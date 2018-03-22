/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// This is a hash map implementation of the Fringe concept. For sparse
// graphs, it would be preferable to use a min binary heap.
class Fringe {
  constructor(store = new Map()) {
    this.store = store;
  }

  extractMinimumEntry() {
    let minimumEntry = null;

    // This operation is O(v). It would be O(log v) if we were using a
    // binary heap.
    this.store.forEach(entry => {
      if (!minimumEntry || entry.totalCost < minimumEntry.totalCost) {
        minimumEntry = entry;
      }
    });

    // Here I create a whole new fringe so that I avoid mutating this
    // one. I do that for the sake of the visualization; this would
    // otherwise be wasteful and inefficient.
    const newStore = new Map(this.store);
    newStore.delete(minimumEntry.toVertex);
    return {
      minimumEntry,
      fringe: new Fringe(newStore),
    }
  }

  addEntry(newEntry) {
    // It is O(1) to find out if we already have a lower cost path
    // to the vertex. In that case we don't add the new entry.
    //
    // This would be O(log v) if we used the binary heap.
    const currentTotalCost = this.currentTotalCost(newEntry.toVertex);
    if (currentTotalCost && currentTotalCost <= newEntry.totalCost) {
      return {
        didUpdate: false,
        fringe: this,
      };
    }

    // Once again I avoid mutation.
    const newStore = new Map(this.store);
    newStore.set(newEntry.toVertex, newEntry);
    return {
      didUpdate: true,
      fringe: new Fringe(newStore),
    };
  }

  currentEntry(toVertex) {
    return this.store.get(toVertex) || null;
  }

  currentTotalCost(toVertex) {
    const currentEntry = this.currentEntry(toVertex);
    return currentEntry ? currentEntry.totalCost : null;
  }

  // Inefficient method used only for visualization purposes.
  hasEdge(edge) {
    return Array.from(this.store.values()).some(entry => (
      entry.lastEdge === edge
    ));
  }

  hasVertex(toVertex) {
    return this.store.has(toVertex);
  }

  isEmpty() {
    return this.store.size == 0;
  }

  toJSON() {
    const json = {};
    this.store.forEach((entry, vertex) => {
      const entryJSON = entry.toJSON();
      // Delete redundant information.
      delete entryJSON.toVertex;

      json[vertex.name] = entryJSON;
    });

    return json;
  }
}

module.exports = Fringe;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class ResultMap {
  constructor(store = new Map()) {
    this.store = store;
  }

  // addEntry ensures immutability and creates a copy of the ResultMap.
  // This is unnecessary, but I do it for visualization purposes.
  // This would be inefficient in a real implementation.
  addEntry(entry) {
    const newStore = new Map(this.store);
    newStore.set(entry.toVertex, entry);
    return new ResultMap(newStore);
  }

  // Inefficient method used only in visualization code.
  hasEdge(edge) {
    for (const entry of this.store.values()) {
      if (entry.lastEdge === edge) return true;
    }

    return false;
  }

  hasVertex(vertex) {
    return this.store.has(vertex);
  }

  toJSON() {
    const json = {};
    this.store.forEach((entry, vertex) => {
      const entryJSON = entry.toJSON();
      // Remove redundant information.
      delete entryJSON.toVertex;

      json[vertex.name] = entryJSON;
    });

    return json;
  }
}

module.exports = ResultMap;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// Puts the costs in a human friendly scale (zero to ten).
const COST_SCALER = 10;
// How much to vary the cost.
const COST_VARIABILITY = 1;
// Number of times to try generating vertex positions/graphs.
const MAX_GENERATE_GRAPH_TRIES = 10;
const MAX_GENERATE_POSITION_TRIES = 100;
const MAX_NUM_EDGES = 3;
// Tries to place vertices a fair distance apart from each other.
const MIN_DISTANCE = 0.275;
const NUM_VERTICES = 10;
// Tries to avoid placing vertices near the borders of the canvas.
const PADDING = 0.05;

module.exports = {
  COST_SCALER,
  COST_VARIABILITY,
  MAX_GENERATE_GRAPH_TRIES,
  MAX_GENERATE_POSITION_TRIES,
  MAX_NUM_EDGES,
  MIN_DISTANCE,
  NUM_VERTICES,
  PADDING,
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const { COST_SCALER } = __webpack_require__(2);

function distance(position1, position2) {
  return Math.sqrt(
    ((position1.x - position2.x) ** 2)
      + ((position1.y - position2.y) ** 2)
  );
}

// Finds the vertex furthest away via "straight line" distance.
function mostDistantVertex(startVertex, vertexPositions) {
  const verticesByDistance_ = verticesByDistance(startVertex, vertexPositions);
  return verticesByDistance_[verticesByDistance_.length - 1].vertex;
}

// Useful convenience. Uses the vertex's position stored in the
// metadata. This is the "straight line" distance between vertices.
function vertexDistance(vertex1, vertex2) {
  const vertexPosition1 = vertex1.metadata.vertexPosition;
  const vertexPosition2 = vertex2.metadata.vertexPosition;
  let cost = COST_SCALER * distance(vertexPosition1, vertexPosition2);
  return Math.ceil(cost * 10) / 10;
}

// Sorts all vertices in graph by distance from a given vertex.
function verticesByDistance(vertex, vertexPositions) {
  const position = vertexPositions.get(vertex);
  const vertices = []
  vertexPositions.forEach((otherPosition, otherVertex) => {
    if (vertex === otherVertex) return;
    vertices.push({
      vertex: otherVertex,
      distance: distance(position, otherPosition),
    });
  });

  vertices.sort((e1, e2) => {
    return e1.distance - e2.distance;
  });

  return vertices;
}

module.exports = {
  distance,
  mostDistantVertex,
  vertexDistance,
  verticesByDistance,
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const dijkstra = __webpack_require__(5);
const { generateGraph, heuristic } = __webpack_require__(7);
const DijkstraGraphColorer = __webpack_require__(11);
const MessageHandler = __webpack_require__(12);
const GraphViewer = __webpack_require__(13);

// Generate the graph.
const {
  vertices,
  vertexPositions,
  startVertex,
  goalVertex
} = generateGraph();

// Get various DOM elements.
const canvasEl = document.getElementById('graph-canvas');
const fringePreEl = document.getElementById('fringe-pre');
const resultPreEl = document.getElementById('result-pre');
const actionPreEl = document.getElementById('action-pre');

// Build a graph viewer for the canvas.
const graphViewer = new GraphViewer(
  canvasEl, vertices, vertexPositions, new DijkstraGraphColorer(),
);
graphViewer.draw();

// Run Dijkstra's algorithm and collect up all messages.
const dijkstraMessages = Array.from(
  dijkstra(startVertex, null) //(vertex) => heuristic(vertex, goalVertex))
);

const messageHandler = new MessageHandler(
  graphViewer, actionPreEl, fringePreEl, resultPreEl, startVertex, goalVertex
);

// Draw initial state of the graph.
messageHandler.handle(dijkstraMessages[0]);

// Let user iterate backward/forward through the messages.
let msgIndex = 0;
const numMessages = dijkstraMessages.length;
document.addEventListener('keypress', (e) => {
  if (e.key === 'j') {
    msgIndex += (msgIndex < (numMessages - 1)) ? 1 : 0;
    messageHandler.handle(dijkstraMessages[msgIndex]);
  } else if (e.key === 'k') {
    msgIndex -= (msgIndex > 0) ? 1 : 0;
    messageHandler.handle(dijkstraMessages[msgIndex]);
  }
});


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Fringe = __webpack_require__(0);
const ResultEntry = __webpack_require__(6);
const ResultMap = __webpack_require__(1);

// Runs Dijkstra's algorithm from a start vertex. Will run the A*
// variant if you supply a heuristic.
//
// This is a generator function. It yields messages along the way about
// what it is doing.
function* dijkstra(startVertex, heuristic) {
  let result = new ResultMap();
  let fringe = new Fringe();

  // Initial vertex has zero cost and no prev edge.
  ({ fringe } = fringe.addEntry(new ResultEntry(
    startVertex,
    null,
    0,
    heuristic ? heuristic(startVertex) : null
  )));

  yield {
    name: 'INITIAL_STATE',
    result,
    fringe,
  };

  while (!fringe.isEmpty()) {
    // Extract minimum cost entry, lock in this path to the vertex.
    let minimumEntry;
    ({ minimumEntry, fringe } = (
      fringe.extractMinimumEntry()
    ));
    result = result.addEntry(minimumEntry);

    yield {
      name: 'EXTRACT_ENTRY',
      minimumEntry,
      fringe,
      result,
    };

    // Yield all the messages that are generated by processExtractedEntry.
    // Note that I use a callback to record the final state of the
    // fringe.
    yield* processExtractedEntry(minimumEntry, fringe, result, heuristic, (newFringe) => {
      fringe = newFringe;
    });

    yield {
      name: 'UPDATE_COMPLETE',
      fringe,
      result,
    };
  }

  yield {
    name: 'FINAL_RESULT',
    fringe,
    result,
  }
}

// Processes all edges out of a newly extracted minimum entry.
//
// This generator will yield messages about what it is doing.
//
// Because fringe is immutable, we let the caller know about the final
// updated fringe via the callback. It isn't simple to just return the
// new fringe because the other yielded objects are all messages.
function* processExtractedEntry(minimumEntry, fringe, result, heuristic, cb) {
  // Consider each edge out of the just extracted vertex.
  for (const evPair of minimumEntry.toVertex.edgeVertexPairs()) {
    const [edge, toVertex] = evPair;

    // Get the current path to the toVertex (if any).
    const currentEntry = fringe.currentEntry(toVertex);
    // Compute the cost of the newly discovered path.
    const newCostToVertex = minimumEntry.costToVertex + edge.cost;
    const heuristicCost = heuristic ? heuristic(toVertex) : null;

    const newEntry = new ResultEntry(
      toVertex,
      edge,
      newCostToVertex,
      heuristicCost,
    )

    yield {
      name: 'CONSIDER_EDGE',
      // entry we just locked in.
      fromEntry: minimumEntry,
      // current entry for the toVertex for the edge
      currentEntry: currentEntry,
      // newly found path to the toVertex for the edge.
      newEntry: newEntry,
      fringe,
      result
    };

    // Don't bother trying to discover new paths to results already
    // locked in.
    if (result.hasVertex(toVertex)) {
      continue;
    }

    // Try adding to the fringe. addEntry tells us whether the fringe
    // was changed.
    ({ didUpdate, fringe } = fringe.addEntry(newEntry))

    if (didUpdate) {
      yield {
        name: 'UPDATE_FRINGE',
        prevEntry: currentEntry,
        newEntry,
        fringe,
        result,
      };
    }
  }

  cb(fringe);
}

module.exports = dijkstra;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

class ResultEntry {
  // heuristicCost is null unless using A* extension to Dijkstra's
  // algorithm.
  constructor(toVertex, lastEdge, costToVertex, heuristicCost) {
    this.toVertex = toVertex;
    this.lastEdge = lastEdge;

    // If a heuristic is supplied, the totalCost is a combination of
    // the costToVertex and the heuristicCost.
    //
    // Normal Dijkstra's only uses costToVertex and has no concept of
    // heuristic cost.
    if (heuristicCost !== null) {
      this.costToVertex = costToVertex;
      this.heuristicCost = heuristicCost;
      this.totalCost = this.costToVertex + this.heuristicCost;
    } else {
      this.costToVertex = costToVertex;
      this.totalCost = costToVertex;
    }
  }

  toJSON() {
    const json = Object.assign({
      toVertex: this.toVertex.name,
      lastEdge: this.lastEdge && this.lastEdge.name,
    });

    if (this.heuristicCost !== null) {
      json.costToVertex = this.costToVertex;
      json.heuristicCost = this.heuristicCost;
    }
    json.totalCost = this.totalCost;

    return json;
  }
}

module.exports = ResultEntry;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const Edge = __webpack_require__(8);
const Vertex = __webpack_require__(9);
const {
  COST_SCALER,
  COST_VARIABILITY,
  MAX_GENERATE_GRAPH_TRIES,
  MAX_GENERATE_POSITION_TRIES,
  MAX_NUM_EDGES,
  MIN_DISTANCE,
  NUM_VERTICES,
  PADDING,
} = __webpack_require__(2);
const {
  distance,
  mostDistantVertex,
  vertexDistance,
  verticesByDistance,
} = __webpack_require__(3);
const { setRandomSeed, seededRandom } = __webpack_require__(10);

// Set a seed that seems to work well.
setRandomSeed(1);

const VERTEX_NAMES = [
  "ATL",
  "LAX",
  "ORD",
  "DFW",
  "JFK",
  "DEN",
  "SFO",
  "LAS",
  "CLT",
  "SEA",
];

// Try to find a position to place a vertex on the canvas.
function generateNewPosition(vertexPositions) {
  for (let tryNum = 0; tryNum < MAX_GENERATE_POSITION_TRIES; tryNum++) {
    // Keep away from the edges.
    const newPosition = {
      x: PADDING + (seededRandom() * (1 - 2*PADDING)),
      y: PADDING + (seededRandom() * (1 - 2*PADDING))
    };

    // Don't let any vertex be too close.
    let tooClose = false;
    vertexPositions.forEach(otherPosition => {
      if (distance(newPosition, otherPosition) < MIN_DISTANCE) {
        tooClose = true;
      }
    });

    if (!tooClose) return newPosition;
  }

  // Sometimes our greedy algorithm backs us into a corner where there
  // is no good position left...
  throw "Maxed out position tries";
}

function generateEdge(vertex, vertexPositions) {
  // Prefer adding edges to closer vertices. This prevents edge
  // "crossings" in the graph visualization.
  for (const entry of verticesByDistance(vertex, vertexPositions)) {
    const { vertex: otherVertex, distance } = entry;

    // Skip if an edge already exists between the two.
    if (vertex.isNeighborTo(otherVertex)) continue;
    // Skip if the other vertex has too many edges already.
    if (otherVertex.edges.length >= MAX_NUM_EDGES) continue;

    // The cost is:
    // (1) The straight line distance, scaled up to a human friendly
    //     scale,
    // (2) Magnified by a random amount. E.g., maybe there are
    //     mountains between two cities so it takes longer to travel
    //     than normal. How much variation is controllable.
    // (3) Rounded off.
    let cost = COST_SCALER * distance;
    cost *= 1 + (COST_VARIABILITY * seededRandom());
    cost = Math.ceil(cost * 10) / 10;

    // Create the edge.
    new Edge(
      `${vertex.name}_${otherVertex.name}`,
      cost,
      vertex,
      otherVertex
    );
    break;
  };

  // Sometimes we can't find anyone to make an edge with. Oh well.
}

function tryGenerateGraph() {
  const vertices = [];
  const vertexPositions = new Map();

  // Generate all the vertices.
  for (let idx = 0; idx < NUM_VERTICES; idx++) {
    // Generate a location for this vertex on the canvas.
    const vertexPosition = generateNewPosition(vertexPositions)
    // Create a new vertex; record as metadata its position.
    const vertex = new Vertex(
      VERTEX_NAMES[idx],
      { vertexPosition }
    );

    vertices.push(vertex);
    vertexPositions.set(vertex, vertexPosition);
  }

  // Generate all the edges.
  for (let idx = 0; idx < MAX_NUM_EDGES; idx++) {
    vertices.forEach(vertex => {
      if (vertex.edges.length >= MAX_NUM_EDGES) return;
      generateEdge(vertex, vertexPositions);
    });
  }

  const startVertex = vertices[0];
  // For A* search, choose as goal vertex the most distance of all
  // vertices.
  const goalVertex = mostDistantVertex(startVertex, vertexPositions);

  return { vertices, vertexPositions, startVertex, goalVertex };
}

function generateGraph() {
  for (let idx = 0; idx < MAX_GENERATE_GRAPH_TRIES; idx++) {
    try {
      const graph = tryGenerateGraph();
      console.log("Successfully generated graph");
      return graph;
    } catch (e) {
      console.log(e);
    }
  }

  throw "Maxed out graph tries";
}

module.exports = {
  generateGraph,
  // Also export vertexDistance for use as an A* heuristic.
  heuristic: vertexDistance,
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

class Edge {
  constructor(name, cost, vertex1, vertex2) {
    this.name = name;
    this.cost = cost;
    this.vertices = [vertex1, vertex2];

    vertex1.edges.push(this);
    vertex2.edges.push(this);
  }

  otherVertex(vertex1) {
    if (this.vertices[0] == vertex1) {
      return this.vertices[1];
    } else if (this.vertices[1] == vertex1) {
      return this.vertices[0];
    } else {
      throw "Vertex not at either end!"
    }
  }
}

module.exports = Edge;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

class Vertex {
  constructor(name, metadata) {
    this.name = name;
    this.edges = [];
    // Vertex can store metadata in case that is helpful for an
    // application.
    this.metadata = metadata;
  }

  edgeVertexPairs() {
    const result = this.edges.map(e => [
      e, e.otherVertex(this)
    ]);

    result.sort((pair1, pair2) => {
      return pair1[0].name > pair2[0].name;
    });

    return result;
  }

  isNeighborTo(otherVertex) {
    return this.edges.some(e => (e.otherVertex(this) === otherVertex));
  }
}

module.exports = Vertex;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

// RIPOFF: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

var m_w = 123456789;
var m_z = 987654321;
var mask = 0xffffffff;

// Takes any integer
function setRandomSeed(i) {
    m_w = i;
    m_z = 987654321;
}

// Returns number between 0 (inclusive) and 1.0 (exclusive),
// just like Math.random().
function seededRandom()
{
    m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    var result = ((m_z << 16) + m_w) & mask;
    result /= 4294967296;
    return result + 0.5;
}

module.exports = {
  setRandomSeed,
  seededRandom,
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const Fringe = __webpack_require__(0);
const ResultMap = __webpack_require__(1);

const CONSIDERED_EDGE_COLOR = 'yellow';
const DEFAULT_EDGE_COLOR = 'black';
const EXTRACTED_EDGE_COLOR = 'cyan';
const FRINGE_EDGE_COLOR = 'blue';
const UPDATED_EDGE_COLOR = 'purple';
const VISITED_EDGE_COLOR = 'green';

const CONSIDERED_VERTEX_COLOR = 'yellow';
const DEFAULT_VERTEX_COLOR = 'black';
const EXTRACTED_VERTEX_COLOR = 'cyan';
const FRINGE_VERTEX_COLOR = 'blue';
const GOAL_VERTEX_COLOR = 'olive';
const START_VERTEX_COLOR = 'red';
const UPDATED_VERTEX_COLOR = 'purple';
const VISITED_VERTEX_COLOR = 'green';

class DijkstraGraphColorer {
  constructor(options) {
    this.clear();
    this.set(options);
  }

  clear() {
    Object.assign(this, {
      startVertex: null,
      goalVertex: null,
      result: new ResultMap(),
      fringe: new Fringe(),
      consideredEdge: null,
      consideredVertex: null,
      extractedEdge: null,
      extractedVertex: null,
      updatedEdge: null,
      updatedVertex: null,
    });
  }

  set(options) {
    Object.assign(this, options);
  }

  colorVertex(vertex) {
    if (this.startVertex === vertex) {
      return START_VERTEX_COLOR;
    } else if (this.goalVertex === vertex) {
      return GOAL_VERTEX_COLOR;
    } else if (this.extractedVertex === vertex) {
      return EXTRACTED_VERTEX_COLOR;
    } else if (this.updatedVertex === vertex) {
      return UPDATED_VERTEX_COLOR;
    } else if (this.consideredVertex === vertex) {
      return CONSIDERED_VERTEX_COLOR;
    } else if (this.result.hasVertex(vertex)) {
      return VISITED_VERTEX_COLOR;
    } else if (this.fringe.hasVertex(vertex)) {
      return FRINGE_VERTEX_COLOR;
    } else {
      return DEFAULT_VERTEX_COLOR;
    }
  }

  colorEdge(edge) {
    if (this.consideredEdge === edge) {
      return CONSIDERED_EDGE_COLOR;
    } else if (this.extractedEdge === edge) {
      return EXTRACTED_EDGE_COLOR;
    } else if (this.updatedEdge === edge) {
      return UPDATED_EDGE_COLOR;
    } else if (this.fringe.hasEdge(edge)) {
      return FRINGE_EDGE_COLOR;
    } else if (this.result.hasEdge(edge)) {
      return VISITED_EDGE_COLOR;
    } else {
      return DEFAULT_EDGE_COLOR;
    }
  }
}

module.exports = DijkstraGraphColorer;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

function prettyJSON(object) {
  return JSON.stringify(object, null, 4);
}

class MessageHandler {
  constructor(graphViewer, actionPreEl, fringePreEl, resultPreEl, startVertex, goalVertex) {
    this.graphViewer = graphViewer;
    this.actionPreEl = actionPreEl;
    this.fringePreEl = fringePreEl;
    this.resultPreEl = resultPreEl;
    this.startVertex = startVertex;
    this.goalVertex = goalVertex;
  }

  handle(msg) {
    this.graphViewer.graphColorer.clear();
    this.graphViewer.graphColorer.set({
      startVertex: this.startVertex,
      goalVertex: this.goalVertex,
      result: msg.result,
      fringe: msg.fringe,
    });

    this.fringePreEl.innerText = prettyJSON(msg.fringe);
    this.resultPreEl.innerText = prettyJSON(msg.result);

    switch (msg.name) {
    case 'INITIAL_STATE':
      this.actionPreEl.innerText = prettyJSON({ name: msg.name });
      break;
    case 'EXTRACT_ENTRY':
      this.graphViewer.graphColorer.set({
        extractedEdge: msg.minimumEntry.lastEdge,
        extractedVertex: msg.minimumEntry.toVertex,
      });
      this.actionPreEl.innerText = prettyJSON({
        name: msg.name,
        minimumEntry: {
          toVertex: msg.minimumEntry.toVertex.name,
          lastEdge: msg.minimumEntry.lastEdge && msg.minimumEntry.lastEdge.name,
          totalCost: msg.minimumEntry.totalCost,
        }
      });
      break;
    case 'CONSIDER_EDGE':
      this.graphViewer.graphColorer.set({
        consideredEdge: msg.newEntry.lastEdge,
        consideredVertex: msg.newEntry.toVertex,
      });
      this.actionPreEl.innerText = prettyJSON({
        name: msg.name,
        edge: msg.newEntry.lastEdge.name,
        currentTotalCost: msg.currentEntry && msg.currentEntry.currentTotalCost,
        costToPrevVertex: msg.fromEntry.costToVertex,
        incrementalCost: msg.newEntry.lastEdge.cost,
        heuristicCost: msg.newEntry.heuristicCost,
        newTotalCost: msg.newEntry.totalCost,
      });
      break;
    case 'UPDATE_FRINGE':
      this.graphViewer.graphColorer.set({
        updatedEdge: msg.newEntry.lastEdge,
        updatedVertex: msg.newEntry.toVertex,
      });
      this.actionPreEl.innerText = prettyJSON({
        name: msg.name,
        updatedEdge: msg.newEntry.lastEdge.name,
        updatedVertex: msg.newEntry.toVertex.name,
        prevCost: msg.prevEntry && msg.prevEntry.totalCost,
        newCost: msg.newEntry.totalCost,
      });
      break;
    case 'UPDATE_COMPLETE':
      this.actionPreEl.innerText = prettyJSON({
        name: msg.name
      });
      break;
    case 'FINAL_RESULT':
      this.actionPreEl.innerText = prettyJSON({
        name: msg.name
      });
      break;
    default:
    console.log(msg)
      throw "Unknown message type!";
    }

    this.graphViewer.draw();
  }
}

module.exports = MessageHandler;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const VertexDragger = __webpack_require__(14);

const BACKGROUND_COLOR = 'gray';
const EDGE_FONT_SIZE = 20;
const EDGE_LINE_WIDTH = 2.5;
const EDGE_TEXT_COLOR = 'white';
const VERTEX_FONT_SIZE = 24;
const VERTEX_RADIUS = 25;
const VERTEX_TEXT_COLOR = 'white';

class GraphViewer {
  constructor(canvasEl, vertices, vertexPositions, graphColorer) {
    this.canvasEl = canvasEl;
    this.canvasEl.height = this.canvasDimensions().height;
    this.canvasEl.width = this.canvasDimensions().width;

    this.ctx = canvasEl.getContext('2d');

    this.vertices = vertices;
    this.vertexPositions = vertexPositions;

    this.vertexDragger = new VertexDragger(this, canvasEl, VERTEX_RADIUS);
    this.graphColorer = graphColorer;

    window.addEventListener('resize', () => this.onResize());
  }

  canvasDimensions() {
    return {
      height: parseInt(getComputedStyle(this.canvasEl).height),
      width: parseInt(getComputedStyle(this.canvasEl).width)
    };
  }

  onResize() {
    this.canvasEl.height = this.canvasDimensions().height;
    this.canvasEl.width = this.canvasDimensions().width;
    this.draw();
  }

  position(vertex) {
    const position = this.vertexPositions.get(vertex);
    return {
      x: position.x * this.canvasDimensions().width,
      y: position.y * this.canvasDimensions().height
    };
  }

  draw() {
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.fillRect(
      0, 0,
      this.canvasDimensions().width, this.canvasDimensions().height
    );

    this.vertices.forEach(vertex => {
      vertex.edges.forEach(e => this.drawEdge(e));
    });
    this.vertices.forEach(vertex => this.drawVertex(vertex));
  }

  writeText(text, position, fontSize, fontColor) {
    this.ctx.font = `${fontSize}px monospace`;
    this.ctx.fillStyle = fontColor;
    const textWidth = this.ctx.measureText(text).width;
    this.ctx.fillText(
      text,
      position.x - (textWidth / 2),
      position.y + (12 / 2),
    );
  }

  drawVertex(vertex) {
    const position = this.position(vertex);

    this.ctx.fillStyle = this.graphColorer.colorVertex(vertex);
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, VERTEX_RADIUS, 0, 2 * Math.PI);
    this.ctx.fill();

    this.writeText(
      vertex.name, position, VERTEX_FONT_SIZE, VERTEX_TEXT_COLOR
    );
  }

  drawEdge(edge) {
    const startPosition = this.position(edge.vertices[0]);
    const endPosition = this.position(edge.vertices[1]);

    this.ctx.lineWidth = EDGE_LINE_WIDTH;
    this.ctx.strokeStyle = this.graphColorer.colorEdge(edge);

    this.ctx.beginPath();
    this.ctx.moveTo(startPosition.x, startPosition.y);
    this.ctx.lineTo(endPosition.x, endPosition.y);
    this.ctx.stroke();

    const halfwayPosition = {
      x: (startPosition.x + endPosition.x) / 2,
      y: (startPosition.y + endPosition.y) / 2,
    };


    this.writeText(
      `${edge.name}: $${edge.cost}`,
      halfwayPosition,
      EDGE_FONT_SIZE,
      EDGE_TEXT_COLOR,
    )
  }
}

module.exports = GraphViewer;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const { distance } = __webpack_require__(3);

class VertexDragger {
  constructor(graphViewer, canvasEl, vertexRadius) {
    this.canvasEl = canvasEl;
    this.graphViewer = graphViewer;
    this.vertexRadius = vertexRadius;

    this.canvasEl.addEventListener('mousedown', (e) => this.onDown(e));
    this.canvasEl.addEventListener('mousemove', (e) => this.onMove(e));
    this.canvasEl.addEventListener('mouseup', (e) => this.onUp(e));
  }

  selectedVertex(mousePosition) {
    let selectedVertex = null;
    for (let vertex of this.graphViewer.vertices) {
      const position = this.graphViewer.position(vertex);
      if (distance(position, mousePosition) < this.vertexRadius) {
        selectedVertex = vertex;
        break
      }
    }

    return selectedVertex;
  }

  onDown(e) {
    const mousePosition = { x: e.offsetX, y: e.offsetY };
    this.activeVertex = this.selectedVertex(mousePosition);
  }

  onMove(e) {
    if (!this.activeVertex) return;

    const mousePosition = {
      x: e.offsetX / this.graphViewer.canvasDimensions().width,
      y: e.offsetY / this.graphViewer.canvasDimensions().height,
    };
    this.graphViewer.vertexPositions.set(
      this.activeVertex, mousePosition
    );
    this.graphViewer.draw();
  }

  onUp(e) {
    this.activeVertex = null;
  }
}

module.exports = VertexDragger;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map
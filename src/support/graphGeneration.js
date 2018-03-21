const Edge = require('../algo/edge');
const Vertex = require('../algo/vertex');
const {
  COST_SCALER,
  COST_VARIABILITY,
  MAX_GENERATE_GRAPH_TRIES,
  MAX_GENERATE_POSITION_TRIES,
  MAX_NUM_EDGES,
  MIN_DISTANCE,
  NUM_VERTICES,
  PADDING,
} = require('./constants');
const {
  distance,
  mostDistantVertex,
  vertexDistance,
  verticesByDistance,
} = require('./distance');
const { setRandomSeed, seededRandom } = require('./random');

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

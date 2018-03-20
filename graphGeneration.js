setRandomSeed(1);

const NUM_VERTICES = 10;
const MIN_DISTANCE = 0.275;
const PADDING = 0.05;
const MAX_GENERATE_POSITION_TRIES = 100;
const MAX_GENERATE_GRAPH_TRIES = 10;
const MAX_NUM_EDGES = 3;
const COST_VARIABILITY = 1;
const COST_SCALER = 10;

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

function distance(position1, position2) {
  return Math.sqrt(
    ((position1.x - position2.x) ** 2)
      + ((position1.y - position2.y) ** 2)
  );
}

function generateNewPosition(vertexPositions) {
  for (let tryNum = 0; tryNum < MAX_GENERATE_POSITION_TRIES; tryNum++) {
    const newPosition = {
      x: PADDING + (seededRandom() * (1 - 2*PADDING)),
      y: PADDING + (seededRandom() * (1 - 2*PADDING))
    };
    let tooClose = false;
    vertexPositions.forEach(otherPosition => {
      if (distance(newPosition, otherPosition) < MIN_DISTANCE) {
        tooClose = true;
      }
    });

    if (!tooClose) return newPosition;
  }

  throw "Maxed out position tries";
}

function neighborsByDistance(vertex, vertexPositions) {
  const position = vertexPositions.get(vertex);
  const neighbors = []
  vertexPositions.forEach((otherPosition, otherVertex) => {
    if (vertex === otherVertex) return;
    neighbors.push({
      vertex: otherVertex,
      distance: distance(position, otherPosition),
    });
  });

  neighbors.sort((e1, e2) => {
    return e1.distance - e2.distance;
  });

  return neighbors;
}

function addNewEdge(vertex, vertexPositions) {
  for (const entry of neighborsByDistance(vertex, vertexPositions)) {
    const { vertex: otherVertex, distance } = entry;

    if (otherVertex.edges.length >= MAX_NUM_EDGES) continue;
    if (vertex.isNeighborTo(otherVertex)) continue;

    let cost = COST_SCALER * distance;
    cost *= 1 + (COST_VARIABILITY * seededRandom());
    cost = Math.ceil(cost * 10) / 10;

    new Edge(
      `${vertex.name}_${otherVertex.name}`,
      cost,
      vertex,
      otherVertex
    );
    break;
  };
}

function heuristic(vertex1, vertex2) {
  const vertexPosition1 = vertex1.metadata.vertexPosition;
  const vertexPosition2 = vertex2.metadata.vertexPosition;
  let cost = COST_SCALER * distance(vertexPosition1, vertexPosition2);
  return Math.ceil(cost * 10) / 10;
}

function tryGenerateGraph() {
  const vertices = [];
  const vertexPositions = new Map();

  for (let idx = 0; idx < NUM_VERTICES; idx++) {
    const vertexPosition = generateNewPosition(vertexPositions)
    const vertex = new Vertex(
      VERTEX_NAMES[idx],
      { vertexPosition }
    );

    vertices.push(vertex);
    vertexPositions.set(vertex, vertexPosition);
  }

  for (let idx = 0; idx < MAX_NUM_EDGES; idx++) {
    vertices.forEach(vertex => {
      if (vertex.edges.length >= MAX_NUM_EDGES) return;
      addNewEdge(vertex, vertexPositions);
    });
  }

  const startVertex = vertices[0];
  let goalVertex = startVertex;
  let goalDistance = 0.0;
  for (const vertex of vertices) {
    const newDistance = heuristic(startVertex, vertex);
    if (newDistance > goalDistance) {
      goalVertex = vertex;
      goalDistance = newDistance;
    }
  }

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

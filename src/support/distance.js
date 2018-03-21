const { COST_SCALER } = require('./constants');

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

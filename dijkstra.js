class Vertex {
  constructor(name) {
    this.name = name;
    this.edges = []
  }

  edgeVertexPairs() {
    return this.edges.map(e => [
      e, e.otherVertex(this)
    ]);
  }

  isNeighborTo(otherVertex) {
    return this.edges.some(e => (e.otherVertex(this) === otherVertex));
  }
}

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

class ResultEntry {
  constructor(toVertex, lastEdge, totalCost) {
    this.toVertex = toVertex;
    this.lastEdge = lastEdge;
    this.totalCost = totalCost;
  }
}

// Ideally would be a heap.
class Fringe {
  constructor() {
    this.store = new Map();
  }

  extractMinimumEntry() {
    let minimumEntry = null;

    this.store.forEach(entry => {
      if (!minimumEntry || minimumEntry.totalCost < entry.totalCost) {
        minimumEntry = entry;
      }
    });

    this.store.delete(minimumEntry.toVertex);

    return minimumEntry;
  }

  addEntry(toVertex, edge, totalCost) {
    const currentEntry = this.store.get(toVertex);
    if (!currentEntry || totalCost < currentEntry) {
      this.store.set(toVertex, new ResultEntry(
        toVertex,
        edge,
        totalCost
      ));
    }
  }

  isEmpty() {
    return this.store.size == 0;
  }
}

function dijkstra(startVertex) {
  const result = new Map();
  const fringe = new Fringe();
  fringe.addEntry(
    startVertex,
    null,
    0
  );

  while (!fringe.isEmpty()) {
    const entry = fringe.extractMinimumEntry();
    result.set(entry.toVertex, entry);

    for (const evPair of entry.toVertex.edgeVertexPairs()) {
      const [edge, newVertex] = evPair;

      if (result.has(newVertex)) {
        continue;
      }

      const newTotalCost = entry.totalCost + edge.cost;
      fringe.addEntry(newVertex, edge, newTotalCost);
    }
  }

  return result;
}

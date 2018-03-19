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
  constructor(store = new Map()) {
    this.store = store;
  }

  extractMinimumEntry() {
    let minimumEntry = null;

    this.store.forEach(entry => {
      if (!minimumEntry || entry.totalCost < minimumEntry.totalCost) {
        minimumEntry = entry;
      }
    });

    const newStore = new Map(this.store);
    newStore.delete(minimumEntry.toVertex);
    return {
      minimumEntry,
      newFringe: new Fringe(newStore),
    }
  }

  addEntry(toVertex, edge, totalCost) {
    const currentTotalCost = this.currentTotalCost(toVertex);
    if (currentTotalCost && currentTotalCost <= totalCost) {
      return this;
    }

    const newStore = new Map(this.store);
    newStore.set(toVertex, new ResultEntry(
      toVertex,
      edge,
      totalCost
    ));

    return new Fringe(newStore);
  }

  currentTotalCost(toVertex) {
    const currentEntry = this.store.get(toVertex);
    return currentEntry ? currentEntry.totalCost : null;
  }

  isEmpty() {
    return this.store.size == 0;
  }

  toJSON() {
    const result = {};
    this.store.forEach((entry, vertex) => {
      result[vertex.name] = {
        lastEdge: entry.lastEdge && entry.lastEdge.name,
        totalCost: entry.totalCost,
      }
    });

    return result;
  }
}

class ResultMap {
  constructor(store = new Map()) {
    this.store = store;
  }

  addEntry(entry) {
    const newStore = new Map(this.store);
    newStore.set(entry.toVertex, entry);
    return new ResultMap(newStore);
  }

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
    const result = {};
    this.store.forEach((entry, vertex) => {
      result[vertex.name] = {
        lastEdge: entry.lastEdge && entry.lastEdge.name,
        totalCost: entry.totalCost,
      }
    });

    return result;
  }
}

function* dijkstra(startVertex) {
  let result = new ResultMap();
  let fringe = new Fringe();
  fringe = fringe.addEntry(
    startVertex,
    null,
    0
  );

  yield {
    name: 'INITIAL_STATE',
    result,
    fringe,
  };

  while (!fringe.isEmpty()) {
    let { minimumEntry, newFringe } = (
      fringe.extractMinimumEntry()
    );
    let newResult = result.addEntry(minimumEntry);

    yield {
      name: 'EXTRACT_ENTRY',
      oldFringe: fringe,
      oldResult: result,
      minimumEntry,
      newFringe,
      newResult,
    };

    [fringe, result] = [newFringe, newResult];

    for (const evPair of minimumEntry.toVertex.edgeVertexPairs()) {
      const [edge, toVertex] = evPair;
      const currentTotalCost = fringe.currentTotalCost(toVertex);
      const newTotalCost = minimumEntry.totalCost + edge.cost;

      yield {
        name: 'CONSIDER_EDGE',
        fromVertex: minimumEntry.toVertex,
        edge,
        toVertex,
        currentTotalCost,
        newTotalCost,
        fringe,
        result
      };

      if (result.hasVertex(toVertex)) {
        continue;
      }

      newFringe = fringe.addEntry(toVertex, edge, newTotalCost);

      yield {
        name: 'UPDATE_FRINGE',
        edge,
        toVertex,
        oldFringe: fringe,
        newFringe,
        result,
      };

      fringe = newFringe;
    }
  }

  yield {
    name: 'FINAL_RESULT',
    fringe,
    result,
  }
}

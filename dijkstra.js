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
      fringe: new Fringe(newStore),
    }
  }

  addEntry(newEntry) {
    const currentTotalCost = this.currentTotalCost(newEntry.toVertex);
    if (currentTotalCost && currentTotalCost <= newEntry.totalCost) {
      return {
        newEntry: null,
        fringe: this,
      };
    }

    const newStore = new Map(this.store);
    newStore.set(newEntry.toVertex, newEntry);

    return {
      newEntry,
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
  ({ fringe } = fringe.addEntry(new ResultEntry(
    startVertex,
    null,
    0
  )));

  yield {
    name: 'INITIAL_STATE',
    result,
    fringe,
  };

  while (!fringe.isEmpty()) {
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

    for (const evPair of minimumEntry.toVertex.edgeVertexPairs()) {
      const [edge, toVertex] = evPair;
      const currentEntry = fringe.currentEntry(toVertex);
      const newTotalCost = minimumEntry.totalCost + edge.cost;

      const newEntry = new ResultEntry(
        toVertex,
        edge,
        newTotalCost,
      )

      yield {
        name: 'CONSIDER_EDGE',
        fromEntry: minimumEntry,
        currentEntry: fringe.currentEntry(toVertex),
        newEntry: newEntry,
        newTotalCost: newTotalCost,
        fringe,
        result
      };

      if (result.hasVertex(toVertex)) {
        continue;
      }

      ({ fringe } = fringe.addEntry(newEntry))

      yield {
        name: 'UPDATE_FRINGE',
        prevEntry: currentEntry,
        newEntry,
        fringe,
        result,
      };
    }

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

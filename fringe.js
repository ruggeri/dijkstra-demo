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
        didUpdate: false,
        fringe: this,
      };
    }

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

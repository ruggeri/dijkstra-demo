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

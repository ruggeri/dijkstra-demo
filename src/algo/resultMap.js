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

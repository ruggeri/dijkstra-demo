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
    const json = {};
    this.store.forEach((entry, vertex) => {
      const entryJSON = entry.toJSON();
      delete entryJSON.toVertex;

      json[vertex.name] = entryJSON;
    });

    return json;
  }
}

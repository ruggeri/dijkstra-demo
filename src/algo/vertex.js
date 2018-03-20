class Vertex {
  constructor(name, metadata) {
    this.name = name;
    this.edges = [];
    // Vertex can store metadata in case that is helpful for an
    // application.
    this.metadata = metadata;
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

module.exports = Vertex;

class Vertex {
  constructor(name, metadata) {
    this.name = name;
    this.edges = [];
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

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

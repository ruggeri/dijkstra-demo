class Vertex {
  constructor(name, metadata) {
    this.name = name;
    this.edges = [];
    // Vertex can store metadata in case that is helpful for an
    // application.
    this.metadata = metadata;
  }

  edgeVertexPairs() {
    const result = this.edges.map(e => [
      e, e.otherVertex(this)
    ]);

    result.sort((pair1, pair2) => {
      return pair1[0].name > pair2[0].name;
    });

    return result;
  }

  isNeighborTo(otherVertex) {
    return this.edges.some(e => (e.otherVertex(this) === otherVertex));
  }
}

module.exports = Vertex;

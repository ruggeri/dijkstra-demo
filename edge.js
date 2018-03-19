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

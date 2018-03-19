class ResultEntry {
  constructor(toVertex, lastEdge, costToVertex, heuristicCost) {
    this.toVertex = toVertex;
    this.lastEdge = lastEdge;

    if (heuristicCost !== null) {
      this.costToVertex = costToVertex;
      this.heuristicCost = heuristicCost;
      this.totalCost = this.costToVertex + this.heuristicCost;
    } else {
      this.costToVertex = costToVertex;
      this.totalCost = costToVertex;
    }
  }

  toJSON() {
    const json = Object.assign({
      toVertex: this.toVertex.name,
      lastEdge: this.lastEdge && this.lastEdge.name,
    });

    if (this.heuristicCost !== null) {
      json.costToVertex = this.costToVertex;
      json.heuristicCost = this.heuristicCost;
    }
    json.totalCost = this.totalCost;

    return json;
  }
}

class ResultEntry {
  // heuristicCost is null unless using A* extension to Dijkstra's
  // algorithm.
  constructor(toVertex, lastEdge, costToVertex, heuristicCost) {
    this.toVertex = toVertex;
    this.lastEdge = lastEdge;

    // If a heuristic is supplied, the totalCost is a combination of
    // the costToVertex and the heuristicCost.
    //
    // Normal Dijkstra's only uses costToVertex and has no concept of
    // heuristic cost.
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

module.exports = ResultEntry;

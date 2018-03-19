function* dijkstra(startVertex, heuristic) {
  let result = new ResultMap();
  let fringe = new Fringe();
  ({ fringe } = fringe.addEntry(new ResultEntry(
    startVertex,
    null,
    0
  )));

  yield {
    name: 'INITIAL_STATE',
    result,
    fringe,
  };

  while (!fringe.isEmpty()) {
    let minimumEntry;
    ({ minimumEntry, fringe } = (
      fringe.extractMinimumEntry()
    ));
    result = result.addEntry(minimumEntry);

    yield {
      name: 'EXTRACT_ENTRY',
      minimumEntry,
      fringe,
      result,
    };

    for (const evPair of minimumEntry.toVertex.edgeVertexPairs()) {
      const [edge, toVertex] = evPair;
      const currentEntry = fringe.currentEntry(toVertex);
      const newCostToVertex = minimumEntry.costToVertex + edge.cost;

      const newEntry = new ResultEntry(
        toVertex,
        edge,
        newCostToVertex,
      )

      yield {
        name: 'CONSIDER_EDGE',
        fromEntry: minimumEntry,
        currentEntry: fringe.currentEntry(toVertex),
        newEntry: newEntry,
        fringe,
        result
      };

      if (result.hasVertex(toVertex)) {
        continue;
      }

      ({ didUpdate, fringe } = fringe.addEntry(newEntry))

      if (didUpdate) {
        yield {
          name: 'UPDATE_FRINGE',
          prevEntry: currentEntry,
          newEntry,
          fringe,
          result,
        };
      }
    }

    yield {
      name: 'UPDATE_COMPLETE',
      fringe,
      result,
    };
  }

  yield {
    name: 'FINAL_RESULT',
    fringe,
    result,
  }
}

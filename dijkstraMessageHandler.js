function prettyJSON(object) {
  return JSON.stringify(object, null, 4);
}

function handleMessage(msg) {
  graphViewer.graphColorer.clear();
  graphViewer.graphColorer.set({
    startVertex: vertices[0],
    result: msg.result,
    fringe: msg.fringe,
  });

  fringePreEl.innerText = prettyJSON(msg.fringe);
  resultPreEl.innerText = prettyJSON(msg.result);
  switch (msg.name) {
  case 'INITIAL_STATE':
    actionPreEl.innerText = prettyJSON({ name: msg.name });
    break;
  case 'EXTRACT_ENTRY':
    graphViewer.graphColorer.set({
      extractedEdge: msg.minimumEntry.lastEdge,
      extractedVertex: msg.minimumEntry.toVertex,
    });
    actionPreEl.innerText = prettyJSON({
      name: msg.name,
      minimumEntry: {
        toVertex: msg.minimumEntry.toVertex.name,
        lastEdge: msg.minimumEntry.lastEdge && msg.minimumEntry.lastEdge.name,
        totalCost: msg.minimumEntry.totalCost,
      }
    });
    break;
  case 'CONSIDER_EDGE':
    graphViewer.graphColorer.set({
      consideredEdge: msg.newEntry.lastEdge,
      consideredVertex: msg.newEntry.toVertex,
    });
    actionPreEl.innerText = prettyJSON({
      name: msg.name,
      edge: msg.newEntry.lastEdge.name,
      currentTotalCost: msg.currentEntry && msg.currentEntry.currentTotalCost,
      costToPrevVertex: msg.fromEntry.totalCost,
      incrementalCost: msg.newEntry.lastEdge.cost,
      newTotalCost: msg.newTotalCost,
    });
    break;
  case 'UPDATE_FRINGE':
    graphViewer.graphColorer.set({
      updatedEdge: msg.newEntry.lastEdge,
      updatedVertex: msg.newEntry.toVertex,
    });
    actionPreEl.innerText = prettyJSON({
      name: msg.name,
      updatedEdge: msg.newEntry.lastEdge.name,
      updatedVertex: msg.newEntry.toVertex.name,
      prevCost: msg.prevEntry && msg.prevEntry.totalCost,
      newCost: msg.newEntry.totalCost,
    });
    break;
  case 'FINAL_RESULT':
    actionPreEl.innerText = prettyJSON({
      name: msg.name
    });
    break;
  default:
    throw "Unknown message type!";
  }

  graphViewer.draw();
}

function prettyJSON(object) {
  return JSON.stringify(object, null, 4);
}

class MessageHandler {
  constructor(graphViewer, actionPreEl, fringePreEl, resultPreEl, startVertex, goalVertex) {
    this.graphViewer = graphViewer;
    this.actionPreEl = actionPreEl;
    this.fringePreEl = fringePreEl;
    this.resultPreEl = resultPreEl;
    this.startVertex = startVertex;
    this.goalVertex = goalVertex;
  }

  handle(msg) {
    this.graphViewer.graphColorer.clear();
    this.graphViewer.graphColorer.set({
      startVertex: this.startVertex,
      goalVertex: this.goalVertex,
      result: msg.result,
      fringe: msg.fringe,
    });

    this.fringePreEl.innerText = prettyJSON(msg.fringe);
    this.resultPreEl.innerText = prettyJSON(msg.result);

    switch (msg.name) {
    case 'INITIAL_STATE':
      this.actionPreEl.innerText = prettyJSON({ name: msg.name });
      break;
    case 'EXTRACT_ENTRY':
      this.graphViewer.graphColorer.set({
        extractedEdge: msg.minimumEntry.lastEdge,
        extractedVertex: msg.minimumEntry.toVertex,
      });
      this.actionPreEl.innerText = prettyJSON({
        name: msg.name,
        minimumEntry: {
          toVertex: msg.minimumEntry.toVertex.name,
          lastEdge: msg.minimumEntry.lastEdge && msg.minimumEntry.lastEdge.name,
          totalCost: msg.minimumEntry.totalCost,
        }
      });
      break;
    case 'CONSIDER_EDGE':
      this.graphViewer.graphColorer.set({
        consideredEdge: msg.newEntry.lastEdge,
        consideredVertex: msg.newEntry.toVertex,
      });
      this.actionPreEl.innerText = prettyJSON({
        name: msg.name,
        edge: msg.newEntry.lastEdge.name,
        currentTotalCost: msg.currentEntry && msg.currentEntry.currentTotalCost,
        costToPrevVertex: msg.fromEntry.costToVertex,
        incrementalCost: msg.newEntry.lastEdge.cost,
        heuristicCost: msg.newEntry.heuristicCost,
        newTotalCost: msg.newEntry.totalCost,
      });
      break;
    case 'UPDATE_FRINGE':
      this.graphViewer.graphColorer.set({
        updatedEdge: msg.newEntry.lastEdge,
        updatedVertex: msg.newEntry.toVertex,
      });
      this.actionPreEl.innerText = prettyJSON({
        name: msg.name,
        updatedEdge: msg.newEntry.lastEdge.name,
        updatedVertex: msg.newEntry.toVertex.name,
        prevCost: msg.prevEntry && msg.prevEntry.totalCost,
        newCost: msg.newEntry.totalCost,
      });
      break;
    case 'UPDATE_COMPLETE':
      this.actionPreEl.innerText = prettyJSON({
        name: msg.name
      });
      break;
    case 'FINAL_RESULT':
      this.actionPreEl.innerText = prettyJSON({
        name: msg.name
      });
      break;
    default:
    console.log(msg)
      throw "Unknown message type!";
    }

    this.graphViewer.draw();
  }
}

module.exports = MessageHandler;

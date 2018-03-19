const {vertices, vertexPositions } = generateGraph();

const canvasEl = document.getElementById('graph-canvas');
const fringePreEl = document.getElementById('fringe-pre');
const resultPreEl = document.getElementById('result-pre');
const actionPreEl = document.getElementById('action-pre');

const graphViewer = new GraphViewer(
  canvasEl, vertices, vertexPositions, new DijkstraGraphColorer(),
);
graphViewer.draw();

const dijkstraMessages = Array.from(dijkstra(vertices[0]));

let msgIndex = 0;
handleMessage(dijkstraMessages[0]);
const numMessages = dijkstraMessages.length;

document.addEventListener('keypress', (e) => {
  if (e.key === 'j') {
    msgIndex += (msgIndex < (numMessages - 1)) ? 1 : 0;
    handleMessage(dijkstraMessages[msgIndex]);
  } else if (e.key === 'k') {
    msgIndex -= (msgIndex > 0) ? 1 : 0;
    handleMessage(dijkstraMessages[msgIndex]);
  }
});

function prettyJSON(object) {
  return JSON.stringify(object, null, 4);
}

function handleMessage(msg) {
  switch (msg.name) {
  case 'INITIAL_STATE':
    fringePreEl.innerText = prettyJSON(msg.fringe);
    resultPreEl.innerText = prettyJSON(msg.result);
    graphViewer.graphColorer = new DijkstraGraphColorer(
      { startVertex: vertices[0],
        result: msg.result,
        fringe: msg.fringe,
      }
    );
    actionPreEl.innerText = prettyJSON({ name: msg.name });
    break;
  case 'EXTRACT_ENTRY':
    fringePreEl.innerText = prettyJSON(msg.fringe);
    resultPreEl.innerText = prettyJSON(msg.result);
    graphViewer.graphColorer = new DijkstraGraphColorer(
      { startVertex: vertices[0],
        result: msg.result,
        fringe: msg.fringe,
        extractedEdge: msg.minimumEntry.lastEdge,
        extractedVertex: msg.minimumEntry.toVertex,
      }
    );
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
    fringePreEl.innerText = prettyJSON(msg.fringe);
    resultPreEl.innerText = prettyJSON(msg.result);
    graphViewer.graphColorer = new DijkstraGraphColorer(
      { startVertex: vertices[0],
        result: msg.result,
        fringe: msg.fringe,
        consideredEdge: msg.newEntry.lastEdge,
        consideredVertex: msg.newEntry.toVertex,
      }
    );
    actionPreEl.innerText = prettyJSON({
      name: msg.name,
      edge: msg.newEntry.lastEdge.name,
      currentTotalCost: msg.currentEntry && msg.currentEntry.currentTotalCost,
      costToCurrentVertex: msg.fromEntry.totalCost,
      incrementalCost: msg.newEntry.lastEdge.cost,
      newTotalCost: msg.newTotalCost,
    });
    break;
  case 'UPDATE_FRINGE':
    fringePreEl.innerText = prettyJSON(msg.fringe);
    resultPreEl.innerText = prettyJSON(msg.result);
    graphViewer.graphColorer = new DijkstraGraphColorer(
      { startVertex: vertices[0],
        result: msg.result,
        fringe: msg.fringe,
        updatedEdge: msg.newEntry.lastEdge,
        updatedVertex: msg.newEntry.toVertex,
      }
    );
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

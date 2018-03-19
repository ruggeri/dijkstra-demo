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

let dijkstraIndex = 0;
handleMessage(dijkstraMessages[0]);

document.addEventListener('keypress', (e) => {
  if (e.key === 'j') {
    dijkstraIndex += 1;
    console.log(e);
    handleMessage(dijkstraMessages[dijkstraIndex]);
  } else if (e.key === 'k') {
    dijkstraIndex -= 1;
    console.log(e);
    handleMessage(dijkstraMessages[dijkstraIndex]);
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
    fringePreEl.innerText = prettyJSON(msg.newFringe);
    resultPreEl.innerText = prettyJSON(msg.newResult);
    graphViewer.graphColorer = new DijkstraGraphColorer(
      { startVertex: vertices[0],
        result: msg.newResult,
        fringe: msg.newFringe,
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
        consideredEdge: msg.edge,
        consideredVertex: msg.toVertex,
      }
    );
    actionPreEl.innerText = prettyJSON({
      name: msg.name,
      edge: msg.edge.name,
      currentTotalCost: msg.currentTotalCost,
      newTotalCost: msg.newTotalCost,
    });
    break;
  case 'UPDATE_FRINGE':
    fringePreEl.innerText = prettyJSON(msg.newFringe);
    resultPreEl.innerText = prettyJSON(msg.result);
    graphViewer.graphColorer = new DijkstraGraphColorer(
      { startVertex: vertices[0],
        result: msg.result,
        fringe: msg.newFringe }
    );
    actionPreEl.innerText = prettyJSON({
      name: msg.name
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

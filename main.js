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

function handleMessage(msg) {
  switch (msg.name) {
  case 'INITIAL_STATE':
    fringePreEl.innerText = JSON.stringify(msg.fringe);
    resultPreEl.innerText = JSON.stringify(msg.result);
    graphViewer.graphColorer = new DijkstraGraphColorer(
      { startVertex: vertices[0],
        result: msg.result,
        fringe: msg.fringe,
      }
    );
    actionPreEl.innerText = JSON.stringify({ name: msg.name });
    break;
  case 'EXTRACT_ENTRY':
    fringePreEl.innerText = JSON.stringify(msg.newFringe);
    resultPreEl.innerText = JSON.stringify(msg.newResult);
    graphViewer.graphColorer = new DijkstraGraphColorer(
      { startVertex: vertices[0],
        result: msg.newResult,
        fringe: msg.newFringe,
        extractedEdge: msg.minimumEntry.lastEdge,
        extractedVertex: msg.minimumEntry.toVertex,
      }
    );
    actionPreEl.innerText = JSON.stringify({
      name: msg.name,
      minimumEntry: {
        toVertex: msg.minimumEntry.toVertex.name,
        lastEdge: msg.minimumEntry.lastEdge && msg.minimumEntry.lastEdge.name,
        totalCost: msg.minimumEntry.totalCost,
      }
    });
    break;
  case 'CONSIDER_EDGE':
    fringePreEl.innerText = JSON.stringify(msg.fringe);
    resultPreEl.innerText = JSON.stringify(msg.result);
    graphViewer.graphColorer = new DijkstraGraphColorer(
      { startVertex: vertices[0],
        result: msg.result,
        fringe: msg.fringe,
        consideredEdge: msg.edge,
        consideredVertex: msg.toVertex,
      }
    );
    actionPreEl.innerText = JSON.stringify({
      name: msg.name,
      edge: msg.edge.name,
      currentTotalCost: msg.currentTotalCost,
      newTotalCost: msg.newTotalCost,
    });
    break;
  case 'UPDATE_FRINGE':
    fringePreEl.innerText = JSON.stringify(msg.newFringe);
    resultPreEl.innerText = JSON.stringify(msg.result);
    graphViewer.graphColorer = new DijkstraGraphColorer(
      { startVertex: vertices[0],
        result: msg.result,
        fringe: msg.newFringe }
    );
    actionPreEl.innerText = JSON.stringify({
      name: msg.name
    });
    break;
  case 'FINAL_RESULT':
    actionPreEl.innerText = JSON.stringify({
      name: msg.name
    });
    break;
  default:
    throw "Unknown message type!";
  }

  graphViewer.draw();
}

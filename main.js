const {vertices, vertexPositions } = generateGraph();

const canvasEl = document.getElementById('graph-canvas');
const fringePreEl = document.getElementById('fringe-pre');
const resultPreEl = document.getElementById('result-pre');

const graphViewer = new GraphViewer(
  canvasEl, vertices, vertexPositions
);
graphViewer.draw();

const dijkstraIterator = dijkstra(vertices[0]);

const intervalId = setInterval(() => {
  const { value, done } = dijkstraIterator.next();
  logDijkstraMessage(value);

  if (done) clearInterval(intervalId);
}, 1000);

function logDijkstraMessage(msg) {
  console.log(msg);
  switch (msg.name) {
  case 'INITIAL_STATE':
    fringePreEl.innerText = JSON.stringify(msg.fringe);
    resultPreEl.innerText = JSON.stringify(msg.result);
    break;
  case 'EXTRACT_ENTRY':
    fringePreEl.innerText = JSON.stringify(msg.newFringe);
    resultPreEl.innerText = JSON.stringify(msg.newResult);
    break;
  case 'CONSIDER_EDGE':
    fringePreEl.innerText = JSON.stringify(msg.fringe);
    resultPreEl.innerText = JSON.stringify(msg.result);
    break;
  case 'UPDATE_FRINGE':
    fringePreEl.innerText = JSON.stringify(msg.newFringe);
    resultPreEl.innerText = JSON.stringify(msg.result);
    break;
  case 'FINAL_RESULT':
    break;
  default:
    throw "Unknown message type!";
  }
}

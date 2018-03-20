const {
  vertices,
  vertexPositions,
  startVertex,
  goalVertex
} = generateGraph();

const canvasEl = document.getElementById('graph-canvas');
const fringePreEl = document.getElementById('fringe-pre');
const resultPreEl = document.getElementById('result-pre');
const actionPreEl = document.getElementById('action-pre');

const graphViewer = new GraphViewer(
  canvasEl, vertices, vertexPositions, new DijkstraGraphColorer(),
);
graphViewer.draw();

const dijkstraMessages = Array.from(
  dijkstra(startVertex, (vertex) => heuristic(vertex, goalVertex))
);

let msgIndex = 0;
handleMessage(dijkstraMessages[0], startVertex, goalVertex);
const numMessages = dijkstraMessages.length;

document.addEventListener('keypress', (e) => {
  if (e.key === 'j') {
    msgIndex += (msgIndex < (numMessages - 1)) ? 1 : 0;
    handleMessage(dijkstraMessages[msgIndex], startVertex, goalVertex);
  } else if (e.key === 'k') {
    msgIndex -= (msgIndex > 0) ? 1 : 0;
    handleMessage(dijkstraMessages[msgIndex], startVertex, goalVertex);
  }
});

const { generateGraph } = require('./support/graphGeneration');
const handleMessage = require('./ui/dijkstraMessageHandler');

// Generate the graph.
const {
  vertices,
  vertexPositions,
  startVertex,
  goalVertex
} = generateGraph();

// Get various DOM elements.
const canvasEl = document.getElementById('graph-canvas');
const fringePreEl = document.getElementById('fringe-pre');
const resultPreEl = document.getElementById('result-pre');
const actionPreEl = document.getElementById('action-pre');

// Build a graph viewer for the canvas.
const graphViewer = new GraphViewer(
  canvasEl, vertices, vertexPositions, new DijkstraGraphColorer(),
);
graphViewer.draw();

// Run Dijkstra's algorithm and collect up all messages.
const dijkstraMessages = Array.from(
  dijkstra(startVertex, (vertex) => heuristic(vertex, goalVertex))
);

// Draw initial state of the graph.
handleMessage(dijkstraMessages[0], startVertex, goalVertex);

// Let user iterate backward/forward through the messages.
let msgIndex = 0;
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

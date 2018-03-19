const {vertices, vertexPositions } = generateGraph();
const canvasEl = document.getElementById('graph-canvas');
const graphViewer = new GraphViewer(
  canvasEl, vertices, vertexPositions
);
graphViewer.draw();

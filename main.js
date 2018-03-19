const {vertices, vertexPositions } = generateGraph();
const canvasEl = document.getElementById('graph-canvas');
canvasEl.height = PIXEL_HEIGHT;
canvasEl.width = PIXEL_WIDTH;

const ctx = canvasEl.getContext('2d');
const graphViewer = new GraphViewer(ctx, vertices, vertexPositions);
graphViewer.draw();

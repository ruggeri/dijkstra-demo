const v1 = new Vertex('v1');
const v2 = new Vertex('v2');
const v3 = new Vertex('v3');

const e1 = new Edge('e1', 1, v1, v2);
const e2 = new Edge('e2', 2, v2, v3);
const e3 = new Edge('e3', 2, v3, v1);

const result = dijkstra(v1);

const canvasEl = document.getElementById('graph-canvas');
canvasEl.height = PIXEL_HEIGHT;
canvasEl.width = PIXEL_WIDTH;

const ctx = canvasEl.getContext('2d');
const graphViewer = new GraphViewer(ctx, [v1, v2, v3]);
graphViewer.draw();

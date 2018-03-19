class VertexDragger {
  constructor(graphViewer, canvasEl) {
    this.canvasEl = canvasEl;
    this.graphViewer = graphViewer;

    this.canvasEl.addEventListener('mousedown', (e) => this.onDown(e));
    this.canvasEl.addEventListener('mousemove', (e) => this.onMove(e));
    this.canvasEl.addEventListener('mouseup', (e) => this.onUp(e));
  }

  selectedVertex(mousePosition) {
    let selectedVertex = null;
    for (let entry of this.graphViewer.vertexPositions) {
      const [vertex, position] = entry;
      if (distance(position, mousePosition) < GraphViewer.VERTEX_RADIUS) {
        selectedVertex = vertex;
        break
      }
    }

    return selectedVertex;
  }


  onDown(e) {
    const mousePosition = { x: e.offsetX, y: e.offsetY };
    this.activeVertex = this.selectedVertex(mousePosition);
  }

  onMove(e) {
    if (!this.activeVertex) return;

    const mousePosition = { x: e.offsetX, y: e.offsetY };
    this.graphViewer.vertexPositions.set(
      this.activeVertex, mousePosition
    );
    this.graphViewer.draw();
  }

  onUp(e) {
    this.activeVertex = null;
  }
}

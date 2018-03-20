class VertexDragger {
  constructor(graphViewer, canvasEl, vertexRadius) {
    this.canvasEl = canvasEl;
    this.graphViewer = graphViewer;
    this.vertexRadius = vertexRadius;

    this.canvasEl.addEventListener('mousedown', (e) => this.onDown(e));
    this.canvasEl.addEventListener('mousemove', (e) => this.onMove(e));
    this.canvasEl.addEventListener('mouseup', (e) => this.onUp(e));
  }

  selectedVertex(mousePosition) {
    let selectedVertex = null;
    for (let vertex of this.graphViewer.vertices) {
      const position = this.graphViewer.position(vertex);
      if (distance(position, mousePosition) < this.vertexRadius) {
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

    const mousePosition = {
      x: e.offsetX / this.graphViewer.canvasDimensions().width,
      y: e.offsetY / this.graphViewer.canvasDimensions().height,
    };
    this.graphViewer.vertexPositions.set(
      this.activeVertex, mousePosition
    );
    this.graphViewer.draw();
  }

  onUp(e) {
    this.activeVertex = null;
  }
}

module.exports = VertexDragger;

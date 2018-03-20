const VertexDragger = require('./vertexDragger');

const BACKGROUND_COLOR = 'gray';
const EDGE_FONT_SIZE = 20;
const EDGE_LINE_WIDTH = 2.5;
const EDGE_TEXT_COLOR = 'white';
const VERTEX_FONT_SIZE = 24;
const VERTEX_RADIUS = 25;
const VERTEX_TEXT_COLOR = 'white';

class GraphViewer {
  constructor(canvasEl, vertices, vertexPositions, graphColorer) {
    this.canvasEl = canvasEl;
    this.canvasEl.height = this.canvasDimensions().height;
    this.canvasEl.width = this.canvasDimensions().width;

    this.ctx = canvasEl.getContext('2d');

    this.vertices = vertices;
    this.vertexPositions = vertexPositions;

    this.vertexDragger = new VertexDragger(this, canvasEl, VERTEX_RADIUS);
    this.graphColorer = graphColorer;

    window.addEventListener('resize', () => this.onResize());
  }

  canvasDimensions() {
    return {
      height: parseInt(getComputedStyle(canvasEl).height),
      width: parseInt(getComputedStyle(canvasEl).width)
    };
  }

  onResize() {
    this.canvasEl.height = this.canvasDimensions().height;
    this.canvasEl.width = this.canvasDimensions().width;
    this.draw();
  }

  position(vertex) {
    const position = this.vertexPositions.get(vertex);
    return {
      x: position.x * this.canvasDimensions().width,
      y: position.y * this.canvasDimensions().height
    };
  }

  draw() {
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.fillRect(
      0, 0,
      this.canvasDimensions().width, this.canvasDimensions().height
    );

    this.vertices.forEach(vertex => {
      vertex.edges.forEach(e => this.drawEdge(e));
    });
    this.vertices.forEach(vertex => this.drawVertex(vertex));
  }

  writeText(text, position, fontSize, fontColor) {
    this.ctx.font = `${fontSize}px monospace`;
    this.ctx.fillStyle = fontColor;
    const textWidth = this.ctx.measureText(text).width;
    this.ctx.fillText(
      text,
      position.x - (textWidth / 2),
      position.y + (12 / 2),
    );
  }

  drawVertex(vertex) {
    const position = this.position(vertex);

    this.ctx.fillStyle = this.graphColorer.colorVertex(vertex);
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, VERTEX_RADIUS, 0, 2 * Math.PI);
    this.ctx.fill();

    this.writeText(
      vertex.name, position, VERTEX_FONT_SIZE, VERTEX_TEXT_COLOR
    );
  }

  drawEdge(edge) {
    const startPosition = this.position(edge.vertices[0]);
    const endPosition = this.position(edge.vertices[1]);

    this.ctx.lineWidth = EDGE_LINE_WIDTH;
    this.ctx.strokeStyle = this.graphColorer.colorEdge(edge);

    this.ctx.beginPath();
    this.ctx.moveTo(startPosition.x, startPosition.y);
    this.ctx.lineTo(endPosition.x, endPosition.y);
    this.ctx.stroke();

    const halfwayPosition = {
      x: (startPosition.x + endPosition.x) / 2,
      y: (startPosition.y + endPosition.y) / 2,
    };


    this.writeText(
      `${edge.name}: $${edge.cost}`,
      halfwayPosition,
      EDGE_FONT_SIZE,
      EDGE_TEXT_COLOR,
    )
  }
}

module.exports = GraphViewer;

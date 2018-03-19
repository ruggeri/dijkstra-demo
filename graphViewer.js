const BACKGROUND_COLOR = 'rgb(128, 128, 128)';
const EDGE_LINE_WIDTH = 2.5;
const FONT_SIZE = 24;
const PIXEL_HEIGHT = 768;
const PIXEL_WIDTH = 1024;
const VERTEX_RADIUS = 25;
const VERTEX_TEXT_COLOR = 'rgb(255, 255, 255)';

class GraphViewer {
  constructor(canvasEl, vertices, vertexPositions, graphColorer) {
    canvasEl.height = PIXEL_HEIGHT;
    canvasEl.width = PIXEL_WIDTH;

    this.ctx = canvasEl.getContext('2d');

    this.vertices = vertices;
    this.vertexPositions = new Map();

    vertexPositions.forEach((pos, v) => {
      this.vertexPositions.set(v, {
        x: pos.x * PIXEL_WIDTH,
        y: pos.y * PIXEL_HEIGHT
      });
    });

    new VertexDragger(this, canvasEl);
    this.graphColorer = graphColorer;
  }

  draw() {
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.fillRect(0, 0, PIXEL_WIDTH, PIXEL_HEIGHT);

    this.vertices.forEach(vertex => {
      vertex.edges.forEach(e => this.drawEdge(e));
    });
    this.vertices.forEach(vertex => this.drawVertex(vertex));
  }

  writeText(text, position, fontColor = 'rgb(0, 0, 0)') {
    this.ctx.font = `${FONT_SIZE}px monospace`;
    this.ctx.fillStyle = fontColor;
    const textWidth = this.ctx.measureText(text).width;
    this.ctx.fillText(
      text,
      position.x - (textWidth / 2),
      position.y + (12 / 2),
    );
  }

  drawVertex(vertex) {
    const position = this.vertexPositions.get(vertex);

    this.ctx.fillStyle = this.graphColorer.colorVertex(vertex);
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, VERTEX_RADIUS, 0, 2 * Math.PI);
    this.ctx.fill();

    this.writeText(vertex.name, position, VERTEX_TEXT_COLOR);
  }

  drawEdge(edge) {
    const startPosition = this.vertexPositions.get(edge.vertices[0]);
    const endPosition = this.vertexPositions.get(edge.vertices[1]);

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
    )
  }
}

GraphViewer.VERTEX_RADIUS = VERTEX_RADIUS;

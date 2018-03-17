const PIXEL_HEIGHT = 768;
const PIXEL_WIDTH = 1024;
const VERTEX_RADIUS = 25;

class GraphViewer {
  constructor(ctx, vertices) {
    this.ctx = ctx;

    this.vertices = vertices;
    this.vertexPositions = new Map();

    vertices.forEach(v => {
      this.vertexPositions.set(v, {
        x: Math.random(),
        y: Math.random(),
      });
    });
  }

  draw() {
    this.ctx.fillStyle = 'rgb(0, 0, 0)';
    this.ctx.fillRect(0, 0, PIXEL_WIDTH, PIXEL_HEIGHT);

    this.vertices.forEach(vertex => this.drawVertex(vertex));
  }

  drawVertex(vertex) {
    const position = this.vertexPositions.get(vertex);
    console.log(position)

    this.ctx.fillStyle = 'rgb(255, 255, 255)';
    this.ctx.beginPath();
    this.ctx.arc(
      position.x * PIXEL_WIDTH,
      position.y * PIXEL_HEIGHT,
      VERTEX_RADIUS,
      0,
      2 * Math.PI,
    );
    this.ctx.fill();
  }
}

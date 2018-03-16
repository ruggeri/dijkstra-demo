const NUM_PIXELS = 500;
const VERTEX_RADIUS = 0.05

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
    this.ctx.fillRect(0, 0, NUM_PIXELS, NUM_PIXELS);

    this.vertices.forEach(vertex => this.drawVertex(vertex));
  }

  drawVertex(vertex) {
    const position = this.vertexPositions.get(vertex);
    console.log(position)

    this.ctx.fillStyle = 'rgb(255, 255, 255)';
    this.ctx.beginPath();
    this.ctx.arc(
      position.x * NUM_PIXELS,
      position.y * NUM_PIXELS,
      VERTEX_RADIUS * NUM_PIXELS,
      0,
      2 * Math.PI,
    );
    this.ctx.fill();
  }
}

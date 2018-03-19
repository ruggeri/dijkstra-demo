const ACTIVE_EDGE_COLOR = 'rgb(255, 255, 0)';
const DEFAULT_EDGE_COLOR = 'rgb(0, 0, 255)';
const VISITED_EDGE_COLOR = 'rgb(0, 255, 0)';

const ACTIVE_VERTEX_COLOR = 'rgb(255, 255, 0)';
const DEFAULT_VERTEX_COLOR = 'rgb(0, 0, 255)';
const START_VERTEX_COLOR = 'rgb(255, 0, 0)';
const VISITED_VERTEX_COLOR = 'rgb(0, 255, 0)';


class DijkstraGraphColorer {
  constructor(options = {}) {
    const {
      startVertex,
      result,
      fringe,
      activeEdge,
      activeVertex
    } = options;

    this.startVertex = startVertex;
    this.result = result || new ResultMap();
    this.fringe = fringe || new Fringe();
    this.activeEdge = activeEdge;
    this.activeVertex = activeVertex;
  }

  colorVertex(vertex) {
    if (this.startVertex === vertex) {
      return START_VERTEX_COLOR;
    } else if (this.activeVertex === vertex) {
      return ACTIVE_VERTEX_COLOR;
    } else if (this.result.hasVertex(vertex)) {
      return VISITED_VERTEX_COLOR;
    } else {
      return DEFAULT_VERTEX_COLOR;
    }
  }

  colorEdge(edge) {
    if (this.activeEdge === edge) {
      return ACTIVE_EDGE_COLOR;
    } else if (this.result.hasEdge(edge)) {
      return VISITED_EDGE_COLOR;
    } else {
      return DEFAULT_EDGE_COLOR;
    }
  }
}

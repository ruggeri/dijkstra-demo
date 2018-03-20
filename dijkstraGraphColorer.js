const CONSIDERED_EDGE_COLOR = 'yellow';
const DEFAULT_EDGE_COLOR = 'black';
const EXTRACTED_EDGE_COLOR = 'cyan';
const FRINGE_EDGE_COLOR = 'blue';
const UPDATED_EDGE_COLOR = 'purple';
const VISITED_EDGE_COLOR = 'green';

const CONSIDERED_VERTEX_COLOR = 'yellow';
const DEFAULT_VERTEX_COLOR = 'black';
const EXTRACTED_VERTEX_COLOR = 'cyan';
const FRINGE_VERTEX_COLOR = 'blue';
const GOAL_VERTEX_COLOR = 'white';
const START_VERTEX_COLOR = 'red';
const UPDATED_VERTEX_COLOR = 'purple';
const VISITED_VERTEX_COLOR = 'green';

class DijkstraGraphColorer {
  constructor(options) {
    this.clear();
    this.set(options);
  }

  clear() {
    Object.assign(this, {
      startVertex: null,
      goalVertex: null,
      result: new ResultMap(),
      fringe: new Fringe(),
      consideredEdge: null,
      consideredVertex: null,
      extractedEdge: null,
      extractedVertex: null,
      updatedEdge: null,
      updatedVertex: null,
    });
  }

  set(options) {
    Object.assign(this, options);
  }

  colorVertex(vertex) {
    if (this.startVertex === vertex) {
      return START_VERTEX_COLOR;
    } else if (this.goalVertex === vertex) {
      return GOAL_VERTEX_COLOR;
    } else if (this.extractedVertex === vertex) {
      return EXTRACTED_VERTEX_COLOR;
    } else if (this.updatedVertex === vertex) {
      return UPDATED_VERTEX_COLOR;
    } else if (this.consideredVertex === vertex) {
      return CONSIDERED_VERTEX_COLOR;
    } else if (this.result.hasVertex(vertex)) {
      return VISITED_VERTEX_COLOR;
    } else if (this.fringe.hasVertex(vertex)) {
      return FRINGE_VERTEX_COLOR;
    } else {
      return DEFAULT_VERTEX_COLOR;
    }
  }

  colorEdge(edge) {
    if (this.consideredEdge === edge) {
      return CONSIDERED_EDGE_COLOR;
    } else if (this.extractedEdge === edge) {
      return EXTRACTED_EDGE_COLOR;
    } else if (this.updatedEdge === edge) {
      return UPDATED_EDGE_COLOR;
    } else if (this.fringe.hasEdge(edge)) {
      return FRINGE_EDGE_COLOR;
    } else if (this.result.hasEdge(edge)) {
      return VISITED_EDGE_COLOR;
    } else {
      return DEFAULT_EDGE_COLOR;
    }
  }
}

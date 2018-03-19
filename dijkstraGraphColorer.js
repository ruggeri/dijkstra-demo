const CONSIDERED_EDGE_COLOR = 'rgb(255, 255, 0)';
const DEFAULT_EDGE_COLOR = 'rgb(0, 0, 255)';
const EXTRACTED_EDGE_COLOR = 'rgb(0, 255, 255)';
const UPDATED_EDGE_COLOR = 'rgb(255, 0, 255)';
const VISITED_EDGE_COLOR = 'rgb(0, 255, 0)';

const CONSIDERED_VERTEX_COLOR = 'rgb(255, 255, 0)';
const DEFAULT_VERTEX_COLOR = 'rgb(0, 0, 255)';
const EXTRACTED_VERTEX_COLOR = 'rgb(0, 255, 255)';
const START_VERTEX_COLOR = 'rgb(255, 0, 0)';
const UPDATED_VERTEX_COLOR = 'rgb(255, 0, 255)';
const VISITED_VERTEX_COLOR = 'rgb(0, 255, 0)';


class DijkstraGraphColorer {
  constructor(options = {}) {
    const {
      startVertex,
      result,
      fringe,
      consideredEdge,
      consideredVertex,
      extractedEdge,
      extractedVertex,
      updatedEdge,
      updatedVertex,
    } = options;

    this.startVertex = startVertex;
    this.result = result || new ResultMap();
    this.fringe = fringe || new Fringe();
    this.consideredEdge = consideredEdge;
    this.consideredVertex = consideredVertex;
    this.extractedEdge = extractedEdge;
    this.extractedVertex = extractedVertex;
    this.updatedEdge = updatedEdge;
    this.updatedVertex = updatedVertex;
  }

  colorVertex(vertex) {
    if (this.startVertex === vertex) {
      return START_VERTEX_COLOR;
    } else if (this.extractedVertex === vertex) {
      return EXTRACTED_VERTEX_COLOR;
    } else if (this.updatedVertex === vertex) {
      return UPDATED_VERTEX_COLOR;
    } else if (this.consideredVertex === vertex) {
      return CONSIDERED_VERTEX_COLOR;
    } else if (this.result.hasVertex(vertex)) {
      return VISITED_VERTEX_COLOR;
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
    } else if (this.result.hasEdge(edge)) {
      return VISITED_EDGE_COLOR;
    } else {
      return DEFAULT_EDGE_COLOR;
    }
  }
}

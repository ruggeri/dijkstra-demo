// Puts the costs in a human friendly scale (zero to ten).
const COST_SCALER = 10;
// How much to vary the cost.
const COST_VARIABILITY = 1;
// Number of times to try generating vertex positions/graphs.
const MAX_GENERATE_GRAPH_TRIES = 10;
const MAX_GENERATE_POSITION_TRIES = 100;
const MAX_NUM_EDGES = 3;
// Tries to place vertices a fair distance apart from each other.
const MIN_DISTANCE = 0.275;
const NUM_VERTICES = 10;
// Tries to avoid placing vertices near the borders of the canvas.
const PADDING = 0.05;

module.exports = {
  COST_SCALER,
  COST_VARIABILITY,
  MAX_GENERATE_GRAPH_TRIES,
  MAX_GENERATE_POSITION_TRIES,
  MAX_NUM_EDGES,
  MIN_DISTANCE,
  NUM_VERTICES,
  PADDING,
};

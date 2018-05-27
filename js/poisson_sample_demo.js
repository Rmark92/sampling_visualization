export default class PoissonSampleDemo {
  constructor(canvas, radius, maxCandidates) {
    this.cellSize = Math.floor(radius / Math.sqrt(2));
    this.maxCandidates = maxCandidates;
    this.radius = radius;
    this.canvasHeight = canvas.height;
    this.canvasWidth = canvas.width;
    this.gridHeight = Math.ceil(this.canvasHeight / this.cellSize) + 1;
    this.gridWidth = Math.ceil(this.canvasWidth / this.cellSize) + 1;
  }

  reset() {
    this.grid = this.initGrid();
    this.points = [];
    this.numPoints = 0;
    this.activePoints = [];
  }

  initGrid() {
    let rowIdx;
    let colIdx;
    const grid = [];
    for (rowIdx = 0; rowIdx < this.gridHeight; rowIdx++) {
      grid[rowIdx] = new Array(this.gridWidth);
    }
    return grid;
  }

  render() {
    this.reset();
    
  }
}

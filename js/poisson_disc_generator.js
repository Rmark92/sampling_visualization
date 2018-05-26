export default class poissonSample {
  constructor(canvasHeight, canvasWidth, radius, maxCandidates) {
    this.cellSize = Math.floor(radius / Math.sqrt(2));
    this.maxCandidates = maxCandidates;
    this.radius = radius;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;
    this.gridHeight = Math.ceil(canvasHeight / this.cellSize) + 1;
    this.gridWidth = Math.ceil(canvasWidth / this.cellSize) + 1;
    this.grid = this.initGrid();
    this.points = [];
    this.numPoints = 0;
    this.activePoints = [];
    // this.steps = [];
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

  // pointToGridCoords(point) {
  //   let rowIdx;
  //   let colIdx;
  //   rowIdx = Math.floor(point[0] / this.cellSize);
  //   colIdx = Math.floor(point[1] / this.cellSize);
  //   return [rowIdx, colIdx];
  // }

  pointToGridCoords(coords) {
    let rowIdx;
    let colIdx;
    rowIdx = Math.floor(coords[0] / this.cellSize);
    colIdx = Math.floor(coords[1] / this.cellSize);
    return [rowIdx, colIdx];
  }


  insert(newPoint) {
    let rowIdx;
    let colIdx;
    this.points.push(newPoint);
    this.activePoints.push(newPoint);
    [rowIdx, colIdx] = this.pointToGridCoords(newPoint.coords);
    this.grid[rowIdx][colIdx] = newPoint;
    this.numPoints += 1;
  }

  // distance(pointA, pointB) {
  //   const squaredDist = Math.pow((pointA[0] - pointB[0]), 2) + Math.pow((pointA[1] - pointB[1]), 2)
  //   return Math.sqrt(squaredDist);
  // }

  distance(pointA, pointB) {
    const squaredDist = Math.pow((pointA.coords[0] - pointB.coords[0]), 2) + Math.pow((pointA.coords[1] - pointB.coords[1]), 2);
    return Math.sqrt(squaredDist);
  }

  isInRange(point) {
    return (point.coords[0] > 0 &&
            point.coords[0] < this.canvasHeight &&
            point.coords[1] > 0 &&
            point.coords[1] < this.canvasWidth);
  }

  // isInRange(point) {
  //   return (point[0] > 0 &&
  //           point[0] < this.canvasHeight &&
  //           point[1] > 0 &&
  //           point[1] < this.canvasWidth);
  // }

  isValidPoint(point) {
    let rowIdx;
    let colIdx;
    if (!this.isInRange(point)) { return false; }
    [rowIdx, colIdx] = this.pointToGridCoords(point.coords);
    const rowIdxMin = Math.max(0, rowIdx - 1);
    const colIdxMin = Math.max(0, colIdx - 1);
    const rowIdxMax = Math.min(this.gridWidth - 1, rowIdx + 1);
    const colIdxMax = Math.min(this.gridHeight - 1, colIdx + 1);

    for (rowIdx = rowIdxMin; rowIdx <= rowIdxMax; rowIdx++) {
      for (colIdx = colIdxMin; colIdx <= colIdxMax; colIdx++) {
        if (this.grid[rowIdx][colIdx] && this.distance(this.grid[rowIdx][colIdx], point) < this.radius) {
               return false;
             }
      }
    }
    return true;
  }

  load() {
    const p0 = { coords: [Math.round(Math.random() * this.canvasWidth),
                          Math.round(Math.random() * this.canvasHeight)],
               };
    // const p0 = [Math.round(Math.random() * this.canvasWidth),
    //             Math.round(Math.random() * this.canvasHeight)];
    this.insert(p0, null);

    let refIdx;
    let refPoint;
    let numCandidates;
    let candidateMaxReached;
    let candidatePoint;
    let theta;
    let dist;
    while (this.activePoints.length > 0) {
      refIdx = Math.floor(Math.random() * this.activePoints.length);
      refPoint = this.activePoints[refIdx];
      candidateMaxReached = true;
      for (numCandidates = 0; numCandidates <= this.maxCandidates; numCandidates++) {
        theta = Math.random() * 360;
        dist = (Math.random()*this.radius + this.radius);
        candidatePoint = { coords: [dist * Math.cos(theta) + refPoint.coords[0],
                                    dist * Math.sin(theta) + refPoint.coords[1]],
                           refCoords: refPoint.coords};
        if (this.isValidPoint(candidatePoint)) {
          this.insert(candidatePoint);
          candidateMaxReached = false;
          break;
        }
      }
      if (candidateMaxReached) {
        this.activePoints.splice(refIdx, 1);
      }
    }
    return this.points;
  }
}

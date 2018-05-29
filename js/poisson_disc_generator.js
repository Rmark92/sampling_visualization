export default class poissonSample {
  constructor(maxHeight, maxWidth, radius, maxCandidates) {
    // this.canvas = canvas;
    // this.context = canvas.getContext('2d');
    this.cellSize = Math.floor(radius / Math.sqrt(2));
    this.maxCandidates = maxCandidates;
    this.radius = radius;
    this.canvasHeight = maxHeight;
    this.canvasWidth = maxWidth;
    this.gridHeight = Math.ceil(maxHeight / this.cellSize) + 1;
    this.gridWidth = Math.ceil(maxWidth / this.cellSize) + 1;
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
            point.coords[0] < this.canvasWidth &&
            point.coords[1] > 0 &&
            point.coords[1] < this.canvasHeight);
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

  drawPoints() {
    this.points.forEach( point=> {
      this.context.beginPath();
      this.context.arc(point.coords[0], point.coords[1], 4, 0, 2*Math.PI);
      this.context.lineWidth = 1;
      // this.context.strokeStyle = "black";
      this.context.fillStyle = "#353638";
      // this.context.stroke();
      this.context.fill();
    });
  }

  drawActives() {
    this.activePoints.forEach( point=> {
      this.context.beginPath();
      this.context.arc(point.coords[0], point.coords[1], 4, 0, 2*Math.PI);
      this.context.lineWidth = 1;
      // this.context.strokeStyle = "black";
      this.context.fillStyle = "#2f89ef";
      // this.context.stroke();
      this.context.fill();
    });
  }

  drawCandidate(candidate) {
    this.context.beginPath();
    this.context.arc(candidate.coords[0], candidate.coords[1], 4, 0, 2*Math.PI);
    this.context.lineWidth = 1;
    this.context.strokeStyle = "black";
    this.context.stroke();
    // this.context.fillStyle = "#f3b414";
    // this.context.fill();
  }

  drawRefPoint(refPoint) {
    this.context.beginPath();
    this.context.arc(refPoint.coords[0], refPoint.coords[1], 4, 0, 2*Math.PI);
    this.context.lineWidth = 5;
    // this.context.strokeStyle = "black";
    this.context.fillStyle = "#fb3c3c";
    this.context.fill();
  }

  drawChoiceCandidate(candidate) {
    this.context.beginPath();
    this.context.arc(candidate.coords[0], candidate.coords[1], 4, 0, 2*Math.PI);
    this.context.lineWidth = 1;
    // this.context.strokeStyle = "black";
    this.context.fillStyle = "#08da88";
    // this.context.stroke();
    this.context.fill();
  }

  demoNextCandidate(numCandidates, refPoint, refIdx) {
    if (numCandidates > this.maxCandidates) {
      this.activePoints.splice(refIdx, 1);
      setTimeout( () => this.demoNextActive(), 1000);
    } else {
      let theta = Math.random() * 360;
      let dist = Math.random()*this.radius + this.radius;
      let candidatePoint = { coords: [dist * Math.cos(theta) + refPoint.coords[0],
                                      dist * Math.sin(theta) + refPoint.coords[1]] };
      this.drawCandidate(candidatePoint);

      if (this.isValidPoint(candidatePoint)) {
        this.insert(candidatePoint);
        setTimeout(() => {
          this.drawChoiceCandidate(candidatePoint);
          setTimeout( () => this.demoNextActive(), 1000);
        }, 500);
      } else {
        setTimeout( () => this.demoNextCandidate(numCandidates + 1, refPoint, refIdx), 100);
      }
    }
  }

  demoNextActive() {
    if (this.activePoints.length === 0) {
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.drawPoints();
    } else {
      let refIdx = Math.floor(Math.random() * this.activePoints.length);
      let refPoint = this.activePoints[refIdx];
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.drawPoints();
      this.drawActives();
      this.drawRefPoint(refPoint);

      setTimeout( () => this.demoNextCandidate(0, refPoint, refIdx), 1000);
    }
  }

  demo(canvas) {
    this.reset();
    const p0 = { coords: [Math.round(Math.random() * this.canvasWidth),
                          Math.round(Math.random() * this.canvasHeight)],
               };

    this.insert(p0);
    this.context = canvas.getContext('2d');
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);


    setTimeout( () => this.demoNextActive(), 100);
  }

  load() {
    this.reset();
    const p0 = { coords: [Math.round(Math.random() * this.canvasWidth),
                          Math.round(Math.random() * this.canvasHeight)],
               };
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

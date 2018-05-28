import * as d3 from "d3";

export default class BestCandidateSample {
  constructor(maxHeight, maxWidth, numDots, numCandidates) {
    this.canvasHeight = maxHeight;
    this.canvasWidth = maxWidth;
    this.numDots = numDots;
    this.numCandidates = numCandidates;
  }

  reset() {
    this.points = [];
    this.quadTree = d3.quadtree();
    this.quadTree.extent([0, 0], [this.canvasWidth, this.canvasHeight]);
  }

  distance(pointA, pointB) {
    const squaredDist = Math.pow((pointA[0] - pointB[0]), 2) + Math.pow((pointA[1] - pointB[1]), 2);
    return Math.sqrt(squaredDist);
  }

  generateRandomPoint() {
    return { coords: [Math.random() * this.canvasWidth,
                      Math.random() * this.canvasHeight] };
  }

  findBestCandidate() {
    let candidateCount;
    let point;
    let nearestNeighbor;
    let distance;
    let bestDistance = 0;
    let bestPoint;

    for (candidateCount = 1; candidateCount <= this.numCandidates; candidateCount++) {
      point = this.generateRandomPoint();
      nearestNeighbor = this.quadTree.find(...point.coords);
      distance = this.distance(nearestNeighbor, point.coords);
      if (distance > bestDistance) {
        bestDistance = distance;
        point.refCoords = nearestNeighbor;
        bestPoint = point;
      }
    }
    return bestPoint;
  }

  insert(point) {
    this.points.push(point);
    this.quadTree.add(point.coords);
  }

  drawPoints() {
    this.points.forEach( point=> {
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

  colorBest(bestCand) {
    this.context.beginPath();
    this.context.arc(bestCand.coords[0], bestCand.coords[1], 4, 0, 2*Math.PI);
    this.context.lineWidth = 1;
    this.context.strokeStyle = "black";
    this.context.stroke();
    this.context.fillStyle = "#08da88";
    this.context.fill();
  }

  drawLine(origin, dest) {
    this.context.moveTo(origin[0], origin[1]);
    this.context.lineTo(dest[0], dest[1]);
    this.context.lineWidth = 1;
    this.context.strokeStyle = "black";
    this.context.stroke();
  }

  demoNextCandidate(candidateAttempts, bestCandidate, bestDistance) {
    if (candidateAttempts === this.numCandidates) {
      this.quadTree.add(bestCandidate.coords);
      this.points.push(bestCandidate);
      this.colorBest(bestCandidate);
      setTimeout( () => this.demoNextCandidates(), 2000);
    } else {
      const candidate = this.generateRandomPoint();
      const nearestNeighbor = this.quadTree.find(...candidate.coords);
      const distance = this.distance(nearestNeighbor, candidate.coords);
      setTimeout( () => {
        this.drawCandidate(candidate);
        setTimeout( () => this.drawLine(candidate.coords, nearestNeighbor), 40);
        if (distance > bestDistance) {
          bestCandidate = candidate;
          bestDistance = distance;
        }
        setTimeout( () => this.demoNextCandidate(candidateAttempts + 1, bestCandidate, bestDistance), 50);
      }, 500);
    }
  }

  demoNextCandidates() {
    if (this.points.length === this.numDots) {
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      setTimeout( () => this.drawPoints(), 1000);
    } else {
      this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.drawPoints();
      setTimeout( () => this.demoNextCandidate(0, null, 0), 50);
    }
  }

  demo(canvas) {
    this.reset();
    this.context = canvas.getContext('2d');
    const p0 = this.generateRandomPoint();
    this.insert(p0);
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.demoNextCandidates();
  }

  load() {
    this.reset();
    const p0 = this.generateRandomPoint();
    this.insert(p0);

    let bestCandidate;
    while (this.points.length < this.numDots) {
      bestCandidate = this.findBestCandidate();
      this.insert(bestCandidate);
    }

    return this.points;
  }
}

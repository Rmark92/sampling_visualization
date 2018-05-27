import * as d3 from "d3";

export default class BestCandidateSample {
  constructor(canvasHeight, canvasWidth, numDots, numCandidates) {
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;
    this.numDots = numDots;
    this.numCandidates = numCandidates;
    this.points = [];
    this.quadTree = d3.quadtree();
    this.quadTree.extent([0, 0], [canvasWidth, canvasHeight]);
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

  demo() {
    
  }

  load() {
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

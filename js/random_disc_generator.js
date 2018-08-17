export default class UniformRandomSample {
  constructor(canvasHeight, canvasWidth, numDots) {
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;
    this.numDots = numDots;
    this.points = [];
  }

  load() {
    let dotsPlaced = 0;
    while (dotsPlaced < this.numDots) {
      let xCoord = Math.random() * this.canvasWidth;
      let yCoord = Math.random() * this.canvasHeight;
      let point = { coords: [xCoord, yCoord] };
      this.points.push(point);
      dotsPlaced += 1;
    }
    return this.points;
  }
}

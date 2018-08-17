export default class UniformSample {
  constructor(canvasHeight, canvasWidth, radius) {
    this.radius = radius;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;
    this.points = [];
  }

  load() {
    const horizStep = this.radius;
    const verticalStep = Math.sqrt(Math.pow(this.radius, 2) - Math.pow((this.radius / 2), 2));

    let horizPos = 0;
    let vertPos = 0;
    let evenRow = true;
    let point;

    let numDots = 0;
    while (vertPos < this.canvasHeight) {
      horizPos = evenRow ? 0 : this.radius / 2;
      while (horizPos < this.canvasWidth) {
        point = { coords: [horizPos, vertPos] };
        this.points.push(point);
        numDots += 1;
        horizPos += horizStep;
      }
      vertPos += verticalStep;
      evenRow = !evenRow;
    }
    return this.points;
  }
}

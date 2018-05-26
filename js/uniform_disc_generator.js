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

// export default function generateUniformDisc(imageCanvas, canvas, radius) {
//   const imageCanvasContext = imageCanvas.getContext('2d');
//   const canvasContext = canvas.getContext('2d');
//   const horizStep = radius;
//   const verticalStep = Math.sqrt(Math.pow(radius, 2) - Math.pow((radius / 2), 2));
//   let horizPos = 0;
//   let vertPos = 0;
//   let evenRow = true;
//
//   function calculateDotRadius(point) {
//     const pixelData = imageCanvasContext.getImageData(point[0], point[1], 1, 1).data.slice(0, 3);
//     const grayScaleVal = pixelData.reduce((memo, val) => memo + val, 0) / 3;
//     const dotRadius = ((300 - grayScaleVal) / 300) * (radius / 2);
//     return dotRadius;
//   }
//
//   function drawPoint(point) {
//     let dotRadius = calculateDotRadius(point);
//     canvasContext.beginPath();
//     canvasContext.arc(point[0], point[1], dotRadius, 0, 2*Math.PI);
//     canvasContext.fill();
//   }
//   let numDots = 0;
//   while (vertPos < canvas.width) {
//     horizPos = evenRow ? 0 : radius / 2;
//     while (horizPos < canvas.width) {
//       drawPoint([horizPos, vertPos]);
//       numDots += 1;
//       horizPos += horizStep;
//     }
//     vertPos += verticalStep;
//     evenRow = !evenRow;
//   }
//   console.log(numDots);
// }

// export default function generateUniformDisc(imageCanvas, canvas, numDots) {
//   const imageCanvasContext = imageCanvas.getContext('2d');
//   const canvasContext = canvas.getContext('2d');
//   const radius = ((canvas.width - 1) / (Math.sqrt(numDots) - 1)) - 1;
//   debugger;
//   let horizPos = 0;
//   let vertPos = 0;
//
//   function calculateDotRadius(point) {
//     const pixelData = imageCanvasContext.getImageData(point[0], point[1], 1, 1).data.slice(0, 3);
//     const grayScaleVal = pixelData.reduce((memo, val) => memo + val, 0) / 3;
//     const dotRadius = ((300 - grayScaleVal) / 300) * (radius / 2);
//     return dotRadius;
//   }
//
//   function drawPoint(point) {
//     let dotRadius = calculateDotRadius(point);
//     canvasContext.beginPath();
//     canvasContext.arc(point[0], point[1], dotRadius, 0, 2*Math.PI);
//     canvasContext.fill();
//   }
//
//   while (vertPos <= canvas.height) {
//     while (horizPos <= canvas.width) {
//       drawPoint([horizPos, vertPos]);
//       horizPos += radius;
//     }
//     vertPos += radius;
//   }
// }

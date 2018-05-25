export default function generateRandomSample(imageCanvas, canvas, numDots, maxRadius) {
  const imageCanvasContext = imageCanvas.getContext('2d');
  const canvasContext = canvas.getContext('2d');

  function calculateDotRadius(point) {
    const pixelData = imageCanvasContext.getImageData(point[0], point[1], 1, 1).data.slice(0, 3);
    const grayScaleVal = pixelData.reduce((memo, val) => memo + val, 0) / 3;
    const dotRadius = ((300 - grayScaleVal) / 300) * (maxRadius / 2);
    return dotRadius;
  }

  let dotsPlaced = 0;

  while (dotsPlaced < numDots) {
    let xCoord = Math.random() * canvas.width;
    let yCoord = Math.random() * canvas.height;
    let point = [xCoord, yCoord];
    let dotRadius = calculateDotRadius(point);
    canvasContext.beginPath();
    canvasContext.arc(point[0], point[1], dotRadius, 0, 2*Math.PI);
    canvasContext.fill();
    dotsPlaced += 1;
  }
}

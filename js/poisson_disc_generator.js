export default function generatePoissonSample(imageCanvas, canvas, canvas2, radius, maxCandidates) {
  const canvasHeight = canvas.height;
  const canvasWidth = canvas.width;
  const context = canvas.getContext("2d");
  const context2 = canvas2.getContext("2d");
  const imageCanvasContext = imageCanvas.getContext("2d");
  const cellSize = Math.floor(radius / Math.sqrt(2));
  const gridHeight = Math.ceil(canvasHeight / cellSize) + 1;
  const gridWidth = Math.ceil(canvasWidth / cellSize) + 1;

  const grid = [];
  const points = [];
  const firstPointsArr = [];

  let rowIdx;
  let colIdx;
  for (rowIdx = 0; rowIdx < gridHeight; rowIdx++) {
    grid[rowIdx] = new Array(gridWidth);
  }

  function pointToGridCoords(point) {
    rowIdx = Math.floor(point[0] / cellSize);
    colIdx = Math.floor(point[1] / cellSize);
    return [rowIdx, colIdx];
  }

  function calculateDotRadius(point) {
    const pixelData = imageCanvasContext.getImageData(point[0], point[1], 1, 1).data.slice(0, 3);
    const grayScaleVal = pixelData.reduce((memo, val) => memo + val, 0) / 3;
    const dotRadius = ((300 - grayScaleVal) / 300) * (radius / 2);
    // debugger
    return dotRadius;
  }

  function insert(point) {
    points.push(point);
    const dotRadius = calculateDotRadius(point);
    // debugger
    context.beginPath();
    context.arc(point[0], point[1], dotRadius, 0, 2*Math.PI);
    context.fill();
    [rowIdx, colIdx] = pointToGridCoords(point);
    grid[rowIdx][colIdx] = point;
  }

  function drawLine(newPoint, prevPoint) {
    context2.beginPath();
    context2.moveTo(prevPoint[0], prevPoint[1]);
    context2.lineTo(newPoint[0],newPoint[1]);
    context2.stroke();
  }

  function distance(pointA, pointB) {
    const squaredDist = Math.pow((pointA[0] - pointB[0]), 2) + Math.pow((pointA[1] - pointB[1]), 2)
    return Math.sqrt(squaredDist);
  }

  function isInRange(point) {
    return (point[0] > 0 &&
            point[0] < canvasHeight &&
            point[1] > 0 &&
            point[1] < canvasWidth);
  }

  function isValidPoint(point) {
    if (!isInRange(point)) { return false; }
    [rowIdx, colIdx] = pointToGridCoords(point);
    const rowIdxMin = Math.max(0, rowIdx - 1);
    const colIdxMin = Math.max(0, colIdx - 1);
    const rowIdxMax = Math.min(gridWidth - 1, rowIdx + 1);
    const colIdxMax = Math.min(gridHeight - 1, colIdx + 1);

    for (rowIdx = rowIdxMin; rowIdx <= rowIdxMax; rowIdx++) {
      for (colIdx = colIdxMin; colIdx <= colIdxMax; colIdx++) {
        if (grid[rowIdx][colIdx] && distance(grid[rowIdx][colIdx], point) < radius) {
               return false;
             }
      }
    }
    return true;
  }

  const p0 = [Math.round(Math.random() * canvasWidth), Math.round(Math.random() * canvasHeight)];
  firstPointsArr.push(p0);
  insert(p0);

  let refIdx;
  let refPoint;
  let numCandidates;
  let candidateMaxReached;
  let candidatePoint;
  let theta;
  let dist;

  function drawNextPoint(activePoints) {
    if (activePoints.length === 0) { return; }
    refIdx = Math.floor(Math.random() * activePoints.length);
    refPoint = activePoints[refIdx];
    candidateMaxReached = true;
    for (numCandidates = 0; numCandidates <= maxCandidates; numCandidates++) {
      theta = Math.random() * 360;
      dist = (Math.random()*radius + radius);
      candidatePoint = [dist * Math.cos(theta) + refPoint[0],
                        dist * Math.sin(theta) + refPoint[1]];
      if (isValidPoint(candidatePoint)) {
        insert(candidatePoint);
        drawLine(candidatePoint, refPoint);
        activePoints.push(candidatePoint);
        candidateMaxReached = false;
        break;
      }
    }
    let newPoints;
    setTimeout( () => {
      if (candidateMaxReached) {
        newPoints = activePoints.slice(0, refIdx).concat(activePoints.slice(refIdx + 1));
      } else {
        newPoints = activePoints.slice(0);
      }
      drawNextPoint(newPoints);
    }, 0)
  }
  //
  drawNextPoint(firstPointsArr);
  // while (activePoints.length > 0) {
  //   refIdx = Math.floor(Math.random() * activePoints.length);
  //   refPoint = activePoints[refIdx];
  //   candidateMaxReached = true;
  //   for (numCandidates = 0; numCandidates <= maxCandidates; numCandidates++) {
  //     theta = Math.random() * 360;
  //     dist = (Math.random()*radius + radius);
  //     candidatePoint = [dist * Math.cos(theta) + refPoint[0],
  //                       dist * Math.sin(theta) + refPoint[1]];
  //     if (isValidPoint(candidatePoint)) {
  //       insert(candidatePoint);
  //       drawLine(candidatePoint, refPoint);
  //       activePoints.push(candidatePoint);
  //       candidateMaxReached = false;
  //       break;
  //     }
  //   }
  //   if (candidateMaxReached) {
  //     activePoints.splice(refIdx, 1);
  //   }
  // }

  // return grid;
}

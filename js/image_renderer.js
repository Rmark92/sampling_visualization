import PoissonSample from './poisson_disc_generator';
import BestCandidateSample from './best_candidate_disc_generator';
import UniformRandomSample from './random_disc_generator';
import UniformSample from './uniform_disc_generator';
import * as d3 from "d3";

export default function renderImages(img) {
  const imageCanv = document.getElementById('image-canvas');
  const poissonCanvasStippling = document.getElementById("poisson-canvas-stippling");
  const poissonCanvasVoronoi = document.getElementById("poisson-canvas-voronoi");
  const poissonCanvasMap = document.getElementById("poisson-canvas-map");
  const poissonCanvasDemo = document.getElementById("poisson-canvas-demo");
  const bestCandCanvasStippling = document.getElementById("bestcand-canvas-stippling");
  const bestCandCanvasVoronoi = document.getElementById("bestcand-canvas-voronoi");
  const bestCandCanvasMap = document.getElementById("bestcand-canvas-map");
  const randomCanvasStippling = document.getElementById("random-canvas-stippling");
  const randomCanvasVoronoi = document.getElementById("random-canvas-voronoi");
  const uniformCanvasStippling = document.getElementById("uniform-canvas-stippling");
  const uniformCanvasVoronoi = document.getElementById("uniform-canvas-voronoi");
  const imgContext = imageCanv.getContext('2d');
  const radius = 3;
  const height = 400;
  const width = 400;

  function drawPoint(point, context) {
    const pixelData = imgContext.getImageData(point[0], point[1], 1, 1).data.slice(0, 3);
    const grayScaleVal = pixelData.reduce((memo, val) => memo + val, 0) / 3;
    const dotRadius = (((255 - grayScaleVal) / 255)) * (radius / 2);
    context.beginPath();
    context.arc(point[0], point[1], dotRadius, 0, 2*Math.PI);
    context.fill();
  }

  function getRgb(point) {
    const rgbVals = Array.from(imgContext.getImageData(...point, 1, 1).data.slice(0, 3));
    return `rgb(${rgbVals.join(', ')})`;
  }

  function fillLine(context, pointA, pointB) {
    const gradient = context.createLinearGradient(pointA[0],
                                                  pointB[0],
                                                  pointA[1],
                                                  pointB[1]);

    gradient.addColorStop(0, getRgb(pointA));
    gradient.addColorStop(1, getRgb(pointB));
    context.strokeStyle = gradient;
    context.stroke();
  }

  function drawNextPolygon(vertices, allPolyLines, context) {
    const vertex = vertices[0];
    const polyLines = allPolyLines[0];
    // debugger;
    if (!(vertex && polyLines)) { return; }
    let rgb;
    let rgbSum;
    let currentPixelCoords;
    let j;
    // rgbSum = Array.from(imgContext.getImageData(vertex[0], vertex[1], 1, 1)
    //                               .data
    //                               .slice(0, 3));
    rgb = Array.from(imgContext.getImageData(vertex[0], vertex[1], 1, 1)
                                .data
                                .slice(0, 3));


    currentPixelCoords = [polyLines[0][0], polyLines[0][1]];
    context.beginPath();
    context.fillStyle = `rgb(${rgb.join(", ")})`;
    context.moveTo(...currentPixelCoords);

    // rgb = Array.from(imgContext.getImageData(...currentPixelCoords, 1, 1).data.slice(0, 3));
    // rgbSum[0] += rgb[0];
    // rgbSum[1] += rgb[1];
    // rgbSum[2] += rgb[2];

    for (j = 1; j < polyLines.length; j++) {
        currentPixelCoords = [polyLines[j][0], polyLines[j][1]];
        // rgb = Array.from(imgContext.getImageData(...currentPixelCoords, 1, 1).data.slice(0, 3));
        // rgbSum[0] += rgb[0];
        // rgbSum[1] += rgb[1];
        // rgbSum[2] += rgb[2];
        context.lineTo(...currentPixelCoords);
    }
    // rgb = rgbSum.map( (sum) => sum / (polyLines.length + 1));
    context.fillStyle = `rgb(${rgb.join(", ")})`;
    context.closePath();
    context.fill();

    setTimeout( () => drawNextPolygon(vertices.slice(1), allPolyLines.slice(1), context), 10);
  }

  function drawVoronoi(points, context) {
    const voronoi = d3.voronoi();
    voronoi.extent([[0, 0], [height, width]]);
    // const voronoiCtx = context.getContext('2d');
    const polyLines = voronoi.polygons(points);
    drawNextPolygon(points, polyLines, context);
  }

  imgContext.drawImage(img, 0, 0, height, width);

  const poissonCanvasStipplingCtx = poissonCanvasStippling.getContext('2d');
  const poissonCanvasMapCtx = poissonCanvasMap.getContext('2d');
  const poissonCanvasVoronoiCtx = poissonCanvasVoronoi.getContext('2d');
  const poissonCanvasDemoCtx = poissonCanvasDemo.getContext('2d');
  const poisson = new PoissonSample(height, width, 3, 30, 400);
  const poissonPoints = poisson.load();
  const bestCandidate = new BestCandidateSample(height, width, poissonPoints.length, 20);
  const bestCandidatePoints = bestCandidate.load();
  const random = new UniformRandomSample(height, width, poissonPoints.length);
  const randomPoints = random.load();
  const uniform = new UniformSample(height, width, 3 * (3/2));
  const uniformPoints = uniform.load();
  drawNextStipplingPoint(poissonPoints, poissonCanvasStipplingCtx);
  drawVoronoi(poissonPoints.map( point => point.coords), poissonCanvasVoronoiCtx);
  drawNextMapLine(poissonPoints, poissonCanvasMapCtx, 2);
  drawNextStep(poisson.steps, poissonCanvasDemoCtx);

  const bestCandCanvasStipplingCtx = bestCandCanvasStippling.getContext('2d');
  const bestCandCanvasVoronoiCtx = bestCandCanvasVoronoi.getContext('2d');
  const bestCandCanvasMapCtx = bestCandCanvasMap.getContext('2d');

  drawNextStipplingPoint(bestCandidatePoints, bestCandCanvasStipplingCtx);
  drawVoronoi(bestCandidatePoints.map(point => point.coords), bestCandCanvasVoronoiCtx);
  drawNextMapLine(bestCandidatePoints, bestCandCanvasMapCtx, 2);

  const uniformCanvasStipplingCtx = uniformCanvasStippling.getContext('2d');
  const uniformCanvasVoronoiCtx = uniformCanvasVoronoi.getContext('2d');
  drawNextStipplingPoint(uniformPoints, uniformCanvasStipplingCtx);
  drawVoronoi(uniformPoints.map( point => point.coords ), uniformCanvasVoronoiCtx);

  const randomCanvasStipplingCtx = randomCanvasStippling.getContext('2d');
  const randomCanvasVoronoiCtx = randomCanvasVoronoi.getContext('2d');
  drawNextStipplingPoint(randomPoints, randomCanvasStipplingCtx);
  drawVoronoi(randomPoints.map( point => point.coords), randomCanvasVoronoiCtx);


  function drawNextStipplingPoint(points, context) {
    if (points.length === 0) { return; }
    drawPoint(points[0].coords, context);
    setTimeout( () => drawNextStipplingPoint(points.slice(1), context), 10);
  }

  function drawNextMapLine(points, context, lineWidth) {
    if (points.length === 0) {
       return;
    } else if (points[0].refCoords) {
      const newPoint = points[0].coords;
      const prevPoint = points[0].refCoords;
      context.beginPath();
      context.moveTo(prevPoint[0], prevPoint[1]);
      context.lineTo(newPoint[0],newPoint[1]);
      context.lineWidth=lineWidth;
      fillLine(context, prevPoint, newPoint);
    }
    setTimeout( () => drawNextMapLine(points.slice(1), context, lineWidth), 10);
  }

  function drawStepResult(steps, context) {
    const step = steps[0];
    const refCoords = step.refCoords;
    const candidates = step.candidates;

    step.candidates.forEach (candidate => {
      context.beginPath();
      context.arc(candidate[0], candidate[1], 1, 0, 2*Math.PI);
      context.lineWidth = 0;
      context.fillStyle = "#ffffff";
      context.fill();
    });

    if (step.chosen) {
      context.beginPath();
      context.arc(refCoords[0], refCoords[1], 1, 0, 2*Math.PI);
      context.lineWidth = 0;
      context.fillStyle = "#2d00ff";
      context.fill();

      context.beginPath();
      context.arc(step.chosen[0], step.chosen[1], 1, 0, 2*Math.PI);
      context.lineWidth = 0;
      context.fillStyle = "#2d00ff";
      context.fill();
    } else {
      context.beginPath();
      context.arc(refCoords[0], refCoords[1], 1, 0, 2*Math.PI);
      context.lineWidth = 0;
      context.fillStyle = "#000000";
      context.fill();
    }

    setTimeout( () => drawNextStep(steps.slice(1), context), 1000);
  }

  function drawNextCandidate(steps, candidates, context) {
    if (candidates.length === 0) {
      drawNextStep(steps.slice(1), context);
      return;
    }

    const candidate = candidates[0];
    context.beginPath();
    context.arc(candidate[0], candidate[1], 4, 0, 2*Math.PI);
    context.lineWidth = 5;
    context.strokeStyle = "black";
    context.fillStyle = "#f3b414";
    context.fill();

    setTimeout( () => drawNextCandidate(steps, candidates.slice(1), context), 50);
  }

  function drawStepCandidates(steps, context) {
    const step = steps[0];
    // const refCoords = step.refCoords;
    const candidates = step.candidateCoords;
    const refCoords = step.refCoords;
    context.beginPath();
    context.arc(refCoords[0], refCoords[1], 4, 0, 2*Math.PI);
    context.lineWidth = 5;
    context.strokeStyle = "black";
    context.fillStyle = "#fb3c3c";
    context.fill();
    setTimeout( () => drawNextCandidate(steps, candidates, context), 50);

    // context.beginPath();
    // context.arc(refCoords[0], refCoords[1], 1, 0, 2*Math.PI);
    // context.lineWidth = 0;
    // context.fillStyle = "#009e42";
    // context.fill();

    // step.candidates.forEach (candidate => {
    //   context.beginPath();
    //   context.arc(candidate[0], candidate[1], 1, 0, 2*Math.PI);
    //   context.lineWidth = 0;
    //   context.fillStyle = "#009e42";
    //   context.fill();
    // });
    //
    // setTimeout( () => drawNextStep(steps.slice(1), context), 100);

    // setTimeout( () => drawStepResult(steps, context), 1000);
  }

  function drawNextStep(steps, context) {
    if (steps.length === 0) { return; }

    const step = steps[0];
    context.clearRect(0, 0, width, height);
    step.points.forEach( point => {
      context.beginPath();
      context.arc(point[0], point[1], 4, 0, 2*Math.PI);
      context.lineWidth = 5;
      context.strokeStyle = "black";
      context.fillStyle = "#827474";
      context.fill();
    });

    step.actives.forEach( point => {
      context.beginPath();
      context.arc(point[0], point[1], 4, 0, 2*Math.PI);
      context.lineWidth = 5;
      context.strokeStyle = "black";
      context.fillStyle = "#08da88";
      context.fill();
    });

    setTimeout( () => drawStepCandidates(steps, context), 500);
  }
}

// let poissonPoints = generatePoissonSample(imageCanv, poissonCanvas, poissonCanvasMap, 4, 30);
// const voronoi = d3.voronoi();
// voronoi.extent([[0, 0], [400, 400]]);
// const vCtx = vCanvas.getContext('2d');
// const polyLines = voronoi.polygons(poissonPoints);
// let i;
// let j;
// let currentDot;
// let currentPixelCoords;
// let rgb;
// let rgbSum;
// let lastRgb;
// let combinedRgbs;
// let prevPixel;
// let gradient;
// let rgbStr;
// // debugger;
// for (i = 0; i < polyLines.length; i++ ) {
//   currentDot = poissonPoints[i];
//   // rgb = imgContext.getImageData(currentDot[0], currentDot[1], 1, 1).data.slice(0, 3);
//   rgbSum = Array.from(imgContext.getImageData(currentDot[0], currentDot[1], 1, 1)
//                                 .data
//                                 .slice(0, 3));
//   // debugger;
//   // vCtx.fillStyle = `rgb(${rgb.join(', ')})`;
//   vCtx.beginPath();
//   vCtx.moveTo(polyLines[i][0][0], polyLines[i][0][1]);
//   currentPixelCoords = [polyLines[i][0][0], polyLines[i][0][1]];
//   rgb = Array.from(imgContext.getImageData(...currentPixelCoords, 1, 1).data.slice(0, 3));
//   rgbSum[0] += rgb[0];
//   rgbSum[1] += rgb[1];
//   rgbSum[2] += rgb[2];
//   prevPixel = currentPixelCoords;
//   lastRgb = `rgb(${rgb.join(', ')})`;
//   for (j = 1; j < polyLines[i].length; j++) {
//     currentPixelCoords = [polyLines[i][j][0], polyLines[i][j][1]];
//     rgb = Array.from(imgContext.getImageData(...currentPixelCoords, 1, 1).data.slice(0, 3));
//     rgbSum[0] += rgb[0];
//     rgbSum[1] += rgb[1];
//     rgbSum[2] += rgb[2];
//     vCtx.lineTo(...currentPixelCoords);
//
//     // combinedRgbs = lastRgb.map((val, idx) => (val + rgb[idx]) / 2);
//     // debugger
//
//     gradient = vCtx.createLinearGradient(prevPixel[0],
//                                          currentPixelCoords[0],
//                                          prevPixel[1],
//                                          currentPixelCoords[1]);
//     rgbStr = `rgb(${rgb.join(', ')})`;
//     gradient.addColorStop(0, lastRgb);
//     gradient.addColorStop(1, rgbStr);
//     vCtx.strokeStyle = gradient;
//     vCtx.stroke();
//     lastRgb = rgbStr;
//     prevPixel = currentPixelCoords;
//   }
//   // debugger
//   rgb = rgbSum.map( (sum) => sum / (polyLines[i].length + 1));
//   vCtx.fillStyle = `rgb(${rgb.join(", ")})`;
//   vCtx.closePath();
//   vCtx.fill();
// }
// debugger;
// d3.select("#poisson-voronoi")
//   .selectAll("path")
//   .data(voronoi(poissonPoints).polygons())
//   .enter()
//   .append("path")
//   .style("fill", "#f50");
// generateRandomSample(imageCanv, randomCanv, poissonPoints.length, 4);
// generateUniformSample(imageCanv, uniformCanv, 6);

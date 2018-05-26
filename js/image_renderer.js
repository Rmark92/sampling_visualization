import PoissonSample from './poisson_disc_generator';
import generateRandomSample from './random_disc_generator';
import generateUniformSample from './uniform_disc_generator';
import * as d3 from "d3";

export default function renderImages(img) {
  const imageCanv = document.getElementById('image-canvas');
  const poissonCanvasStippling = document.getElementById("poisson-canvas");
  const poissonCanvasMap = document.getElementById("poisson-path-canvas");
  const randomCanv = document.getElementById("random-canvas");
  const uniformCanv = document.getElementById("uniform-canvas");
  const poissonVoronoi = document.getElementById("poisson-voronoi");
  const imgContext = imageCanv.getContext('2d');
  const radius = 3;

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
  //
  // function initVoronoi() {
  //   const voronoi = d3.voronoi();
  //   voronoi.extent([[0, 0], [poissonVoronoi.height, poissonVoronoi.width]]);
  //   const voronoiCtx = poissonVoronoi.getContext('2d');
  //   const voronoiPoints = [];
  //   let polyLines;
  //   return (newPoint) => {
  //     // debugger;
  //     voronoiPoints.push(newPoint);
  //     if (voronoiPoints.length % 100 === 0) {
  //         polyLines = voronoi.polygons(voronoiPoints);
  //         voronoiCtx.clearRect(0, 0, poissonVoronoi.width, poissonVoronoi.height);
  //         drawVoronoiPolygons(voronoiCtx, voronoiPoints, polyLines);
  //     }
  //   };
  // }

  function drawNextPolygon(vertices, allPolyLines, context) {
    const vertex = vertices[0];
    const polyLines = allPolyLines[0];
    // debugger;
    if (!(vertex && polyLines)) { return; }
    let rgb;
    let rgbSum;
    let currentPixelCoords;
    let j;
    rgbSum = Array.from(imgContext.getImageData(vertex[0], vertex[1], 1, 1)
                                  .data
                                  .slice(0, 3));

    currentPixelCoords = [polyLines[0][0], polyLines[0][1]];
    context.beginPath();
    context.moveTo(...currentPixelCoords);

    rgb = Array.from(imgContext.getImageData(...currentPixelCoords, 1, 1).data.slice(0, 3));
    rgbSum[0] += rgb[0];
    rgbSum[1] += rgb[1];
    rgbSum[2] += rgb[2];

    for (j = 1; j < polyLines.length; j++) {
        currentPixelCoords = [polyLines[j][0], polyLines[j][1]];
        rgb = Array.from(imgContext.getImageData(...currentPixelCoords, 1, 1).data.slice(0, 3));
        rgbSum[0] += rgb[0];
        rgbSum[1] += rgb[1];
        rgbSum[2] += rgb[2];
        context.lineTo(...currentPixelCoords);
    }
    rgb = rgbSum.map( (sum) => sum / (polyLines.length + 1));
    context.fillStyle = `rgb(${rgb.join(", ")})`;
    context.closePath();
    context.fill();

    setTimeout( () => drawNextPolygon(vertices.slice(1), allPolyLines.slice(1), context), 1);
  }

  function drawVoronoi(points) {
    const voronoi = d3.voronoi();
    voronoi.extent([[0, 0], [poissonVoronoi.height, poissonVoronoi.width]]);
    const voronoiCtx = poissonVoronoi.getContext('2d');
    const polyLines = voronoi.polygons(points);
    drawNextPolygon(points, polyLines, voronoiCtx);
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

    // debugger;
  }

  imgContext.drawImage(img, 0, 0, 400, 400);

  const poissonCanvasStipplingCtx = poissonCanvasStippling.getContext('2d');
  const poissonCanvasMapCtx = poissonCanvasMap.getContext('2d');
  const poisson = new PoissonSample(poissonCanvasStippling.height, poissonCanvasStippling.width, 4, 30);
  // const voronoiDrawer = initVoronoi(poissonVoronoi);
  const poissonPoints = poisson.load();
  debugger;

  function drawNextStipplingPoint(points) {
    if (points.length === 0) { return; }
    drawPoint(points[0].coords, poissonCanvasStipplingCtx);
    setTimeout( () => drawNextStipplingPoint(points.slice(1)), 1);
  }

  function drawNextMapLine(points) {
    if (points.length === 0) {
       return;
    } else if (points[0].refCoords) {
      const newPoint = points[0].coords;
      const prevPoint = points[0].refCoords;
      poissonCanvasMapCtx.beginPath();
      poissonCanvasMapCtx.moveTo(prevPoint[0], prevPoint[1]);
      poissonCanvasMapCtx.lineTo(newPoint[0],newPoint[1]);
      poissonCanvasMapCtx.lineWidth=2;
      fillLine(poissonCanvasMapCtx, prevPoint, newPoint);
    }
    setTimeout( () => drawNextMapLine(points.slice(1)), 1);
  }
  // let poissonPoints = poisson.load((newPoint, prevPoint) => {
  //   setTimeout(() => {
  //     drawPoint(newPoint, poissonCanvasStipplingCtx);
  //     // voronoiDrawer(newPoint);
  //     if (prevPoint) {
  //       poissonCanvasMapCtx.beginPath();
  //       poissonCanvasMapCtx.moveTo(prevPoint[0], prevPoint[1]);
  //       poissonCanvasMapCtx.lineTo(newPoint[0],newPoint[1]);
  //       poissonCanvasMapCtx.lineWidth=1;
  //       fillLine(poissonCanvasMapCtx, prevPoint, newPoint);
  //     }
  //   }, 100);
  // });
  drawNextStipplingPoint(poissonPoints);
  drawNextMapLine(poissonPoints);
  drawVoronoi(poissonPoints.map( point => point.coords));
  // generateRandomSample(imageCanv, randomCanv, poissonPoints.length, 4);
  // generateUniformSample(imageCanv, uniformCanv, 6);

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
}

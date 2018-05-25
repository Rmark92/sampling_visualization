import generatePoissonSample from './poisson_disc_generator';
import generateRandomSample from './random_disc_generator';
import generateUniformSample from './uniform_disc_generator';
import * as d3 from "d3";

document.addEventListener("DOMContentLoaded", () => {
  // const img = document.getElementById('original-image');
  // var imageCanv = document.getElementById('image-canvas');
  // imageCanv.width = img.width;
  // imageCanv.height = img.height;
  // const imgContext = imageCanv.getContext('2d');
  const img = new Image();
  img.src = 'images/the_zuck.jpg';
  // img.crossOrigin = 'anonymous';
  const imageCanv = document.getElementById('image-canvas');
  const poissonCanvas = document.getElementById("poisson-canvas");
  const poissonCanvasMap = document.getElementById("poisson-path-canvas");
  const randomCanv = document.getElementById("random-canvas");
  const uniformCanv = document.getElementById("uniform-canvas");
  const vCanvas = document.getElementById("poisson-voronoi");
  const imgContext = imageCanv.getContext('2d');
  img.onload = () => {
    // imgContext.drawImage(img, 0, 0, 400, 400);
    // renderImages(img);
    let poissonPoints = generatePoissonSample(imageCanv, poissonCanvas, poissonCanvasMap, 4, 30);
    const voronoi = d3.voronoi();
    voronoi.extent([[0, 0], [400, 400]]);
    const vCtx = vCanvas.getContext('2d');
    const polyLines = voronoi.polygons(poissonPoints);
    let i;
    let j;
    let currentDot;
    let currentPixelCoords;
    let rgb;
    let rgbSum;
    let lastRgb;
    let combinedRgbs;
    let prevPixel;
    let gradient;
    let rgbStr;
    // debugger;
    for (i = 0; i < polyLines.length; i++ ) {
      currentDot = poissonPoints[i];
      // rgb = imgContext.getImageData(currentDot[0], currentDot[1], 1, 1).data.slice(0, 3);
      rgbSum = Array.from(imgContext.getImageData(currentDot[0], currentDot[1], 1, 1)
                                    .data
                                    .slice(0, 3));
      // debugger;
      // vCtx.fillStyle = `rgb(${rgb.join(', ')})`;
      vCtx.beginPath();
      vCtx.moveTo(polyLines[i][0][0], polyLines[i][0][1]);
      currentPixelCoords = [polyLines[i][0][0], polyLines[i][0][1]];
      rgb = Array.from(imgContext.getImageData(...currentPixelCoords, 1, 1).data.slice(0, 3));
      rgbSum[0] += rgb[0];
      rgbSum[1] += rgb[1];
      rgbSum[2] += rgb[2];
      prevPixel = currentPixelCoords;
      lastRgb = `rgb(${rgb.join(', ')})`;
      for (j = 1; j < polyLines[i].length; j++) {
        currentPixelCoords = [polyLines[i][j][0], polyLines[i][j][1]];
        rgb = Array.from(imgContext.getImageData(...currentPixelCoords, 1, 1).data.slice(0, 3));
        rgbSum[0] += rgb[0];
        rgbSum[1] += rgb[1];
        rgbSum[2] += rgb[2];
        vCtx.lineTo(...currentPixelCoords);

        // combinedRgbs = lastRgb.map((val, idx) => (val + rgb[idx]) / 2);
        // debugger

        gradient = vCtx.createLinearGradient(prevPixel[0],
                                             currentPixelCoords[0],
                                             prevPixel[1],
                                             currentPixelCoords[1]);
        rgbStr = `rgb(${rgb.join(', ')})`;
        gradient.addColorStop(0, lastRgb);
        gradient.addColorStop(1, rgbStr);
        vCtx.strokeStyle = gradient;
        vCtx.stroke();
        lastRgb = rgbStr;
        prevPixel = currentPixelCoords;
      }
      // debugger
      rgb = rgbSum.map( (sum) => sum / (polyLines[i].length + 1));
      vCtx.fillStyle = `rgb(${rgb.join(", ")})`;
      vCtx.closePath();
      vCtx.fill();
    }
    // debugger;
    // d3.select("#poisson-voronoi")
    //   .selectAll("path")
    //   .data(voronoi(poissonPoints).polygons())
    //   .enter()
    //   .append("path")
    //   .style("fill", "#f50");
    generateRandomSample(imageCanv, randomCanv, poissonPoints.length, 4);
    generateUniformSample(imageCanv, uniformCanv, 6);
  };
});

import * as d3 from "d3";
import StipplingCanvasContainer from './stippling_canvas_container';
import VoronoiCanvasContainer from './voronoi_canvas_container';
import MapCanvasContainer from './map_canvas_container';

export default class ImageRenderer {
  constructor(originalImage, height, width, maxDotRadius) {
    this.imgContext = document.getElementById('image-canvas').getContext('2d');
    this.height = height;
    this.width = width;
    this.maxDotRadius = maxDotRadius;
    this.renderedImageCanvases = document.getElementById('sampled-canvases');
    // debugger;
  }
  //
  // renderCanvasContainers(...canvasContainers) {
  //   canvasContainers.forEach((container) => {
  //     this.renderedImageCanvases.appendChild(container.htmlContent);
  //   });
  // }

  clearCanvases() {
    this.clearChildren(this.renderedImageCanvases);
  }

  render(points, mapType) {
    this.clearCanvases();
    // this.renderedImageCanvases.setAttribute("style", "display:flex");
    const stipplingCanvasContainer = new StipplingCanvasContainer(this.height, this.width, this.maxDotRadius);
    this.renderedImageCanvases.appendChild(stipplingCanvasContainer.htmlContainer);
    stipplingCanvasContainer.renderSample(this.imgContext, points, this.maxDotRadius);
    const voronoiCanvasContainer = new VoronoiCanvasContainer(this.height, this.width);
    this.renderedImageCanvases.appendChild(voronoiCanvasContainer.htmlContainer);
    voronoiCanvasContainer.renderSample(this.imgContext, points);
    if (mapType) {
      const mapCanvasContainer = new MapCanvasContainer(this.height, this.width, mapType);
      this.renderedImageCanvases.appendChild(mapCanvasContainer.htmlContainer);
      mapCanvasContainer.renderSample(this.imgContext, points);
    }


    // this.renderCanvasContainers(stipplingCanvasContainer, voronoiCanvasContainer);
    // this.stipplingCanvasContainer = document.createElement('div');
    // this.voronoiCanvasContainer = document.createElement('div');
    // this.renderCanvases(this.stipplingCanvas, this.voronoiCanvas);
    // this.drawNextStipplingPoint(points, this.stipplingCanvas.getContext('2d'));
    // this.drawVoronoi(points, this.voronoiCanvas.getContext('2d'));
    // if (withMap) {
    //   this.mapCanvas = document.createElement('canvas');
    //   this.renderCanvases(this.mapCanvas);
    //   this.drawNextMapLine(points, this.mapCanvas.getContext('2d'));
    // }
  }

  // drawPoint(point, context) {
  //   const pixelData = this.imgContext.getImageData(point[0], point[1], 1, 1).data.slice(0, 3);
  //   const grayScaleVal = pixelData.reduce((memo, val) => memo + val, 0) / 3;
  //   const dotRadius = (((255 - grayScaleVal) / 255)) * (this.maxDotRadius / 2);
  //   context.beginPath();
  //   context.arc(point[0], point[1], dotRadius, 0, 2*Math.PI);
  //   context.fill();
  // }
  //
  // getRgb(point) {
  //   const rgbVals = Array.from(this.imgContext.getImageData(...point, 1, 1).data.slice(0, 3));
  //   return `rgb(${rgbVals.join(', ')})`;
  // }
  //
  // fillLine(context, pointA, pointB) {
  //   const gradient = context.createLinearGradient(pointA[0],
  //                                                 pointB[0],
  //                                                 pointA[1],
  //                                                 pointB[1]);
  //
  //   gradient.addColorStop(0, this.getRgb(pointA));
  //   gradient.addColorStop(1, this.getRgb(pointB));
  //   context.strokeStyle = gradient;
  //   context.stroke();
  // }

  clearChildren(...elements) {
    elements.forEach( (element) => {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    });
  }

  // drawNextStipplingPoint(points, context) {
  //   if (points.length === 0) { return; }
  //   this.drawPoint(points[0].coords, context);
  //   setTimeout( () => this.drawNextStipplingPoint(points.slice(1), context), 1);
  // }
  //
  // drawNextMapLine(points, context) {
  //   if (points.length === 0) {
  //      return;
  //   } else if (points[0].refCoords) {
  //     const newPoint = points[0].coords;
  //     const prevPoint = points[0].refCoords;
  //     context.beginPath();
  //     context.moveTo(prevPoint[0], prevPoint[1]);
  //     context.lineTo(newPoint[0],newPoint[1]);
  //     context.lineWidth = 2;
  //     this.fillLine(context, prevPoint, newPoint);
  //   }
  //   setTimeout( () => this.drawNextMapLine(points.slice(1), context), 1);
  // }
  //
  // drawNextPolygon(vertices, allPolyLines, context) {
  //   const vertex = vertices[0];
  //   const polyLines = allPolyLines[0];
  //   if (!(vertex && polyLines)) { return; }
  //   let rgb;
  //   let rgbSum;
  //   let currentPixelCoords;
  //   let j;
  //   // rgbSum = Array.from(imgContext.getImageData(vertex[0], vertex[1], 1, 1)
  //   //                               .data
  //   //                               .slice(0, 3));
  //   rgb = Array.from(this.imgContext.getImageData(vertex[0], vertex[1], 1, 1)
  //                               .data
  //                               .slice(0, 3));
  //
  //
  //
  //   currentPixelCoords = [polyLines[0][0], polyLines[0][1]];
  //   context.beginPath();
  //   // context.fillStyle = `rgb(${rgb.join(", ")})`;
  //   context.moveTo(...currentPixelCoords);
  //
  //   // rgb = Array.from(imgContext.getImageData(...currentPixelCoords, 1, 1).data.slice(0, 3));
  //   // rgbSum[0] += rgb[0];
  //   // rgbSum[1] += rgb[1];
  //   // rgbSum[2] += rgb[2];
  //
  //   for (j = 1; j < polyLines.length; j++) {
  //       currentPixelCoords = [polyLines[j][0], polyLines[j][1]];
  //       // rgb = Array.from(imgContext.getImageData(...currentPixelCoords, 1, 1).data.slice(0, 3));
  //       // rgbSum[0] += rgb[0];
  //       // rgbSum[1] += rgb[1];
  //       // rgbSum[2] += rgb[2];
  //       context.lineTo(...currentPixelCoords);
  //   }
  //   // rgb = rgbSum.map( (sum) => sum / (polyLines.length + 1));
  //   // debugger;
  //   context.fillStyle = `rgb(${rgb.join(", ")})`;
  //   context.closePath();
  //   context.fill();
  //
  //   setTimeout( () => this.drawNextPolygon(vertices.slice(1), allPolyLines.slice(1), context), 1);
  // }
  //
  // drawVoronoi(points, context) {
  //   const voronoi = d3.voronoi();
  //   voronoi.extent([[0, 0], [this.height, this.width]]);
  //   // const voronoiCtx = context.getContext('2d');
  //   const vertices = points.map( point => point.coords );
  //   const polyLines = voronoi.polygons(vertices);
  //   this.drawNextPolygon(vertices, polyLines, context);
  // }


}

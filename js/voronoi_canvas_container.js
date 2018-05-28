import * as d3 from "d3";

export default class VoronoiCanvasContainer {
  constructor(height, width) {
    this.htmlContainer = document.createElement("div");
    this.htmlContainer.height = height + 50;
    this.htmlContainer.width = width + 50;
    this.title = document.createElement("h3");
    this.title.innerHTML = "Voronoi Mosaic";
    this.htmlContainer.appendChild(this.title);
    this.canvas = document.createElement("canvas");
    this.canvas.height = height;
    this.canvas.width = width;
    this.context = this.canvas.getContext('2d');
    this.htmlContainer.appendChild(this.canvas);
    this.description = document.createElement("p");
    this.description.innerHTML = "Each point from the sample generates its" +
                                 " own Voronoi cell, where partitions of cells" +
                                 " are based on the distance between neighboring points";
    this.htmlContainer.appendChild(this.description);
  }

  renderSample(imgContext, points) {
    this.imgContext = imgContext;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const voronoi = d3.voronoi();
    voronoi.extent([[0, 0], [this.canvas.height, this.canvas.width]]);
    const vertices = points.map( point => point.coords );
    const polyLines = voronoi.polygons(vertices);
    this.drawNextPolygon(vertices, polyLines);
  }

  drawNextPolygon(vertices, allPolyLines) {
    const vertex = vertices[0];
    const polyLines = allPolyLines[0];
    if (!(vertex && polyLines)) { return; }
    let rgb;
    let rgbSum;
    let currentPixelCoords;
    let j;
    rgb = Array.from(this.imgContext.getImageData(vertex[0], vertex[1], 1, 1)
                                .data
                                .slice(0, 3));



    currentPixelCoords = [polyLines[0][0], polyLines[0][1]];
    this.context.beginPath();
    this.context.moveTo(...currentPixelCoords);

    for (j = 1; j < polyLines.length; j++) {
        currentPixelCoords = [polyLines[j][0], polyLines[j][1]];
        this.context.lineTo(...currentPixelCoords);
    }
    this.context.fillStyle = `rgb(${rgb.join(", ")})`;
    this.context.closePath();
    this.context.fill();

    setTimeout( () => this.drawNextPolygon(vertices.slice(1), allPolyLines.slice(1)), 1);
  }
}

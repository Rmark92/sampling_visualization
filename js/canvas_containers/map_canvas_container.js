export default class MapCanvasContainer {
  constructor(height, width, mapType) {
    this.htmlContainer = document.createElement("div");
    this.title = document.createElement("h3");
    this.title.innerHTML = "Generation Map";
    this.htmlContainer.appendChild(this.title);
    this.canvas = document.createElement("canvas");
    this.canvas.height = height;
    this.canvas.width = width;
    this.context = this.canvas.getContext('2d');
    this.htmlContainer.appendChild(this.canvas);
    this.description = document.createElement("p");
    this.description.innerHTML = this.generateDescription(mapType);
    this.htmlContainer.appendChild(this.description);
  }

  generateDescription(mapType) {
    switch(mapType) {
      case 'poisson':
        return (
          "This image represents a tree" +
          " where each node's parent is the active point" +
          " from which it was created (see the demo for further explanation)"
        );
      case 'best-candidate':
        return (
          "This image represents a graph" +
          " where each edge connects a selected candidate" +
          " with its nearest neighbor at the time it was chosen" +
          " (see the demo for further explanation)"
        );
    }
  }

  getRgb(point) {
    const rgbVals = Array.from(this.imgContext.getImageData(...point, 1, 1).data.slice(0, 3));
    return `rgb(${rgbVals.join(', ')})`;
  }

  fillLine(pointA, pointB) {
    const gradient = this.context.createLinearGradient(pointA[0],
                                                       pointB[0],
                                                       pointA[1],
                                                       pointB[1]);

    gradient.addColorStop(0, this.getRgb(pointA));
    gradient.addColorStop(1, this.getRgb(pointB));
    this.context.strokeStyle = gradient;
    this.context.stroke();
  }

  drawNextMapLine(points) {
    if (points.length === 0) {
       return;
    } else if (points[0].refCoords) {
      const newPoint = points[0].coords;
      const prevPoint = points[0].refCoords;
      this.context.beginPath();
      this.context.moveTo(prevPoint[0], prevPoint[1]);
      this.context.lineTo(newPoint[0],newPoint[1]);
      this.context.lineWidth = 2;
      this.fillLine(prevPoint, newPoint);
    }
    setTimeout( () => this.drawNextMapLine(points.slice(1)), 1);
  }

  renderSample(imgContext, points) {
    this.imgContext = imgContext;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawNextMapLine(points);
  }
}

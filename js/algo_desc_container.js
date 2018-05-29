export default class AlgoDescContainer {
  constructor(title, description, demoSample) {
    this.title = title;
    this.description = description;
    this.demoSample = demoSample;
  }

  render() {
    const descContainer = document.getElementById("desc-container");
    while (descContainer.firstChild) {
      descContainer.removeChild(descContainer.firstChild);
    }
    const htmlTitle = document.createElement("h3");
    htmlTitle.innerHTML = this.title;
    descContainer.appendChild(htmlTitle);
    const htmlDesc = document.createElement("p");
    htmlDesc.innerHTML = this.description;
    descContainer.appendChild(htmlDesc);
    if (this.demoSample) {
      const demoCanvas = document.createElement("canvas");
      demoCanvas.height = this.demoSample.canvasHeight;
      demoCanvas.width = this.demoSample.canvasWidth;
      descContainer.appendChild(demoCanvas);
      this.demoSample.demo(demoCanvas);
    }
  }
}

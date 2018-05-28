import renderImages from './image_renderer';
import PoissonSample from './poisson_disc_generator';
import BestCandidateSample from './best_candidate_disc_generator';
import UniformRandomSample from './random_disc_generator';
import UniformSample from './uniform_disc_generator';
import ImageRenderer from './image_renderer2';

document.addEventListener("DOMContentLoaded", () => {
  const img = new Image();
  img.src = 'images/afremov.jpg';
  img.onload = () => {
    // renderImages(img);
    const imgCanvas = document.getElementById("image-canvas");
    const imgContext = imgCanvas.getContext('2d');
    const height = imgCanvas.height;
    const width = imgCanvas.width;
    imgContext.drawImage(img, 0, 0, height, width);

    const poisson = new PoissonSample(height, width, 3, 20);
    let poissonPoints = poisson.load();
    const bestCandidate = new BestCandidateSample(height, width, poissonPoints.length, 10);
    const randomSample = new UniformRandomSample(height, width, poissonPoints.length);
    const uniform = new UniformSample(height, width, 5);
    const imageRenderer = new ImageRenderer(imgCanvas, height, width, 4);

    let distType;
    const distSelectOptions = document.getElementById("distribution-selection-options");
    // const distSelectList = document.getElementById("dist-type-options");
    Array.from(distSelectOptions.children).forEach(child => {
      child.addEventListener("click", (event) => {
        event.preventDefault();
        renderSampledImages(event.target.value);
        // debugger;
      });
      // distType = distSelectList.options[distSelectList.selectedIndex].value;
      // renderSampledImages(distType);
    });

    function renderSampledImages(type) {
      let points;
      switch(type) {
      case "poisson":
        points = poisson.load();
        imageRenderer.render(points, true);
        break;
        // return poissonPoints;
      case "best-candidate":
        points = bestCandidate.load();
        imageRenderer.render(points, true);
        break;
        // return bestCandidate.load();
      case "uniform-random":
        points = randomSample.load();
        imageRenderer.render(points);
        break;
        // uniformRandomSample.load();
      case "uniform":
        points = uniform.load();
        imageRenderer.render(points);
        break;
        // return uniform.load();
      }
    }
  };
});

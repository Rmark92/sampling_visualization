import PoissonSample from './disc_generators/poisson_disc_generator';
import BestCandidateSample from './disc_generators/best_candidate_disc_generator';
import UniformRandomSample from './disc_generators/random_disc_generator';
import UniformSample from './disc_generators/uniform_disc_generator';
import ImageRenderer from './canvas_containers/image_renderer';
import PoissonDescContainer from './description_containers/poisson_desc_container';
import BestCandDescContainer from './description_containers/best_cand_desc_container';
import UniformRandomDescContainer from './description_containers/uniform_rand_desc_container';
import UniformDescContainer from './description_containers/uniform_desc_container';

function getImageOptions() {
  return Array.from(document.getElementsByClassName('image-selection'));
}

document.addEventListener("DOMContentLoaded", () => {
  const img = new Image();
  img.src = 'images/afremov.jpg';

  getImageOptions().forEach( imgSelection => {
    imgSelection.addEventListener('click', (event) => {
      img.src = event.target.src;
    });
  });

  const imageUploadInput = document.getElementById('image-file-input');
  const imageUploadImage = document.getElementById('user-image');
  let fileReader;
  let file;
  imageUploadInput.addEventListener('change', (event) => {
    file = event.target.files[0];
    fileReader = new FileReader();

    fileReader.onloadend = () => {
      imageUploadImage.src = fileReader.result;
    };

    if (file) {
      fileReader.readAsDataURL(file);
    }
  });

  img.onload = () => {
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
    Array.from(distSelectOptions.children).forEach(child => {
      child.addEventListener("click", (event) => {
        event.preventDefault();
        renderSampledImages(event.target.value);
      });
    });

    function renderSampledImages(type) {
      let points;
      switch(type) {
      case "poisson":
        points = poisson.load();
        imageRenderer.render(points, 'poisson');
        (new PoissonDescContainer).render();
        break;
      case "best-candidate":
        points = bestCandidate.load();
        imageRenderer.render(points, 'best-candidate');
        (new BestCandDescContainer).render();
        break;
      case "uniform-random":
        points = randomSample.load();
        imageRenderer.render(points);
        (new UniformRandomDescContainer).render();
        break;
      case "uniform":
        points = uniform.load();
        imageRenderer.render(points);
        (new UniformDescContainer).render();
        break;
      }
    }
  };
});

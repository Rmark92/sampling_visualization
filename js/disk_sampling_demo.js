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
  const imgCanvas = document.getElementById("image-canvas");
  const imgContext = imgCanvas.getContext('2d');
  const imgHeight = imgCanvas.height;
  const imgWidth = imgCanvas.width;

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

  const distSelectOptions = document.getElementById("distribution-selection-options").children;
  let selectedDistType = 'poisson';

  // since a different number of poisson points is generated each time,
  // we'll need a reference to this number so we can ensure the other algorithms
  // generate the same number of points for accurate comparison
  let poisson;
  let poissonPoints;
  const resetPoisson = () => {
    poisson = new PoissonSample(imgHeight, imgWidth, 3, 20);
    poissonPoints = poisson.load();
  };

  Array.from(distSelectOptions).forEach(optionBtn => {
    optionBtn.addEventListener('click', (event) => {
      event.preventDefault();
      setSelectedDist(event.target.value);
    });
  });

  const setSelectedDist = (type) => {
    Array.from(distSelectOptions).forEach(optionBtn => {
      if (optionBtn.value !== type) {
        optionBtn.classList.remove("selected-dist");
      } else {
        optionBtn.classList.add("selected-dist");
      }
    });

    if (type === 'poisson') resetPoisson();
    selectedDistType = type;
    renderSampledImages(type);
  };

  function renderSampledImages(type) {
    const imageRenderer = new ImageRenderer(imgCanvas, imgHeight, imgWidth, 4);
    let points;
    switch(type) {
      case "poisson":
        imageRenderer.render(poissonPoints, 'poisson');
        (new PoissonDescContainer).render();
        break;
      case "best-candidate":
        const bestCandidate = new BestCandidateSample(imgHeight, imgWidth, poissonPoints.length, 10);
        points = bestCandidate.load();
        imageRenderer.render(points, 'best-candidate');
        (new BestCandDescContainer).render();
        break;
      case "uniform-random":
        const randomSample = new UniformRandomSample(imgHeight, imgWidth, poissonPoints.length);
        points = randomSample.load();
        imageRenderer.render(points);
        (new UniformRandomDescContainer).render();
        break;
      case "uniform":
        const uniform = new UniformSample(imgHeight, imgWidth, 5);
        points = uniform.load();
        imageRenderer.render(points);
        (new UniformDescContainer).render();
        break;
    }
  }

  img.onload = () => {
    imgContext.drawImage(img, 0, 0, imgHeight, imgWidth);
    resetPoisson();
    renderSampledImages(selectedDistType);
  };
});

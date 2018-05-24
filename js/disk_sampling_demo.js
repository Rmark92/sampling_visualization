import generatePoissonSample from './poisson_disc_generator';

document.addEventListener("DOMContentLoaded", () => {
  // const img = document.getElementById('original-image');
  // var imageCanv = document.getElementById('image-canvas');
  // imageCanv.width = img.width;
  // imageCanv.height = img.height;
  // const imgContext = imageCanv.getContext('2d');
  const img = new Image();
  img.src = 'starry_night.jpg';
  // img.crossOrigin = 'anonymous';
  var imageCanv = document.getElementById('image-canvas');
  const imgContext = imageCanv.getContext('2d');
  img.onload = () => {
    imgContext.drawImage(img, 0, 0, 400, 400);
  };
  // document.append(canvas);
  // context.getImageData(x, y, 1, 1).data;
  const poissonCanvas = document.getElementById("poisson-canvas");
  const poissonCanvasMap = document.getElementById("poisson-path-canvas");

  generatePoissonSample(imageCanv, poissonCanvas, poissonCanvasMap, 2, 30);
});

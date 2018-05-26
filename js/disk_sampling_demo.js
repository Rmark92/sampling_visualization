import renderImages from './image_renderer';

document.addEventListener("DOMContentLoaded", () => {
  const img = new Image();
  img.src = 'starry_night.jpg';
  img.onload = () => {
    renderImages(img);
  };
});

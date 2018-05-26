import renderImages from './image_renderer';

document.addEventListener("DOMContentLoaded", () => {
  const img = new Image();
  img.src = 'images/the_zuck.jpg';
  img.onload = () => {
    renderImages(img);
  };
});

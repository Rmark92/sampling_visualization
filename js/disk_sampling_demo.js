import renderImages from './image_renderer';

document.addEventListener("DOMContentLoaded", () => {
  const img = new Image();
  img.src = 'images/AyyyLmao.jpg';
  img.onload = () => {
    renderImages(img);
  };
});

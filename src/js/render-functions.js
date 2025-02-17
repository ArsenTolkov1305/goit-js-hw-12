import iziToast from 'izitoast';
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  showCounter: true,
  enableKeyboard: true,
  overlayOpacity: 0.9,
  nav: true,
  close: true,
  animationSpeed: 250
});


export const clearGallery = () => {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
};



export const createImageCard = (image) => {
  const card = document.createElement('div');
  card.classList.add('gallery-item');


  const link = document.createElement('a');
  link.href = image.largeImageURL;
  link.classList.add('gallery-link');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;

  const info = document.createElement('div');
  info.classList.add('image-info');
  info.innerHTML = `
    <p><strong>Likes:</strong> ${image.likes}</p>
    <p><strong>Views:</strong> ${image.views}</p>
    <p><strong>Comments:</strong> ${image.comments}</p>
    <p><strong>Downloads:</strong> ${image.downloads}</p>
  `;

  link.appendChild(img);
  card.appendChild(link);
  card.appendChild(info);
  return card;
};



export const showEndOfResultsMessage = () => {
  iziToast.info({
    title: 'End of search Results',
    message: 'We are sorry, but you are reached the end of search results',
  });
};

export function showNoResultsMessage() {
  alert("We haven't got any images!");
}


export const loader = document.querySelector('.loader');



export function showLoader(loader) {
  loader.classList.add('visible');
  loader.classList.remove('hidden');
}

export function hideLoader(loader) {
  loader.classList.remove('visible');
  loader.classList.add('hidden');
}




export const refreshGallery = () => {
  lightbox.refresh();
};
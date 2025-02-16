import { fetchImages } from '/js/pixabay-api.js';
import { clearGallery, createImageCard, showNoResultsMessage, loader, showLoader, hideLoader } from '/js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const gallery = document.querySelector('.gallery');

// fixing loader after page refresh
    hideLoader(loader);
// fixing loader


// testing area
const lightbox = new SimpleLightbox('.lightbox');
// testing area
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = input.value.trim();

  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term!',
    });
    return;
  }

  clearGallery();
  showLoader(loader);

  try {
    const images = await fetchImages(query);
    hideLoader(loader);
    
    if (images.length === 0) {
      showNoResultsMessage();
    } else {
      images.forEach(image => {
        const imageCard = createImageCard(image);
        gallery.appendChild(imageCard);
      });
      
      lightbox.refresh();
    }
  } catch (error) {
    hideLoader(loader);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
    });
  }
});


// paginatiom

let currentPage = 1;
let currentQuery = '';
const perPage = 40;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = input.value.trim();

  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term!',
    });
    return;
  }

  currentPage = 1;
  currentQuery = query;
  clearGallery();
  showLoader(loader);

  try {
    const { hits: images, totalHits } = await fetchImages(query, currentPage, perPage);
    hideLoader(loader);
    
    if (images.length === 0) {
      showNoResultsMessage();
    } else {
      images.forEach(image => {
        const imageCard = createImageCard(image);
        gallery.appendChild(imageCard);
      });
      
      lightbox.refresh();

      
      if (totalHits > currentPage * perPage) {
        showLoadMoreButton();
      }
    }
  } catch (error) {
    hideLoader(loader);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
    });
  }
});


const loadMoreBtn = document.querySelector('.load-more');

const showLoadMoreButton = () => {
  loadMoreBtn.classList.remove('hidden');
};

const hideLoadMoreButton = () => {
  loadMoreBtn.classList.add('hidden');
};

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  showLoader(loader);

  try {
    const { hits: images, totalHits } = await fetchImages(currentQuery, currentPage, perPage);
    hideLoader(loader);

    images.forEach(image => {
      const imageCard = createImageCard(image);
      gallery.appendChild(imageCard);
    });

    lightbox.refresh();

    if (currentPage * perPage >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results."
      });
      // alert("We're sorry, but you've reached the end of search results.");
    }

     
    const { height: cardHeight } = gallery
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  } catch (error) {
    hideLoader(loader);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
    });
  }
});
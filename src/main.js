import { fetchImages } from './js/pixabay-api.js';
import {
  clearGallery,
  createImageCard,
  showNoResultsMessage,
  showEndOfResultsMessage,
  loader,
  showLoader,
  hideLoader
} from './js/render-functions.js';
import { refreshGallery } from './js/render-functions.js';

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

document.addEventListener('DOMContentLoaded', () => {
  hideLoader(loader);
  loadMoreBtn.classList.add('hidden');
});


function isLastPage(totalHits, currentPage, perPage) {
  return currentPage * perPage >= totalHits;
}

function handleLoadMore() {
  currentPage += 1;
  fetchAndRenderImages(currentQuery, currentPage);
}

async function fetchAndRenderImages(query, page) {
  showLoader(loader);
  loadMoreBtn.classList.add('hidden');

  try {
    const { hits, totalHits: total } = await fetchImages(query, page);
    totalHits = total;

    if (hits.length === 0) {
      showEndOfResultsMessage();
      return;
    }

    const cards = hits.map(createImageCard);
    gallery.append(...cards);
    refreshGallery();

    if (page > 1) {
      const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      });
    }

    if (isLastPage(totalHits, page, 40)) {
      showEndOfResultsMessage();
    } else {
      loadMoreBtn.classList.remove('hidden');
    }

  } catch (error) {
    console.error(error);
    showNoResultsMessage();
  } finally {
    hideLoader(loader);
  }
}

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = document.getElementById('search-input').value.trim();
  if (!query) return;

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  await fetchAndRenderImages(query, currentPage);
});

loadMoreBtn.addEventListener('click', handleLoadMore);
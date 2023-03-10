import debounce from 'lodash.debounce';
import { fetchData } from './fetchData';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formEl = document.getElementById("search-form");
const galeryEl = document.querySelector(".gallery");
const loadBtnEl = document.querySelector(".more");
let currentFetchPage = 1;
let input = "";

formEl.addEventListener("input", debounce((handleInput), 100));
function handleInput(event) {
  input = event.target.value.trim(" ");

}
formEl.addEventListener("submit", (ev) => {
  handleSubmit(ev);

});
loadBtnEl.addEventListener("click", handleBtn);
function handleBtn() {
  let dataArr = [];
  fetchData(input, currentFetchPage)
    .then((data) => {
      dataArr = data.data.hits;
      drawing(dataArr)
      currentFetchPage++;
    })
    .catch((er) => {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    });

}
function handleSubmit(ev) {
  ev.preventDefault();
  currentFetchPage = 1;
  galeryEl.innerHTML = "";
  let dataArr = [];
  fetchData(input, currentFetchPage)
    .then((data) => {
      let totalHits = data.data.totalHits;
      if (totalHits === 0) {
        return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
      }
      else if (totalHits === document.querySelectorAll(".photo-card").length + 1) {
        return Notiflix.Notify.info("Hooray! We found totalHits images.")
      }
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
      dataArr = data.data.hits;
      drawing(dataArr)
      loadBtnEl.classList.remove("disabled");
      currentFetchPage++;

    }

    )
    .catch((er) => {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }

    )
    .finally(ev.currentTarget.reset());

}

function markupGallery(arr) {
  return arr.map(item => `<div class="photo-card">
    <a class="gallery__item" href="${item.largeImageURL}">
    <img class="gallery__image" src="${item.webformatURL}" alt="${item.tags}"  />
</a>
  <div class="info">
    <p class="info-item">Likes:
      <b>${item.likes}</b>
    </p>
    <p class="info-item">Views:
      <b>${item.views}</b>
    </p>
    <p class="info-item">Comments:
      <b>${item.comments}</b>
    </p>
    <p class="info-item">Downloads:
      <b>${item.downloads}</b>
    </p>
  </div>
</div>`).join("");
}
function drawing(params) {
  galeryEl.insertAdjacentHTML("beforeend", markupGallery(params));
  let gallery = new SimpleLightbox('.gallery a', { captionDelay: 250 });
  gallery.refresh();
}

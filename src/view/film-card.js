import AbstractView from './abstract.js';

const createFilmCardTemplate = (film) => {
  const filmYear = film.filmInfo.release.date.split(' ').splice(-1);

  return `<article class="film-card" id = "${film.id}">
    <h3 class="film-card__title">${film.filmInfo.title}</h3>
    <p class="film-card__rating">${film.filmInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${filmYear}</span>
      <span class="film-card__duration">${film.filmInfo.runtime}</span>
      <span class="film-card__genre">${film.filmInfo.genre[0]}</span>
    </p>
    <img src="./images/posters/${film.filmInfo.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${film.filmInfo.description}</p>
    <a class="film-card__comments">${film.comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._clickHandler);
  }
}

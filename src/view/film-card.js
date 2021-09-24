import AbstractView from './abstract.js';
import {humanizeDateCard, humanizeRuntime} from '../utils/film.js';

const createFilmCardTemplate = (film) => {
  const filmYear = humanizeDateCard(film.filmInfo.release.date);
  const filmRuntime = humanizeRuntime(film.filmInfo.runtime);

  return `<article class="film-card" id="${film.id}">
    <h3 class="film-card__title">${film.filmInfo.title}</h3>
    <p class="film-card__rating">${film.filmInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${filmYear}</span>
      <span class="film-card__duration">${filmRuntime}</span>
      <span class="film-card__genre">${film.filmInfo.genre[0]}</span>
    </p>
    <img src="${film.filmInfo.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${film.filmInfo.description}</p>
    <a class="film-card__comments">${film.comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${(film.userDetails.watchlist) ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${(film.userDetails.alreadyWatched) ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${(film.userDetails.favorite) ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._openClickHandler = this._openClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._alreadyWatchedClickHandler = this._alreadyWatchedClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setOpenClickHandler(callback) {
    this._callback.openClick = callback;
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._openClickHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._openClickHandler);
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._openClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setAlreadyWatchedClickHandler(callback) {
    this._callback.alreadyWatchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._alreadyWatchedClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  _openClickHandler(evt) {
    evt.preventDefault();
    this._callback.openClick();
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick();
  }

  _alreadyWatchedClickHandler() {
    this._callback.alreadyWatchedClick();
  }

  _watchlistClickHandler() {
    this._callback.watchlistClick();
  }
}

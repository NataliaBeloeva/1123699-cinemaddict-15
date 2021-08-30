import {render, remove, RenderPosition} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import FilmsContainerView from '../view/films-container.js';
import NoFilmView from '../view/no-film.js';
import SortView from '../view/sort.js';
import ShowMoreView from '../view/show-more.js';
import FilmPresenter from './film.js';


const FILM_COUNT_PER_STEP = 5;

export default class Films {
  constructor (filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    this._filmPresenter = new Map();

    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsContainerComponent = new FilmsContainerView();
    this._noFilmsComponent = new NoFilmView();
    this._sortComponent = new SortView();
    this._showMoreComponent = new ShowMoreView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._renderFilmBoard(films);
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._filmPresenter.get(updatedFilm.id).init(updatedFilm);
  }

  _renderSort() {
    render(this._filmsComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderFilm(film) {
    const filmPresenter = new FilmPresenter(this._filmsContainerComponent, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter.set(film.id, filmPresenter);
  }

  _renderFilms(from, to) {
    this._films.slice(from, to).forEach((film) => this._renderFilm(film));
  }

  _renderNoFilms() {
    render(this._filmsContainer, this._filmsComponent);
    render(this._filmsComponent, this._filmsListComponent);
    render(this._filmsListComponent, this._noFilmsComponent);
  }

  _handleShowMoreClick () {
    this._renderFilms(this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    this._renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._films.length) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMore() {
    render(this._filmsListComponent, this._showMoreComponent);

    this._showMoreComponent.setClickHandler(this._handleShowMoreClick);
  }

  _clearFilmList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this._showMoreComponent);
  }

  _renderFilmList() {
    render(this._filmsContainer, this._filmsComponent);
    render(this._filmsComponent, this._filmsListComponent);
    render(this._filmsListComponent, this._filmsContainerComponent);

    this._renderFilms(0, Math.min(this._films.length, FILM_COUNT_PER_STEP));

    if (this._films.length > FILM_COUNT_PER_STEP) {
      this._renderShowMore();
    }
  }

  _renderFilmBoard() {
    if (this._films.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    this._renderFilmList();
  }
}


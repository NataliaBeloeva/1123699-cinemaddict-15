import {render, remove, RenderPosition} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import {sortFilmByDate, sortFilmByRating, sortFilmByComments} from '../utils/film.js';
import {SortType, FilmTitles} from '../const.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import FilmsContainerView from '../view/films-container.js';
import FilmExtraView from '../view/films-extra.js';
import NoFilmView from '../view/no-film.js';
import SortView from '../view/sort.js';
import ShowMoreView from '../view/show-more.js';
import FilmPresenter from './film.js';


const FILM_COUNT_PER_STEP = 5;
const FILMS_EXTRA_COUNT = 2;

export default class Films {
  constructor (filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._filmPresenter = new Map();
    this._filmRatedPresenter = new Map();
    this._filmCommentedPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsRatedListComponent = new FilmExtraView(FilmTitles.RATED);
    this._filmsCommentedListComponent = new FilmExtraView(FilmTitles.COMMENTED);
    this._filmsContainerComponent = new FilmsContainerView();
    this._filmsRatedContainerComponent = new FilmsContainerView();
    this._filmsCommentedContainerComponent = new FilmsContainerView();
    this._noFilmsComponent = new NoFilmView();
    this._sortComponent = new SortView();
    this._showMoreComponent = new ShowMoreView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    this._ratedFilms = films.slice().sort(sortFilmByRating);
    this._commentedFilms = films.slice().sort(sortFilmByComments);
    this._renderFilmBoard(films);
  }

  _getFilmPresenters() {
    return [this._filmPresenter, this._filmRatedPresenter, this._filmCommentedPresenter];
  }

  _handleModeChange() {
    this._getFilmPresenters().map((presenter) => presenter.forEach((item) => item.resetView()));
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._ratedFilms = updateItem(this._ratedFilms, updatedFilm);
    this._commentedFilms = updateItem(this._commentedFilms, updatedFilm);

    this._getFilmPresenters().map((presenter) => {
      if (presenter.has(updatedFilm.id)) {
        presenter.get(updatedFilm.id).init(updatedFilm);
      }
    });
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortFilmByDate);
        break;
      case SortType.RATING:
        this._films.sort(sortFilmByRating);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderFilmList();
    this._renderRatedFilmList();
    this._renderCommentedFilmList();
  }

  _renderSort() {
    render(this._filmsComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilm(film, container, presenter) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    presenter.set(film.id, filmPresenter);
  }

  _renderFilms(from, to) {
    this._films.slice(from, to).forEach((film) => this._renderFilm(film, this._filmsContainerComponent, this._filmPresenter));
  }

  _renderRatedFilms(from, to) {
    this._ratedFilms.slice(from, to).forEach((film) => this._renderFilm(film, this._filmsRatedContainerComponent, this._filmRatedPresenter));
  }

  _renderCommentedFilms(from, to) {
    this._commentedFilms.slice(from, to).forEach((film) => this._renderFilm(film, this._filmsCommentedContainerComponent, this._filmCommentedPresenter));
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
    this._getFilmPresenters().map((presenter) => presenter.forEach((item) => item.destroy()));
    this._getFilmPresenters().forEach((presenter) => presenter.clear());

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

  _renderRatedFilmList() {
    render(this._filmsComponent, this._filmsRatedListComponent);
    render(this._filmsRatedListComponent, this._filmsRatedContainerComponent);
    this._renderRatedFilms(0, Math.min(this._films.length, FILMS_EXTRA_COUNT));
  }

  _renderCommentedFilmList() {
    render(this._filmsComponent, this._filmsCommentedListComponent);
    render(this._filmsCommentedListComponent, this._filmsCommentedContainerComponent);
    this._renderCommentedFilms(0, Math.min(this._films.length, FILMS_EXTRA_COUNT));
  }

  _renderFilmBoard() {
    if (this._films.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderFilmList();
    this._renderSort();
    this._renderRatedFilmList();
    this._renderCommentedFilmList();
  }
}


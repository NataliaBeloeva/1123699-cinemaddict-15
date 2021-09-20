import {render, remove, RenderPosition} from '../utils/render.js';
import {sortFilmByDate, sortFilmByRating} from '../utils/film.js';
import {filter} from '../utils/filter.js';
import {SortType, FilmTitle, UserAction, UpdateType, FilterType} from '../const.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import FilmsContainerView from '../view/films-container.js';
import FilmExtraView from '../view/films-extra.js';
import NoFilmView from '../view/no-film.js';
import SortView from '../view/sort.js';
import ShowMoreView from '../view/show-more.js';
import LoadingView from '../view/loading.js';
import FilmPresenter from './film.js';

const FILM_COUNT_PER_STEP = 5;
const FILMS_EXTRA_COUNT = 2;

export default class Films {
  constructor (filmsContainer, filmsModel, filterModel, api) {
    this._filmsContainer = filmsContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._api = api;

    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._filterType = FilterType.ALL;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._filmPresenter = new Map();
    this._filmRatedPresenter = new Map();
    this._filmCommentedPresenter = new Map();

    this._sortComponent = null;
    this._showMoreComponent = null;
    this._noFilmComponent = null;

    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsRatedListComponent = new FilmExtraView(FilmTitle.RATED);
    this._filmsCommentedListComponent = new FilmExtraView(FilmTitle.COMMENTED);
    this._filmsContainerComponent = new FilmsContainerView();
    this._filmsRatedContainerComponent = new FilmsContainerView();
    this._filmsCommentedContainerComponent = new FilmsContainerView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreClick = this._handleShowMoreClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

  }

  init() {
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredTasks = filter[this._filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredTasks.sort(sortFilmByDate);
      case SortType.RATING:
        return filteredTasks.sort(sortFilmByRating);
    }
    return filteredTasks;
  }

  _getFilmPresenters() {
    return [this._filmPresenter, this._filmRatedPresenter, this._filmCommentedPresenter];
  }

  _handleModeChange() {
    this._getFilmPresenters().map((presenter) => presenter.forEach((item) => item.resetView()));
  }

  _handleViewAction(actionType, updateType, update, filterType) {
    switch (actionType) {
      case UserAction.UPDATE_FILM: {
        const actualUpdateType = this._filterModel.getFilter() === filterType ? UpdateType.MINOR : updateType;
        this._filmsModel.updateFilm(actualUpdateType, update);
        break;
      }
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedFilmCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearBoard({resetRenderedFilmCount: true});
    this._renderBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._filmsComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderFilm(film, container, presenter) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange, this._api);
    filmPresenter.init(film);
    presenter.set(film.id, filmPresenter);
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(film, this._filmsContainerComponent, this._filmPresenter));
  }

  _renderRatedFilms(from, to) {
    this._ratedFilms.slice(from, to).forEach((film) => this._renderFilm(film, this._filmsRatedContainerComponent, this._filmRatedPresenter));
  }

  _renderCommentedFilms(from, to) {
    this._commentedFilms.slice(from, to).forEach((film) => this._renderFilm(film, this._filmsCommentedContainerComponent, this._filmCommentedPresenter));
  }

  _renderNoFilms() {
    this._noFilmComponent = new NoFilmView(this._filterType);
    render(this._filmsContainer, this._noFilmComponent);
  }

  _renderLoading() {
    render(this._filmsContainer, this._loadingComponent);
  }

  _handleShowMoreClick () {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilms(films);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreComponent);
    }
  }

  _renderShowMore() {
    if (this._showMoreComponent !== null) {
      this._showMoreComponent = null;
    }

    this._showMoreComponent = new ShowMoreView();
    this._showMoreComponent.setClickHandler(this._handleShowMoreClick);
    render(this._filmsListComponent, this._showMoreComponent);
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

  _clearBoard({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();

    remove(this._filmsComponent);
    remove(this._filmsListComponent);
    remove(this._filmsContainerComponent);
    remove(this._sortComponent);
    remove(this._showMoreComponent);
    remove(this._loadingComponent);

    if (this._noFilmComponent) {
      remove(this._noFilmComponent);
    }

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();
    const filmCount = films.length;

    if (filmCount === 0) {
      this._renderNoFilms();
      return;
    }

    render(this._filmsContainer, this._filmsComponent);
    render(this._filmsComponent, this._filmsListComponent);
    render(this._filmsListComponent, this._filmsContainerComponent);

    this._renderSort();
    this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedFilmCount)));

    if (filmCount > this._renderedFilmCount) {
      this._renderShowMore();
    }
  }
}


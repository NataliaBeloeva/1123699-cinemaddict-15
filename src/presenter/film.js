import {render, remove, replace} from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export default class Film {
  constructor (filmContainer, changeData, changeMode) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleOpenPopup = this._handleOpenPopup.bind(this);
    this._handleClosePopup = this._handleClosePopup.bind(this);
    this._onDocumentKeydown = this._onDocumentKeydown.bind(this);

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
  }

  init(film) {
    this._film = film;
    this._popupContainer = document.body;

    const prevFilmComponent = this._filmComponent;

    this._filmComponent = new FilmCardView(film);

    this._filmComponent.setOpenClickHandler(this._handleOpenPopup);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    if (prevFilmComponent === null) {
      render(this._filmContainer, this._filmComponent);
      return;
    }

    if (this._filmContainer.getElement().contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._mode === Mode.POPUP) {
      this._openPopup();
    }

    remove(prevFilmComponent);

  }

  destroy() {
    remove(this._filmComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _openPopup() {
    this._changeMode();

    this._popupComponent = new PopupView(this._film);
    this._popupComponent.setCloseClickHandler(this._handleClosePopup);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popupComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    render(this._popupContainer, this._popupComponent);
    this._popupContainer.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onDocumentKeydown);

    this._mode = Mode.POPUP;
  }

  _closePopup() {
    remove(this._popupComponent);
    this._popupContainer.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._onDocumentKeydown);
    this._mode = Mode.DEFAULT;
  }

  _onDocumentKeydown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _handleOpenPopup() {
    this._openPopup();
  }

  _handleClosePopup() {
    this._closePopup();
  }

  _handleFavoriteClick() {
    this._changeData(Object.assign({}, this._film, {userDetails: {...this._film.userDetails, favorite: !this._film.userDetails.favorite}}));
  }

  _handleAlreadyWatchedClick() {
    this._changeData(Object.assign({}, this._film, {userDetails: {...this._film.userDetails, alreadyWatched: !this._film.userDetails.alreadyWatched}}));
  }

  _handleWatchlistClick() {
    this._changeData(Object.assign({}, this._film, {userDetails: {...this._film.userDetails, watchlist: !this._film.userDetails.watchlist}}));
  }

}

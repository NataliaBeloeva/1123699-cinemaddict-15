import {render, remove, replace} from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import {UserAction, UpdateType} from '../const.js';

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
    this._handleCommentsUpdate = this._handleCommentsUpdate.bind(this);
  }

  init(film, updateType, mode) {
    this._film = film;
    this._popupContainer = document.body;
    this._mode = mode;
    this._updateType = updateType;

    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;

    this._filmComponent = new FilmCardView(this._film);
    this._popupComponent = new PopupView(this._film);

    this._filmComponent.setOpenClickHandler(this._handleOpenPopup);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    this._popupComponent.setCloseClickHandler(this._handleClosePopup);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popupComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setCommentDeleteClickHandler(this._handleCommentsUpdate);
    this._popupComponent.setAddCommentHandler(this._handleCommentsUpdate);

    if (prevFilmComponent === null) {
      render(this._filmContainer, this._filmComponent);
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._mode === Mode.POPUP && this._updateType === UpdateType.MINOR) {
      const popup = document.querySelector('.film-details');
      const filmIndex = this._film.id;
      const popupIndex = parseInt(popup.dataset.id, 10);
      if (filmIndex === popupIndex) {
        this._openPopup();
      }
    }

    if (this._mode === Mode.POPUP && this._updateType === UpdateType.PATCH) {
      replace(this._filmComponent, prevFilmComponent);
      replace(this._popupComponent, prevPopupComponent);
    }

    if (this._updateType === UpdateType.MAJOR) {
      const popup = document.querySelector('.film-details');
      if (popup) {
        this._closePopup();
      }
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);

  }

  destroy() {
    remove(this._filmComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._mode = Mode.DEFAULT;
    }
  }

  _openPopup() {
    this._closePopup();
    render(this._popupContainer, this._popupComponent);
    this._popupContainer.classList.add('hide-overflow');
    document.addEventListener('keydown', this._onDocumentKeydown);
    this._popupComponent.reset(this._film);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _closePopup() {
    const currentPopup = document.querySelector('.film-details');
    if (currentPopup) {
      currentPopup.remove();
      this._popupContainer.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this._onDocumentKeydown);
      this._mode = Mode.DEFAULT;
    }
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

  _handleFavoriteClick(film) {
    this._updateControls(film, film.userDetails, 'favorite', !film.userDetails.favorite, this._mode);
  }

  _handleAlreadyWatchedClick(film) {
    this._updateControls(film, film.userDetails, 'alreadyWatched', !film.userDetails.alreadyWatched, this._mode);
  }

  _handleWatchlistClick(film) {
    this._updateControls(film, film.userDetails, 'watchlist', !film.userDetails.watchlist, this._mode);
  }

  _updateControls(film, object, property, value, mode) {
    const newData = Object.assign(
      {},
      film,
      object[property] = value,
    );
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      newData,
      mode,
    );
    this._popupComponent.updateData(newData, true);
  }

  _handleCommentsUpdate(update) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      update,
      Mode.POPUP,
    );
  }
}

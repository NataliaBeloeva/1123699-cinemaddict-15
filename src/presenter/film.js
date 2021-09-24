import {render, remove, replace} from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import {Mode, UserAction, UpdateType, FilterType} from '../const.js';

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class Film {
  constructor (filmContainer, changeData, changeMode, filmsModel, api) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._filmsModel = filmsModel;
    this._api = api;

    this._filmComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleOpenPopup = this._handleOpenPopup.bind(this);
    this._handleClosePopup = this._handleClosePopup.bind(this);
    this._documentKeydownHandler = this._documentKeydownHandler.bind(this);

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleCommentDelete = this._handleCommentDelete.bind(this);
    this._handleCommentAdd = this._handleCommentAdd.bind(this);
  }

  init(film) {
    this._film = film;
    this._popupContainer = document.body;

    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;


    this._filmComponent = new FilmCardView(this._film);
    this._popupComponent = new PopupView(this._film);
    this._getComments();

    this._filmComponent.setOpenClickHandler(this._handleOpenPopup);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    this._popupComponent.setCloseClickHandler(this._handleClosePopup);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popupComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setCommentDeleteClickHandler(this._handleCommentDelete);
    this._popupComponent.setAddCommentHandler(this._handleCommentAdd);

    if (prevFilmComponent === null) {
      render(this._filmContainer, this._filmComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._mode === Mode.POPUP) {
      replace(this._filmComponent, prevFilmComponent);
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  destroy() {
    remove(this._filmComponent);
    this._closePopup();
    remove(this._popupComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._popupComponent.updateData({
        isDisabled: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._popupComponent.updateData({
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this._popupComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._filmComponent.shake(resetFormState);
        this._popupComponent.shake(resetFormState);
        break;
    }
  }

  _getComments() {
    this._api.getComments(this._film)
      .then((comments) => {
        this._filmsModel.setComments(comments);
        this._popupComponent.setComments(comments);
      });
  }

  _openPopup() {
    this._changeMode();
    this._getComments();
    render(this._popupContainer, this._popupComponent);
    this._popupContainer.classList.add('hide-overflow');
    document.addEventListener('keydown', this._documentKeydownHandler);
    this._mode = Mode.POPUP;
  }

  _closePopup() {
    const currentPopup = document.querySelector('.film-details');
    if (currentPopup) {
      currentPopup.remove();
      this._popupContainer.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this._documentKeydownHandler);
      this._mode = Mode.DEFAULT;
    }
  }

  _handleOpenPopup() {
    this._openPopup();
  }

  _handleClosePopup() {
    this._closePopup();
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            ...this._film.userDetails,
            favorite: !this._film.userDetails.favorite,
          },
        },
      ),
      FilterType.FAVORITES,
    );
  }

  _handleAlreadyWatchedClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            ...this._film.userDetails,
            alreadyWatched: !this._film.userDetails.alreadyWatched,
          },
        },
      ),
      FilterType.HISTORY,
    );
  }

  _handleWatchlistClick() {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            ...this._film.userDetails,
            watchlist: !this._film.userDetails.watchlist,
          },
        },
      ),
      FilterType.WATCHLIST,
    );
  }

  _handleCommentDelete(comment) {
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      comment,
      this._film,
    );
  }

  _handleCommentAdd(comment, emotion) {
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {comment, emotion},
      this._film,
    );
  }

  _documentKeydownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._popupComponent.reset(this._film);
      this._closePopup();
    }
  }

}

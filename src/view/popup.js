import SmartView from './smart.js';
import {generateDate, humanizeDate, humanizeDatePopup, humanizeRuntime} from '../utils/film.js';
import {getRandomUniqueInteger} from '../utils/common.js';
import {EMOTIONS} from '../const.js';

const createGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;

const createCommentTemplate = (message) => {
  const {id, author, comment, date, emotion} = message;

  return `<li class="film-details__comment" id="${id}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${date}</span>
        <button class="film-details__comment-delete" data-id="${id}">Delete</button>
      </p>
    </div>
  </li>`;
};

const createEmotionTemplate = (emotion, emotionType) => (
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${emotionType === emotion ? 'checked' : ''}>
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>`
);

const generateGenres = (genres) => genres.map(createGenreTemplate).join(' ');
const generateComments = (comments) => comments.map(createCommentTemplate).join(' ');
const generateEmotions = (emotions, emotionType) => emotions.map((emotion) => createEmotionTemplate(emotion, emotionType)).join(' ');

const createPopupTemplate = (film) => {
  const filmDate = humanizeDatePopup(film.filmInfo.release.date);
  const filmRuntime = humanizeRuntime(film.filmInfo.runtime);

  return `<section class="film-details data-id="${film.id}">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${film.filmInfo.poster}" alt="">

            <p class="film-details__age">${film.filmInfo.ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${film.filmInfo.title}</h3>
                <p class="film-details__title-original">Original: ${film.filmInfo.alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${film.filmInfo.totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${film.filmInfo.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${film.filmInfo.writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${film.filmInfo.actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${filmDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${filmRuntime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${film.filmInfo.release.releaseCountry}</td>
              </tr>
              <tr class="film-details__row film-details__row-genre">
                <td class="film-details__term">${(film.filmInfo.genre.length > 1) ? 'Genres' : 'Genre'}</td>
                <td class="film-details__cell">${generateGenres(film.filmInfo.genre)}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${film.filmInfo.description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${(film.userDetails.watchlist) ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${(film.userDetails.alreadyWatched) ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${(film.userDetails.favorite) ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>
      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${film.comments.length}</span></h3>
          ${film.comments.length ? `<ul class="film-details__comments-list">${generateComments(film.comments)}</ul>` : ''}
          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${film.emotionType ? `<img src="images/emoji/${film.emotionType}.png" width="55" height="55" alt="emoji-${film.emotionType}"> <input name="user-emoji" type="hidden" id="user-emoji" value="${film.emotionType}">` : ''}
            </div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${film.newComment}</textarea>
            </label>
            <div class="film-details__emoji-list">
              ${generateEmotions(EMOTIONS, film.emotionType)}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class Popup extends SmartView {
  constructor(film) {
    super();
    this._data = Popup.parseFilmToData(film);
    this._comments = this._data.comments;

    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._alreadyWatchedClickHandler = this._alreadyWatchedClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);

    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
    this._keyDownCtrlEnterHandler = this._keyDownCtrlEnterHandler.bind(this);
    this._commentTextInputHandler = this._commentTextInputHandler.bind(this);
    this._commentEmotionChangeHandler = this._commentEmotionChangeHandler.bind(this);
    this._scrollPopupHandler = this._scrollPopupHandler.bind(this);

    this._setInnerHandlers();
  }

  reset(film) {
    this.updateData(
      Popup.parseFilmToData(film),
    );
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick();
    this.getElement().scrollTo(0, this._data.scrollPosition);
  }

  _alreadyWatchedClickHandler() {
    this._callback.alreadyWatchedClick();
    this.getElement().scrollTo(0, this._data.scrollPosition);
  }

  _watchlistClickHandler() {
    this._callback.watchlistClick();
    this.getElement().scrollTo(0, this._data.scrollPosition);
  }

  _commentTextInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      newComment: evt.target.value,
    }, true);
  }

  _commentEmotionChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName === 'INPUT') {
      this.updateData({
        emotionType: evt.target.value,
      });
    }

    this.getElement().scrollTo(0, this._data.scrollPosition);
  }

  _commentDeleteClickHandler(evt) {
    evt.preventDefault();
    const commentId = parseInt(evt.target.dataset.id, 10);
    const index = this._comments.findIndex((comment) => comment.id === commentId);

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    this.updateData({
      comments: this._comments,
    });

    this._callback.commentDeleteClick(Popup.parseDataToFilm(this._data));
  }

  _keyDownCtrlEnterHandler(evt) {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey) && this._data.emotionType && this._data.newComment) {
      const commentToAdd = {
        id: getRandomUniqueInteger(0, 1000),
        author: 'Натали',
        comment: this._data.newComment,
        date: humanizeDate(generateDate()),
        emotion: this._data.emotionType,
      };

      this._comments = [...this._comments, commentToAdd];

      this.updateData({
        comments: this._comments,
      });

      document.removeEventListener('keydown', this._keyDownCtrlEnterHandler);
      this._callback.addComment(Popup.parseDataToFilm(this._data));
    }
  }

  _scrollPopupHandler(evt) {
    this.updateData({
      scrollPosition: evt.target.scrollTop,
    }, true);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentTextInputHandler);
    this.getElement().querySelector('.film-details__emoji-list').addEventListener('change', this._commentEmotionChangeHandler);
    this.getElement().addEventListener('scroll', this._scrollPopupHandler);
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setAlreadyWatchedClickHandler(callback) {
    this._callback.alreadyWatchedClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._alreadyWatchedClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._watchlistClickHandler);
  }

  setCommentDeleteClickHandler(callback) {
    this._callback.commentDeleteClick = callback;
    this.getElement().querySelectorAll('.film-details__comment-delete').forEach((comment) => comment.addEventListener('click', this._commentDeleteClickHandler));
  }

  setAddCommentHandler(callback) {
    this._callback.addComment = callback;
    document.addEventListener('keydown', this._keyDownCtrlEnterHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setCommentDeleteClickHandler(this._callback.commentDeleteClick);
    this.setAddCommentHandler(this._callback.addComment);
  }

  static parseFilmToData(film) {
    return Object.assign(
      {},
      film,
      {
        newComment: '',
        emotionType: null,
        scrollPosition: 0,
      },
    );
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    if (!data.newComment) {
      data.newComment = '';
    }

    if (!data.emotionType) {
      data.emotionType = null;
    }

    delete data.newComment;
    delete data.emotionType;

    return data;
  }
}

import AbstractView from './abstract.js';
import {getUserRank} from '../utils/film.js';

const createProfileTemplate = (watchedFilmCount) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getUserRank(watchedFilmCount)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class Profile extends AbstractView {
  constructor(watchedFilmCount) {
    super();

    this._watchedFilmCount = watchedFilmCount;
  }

  getTemplate() {
    return createProfileTemplate(this._watchedFilmCount);
  }
}

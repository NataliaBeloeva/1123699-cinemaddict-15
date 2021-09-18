import AbstractView from './abstract.js';
import {FilterType} from '../const.js';

const NoFilmTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoFilmTemplate = (filterType) => {
  const noFilmTextValue = NoFilmTextType[filterType];
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title">${noFilmTextValue}</h2>
      </section>
    </section>`);
};

export default class NoFilm extends AbstractView {
  constructor(data) {
    super();

    this._data = data;
  }

  getTemplate() {
    return createNoFilmTemplate(this._data);
  }
}

import AbstractView from './abstract.js';

const createFilmAmountTemplate = (amount) => `<p>${amount} movies inside</p>`;

export default class FilmAmount extends AbstractView {
  constructor(amount) {
    super();
    this._amount = amount;
  }

  getTemplate() {
    return createFilmAmountTemplate(this._amount);
  }
}

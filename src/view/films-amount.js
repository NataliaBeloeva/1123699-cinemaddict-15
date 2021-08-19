import {createElement} from '../util.js';

const createFilmAmountTemplate = (amount) => `<p>${amount} movies inside</p>`;

export default class FilmAmount {
  constructor(amount) {
    this._amount = amount;
    this._element = null;
  }

  getTemplate() {
    return createFilmAmountTemplate(this._amount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

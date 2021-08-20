import {createElement} from '../util.js';

const SORT_TYPES = ['default', 'date', 'rating'];

const isActiveClassName = (condition) => condition ? 'sort__button--active' : '';

const createSortItemTemplate = (type, isActive) => (
  `<li><a href="#" class="sort__button ${isActiveClassName(isActive)}">Sort by ${type}</a></li>`
);

const createSortTemplate = (types, activeType) => {
  const sortItemsTemplate = types.map((type) => createSortItemTemplate(type, type === activeType)).join('');

  return `<ul class="sort">${sortItemsTemplate}</ul>`;
};

export default class Sort {
  constructor() {
    this._type = SORT_TYPES;
    this._element = null;
  }

  getTemplate() {
    return createSortTemplate(this._type, this._type[0]);
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

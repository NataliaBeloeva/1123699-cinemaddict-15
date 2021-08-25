import AbstractView from './abstract.js';

const SORT_TYPES = ['default', 'date', 'rating'];

const isActiveClassName = (condition) => condition ? 'sort__button--active' : '';

const createSortItemTemplate = (type, isActive) => (
  `<li><a href="#" class="sort__button ${isActiveClassName(isActive)}">Sort by ${type}</a></li>`
);

const createSortTemplate = (types, activeType) => {
  const sortItemsTemplate = types.map((type) => createSortItemTemplate(type, type === activeType)).join('');

  return `<ul class="sort">${sortItemsTemplate}</ul>`;
};

export default class Sort extends AbstractView {
  constructor() {
    super();
    this._type = SORT_TYPES;
  }

  getTemplate() {
    return createSortTemplate(this._type, this._type[0]);
  }
}

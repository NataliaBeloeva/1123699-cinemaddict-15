import AbstractView from './abstract.js';
import {MenuItem} from '../const.js';

const createFilterCountTemplate = (count) => `<span class="main-navigation__item-count">${count}</span>`;

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return `<a href="#${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter-type="${type}" data-menu-type="${MenuItem.FILMS}">${name}
    ${type !== 'all' ? createFilterCountTemplate(count) : ''}
    </a>`;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional" data-menu-type="${MenuItem.STATISTICS}">Stats</a>
  </nav>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._menuTypeChangeHandler = this._menuTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().querySelector('.main-navigation__items').addEventListener('click', this._filterTypeChangeHandler);
  }

  setMenuTypeChangeHandler(callback) {
    this._callback.menuTypeChange = callback;
    this.getElement().querySelector('.main-navigation__items').addEventListener('click', this._menuTypeChangeHandler);
    this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this._menuTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName === 'A') {
      evt.preventDefault();
      this._callback.filterTypeChange(evt.target.dataset.filterType);
    }
  }

  _menuTypeChangeHandler(evt) {
    if (evt.target.tagName === 'A') {
      evt.preventDefault();
      this._callback.menuTypeChange(evt.target.dataset.menuType);
    }
  }
}

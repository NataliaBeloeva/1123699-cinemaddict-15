import {createElement} from '../util.js';

const filterTitles = {
  all: 'All Movies',
  watchlist: 'Watchlist',
  alreadyWatched: 'History',
  favorite: 'Favorites',
};

const isActiveClassName = (condition) => condition ? 'main-navigation__item--active' : '';

const createFilterCountTemplate = (count) => `<span class="main-navigation__item-count">${count}</span>`;

const createFilterItemTemplate = (filter, isActive) => {
  const {name, count} = filter;
  return `<a href="#${name}" class="main-navigation__item ${isActiveClassName(isActive)}">${filterTitles[name]}${name !== 'all' ? createFilterCountTemplate(count) : ''}</a>`;
};


const createFilterTemplate = (filterItems, activeFilter) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, filter.name === activeFilter)).join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Filter {
  constructor(filters) {
    this._filter = filters;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filter, this._filter[0].name);
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

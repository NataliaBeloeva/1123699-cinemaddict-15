import {render, replace, remove} from '../utils/render.js';
import {FilteredFilm} from '../utils/filter.js';
import {FilterType, FilterName, UpdateType, MenuItem} from '../const.js';
import ProfileView from '../view/profile.js';
import FilterView from '../view/filter.js';

export default class Filter {
  constructor(headerContainer, filterContainer, filterModel, filmsModel, menuClickHandler) {
    this._headerContainer = headerContainer;
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._menuClickHandler = menuClickHandler;
    this._menutype = MenuItem.FILMS;

    this._filterComponent = null;
    this._profileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleMenuTypeChange = this._handleMenuTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;
    const prevProfileComponent = this._profileComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._profileComponent = new ProfileView(this._getWatchedFilms());

    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._filterComponent.setMenuTypeChangeHandler(this._handleMenuTypeChange);

    if (prevFilterComponent === null && prevProfileComponent === null) {
      render(this._filterContainer, this._filterComponent);
      render(this._headerContainer, this._profileComponent);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    replace(this._profileComponent, prevProfileComponent);

    remove(prevFilterComponent);
    remove(prevProfileComponent);
  }

  _getWatchedFilms() {
    return this._getFilters().find((item) => item.type === FilterType.HISTORY).count;
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: FilterName.ALL,
        count: FilteredFilm[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: FilterName.WATCHLIST,
        count: FilteredFilm[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: FilterName.HISTORY,
        count: FilteredFilm[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: FilterName.FAVORITES,
        count: FilteredFilm[FilterType.FAVORITES](films).length,
      },
    ];
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleMenuTypeChange(menutype) {
    if (this._menutype === menutype) {
      return;
    }

    this._menutype = menutype;
    this.init();
    this._menuClickHandler(menutype);
  }
}

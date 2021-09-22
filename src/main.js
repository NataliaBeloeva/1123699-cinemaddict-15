import {render, remove} from './utils/render.js';
import {MenuItem, UpdateType} from './const.js';
import FilmAmountView from './view/films-amount.js';
import StatsView from './view/stats.js';
import FilmsPresenter from './presenter/films.js';
import FilterPresenter from './presenter/filter.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic stroms829bg0506nb';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const bodyElement = document.body;
const mainElement = bodyElement.querySelector('.main');
const headerElement = bodyElement.querySelector('.header');
const footerElement = bodyElement.querySelector('.footer');
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

const api = new Api(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const filmsPresenter = new FilmsPresenter(mainElement, filmsModel, filterModel, api);

let statsComponent = null;
const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      filmsPresenter.init();
      remove(statsComponent);
      break;
    case MenuItem.STATISTICS:
      filmsPresenter.destroy();
      statsComponent = new StatsView(filmsModel.getFilms());
      render(mainElement, statsComponent);
      break;
  }
};

const filterPresenter = new FilterPresenter(headerElement, mainElement, filterModel, filmsModel, handleMenuClick);

filterPresenter.init();
filmsPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    render(footerStatisticsElement, new FilmAmountView(films.length));
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });

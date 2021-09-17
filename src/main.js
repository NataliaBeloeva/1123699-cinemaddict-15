import {render} from './utils/render.js';
import {MenuItem} from './const.js';
import {generateCard} from './mock/film-card.js';
import ProfileView from './view/profile.js';
import FilmAmountView from './view/films-amount.js';
import FilmsPresenter from './presenter/films.js';
import FilterPresenter from './presenter/filter.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';

const FILMS_TOTAL = 17;

const bodyElement = document.body;
const mainElement = bodyElement.querySelector('.main');
const headerElement = bodyElement.querySelector('.header');
const footerElement = bodyElement.querySelector('.footer');
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');


const films = new Array(FILMS_TOTAL).fill(null).map((item, idx) => generateCard(idx));


const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

const filmsPresenter = new FilmsPresenter(mainElement, filmsModel, filterModel);

render(headerElement, new ProfileView());

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      filmsPresenter.init();
      // Скрыть статистику
      break;
    case MenuItem.STATISTICS:
      filmsPresenter.destroy();
      // Показать статистику
      break;
  }
};

const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel, handleMenuClick);

filterPresenter.init();
filmsPresenter.init();

render(footerStatisticsElement, new FilmAmountView(FILMS_TOTAL));



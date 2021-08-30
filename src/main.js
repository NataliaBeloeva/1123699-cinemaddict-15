import {render} from './utils/render.js';
import {generateCard} from './mock/film-card.js';
import ProfileView from './view/profile.js';
import FilterView from './view/filter.js';
import FilmAmountView from './view/films-amount.js';
import FilmsPresenter from './presenter/films.js';

const FILMS_TOTAL = 22;

const bodyElement = document.body;
const mainElement = bodyElement.querySelector('.main');
const headerElement = bodyElement.querySelector('.header');
const footerElement = bodyElement.querySelector('.footer');
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

const filmToFilterMap = {
  all: (data) => data.length,
  watchlist: (data) => data.filter((film) => film.userDetails.watchlist).length,
  alreadyWatched: (data) => data.filter((film) => film.userDetails.alreadyWatched).length,
  favorite: (data) => data.filter((film) => film.userDetails.favorite).length,
};

const generateFilter = (data) => Object.entries(filmToFilterMap).map(
  ([filterName, countFilms]) => ({
    name: filterName,
    count: countFilms(data),
  }),
);

const films = new Array(FILMS_TOTAL).fill(null).map((_, idx) => generateCard(idx));
const filters = generateFilter(films);

const filmsPresenter = new FilmsPresenter(mainElement);

render(headerElement, new ProfileView());
render(mainElement, new FilterView(filters));

filmsPresenter.init(films);

render(footerStatisticsElement, new FilmAmountView(FILMS_TOTAL));



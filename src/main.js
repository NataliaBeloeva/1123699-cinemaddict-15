import {PlaceTypes, render} from './util.js';
import {createProfileTemplate} from './view/profile.js';
import {createMenuTemplate} from './view/menu.js';
import {createSortTemplate} from './view/sort.js';
import {createFilmsTemplate} from './view/films.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreTemplate} from './view/show-more.js';
import {createFilmsExtraTemplate} from './view/films-extra.js';
import {createFilmsAmountTemplate} from './view/films-amount.js';
import {createPopupTemplate} from './view/popup.js';
import {createPopupCommentTemplate} from './view/popup-comment.js';
import {createFilmsGenreTemplate} from './view/film-genre.js';
import {generateCard} from './mock/film-card.js';
import {generateFilter} from './mock/filter.js';

const FILMS_TOTAL = 20;
const FILMS_ALL_COUNT = 5;
const FILMS_EXTRA_COUNT = 2;
const FILM_COUNT_PER_STEP = 5;
const SORT_TYPES = ['default', 'date', 'rating'];

const FilmListTypes = {
  ALL: {
    title: 'All movies. Upcoming',
  },
  TOP: {
    title: 'Top rated',
  },
  COMMENTED: {
    title: 'Most commented',
  },
};

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

const films = new Array(FILMS_TOTAL).fill(null).map((_, idx) => generateCard(idx));
const filters = generateFilter(films);

const renderFilmCards = (container, amount) => {
  for (let i = 0; i < amount; i++) {
    render(container, createFilmCardTemplate(films[i]));
  }
};

render(headerElement, createProfileTemplate());
render(mainElement, createMenuTemplate(filters, filters[0].name));
render(mainElement, createSortTemplate(SORT_TYPES, SORT_TYPES[0]));
render(mainElement, createFilmsTemplate());

const filmsSectionElement = mainElement.querySelector('.films');
const filmsContainerElement = filmsSectionElement.querySelector('.films-list__container');

renderFilmCards(filmsContainerElement, FILMS_ALL_COUNT);

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(filmsContainerElement, createShowMoreTemplate(), PlaceTypes.AFTER);

  const showMoreButton = filmsSectionElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => render(filmsContainerElement, createFilmCardTemplate(film)));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

render(filmsSectionElement, createFilmsExtraTemplate(FilmListTypes.TOP.title));
render(filmsSectionElement, createFilmsExtraTemplate(FilmListTypes.COMMENTED.title));

const filmsExtraContainerElements = filmsSectionElement.querySelectorAll('.films-list--extra .films-list__container');

for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
  renderFilmCards(filmsExtraContainerElements[i], FILMS_EXTRA_COUNT);
}

render(footerElement, createPopupTemplate(films[0]), PlaceTypes.AFTER);

const popup = document.querySelector('.film-details');
const popupGenreElement = popup.querySelector('.film-details__row-genre .film-details__cell');
const popupCommentsElement = popup.querySelector('.film-details__comments-list');

for (let i = 0; i < films[0].filmInfo.genre.length; i++) {
  render(popupGenreElement, createFilmsGenreTemplate(films[0].filmInfo.genre[i]));
}

for (let i = 0; i < films[0].comments.length; i++) {
  render(popupCommentsElement, createPopupCommentTemplate(films[0].comments[i]));
}

render(footerStatisticsElement, createFilmsAmountTemplate(FILMS_TOTAL));



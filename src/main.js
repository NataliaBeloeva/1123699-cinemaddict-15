import {PlaceTypes, render} from './util.js';
import {createProfileTemplate} from './view/profile.js';
import {createMenuTemplate} from './view/menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createFilmsTemplate} from './view/films.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreTemplate} from './view/show-more.js';
import {createFilmsExtraTemplate} from './view/films-extra.js';
import {createFilmsAmountTemplate} from './view/films-amount.js';
import {createPopupTemplate} from './view/popup.js';
import {createPopupCommentTemplate} from './view/popup-comment.js';

const FILMS_ALL_COUNT = 5;
const FILMS_EXTRA_COUNT = 2;
const COMMENTS_COUNT = 4;

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

const renderFilmCards = (container, amount) => {
  for (let i = 0; i < amount; i++) {
    render(container, createFilmCardTemplate());
  }
};

render(headerElement, createProfileTemplate());
render(mainElement, createMenuTemplate());
render(mainElement, createFilterTemplate());
render(mainElement, createFilmsTemplate());

const filmsSectionElement = mainElement.querySelector('.films');
const filmsContainerElement = filmsSectionElement.querySelector('.films-list__container');

renderFilmCards(filmsContainerElement, FILMS_ALL_COUNT);

render(filmsContainerElement, createShowMoreTemplate(), PlaceTypes.AFTER);
render(filmsSectionElement, createFilmsExtraTemplate(FilmListTypes.TOP.title));
render(filmsSectionElement, createFilmsExtraTemplate(FilmListTypes.COMMENTED.title));

const filmsExtraContainerElements = filmsSectionElement.querySelectorAll('.films-list--extra .films-list__container');

for (let i = 0; i < FILMS_EXTRA_COUNT; i++) {
  renderFilmCards(filmsExtraContainerElements[i], FILMS_EXTRA_COUNT);
}

render(footerElement, createPopupTemplate(), PlaceTypes.AFTER);

const popupCommentsElement = document.querySelector('.film-details__comments-list');

for (let i = 0; i < COMMENTS_COUNT; i++) {
  render(popupCommentsElement, createPopupCommentTemplate());
}

render(footerStatisticsElement, createFilmsAmountTemplate());



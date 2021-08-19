import {render} from './util.js';
import {generateCard} from './mock/film-card.js';
import ProfileView from './view/profile.js';
import SortView from './view/sort.js';
import FilterView from './view/filter.js';
import FilmsView from './view/films.js';
import FilmCardView from './view/film-card.js';
import ShowMoreView from './view/show-more.js';
import FilmExtraView from './view/films-extra.js';
import FilmAmountView from './view/films-amount.js';
import PopupView from './view/popup.js';
import NoFilmView from './view/no-film.js';

const FILMS_TOTAL = 22;
const FILMS_EXTRA_COUNT = 2;
const FILM_COUNT_PER_STEP = 5;

const bodyElement = document.body;
const mainElement = bodyElement.querySelector('.main');
const headerElement = bodyElement.querySelector('.header');
const footerElement = bodyElement.querySelector('.footer');
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

const FilmTitles = {
  TOP: 'Top rated',
  COMMENTED: 'Most commented',
};

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

const topRatedFilms = films.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating).slice(0, FILMS_EXTRA_COUNT);
const mostCommentedFilms = films.slice().sort((a, b) => b.comments.length - a.comments.length).slice(0, FILMS_EXTRA_COUNT);

render(headerElement, new ProfileView().getElement());
render(mainElement, new FilterView(filters).getElement());
render(mainElement, new SortView().getElement());
render(mainElement, new FilmsView().getElement());

const filmsSectionElement = mainElement.querySelector('.films');
const filmsListElement = filmsSectionElement.querySelector('.films-list');
const filmsContainerElement = filmsSectionElement.querySelector('.films-list__container');

const renderFilm = (container, film) => {
  const filmComponent = new FilmCardView(film);
  const popupComponent = new PopupView(film);

  const filmTitleElement = filmComponent.getElement().querySelector('.film-card__title');
  const filmPosterElement = filmComponent.getElement().querySelector('.film-card__poster');
  const filmCommentsLinkElement = filmComponent.getElement().querySelector('.film-card__comments');
  const popupCloseElement = popupComponent.getElement().querySelector('.film-details__close-btn');

  const onDocumentKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      bodyElement.removeChild(popupComponent.getElement());
      bodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  const openPopup = () => {
    bodyElement.appendChild(popupComponent.getElement());
    bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', onDocumentKeydown);
  };

  const onPopupCLoseElementClick = () => {
    bodyElement.removeChild(popupComponent.getElement());
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onDocumentKeydown);
  };

  filmTitleElement.addEventListener('click', () => {
    openPopup();
  });

  filmPosterElement.addEventListener('click', () => {
    openPopup();
  });

  filmCommentsLinkElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    openPopup();
  });

  popupCloseElement.addEventListener('click', onPopupCLoseElementClick);

  render(container, filmComponent.getElement());
};

if (films.length === 0) {
  render(filmsListElement, new NoFilmView().getElement());
} else {

  for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
    renderFilm(filmsContainerElement, films[i]);
  }

  if (films.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;

    render(filmsListElement, new ShowMoreView().getElement());

    const showMoreButton = filmsSectionElement.querySelector('.films-list__show-more');

    showMoreButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      films
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => renderFilm(filmsContainerElement, film));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= films.length) {
        showMoreButton.remove();
      }
    });
  }

  render(filmsSectionElement, new FilmExtraView(FilmTitles.TOP).getElement());
  render(filmsSectionElement, new FilmExtraView(FilmTitles.COMMENTED).getElement());

  const filmsExtraContainerElements = filmsSectionElement.querySelectorAll('.films-list--extra .films-list__container');

  topRatedFilms.forEach((film) => {
    renderFilm(filmsExtraContainerElements[0], film);
  });
  mostCommentedFilms.forEach((film) => {
    renderFilm(filmsExtraContainerElements[1], film);
  });

}

render(footerStatisticsElement, new FilmAmountView(FILMS_TOTAL).getElement());



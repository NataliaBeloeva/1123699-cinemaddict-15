import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {MINUTES_IN_HOUR_COUNT, HOUR_ZERO_COUNT, MINUTES_ZERO_COUNT, INITIAL_RUNTIME_COUNT} from '../const.js';

dayjs.extend(isBetween);

export const getFilmGenres = (films) => films.reduce((accumulator, film) => accumulator.concat(film.filmInfo.genre), []);

export const makeItemsUnique = (items) => [...new Set(items)];

export const sortGenreByCount = (genreA, genreB) => {
  const genreCountA = genreA.count;
  const genreCountB = genreB.count;

  return genreCountB - genreCountA;
};

export const getGenresSorted = (uniqueGenres, films) => {
  const uniqueFilms = uniqueGenres.map((element) => ({
    genre: element,
    count: films.filter((film) => film === element).length,
  }));

  uniqueFilms.sort(sortGenreByCount);

  return {
    labels: uniqueFilms.map((element) => element.genre),
    data: uniqueFilms.map((element) => element.count),
  };
};

export const getFilmsInPeriod = (from, to, films) => films.filter((film) => dayjs(film.userDetails.watchingDate).isBetween(from, to, null, []));

export const getHoursAndMinutes = (minutes) => minutes ? {hours: Math.floor(minutes / MINUTES_IN_HOUR_COUNT), minutes: minutes % MINUTES_IN_HOUR_COUNT} : {hours: HOUR_ZERO_COUNT, minutes: MINUTES_ZERO_COUNT};

export const getTotalDuration = (films) => getHoursAndMinutes(films.reduce((acc, film) => acc + film.filmInfo.runtime, INITIAL_RUNTIME_COUNT));

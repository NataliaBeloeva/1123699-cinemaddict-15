import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const getFilmGenres = (films) => films.reduce((accumulator, film) => accumulator.concat(film.filmInfo.genre), []);

export const makeItemsUnique = (items) => [...new Set(items)];

export const sortGenreByCount = (genreA, genreB) => {
  const genreCountA = genreA.count;
  const genreCountB = genreB.count;

  return genreCountB - genreCountA;
};

export const getGenresSorted = (unique, films) => {
  const data = [];

  for (let i = 0; i < unique.length; i++) {
    const genreObject = {
      genre: unique[i],
      count: 0,
    };

    for (let j = 0; j < films.length; j++) {
      if (films[j] === genreObject.genre) {
        genreObject.count += 1;
      }
    }
    data.push(genreObject);
  }

  data.sort(sortGenreByCount);

  return {
    labels: data.map((element) => element.genre),
    data: data.map((element) => element.count),
  };
};

export const getFilmsInPeriod = (from, to, films) => films.filter((film) => dayjs(film.userDetails.watchingDate).isBetween(from, to, null, []));

export const getHoursAndMinutes = (minutes) => minutes ? {hours: Math.floor(minutes / 60), minutes: minutes % 60} : {hours: 0, minutes: 0};

export const getTotalDuration = (films) => getHoursAndMinutes(films.reduce((acc, film) => acc + film.filmInfo.runtime, 0));

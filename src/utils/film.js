import dayjs from 'dayjs';
import {MINUTES_IN_HOUR_COUNT, WatchedFilm, UserRank} from '../const.js';

export const humanizeDate = (date) => dayjs(date).format('YYYY/MM/DD hh:mm');
export const humanizeDateCard = (date) => dayjs(date).format('YYYY');
export const humanizeDatePopup = (date) => dayjs(date).format('DD MMMM YYYY');
export const sortFilmByDate = (filmA, filmB) => dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
export const sortFilmByRating = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;
export const sortFilmByComments = (filmA, filmB) => filmB.comments.length - filmA.comments.length;
export const humanizeRuntime = (time) => `${Math.floor(time / MINUTES_IN_HOUR_COUNT)}h ${time % MINUTES_IN_HOUR_COUNT}m`;
export const isDateToday = (date) => dayjs(date).isToday();

export const getUserRank = (watchedFilmCount) => {
  const isNovice = watchedFilmCount > WatchedFilm.ZERO && watchedFilmCount <= WatchedFilm.MIN;
  const isFan = watchedFilmCount > WatchedFilm.MIN && watchedFilmCount <= WatchedFilm.MAX;
  const isMovieBuff = watchedFilmCount > WatchedFilm.MAX;

  if (isNovice) {
    return UserRank.NOVICE;
  } else if (isFan) {
    return UserRank.FAN;
  } else if (isMovieBuff) {
    return UserRank.MOVIE_BUFF;
  }
  return '';
};

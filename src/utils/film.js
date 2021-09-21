import dayjs from 'dayjs';
import {getRandomInteger} from './common.js';
import {ZERO_FILMS_COUNT, MIN_FILMS_COUNT, MAX_FILMS_COUNT, UserRank} from '../const.js';

export const generateDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};
export const humanizeDate = (date) => dayjs(date).format('YYYY/MM/DD hh:mm');
export const humanizeDateCard = (date) => dayjs(date).format('YYYY');
export const humanizeDatePopup = (date) => dayjs(date).format('DD MMMM YYYY');
export const sortFilmByDate = (filmA, filmB) => dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
export const sortFilmByRating = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;
export const sortFilmByComments = (filmA, filmB) => filmB.comments.length - filmA.comments.length;
export const humanizeRuntime = (time) => `${Math.floor(time / 60)}h ${time % 60}m`;
export const isDateToday = (date) => dayjs(date).isToday();

export const getUserRank = (watchedFilmCount) => {
  const isNovice = watchedFilmCount > ZERO_FILMS_COUNT && watchedFilmCount <= MIN_FILMS_COUNT;
  const isFan = watchedFilmCount > MIN_FILMS_COUNT && watchedFilmCount <= MAX_FILMS_COUNT;
  const isMovieBuff = watchedFilmCount > MAX_FILMS_COUNT;

  if (isNovice) {
    return UserRank.NOVICE;
  } else if (isFan) {
    return UserRank.FAN;
  } else if (isMovieBuff) {
    return UserRank.MOVIE_BUFF;
  }
  return '';
};

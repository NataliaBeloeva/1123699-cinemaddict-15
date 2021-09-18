import dayjs from 'dayjs';
import {getRandomInteger} from './common.js';

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


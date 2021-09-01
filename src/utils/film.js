import dayjs from 'dayjs';

export const humanizeDate = (date) => dayjs(date).format('YYYY/MM/DD hh:mm');
export const humanizeDateCard = (date) => dayjs(date).format('YYYY');
export const humanizeDatePopup = (date) => dayjs(date).format('DD MMMM YYYY');
export const sortFilmByDate = (filmA, filmB) => dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
export const sortFilmByRating = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;

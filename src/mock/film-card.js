import dayjs from 'dayjs';
import {getRandomInteger, getRandomFloatInteger, getRandomUniqueInteger, getRandomArrayElement, shuffleArray} from '../utils/common.js';
import {humanizeDate} from '../utils/film.js';


const COMMENTS_AMOUNT = 5;

const FILM_TITLES = [
  'Made for each other',
  'Popeye meets Sinbad',
  'Sagebrush trail',
  'Santa Claus conquers the Martians',
  'The dance of life',
  'The greate flamarion',
  'The man with the golden arm',
];

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const AUTHORS = [
  'Лиза',
  'Виталик',
  'Рамзес',
  'Палеослав',
  'Гертруда',
  'Викториан',
  'Галина',
  'Натали',
];

const MESSAGES = [
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',
];

const AGE = [6, 12, 16, 18];

const DIRECTORS = [
  'Steven Spielberg',
  'James Cameron',
  'Martin Scorsese',
  'Quentin Tarantino',
  'Christopher Nolan',
  'David O. Russell',
  'David Fincher',
  'Peter Jackson',
  'Tim Burton',
];

const WRITERS = [
  'Charlie Kaufman',
  'Satyajit Ray',
  'Stanley Kubrick',
  'Quentin Tarantino',
  'Francis Coppola',
  'Aaron Sorkin',
  'Oliver Stone',
];

const ACTORS = [
  'Tom Hanks',
  'Johnny Depp',
  'Leonardo DiCaprio',
  'Dwayne Johnson',
  'Chris Hemsworth',
  'Tom Cruise',
  'Will Smith',
  'Jackie Chan',
  'Robert Downey Jr.',
  'Morgan Freeman',
];

const COUNTRIES = [
  'USA',
  'France',
  'Spain',
  'Russian',
  'Southern Korea',
  'Argentina',
  'China',
  'Japan',
  'Norway',
];

const GENRES = [
  'Musical',
  'Comedy',
  'Mysteria',
  'Drama',
  'Western',
  'Cartoon',
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const days = {
  MIN: 1,
  MAX: 28,
};

const filmDescriptionCount = {
  MIN: 1,
  MAX: 5,
};

const filmWritersCount = {
  MIN: 1,
  MAX: 3,
};

const filmActorsCount = {
  MIN: 1,
  MAX: 3,
};

const filmGenresCount = {
  MIN: 1,
  MAX: 3,
};

const filmRating = {
  MIN: 4,
  MAX: 9,
};

const filmYear = {
  MIN: 1920,
  MAX: 2021,
};

const filmDuration = {
  hours: {
    MIN: 0,
    MAX: 3,
  },
  minutes: {
    MIN: 0,
    MAX: 59,
  },
};

const generateDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

const generateComment = () => {
  const date = generateDate();
  return {
    id: getRandomUniqueInteger(0, 1000),
    author: getRandomArrayElement(AUTHORS),
    comment: getRandomArrayElement(MESSAGES),
    date: humanizeDate(date),
    emotion: getRandomArrayElement(EMOTIONS),
  };
};

const generateCard = (idx) => {
  const descriptions = shuffleArray(DESCRIPTIONS).slice(0, getRandomInteger (filmDescriptionCount.MIN, filmDescriptionCount.MAX));
  const writers = shuffleArray(WRITERS).slice(0, getRandomInteger (filmWritersCount.MIN, filmWritersCount.MAX));
  const actors = shuffleArray(ACTORS).slice(0, getRandomInteger (filmActorsCount.MIN, filmActorsCount.MAX));
  const genres = shuffleArray(GENRES).slice(0, getRandomInteger (filmGenresCount.MIN, filmGenresCount.MAX));
  const comments = new Array(getRandomInteger(0, COMMENTS_AMOUNT)).fill(null).map(generateComment);
  const date = generateDate();

  return {
    id: idx,
    comments: comments,
    filmInfo: {
      title: getRandomArrayElement(FILM_TITLES),
      alternativeTitle: getRandomArrayElement(FILM_TITLES),
      totalRating: getRandomFloatInteger(filmRating.MIN, filmRating.MAX),
      poster: getRandomArrayElement(POSTERS),
      ageRating: getRandomArrayElement(AGE),
      director: getRandomArrayElement(DIRECTORS),
      writers: writers.join(', '),
      actors: actors.join(', '),
      release: {
        date: `${getRandomInteger(days.MIN, days.MAX)} ${getRandomArrayElement(MONTHS)} ${getRandomInteger(filmYear.MIN, filmYear.MAX)}`,
        releaseCountry: getRandomArrayElement(COUNTRIES),
      },
      runtime: `${getRandomInteger(filmDuration.hours.MIN, filmDuration.hours.MAX)}h ${getRandomInteger(filmDuration.minutes.MIN, filmDuration.minutes.MAX)}m`,
      genre: genres,
      description: descriptions.join(' '),
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      alreadyWatched: Boolean(getRandomInteger(0, 1)),
      watchingDate: date,
      favorite: Boolean(getRandomInteger(0, 1)),
    },
  };
};

export {generateCard};

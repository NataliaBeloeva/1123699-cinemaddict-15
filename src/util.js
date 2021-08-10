import dayjs from 'dayjs';

const PlaceTypes = {
  BEFORE: 'beforeend',
  AFTER: 'afterend',
};

const render = (container, template, place = PlaceTypes.BEFORE) => container.insertAdjacentHTML(place, template);

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomFloatInteger = (a, b) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);

  return (lower + Math.random() * (upper - lower + 1)).toFixed(1);
};

const getRandomUniqueInteger = (min, max) => {
  const previousValues = [];
  let currentValue = getRandomInteger(min, max);
  if (previousValues.length >= (max - min + 1)) {
    throw new Error(`Перебраны все числа из диапазона от ${min} до ${max}`);
  }
  while (previousValues.includes(currentValue)) {
    currentValue = getRandomInteger(min, max);
  }
  previousValues.push(currentValue);
  return currentValue;
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const shuffleArray = (elements) => elements.sort(() => 0.5 - Math.random());

const humanizeDate = (date) => dayjs(date).format('YYYY/MM/DD hh:mm');

export {PlaceTypes, render, getRandomInteger, getRandomFloatInteger, getRandomUniqueInteger, getRandomArrayElement, shuffleArray, humanizeDate};

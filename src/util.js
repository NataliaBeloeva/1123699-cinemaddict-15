import dayjs from 'dayjs';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloatInteger = (a, b) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);

  return (lower + Math.random() * (upper - lower + 1)).toFixed(1);
};

export const getRandomUniqueInteger = (min, max) => {
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

export const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

export const shuffleArray = (elements) => elements.sort(() => 0.5 - Math.random());

export const humanizeDate = (date) => dayjs(date).format('YYYY/MM/DD hh:mm');

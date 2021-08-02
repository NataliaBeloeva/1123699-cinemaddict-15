const PlaceTypes = {
  BEFORE: 'beforeend',
  AFTER: 'afterend',
};

const render = (container, template, place = PlaceTypes.BEFORE) => container.insertAdjacentHTML(place, template);

export {PlaceTypes, render};

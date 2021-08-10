const isActiveClassName = (condition) => condition ? 'sort__button--active' : '';

const createSortItemTemplate = (type, isActive) => (
  `<li><a href="#" class="sort__button ${isActiveClassName(isActive)}">Sort by ${type}</a></li>`
);

const createSortTemplate = (types, activeType) => {
  const sortItemsTemplate = types.map((type) => createSortItemTemplate(type, type === activeType)).join('');

  return `<ul class="sort">${sortItemsTemplate}</ul>`;
};

export {createSortTemplate};

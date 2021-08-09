const filterTitles = {
  all: 'All Movies',
  watchlist: 'Watchlist',
  alreadyWatched: 'History',
  favorite: 'Favorites',
};

const isActiveClassName = (condition) => condition ? 'main-navigation__item--active' : '';

const createFilterCountTemplate = (count) => `<span class="main-navigation__item-count">${count}</span>`;

const createFilterItemTemplate = (filter, isActive) => {
  const {name, count} = filter;
  return `<a href="#${name}" class="main-navigation__item ${isActiveClassName(isActive)}">${filterTitles[name]}${name !== 'all' ? createFilterCountTemplate(count) : ''}</a>`;
};


const createMenuTemplate = (filterItems, activeFilter) => {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, filter.name === activeFilter)).join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export {createMenuTemplate};

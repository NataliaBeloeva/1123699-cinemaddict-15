const filmToFilterMap = {
  all: (films) => films.length,
  watchlist: (films) => films.filter((film) => film.userDetails.watchlist).length,
  alreadyWatched: (films) => films.filter((film) => film.userDetails.alreadyWatched).length,
  favorite: (films) => films.filter((film) => film.userDetails.favorite).length,
};

const generateFilter = (films) => Object.entries(filmToFilterMap).map(
  ([filterName, countTasks]) => ({
    name: filterName,
    count: countTasks(films),
  }),
);

export {generateFilter};

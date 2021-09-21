import AbstractObserver from '../utils/abstract-observer.js';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  setComments(comments) {
    this._films.comments = comments;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, update, filmUpdated) {
    const filmIndex = this._films.findIndex((film) => film.id === filmUpdated.id);
    const commentIndex = this._films[filmIndex].comments.findIndex((comment) => comment === update);

    if (commentIndex === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._films[filmIndex].comments = [
      ...this._films[filmIndex].comments.slice(0, commentIndex),
      ...this._films[filmIndex].comments.slice(commentIndex + 1),
    ];

    this._notify(updateType, this._films[filmIndex]);
  }

  addComment(updateType, update) {
    const filmIndex = this._films.findIndex((film) => film.id === update.movie.id);
    const updatedComments = update.movie.comments;

    if (filmIndex === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films[filmIndex].comments = updatedComments;
    this._notify(updateType, this._films[filmIndex]);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        id: film.id,
        comments: film.comments,
        filmInfo: {
          title: film['film_info']['title'],
          alternativeTitle: film['film_info']['alternative_title'],
          totalRating: film['film_info']['total_rating'],
          poster: film['film_info']['poster'],
          ageRating: film['film_info']['age_rating'],
          director: film['film_info']['director'],
          writers: film['film_info']['writers'],
          actors: film['film_info']['actors'],
          release: {
            date: film['film_info']['release']['date'] !== null ? new Date(film['film_info']['release']['date']) : film['film_info']['release']['date'],
            releaseCountry: film['film_info']['release']['release_country'],
          },
          runtime: film['film_info']['runtime'],
          genre: film['film_info']['genre'],
          description: film['film_info']['description'],
        },
        userDetails: {
          watchlist: film['user_details']['watchlist'],
          alreadyWatched: film['user_details']['already_watched'],
          watchingDate: film['user_details']['watching_date'] !== null ? new Date(film['user_details']['watching_date']) : film['user_details']['watching_date'],
          favorite: film['user_details']['favorite'],
        },
      },
    );

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'id': film.id,
        'comments': film.comments,
        'film_info': {
          'title': film.filmInfo.title,
          'alternative_title': film.filmInfo.alternativeTitle,
          'total_rating': film.filmInfo.totalRating,
          'poster': film.filmInfo.poster,
          'age_rating': film.filmInfo.ageRating,
          'director': film.filmInfo.director,
          'writers': film.filmInfo.writers,
          'actors': film.filmInfo.actors,
          'release': {
            'date': film.filmInfo.release.date instanceof Date ? film.filmInfo.release.date.toISOString() : null,
            'release_country': film.filmInfo.release.releaseCountry,
          },
          'runtime': film.filmInfo.runtime,
          'genre': film.filmInfo.genre,
          'description': film.filmInfo.description,
        },
        'user_details': {
          'watchlist': film.userDetails.watchlist,
          'already_watched': film.userDetails.alreadyWatched,
          'watching_date': film.userDetails.watchingDate instanceof Date ? film.userDetails.watchingDate.toISOString() : null,
          'favorite': film.userDetails.favorite,
        },
      },
    );
    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;

    return adaptedFilm;
  }
}

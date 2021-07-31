import {createFilmCardTemplate} from './film-card.js';

const createFilmsTitleTemplate = () => (
  '<h2 class="films-list__title">Top rated</h2>'
);

const createFilmsExtraTemplate = () => (
  `<section class="films-list films-list--extra">
    ${createFilmsTitleTemplate()}
    <div class="films-list__container">
      ${createFilmCardTemplate()}
      ${createFilmCardTemplate()}
    </div>
  </section>`
);

export {createFilmsExtraTemplate};


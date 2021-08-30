import AbstractView from './abstract.js';

const createFilmsContainerTemplate = () => '<div class="films-list__container"></div>';

export default class FilmsContainer extends AbstractView {
  getTemplate() {
    return createFilmsContainerTemplate();
  }
}

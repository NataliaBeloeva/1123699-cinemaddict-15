import {render} from './util.js';
import {createMenuTemplate} from './view/menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createFilmsTemplate} from './view/films.js';
import {createProfileTemplate} from './view/profile.js';
import {createPopupTemplate} from './view/popup.js';
import {createFilmsAmountTemplate} from './view/stats.js';

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerElement = document.querySelector('.footer');
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

render(mainElement, createMenuTemplate(), 'beforeend');
render(mainElement, createFilterTemplate(), 'beforeend');
render(mainElement, createFilmsTemplate(), 'beforeend');
render(headerElement, createProfileTemplate(), 'beforeend');
render(footerElement, createPopupTemplate(), 'afterend');
render(footerStatisticsElement, createFilmsAmountTemplate(), 'beforeend');

import SmartView from './smart.js';
import dayjs from 'dayjs';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getFilmGenres, makeItemsUnique, getGenresSorted, getFilmsInPeriod, getTotalDuration} from '../utils/stats.js';
import {StatsPeriod} from '../const.js';
import {getUserRank} from '../utils/film.js';

const BAR_HEIGHT = 50;

const renderGenresChart = (genresCtx, films) => {
  const filmGenres = getFilmGenres(films);
  const uniqueGenres = makeItemsUnique(filmGenres);
  const genresSorted = getGenresSorted(uniqueGenres, filmGenres);

  genresCtx.height = BAR_HEIGHT * uniqueGenres.length;

  return new Chart(genresCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genresSorted.labels,
      datasets: [{
        data: genresSorted.data,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatsTemplate = (data) => {
  const {films, dateFrom, dateTo} = data;
  const rating = getUserRank(data.films.length);
  const filmsInPeriod = getFilmsInPeriod(dateFrom, dateTo, films);
  const watchedFilmCount = filmsInPeriod.length;
  const totalDuration = getTotalDuration(filmsInPeriod);
  const filmGenres = getFilmGenres(filmsInPeriod);
  const uniqueGenres = makeItemsUnique(filmGenres);
  const genresSorted = getGenresSorted(uniqueGenres, filmGenres);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rating}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalDuration.hours} <span class="statistic__item-description">h</span> ${totalDuration.minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        ${filmsInPeriod.length ? `<p class="statistic__item-text">${genresSorted.labels[0]}</p>` : ''}
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class Stats extends SmartView {
  constructor(films) {
    super();

    this._films = films.filter((film) => film.userDetails.alreadyWatched === true);

    this._data = {
      films: this._films,
      dateFrom: (() => {
        const defaultDateFrom = StatsPeriod.ALLTIME;
        return dayjs().subtract(defaultDateFrom, 'day').toDate();
      })(),
      dateTo: dayjs().toDate(),
      check: 'all-time',
    };

    this._chart = null;
    this._rangeChangeHandler = this._rangeChangeHandler.bind(this);

    this._setCharts();
    this._setInnerHandlers();
  }

  removeElement() {
    super.removeElement();
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  _setCharts() {
    if (this._chart !== null) {
      this._chart = null;
    }

    const {films, dateFrom, dateTo, check} = this._data;

    Array.from(this.getElement().querySelector('.statistic__filters').children)
      .find((child) => child.value === check).checked = true;

    const filmsInPeriod = getFilmsInPeriod(dateFrom, dateTo, films);
    const genresCtx = this.getElement().querySelector('.statistic__chart');

    this._chart = renderGenresChart(genresCtx, filmsInPeriod);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._rangeChangeHandler);
  }

  restoreHandlers() {
    this._setCharts();
    this._setInnerHandlers();
  }

  _rangeChangeHandler(evt) {
    const data = new FormData(evt.currentTarget);
    const dateFrom = this._getStatsPeriod(data.get('statistic-filter'));
    if (!dateFrom) {
      return;
    }

    if (dateFrom === 0) {
      this.updateData({
        dateFrom: dayjs().toDate(),
      });
    }
    this.updateData({
      dateFrom: (() => dayjs().subtract(dateFrom, 'day').toDate())(),
      check: evt.target.value,
    });
  }

  _getStatsPeriod(period) {
    switch (period) {
      case 'today':
        return StatsPeriod.TODAY;
      case 'week':
        return StatsPeriod.WEEK;
      case 'month':
        return StatsPeriod.MOUNTH;
      case 'year':
        return StatsPeriod.YEAR;
      case 'all-time':
        return StatsPeriod.ALLTIME;
    }
  }

}

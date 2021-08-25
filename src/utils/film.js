import dayjs from 'dayjs';

export const humanizeDate = (date) => dayjs(date).format('YYYY/MM/DD hh:mm');

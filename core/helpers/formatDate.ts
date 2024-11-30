import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export function formatDate(
  date: Date | string | null,
  format = 'YYYY-MM-DD HH:mm'
) {
  if (!date) {
    return '-';
  }

  return dayjs(date).format(format);
}

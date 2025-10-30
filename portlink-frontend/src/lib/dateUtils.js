export function formatDate(date, locale = 'vi-VN') {
  if (!date) return '';
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isWithinRange(date, start, end) {
  const value = new Date(date).getTime();
  const startValue = new Date(start).getTime();
  const endValue = new Date(end).getTime();
  if ([value, startValue, endValue].some(Number.isNaN)) return false;
  return value >= startValue && value <= endValue;
}

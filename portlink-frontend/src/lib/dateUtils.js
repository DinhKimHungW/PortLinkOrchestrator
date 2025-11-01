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

export function formatDuration(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if ([startDate, endDate].some((value) => Number.isNaN(value.getTime()))) return '';
  const diffMs = Math.max(0, endDate.getTime() - startDate.getTime());
  const totalMinutes = Math.round(diffMs / 60000);
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

export const formatNumber = value => (value || 0).toLocaleString('en-US');

const UNITS = [
  ['year', 31536000],
  ['month', 2592000],
  ['week', 604800],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
];

const relativeTimeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export const formatRelativeTime = (isoDate, now = Date.now()) => {
  const time = new Date(isoDate).getTime();
  if (!isoDate || Number.isNaN(time)) {
    return null;
  }
  const seconds = Math.round((time - now) / 1000);
  const match = UNITS.find(([, unitSeconds]) => Math.abs(seconds) >= unitSeconds);
  return match
    ? relativeTimeFormat.format(Math.round(seconds / match[1]), match[0])
    : 'just now';
};

export const formatNumber = value => (value || 0).toLocaleString('en-US');

// Seconds per unit. Months and years are approximate (30 and 365 days).
const UNITS = [
  ['year', 31536000],
  ['month', 2592000],
  ['week', 604800],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
];

const relativeTimeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

/**
 * Formats a date as relative time, for example "3 days ago".
 * @param {string} isoDate - Date in ISO 8601 format, as Algolia sends it.
 * @param {number} [now=Date.now()] - Reference time in milliseconds. Useful in tests.
 * @returns {string|null} null if the date is missing or invalid.
 */
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

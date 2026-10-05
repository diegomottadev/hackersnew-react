import { SORT_KEYS } from '../constants/sorts';

/**
 * Reads the search and sort state from a query string like "?q=react&sort=points&reverse=1".
 * Unknown sort values fall back to NONE, so a bad link still opens the app.
 * @param {string} search - Usually window.location.search.
 * @returns {{query: string|null, sortKey: string, isSortReverse: boolean}} query is null if the URL has no "q".
 */
export const readUrlState = search => {
  const params = new URLSearchParams(search);
  const sortParam = (params.get('sort') || '').toUpperCase();
  const sortKey = SORT_KEYS.includes(sortParam) ? sortParam : 'NONE';
  return {
    query: params.get('q'),
    sortKey,
    isSortReverse: sortKey !== 'NONE' && params.get('reverse') === '1',
  };
};

/**
 * Builds the query string for the current state. Default values are left out to keep links short.
 * @returns {string} For example "?q=react&sort=points".
 */
export const buildUrlSearch = ({ query, sortKey, isSortReverse }) => {
  const params = new URLSearchParams({ q: query });
  if (sortKey !== 'NONE') {
    params.set('sort', sortKey.toLowerCase());
  }
  if (isSortReverse) {
    params.set('reverse', '1');
  }
  return `?${params.toString()}`;
};

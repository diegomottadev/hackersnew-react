import { SORTS } from '../constants/sorts';

/**
 * Returns the list in the requested order. The original array is never changed.
 * @param {Object[]} list - Stories to sort.
 * @param {string} sortKey - A key from SORTS.
 * @param {boolean} isSortReverse - Flips the natural order of the sort.
 * @returns {Object[]}
 */
export const sortStories = (list, sortKey, isSortReverse) => {
  const sortedList = SORTS[sortKey](list);
  return isSortReverse
    ? [...sortedList].reverse()
    : sortedList;
};

/**
 * Tells which way a sort option shows the list right now, so the UI can pick the arrow.
 * @returns {'ascending'|'descending'|'none'} 'none' if the option isn't the active one.
 */
export const getSortDirection = (option, activeSortKey, isSortReverse) => {
  if (option.sortKey !== activeSortKey) {
    return 'none';
  }
  return option.isDescending !== isSortReverse ? 'descending' : 'ascending';
};

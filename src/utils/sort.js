import { SORTS } from '../constants/sorts';

export const sortStories = (list, sortKey, isSortReverse) => {
  const sortedList = SORTS[sortKey](list);
  return isSortReverse
    ? [...sortedList].reverse()
    : sortedList;
};

// Sentido en que se ve ordenada una opción: 'ascending', 'descending' o 'none' si no está activa.
export const getSortDirection = (option, activeSortKey, isSortReverse) => {
  if (option.sortKey !== activeSortKey) {
    return 'none';
  }
  return option.isDescending !== isSortReverse ? 'descending' : 'ascending';
};

import { sortBy } from 'lodash';

export const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

export const SORT_KEYS = Object.keys(SORTS);

// Opciones de orden visibles. isDescending indica el orden natural de su SORT.
// Para agregar una, sumar su función en SORTS y su entrada acá.
export const SORT_OPTIONS = [
  { sortKey: 'TITLE', label: 'Title', isDescending: false },
  { sortKey: 'AUTHOR', label: 'Author', isDescending: false },
  { sortKey: 'COMMENTS', label: 'Comments', isDescending: true },
  { sortKey: 'POINTS', label: 'Points', isDescending: true },
];

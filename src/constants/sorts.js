import sortBy from 'lodash/sortBy';

export const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  // Comments and points show the highest values first.
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

export const SORT_KEYS = Object.keys(SORTS);

// Sort buttons shown in the UI. isDescending says if the matching SORT puts the highest values first.
// To add an option, add its function to SORTS and its entry here.
export const SORT_OPTIONS = [
  { sortKey: 'TITLE', label: 'Title', isDescending: false },
  { sortKey: 'AUTHOR', label: 'Author', isDescending: false },
  { sortKey: 'COMMENTS', label: 'Comments', isDescending: true },
  { sortKey: 'POINTS', label: 'Points', isDescending: true },
];

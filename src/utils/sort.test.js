import { describe, it, expect } from 'vitest';
import { sortStories, getSortDirection } from './sort';

const list = [
  { objectID: '1', title: 'B', author: 'zoe', points: 10, num_comments: 5 },
  { objectID: '2', title: 'A', author: 'adam', points: 30, num_comments: 1 },
  { objectID: '3', title: 'C', author: 'mia', points: 20, num_comments: 9 },
];
const ids = stories => stories.map(story => story.objectID);

describe('sortStories', () => {
  it('keeps the API order with NONE', () => {
    expect(ids(sortStories(list, 'NONE', false))).toEqual(['1', '2', '3']);
  });

  it('sorts titles A to Z', () => {
    expect(ids(sortStories(list, 'TITLE', false))).toEqual(['2', '1', '3']);
  });

  it('sorts points from highest to lowest', () => {
    expect(ids(sortStories(list, 'POINTS', false))).toEqual(['2', '3', '1']);
  });

  it('flips the order when isSortReverse is true', () => {
    expect(ids(sortStories(list, 'POINTS', true))).toEqual(['1', '3', '2']);
  });

  it('never changes the original array', () => {
    const copy = [...list];
    sortStories(list, 'NONE', true);
    sortStories(list, 'TITLE', true);
    expect(list).toEqual(copy);
  });
});

describe('getSortDirection', () => {
  const title = { sortKey: 'TITLE', isDescending: false };
  const points = { sortKey: 'POINTS', isDescending: true };

  it('returns none for an option that is not active', () => {
    expect(getSortDirection(title, 'POINTS', false)).toBe('none');
  });

  it('uses the natural order of the option', () => {
    expect(getSortDirection(title, 'TITLE', false)).toBe('ascending');
    expect(getSortDirection(points, 'POINTS', false)).toBe('descending');
  });

  it('flips the natural order when reversed', () => {
    expect(getSortDirection(title, 'TITLE', true)).toBe('descending');
    expect(getSortDirection(points, 'POINTS', true)).toBe('ascending');
  });
});

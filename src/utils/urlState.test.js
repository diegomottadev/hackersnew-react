import { describe, it, expect } from 'vitest';
import { readUrlState, buildUrlSearch } from './urlState';

describe('readUrlState', () => {
  it('reads the query, sort and reverse flag', () => {
    expect(readUrlState('?q=react&sort=points&reverse=1')).toEqual({
      query: 'react',
      sortKey: 'POINTS',
      isSortReverse: true,
    });
  });

  it('returns defaults for an empty query string', () => {
    expect(readUrlState('')).toEqual({ query: null, sortKey: 'NONE', isSortReverse: false });
  });

  it('ignores unknown sort values and reverse without a sort', () => {
    expect(readUrlState('?q=x&sort=banana&reverse=1')).toEqual({
      query: 'x',
      sortKey: 'NONE',
      isSortReverse: false,
    });
  });

  it('decodes special characters', () => {
    expect(readUrlState('?q=c%2B%2B+%26+rust').query).toBe('c++ & rust');
  });
});

describe('buildUrlSearch', () => {
  it('leaves out default sort values', () => {
    expect(buildUrlSearch({ query: 'react', sortKey: 'NONE', isSortReverse: false })).toBe('?q=react');
  });

  it('adds sort and reverse when set', () => {
    expect(buildUrlSearch({ query: 'react', sortKey: 'POINTS', isSortReverse: true }))
      .toBe('?q=react&sort=points&reverse=1');
  });

  it('gives back the same state it reads', () => {
    const state = { query: 'c++ & rust', sortKey: 'AUTHOR', isSortReverse: true };
    expect(readUrlState(buildUrlSearch(state))).toEqual(state);
  });
});

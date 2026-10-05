import { describe, it, expect, vi, afterEach } from 'vitest';
import { searchStories } from './hackerNews';

const mockFetch = response => vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(response)));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('searchStories', () => {
  it('encodes the search term and sends the page', async () => {
    mockFetch({ ok: true, json: () => Promise.resolve({ hits: [], page: 2 }) });

    await searchStories('c++ & rust', 2);

    expect(fetch).toHaveBeenCalledWith(
      'https://hn.algolia.com/api/v1/search?query=c%2B%2B%20%26%20rust&page=2&hitsPerPage=100'
    );
  });

  it('resolves with the JSON body', async () => {
    mockFetch({ ok: true, json: () => Promise.resolve({ hits: [{ objectID: '1' }], page: 0 }) });

    await expect(searchStories('react', 0)).resolves.toEqual({ hits: [{ objectID: '1' }], page: 0 });
  });

  it('rejects when the status is not 2xx', async () => {
    mockFetch({ ok: false, status: 503 });

    await expect(searchStories('react', 0)).rejects.toThrow('HTTP 503');
  });
});

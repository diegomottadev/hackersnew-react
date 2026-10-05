import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { searchStories } from '../../api/hackerNews';

vi.mock('../../api/hackerNews', () => ({
  searchStories: vi.fn(),
}));

const story = (objectID, title, points = 1) => ({
  objectID,
  title,
  points,
  author: 'pg',
  url: `https://example.com/${objectID}`,
  num_comments: 0,
  created_at: '2026-01-01T00:00:00Z',
});

// Fake API: every term has its own stories. The page number goes into the id.
const respond = (term, page) => Promise.resolve({
  hits: [story(`${term}-${page}-a`, `${term} story A`, 10), story(`${term}-${page}-b`, `${term} story B`, 30)],
  page,
});

// Lets a test decide when a request finishes.
const deferred = () => {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
};

const titles = () => screen.getAllByRole('listitem')
  .map(item => within(item).queryByRole('link', { name: /story/ }))
  .filter(Boolean)
  .map(link => link.textContent.replace(' (opens in a new tab)', ''));

const search = async (user, term) => {
  const input = screen.getByRole('searchbox', { name: 'Search stories' });
  await user.clear(input);
  await user.type(input, term);
  await user.click(screen.getByRole('button', { name: 'Search' }));
};

beforeEach(() => {
  searchStories.mockReset();
  searchStories.mockImplementation(respond);
  window.history.replaceState(null, '', '/');
});

describe('App', () => {
  it('loads the default query and writes it to the URL', async () => {
    render(<App />);

    expect(await screen.findByText('redux story A')).toBeInTheDocument();
    expect(searchStories).toHaveBeenCalledWith('redux', 0);
    expect(window.location.search).toBe('?q=redux');
  });

  it('opens the search and sort from a shared link', async () => {
    window.history.replaceState(null, '', '/?q=vue&sort=points&reverse=1');
    render(<App />);

    await screen.findByText('vue story A');
    expect(searchStories).toHaveBeenCalledWith('vue', 0);
    expect(screen.getByRole('searchbox')).toHaveValue('vue');
    expect(screen.getByRole('button', { name: /Points/ })).toHaveAttribute('aria-pressed', 'true');
    // Points sort high to low, reversed means low to high.
    expect(titles()).toEqual(['vue story A', 'vue story B']);
  });

  it('searches a new term and adds it to the browser history', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('redux story A');

    await search(user, 'c++ & rust');

    expect(await screen.findByText('c++ & rust story A')).toBeInTheDocument();
    expect(searchStories).toHaveBeenLastCalledWith('c++ & rust', 0);
    expect(window.location.search).toBe('?q=c%2B%2B+%26+rust');
  });

  it('goes back to the previous search with the back button', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('redux story A');
    await search(user, 'react');
    await screen.findByText('react story A');

    window.history.back();

    expect(await screen.findByText('redux story A')).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveValue('redux');
    // redux was cached, so going back doesn't fetch it again.
    expect(searchStories).toHaveBeenCalledTimes(2);
  });

  it('uses the cache for a term it already searched', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('redux story A');
    await search(user, 'react');
    await screen.findByText('react story A');

    await search(user, 'redux');

    expect(await screen.findByText('redux story A')).toBeInTheDocument();
    expect(searchStories).toHaveBeenCalledTimes(2);
  });

  it('sorts by points, flips on a second click and keeps it in the URL', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('redux story A');

    await user.click(screen.getByRole('button', { name: /Points/ }));
    expect(titles()).toEqual(['redux story B', 'redux story A']);
    expect(window.location.search).toBe('?q=redux&sort=points');

    await user.click(screen.getByRole('button', { name: /Points/ }));
    expect(titles()).toEqual(['redux story A', 'redux story B']);
    expect(window.location.search).toBe('?q=redux&sort=points&reverse=1');
  });

  it('dismisses a story', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('redux story A');

    await user.click(screen.getByRole('button', { name: 'Dismiss “redux story A”' }));

    expect(screen.queryByText('redux story A')).not.toBeInTheDocument();
    expect(screen.getByText('1 story')).toBeInTheDocument();
  });

  it('loads the next page and adds it to the list', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText('redux story A');

    await user.click(screen.getByRole('button', { name: 'Load more' }));

    await waitFor(() => expect(screen.getByText('4 stories')).toBeInTheDocument());
    expect(searchStories).toHaveBeenLastCalledWith('redux', 1);
  });

  it('shows an error and retries', async () => {
    const user = userEvent.setup();
    searchStories.mockImplementationOnce(() => Promise.reject(new Error('HTTP 503')));
    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong');
    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('redux story A')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps a slow response under the term that asked for it', async () => {
    const user = userEvent.setup();
    const slowRedux = deferred();
    searchStories.mockImplementationOnce(() => slowRedux.promise);
    render(<App />);

    await search(user, 'react');
    await screen.findByText('react story A');
    slowRedux.resolve({ hits: [story('late', 'late redux story')], page: 0 });

    // The late redux answer must not replace the react results on screen.
    await waitFor(() => expect(titles()).toEqual(['react story A', 'react story B']));
    await search(user, 'redux');
    expect(await screen.findByText('late redux story')).toBeInTheDocument();
  });
});

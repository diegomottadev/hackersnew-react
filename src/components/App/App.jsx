import React, { Component } from 'react';
import Header from '../Header';
import StoryList from '../StoryList';
import Button from '../Button';
import ErrorAlert from '../ErrorAlert';
import withSearch from '../../hocs/withSearch';
import withLoading from '../../hocs/withLoading';
import { searchStories } from '../../api/hackerNews';
import { DEFAULT_QUERY, DEFAULT_PAGE } from '../../constants/search';
import { readUrlState, buildUrlSearch } from '../../utils/urlState';
import './App.css';

const StoryListWithSearch = withSearch(StoryList);
const ButtonWithLoading = withLoading(Button);

class App extends Component {
  constructor(props) {
    super(props);
    // The URL decides the first search and sort, so shared links open the same view.
    const { query, sortKey, isSortReverse } = readUrlState(window.location.search);
    this.state = {
      // Cache of results per search term: { [term]: { hits, page } }.
      results: null,
      // searchKey is the term that was submitted. searchTerm is what's in the input right now.
      searchKey: '',
      searchTerm: query === null ? DEFAULT_QUERY : query,
      isLoading: false,
      sortKey,
      isSortReverse,
      error: null,
    };
    this.needsToFetch = this.needsToFetch.bind(this);
    this.setStories = this.setStories.bind(this);
    this.fetchStories = this.fetchStories.bind(this);
    this.fetchNextPage = this.fetchNextPage.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSort = this.onSort.bind(this);
    this.onPopState = this.onPopState.bind(this);
    this.updateUrl = this.updateUrl.bind(this);
  }

  // Writes the state to the URL. setState is async, so callers pass the new values in changes.
  // method is 'pushState' for a new history entry, or 'replaceState' to change the current one.
  updateUrl(method, changes) {
    const { searchKey, sortKey, isSortReverse } = { ...this.state, ...changes };
    const search = buildUrlSearch({ query: searchKey, sortKey, isSortReverse });
    if (search !== window.location.search) {
      window.history[method](null, '', search);
    }
  }

  // Runs when the user goes back or forward in the browser history.
  onPopState() {
    const { query, sortKey, isSortReverse } = readUrlState(window.location.search);
    const searchTerm = query === null ? DEFAULT_QUERY : query;
    this.setState({ searchTerm, searchKey: searchTerm, sortKey, isSortReverse });
    if (this.needsToFetch(searchTerm)) {
      this.fetchStories(searchTerm, DEFAULT_PAGE);
    }
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
    // Sorting changes the current entry, so the back button doesn't step through every click.
    this.updateUrl('replaceState', { sortKey, isSortReverse });
  }

  needsToFetch(searchTerm) {
    const { results } = this.state;
    return !results || !results[searchTerm];
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.updateUrl('pushState', { searchKey: searchTerm });
    if (this.needsToFetch(searchTerm)) {
      this.fetchStories(searchTerm, DEFAULT_PAGE);
    }
    event.preventDefault();
  }

  // Uses prevState so two quick dismisses don't overwrite each other.
  onDismiss(id) {
    this.setState(prevState => {
      const { searchKey, results } = prevState;
      const { hits, page } = results[searchKey];
      const isNotId = item => item.objectID !== id;
      return {
        results: {
          ...results,
          [searchKey]: { hits: hits.filter(isNotId), page }
        }
      };
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  // Saves the response under the term that asked for it. If we used the current searchKey,
  // a slow response could overwrite the results of a newer search.
  setStories(result, searchKey) {
    const { hits, page } = result;
    this.setState(prevState => {
      const { results } = prevState;
      const oldHits = results && results[searchKey]
        ? results[searchKey].hits
        : [];
      return {
        results: {
          ...results,
          [searchKey]: { hits: [...oldHits, ...hits], page }
        },
        isLoading: false,
        error: null,
      };
    });
  }

  fetchStories(searchTerm, page) {
    this.setState({ isLoading: true, error: null });
    searchStories(searchTerm, page)
      .then(result => this._isMounted && this.setStories(result, searchTerm))
      .catch(error => this._isMounted && this.setState({ error, isLoading: false }));
  }

  // Fetches the next page of the active term, or the first page if there are no results yet.
  // Both "Load more" and "Retry" use it.
  fetchNextPage() {
    const { searchKey, results } = this.state;
    const cached = results && results[searchKey];
    this.fetchStories(searchKey, cached ? cached.page + 1 : DEFAULT_PAGE);
  }

  componentDidMount() {
    // Responses can arrive after the component unmounts. This flag stops setState in that case.
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.updateUrl('replaceState', { searchKey: searchTerm });
    this.fetchStories(searchTerm, DEFAULT_PAGE);
    window.addEventListener('popstate', this.onPopState);
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('popstate', this.onPopState);
  }

  render() {
    const {
      searchTerm,
      results,
      searchKey,
      isLoading,
      sortKey,
      isSortReverse,
      error
    } = this.state;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return (
      <main className="page">
        <Header />
        <StoryListWithSearch
          value={searchTerm}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}
          list={list}
          isLoading={isLoading}
          onDismiss={this.onDismiss}
          sortKey={sortKey}
          onSort={this.onSort}
          isSortReverse={isSortReverse}
        />
        {error &&
          <ErrorAlert onRetry={this.fetchNextPage}>
            Something went wrong while loading stories.
          </ErrorAlert>
        }
        {list.length > 0 &&
          <div className="load-more">
            <ButtonWithLoading
              isLoading={isLoading}
              onClick={this.fetchNextPage}
            >
              Load more
            </ButtonWithLoading>
          </div>
        }
      </main>
    );
  }
}

export default App;

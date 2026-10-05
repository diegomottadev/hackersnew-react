import React, { Component } from 'react';
import Header from '../Header';
import StoryList from '../StoryList';
import Button from '../Button';
import ErrorAlert from '../ErrorAlert';
import withSearch from '../../hocs/withSearch';
import withLoading from '../../hocs/withLoading';
import { searchStories } from '../../api/hackerNews';
import { DEFAULT_QUERY, DEFAULT_PAGE } from '../../constants/search';
import './App.css';

const StoryListWithSearch = withSearch(StoryList);
const ButtonWithLoading = withLoading(Button);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
      sortKey: 'NONE',
      isSortReverse: false,
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
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  needsToFetch(searchTerm) {
    const { results } = this.state;
    return !results || !results[searchTerm];
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToFetch(searchTerm)) {
      this.fetchStories(searchTerm, DEFAULT_PAGE);
    }
    event.preventDefault();
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  //metodo que se ejecuta al escribir en el input
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  // Guarda la respuesta bajo el término que se pidió, no bajo el searchKey actual,
  // para que una respuesta lenta no pise los resultados de otra búsqueda.
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

  // Pide la página siguiente del término activo, o la primera si todavía no hay resultados.
  // Sirve tanto para "Load more" como para reintentar después de un error.
  fetchNextPage() {
    const { searchKey, results } = this.state;
    const cached = results && results[searchKey];
    this.fetchStories(searchKey, cached ? cached.page + 1 : DEFAULT_PAGE);
  }

  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchStories(searchTerm, DEFAULT_PAGE);
  }

  componentWillUnmount() {
    this._isMounted = false;
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

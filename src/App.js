import React, { Component } from 'react';
import './App.css';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { searchStories } from './api';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

// Columnas ordenables de la tabla. isDescending indica el orden natural de su SORT.
const COLUMNS = [
  { sortKey: 'TITLE', label: 'Title', width: '40%', isDescending: false, render: item => <a href={item.url}>{item.title}</a> },
  { sortKey: 'AUTHOR', label: 'Author', width: '30%', isDescending: false, render: item => item.author },
  { sortKey: 'COMMENTS', label: 'Comments', width: '10%', isDescending: true, render: item => item.num_comments },
  { sortKey: 'POINTS', label: 'Points', width: '10%', isDescending: true, render: item => item.points },
];
const ARCHIVE_WIDTH = '10%';

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
    this.setState({ isLoading: true });
    searchStories(searchTerm, page)
      .then(result => this._isMounted && this.setStories(result, searchTerm))
      .catch(error => this._isMounted && this.setState({ error, isLoading: false }));
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

    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
    ) || 0;
    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return (
      <div className="page">
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
          <br />
          {error && <p>Something went wrong.</p>}
          <TableWithSearch
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
            list={list}
            onDismiss={this.onDismiss}
            sortKey={sortKey}
            onSort={this.onSort}
            isSortReverse={isSortReverse}
          />
        </div>
      </div>
    );
  }
}

const Sort = ({
  sortKey,
  activeSortKey,
  onSort,
  isSortReverse,
  isDescending,
  children
}) => {
  const isActive = sortKey === activeSortKey;
  const sortClass = classNames(
    'button-inline',
    { 'button-active': isActive }
  );
  const isShownDescending = isDescending !== isSortReverse;
  return (
    <div>
      {isActive && <FontAwesomeIcon icon={isShownDescending ? faArrowDown : faArrowUp} />}
      <Button
        onClick={() => onSort(sortKey)}
        className={sortClass}
      >
        {children}
      </Button>
    </div>
  );
}

Sort.propTypes = {
  sortKey: PropTypes.string.isRequired,
  activeSortKey: PropTypes.string.isRequired,
  onSort: PropTypes.func.isRequired,
  isSortReverse: PropTypes.bool.isRequired,
  isDescending: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

//Componente funcional
const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

//Componente funcional
const Table = ({
  list,
  onDismiss,
  isSortReverse,
  sortKey,
  onSort,
}) => {
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse
    ? [...sortedList].reverse()
    : sortedList;
  return (
    <div className="table">
      <div className="table-header">
        {COLUMNS.map(column =>
          <span key={column.sortKey} style={{ width: column.width }}>
            <Sort
              sortKey={column.sortKey}
              onSort={onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
              isDescending={column.isDescending}
            >
              {column.label}
            </Sort>
          </span>
        )}
        <span style={{ width: ARCHIVE_WIDTH }}>
          Archive
        </span>
      </div>
      {reverseSortedList.map(item =>
        <div key={item.objectID} className="table-row">
          {COLUMNS.map(column =>
            <span key={column.sortKey} style={{ width: column.width }}>
              {column.render(item)}
            </span>
          )}
          <span style={{ width: ARCHIVE_WIDTH }}>
            <Button onClick={() => onDismiss(item.objectID)}>
              Dismiss
            </Button>
          </span>
        </div>
      )}
    </div>
  );
}

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      title: PropTypes.string,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
  sortKey: PropTypes.oneOf(Object.keys(SORTS)).isRequired,
  onSort: PropTypes.func.isRequired,
  isSortReverse: PropTypes.bool.isRequired,
};

const getDisplayName = Component => Component.displayName || Component.name || 'Component';

// HOC: antepone un formulario de búsqueda al componente.
const withSearch = (Component) => {
  const WithSearch = ({ value, onChange, onSubmit, ...rest }) =>
    <div>
      <Search
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
      >
        Search
      </Search>
      <Component {...rest} />
    </div>;
  WithSearch.displayName = `withSearch(${getDisplayName(Component)})`;
  WithSearch.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };
  return WithSearch;
}
const TableWithSearch = withSearch(Table);

//Componente funcional
const Button = ({
  onClick,
  className = '',
  children,
}) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const Loading = () =>
  <div>
    <FontAwesomeIcon icon={faSpinner} color="#ddd" spin />
  </div>

// HOC: muestra un spinner en lugar del componente mientras isLoading es true.
const withLoading = (Component) => {
  const WithLoading = ({ isLoading, ...rest }) =>
    isLoading
      ? <Loading />
      : <Component {...rest} />;
  WithLoading.displayName = `withLoading(${getDisplayName(Component)})`;
  WithLoading.propTypes = {
    isLoading: PropTypes.bool.isRequired,
  };
  return WithLoading;
}
const ButtonWithLoading = withLoading(Button);

export default App;

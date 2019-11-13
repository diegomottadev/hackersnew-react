import React, { Component } from 'react';
import './App.css';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '100';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};
//cadenas de textos en ES6

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log(url)
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
    };
    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  needsToSearchTopstories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    console.log(searchTerm)
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopstories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
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
  //E6
  isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

  //metodo que se ejecuta al escribir en el input
  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  }
  setSearchTopStories(result) {
    //console.log(result)
    //this.setState({ result });

    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];
    const updatedHits = [
      ...oldHits,
      ...hits
    ];
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      },
      isLoading: false,
    });

  }

  fetchSearchTopStories(searchTerm, page) {

    this.setState({ isLoading: true });
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`).then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
  }


  render() {
    const {
      searchTerm,
      results,
      searchKey,
      isLoading,
      sortKey,
      isSortReverse
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

    //if (!result) { return null; }
    // onDismiss={this.onDismiss}
    return (
      <div className="page">
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
          <br />
          {list
            ? <ListWithSearch
              value={searchTerm}
              onChange={this.onSearchChange}
              onSubmit={this.onSearchSubmit}
              list={list}
              pattern={searchTerm}
              onDismiss={this.onDismiss}
              sortKey={sortKey}
              onSort={this.onSort}
              isSortReverse={isSortReverse}
            ></ListWithSearch>
            : null
          }
        </div>
      </div >
    );
  }
}

const Sort = ({
  sortKey,
  activeSortKey,
  onSort,
  children,
  reverse
}) => {
  //importar el paquete npn classesname para definir con clases condicionales
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  );
  return (<div>
    {
      sortKey === activeSortKey && reverse?  <FontAwesomeIcon icon="arrow-down"/> :  <FontAwesomeIcon icon="arrow-up"/>
    }
   
    <Button
      onClick={() => onSort(sortKey)}
      className={sortClass}
    >
      {children}
    </Button>
  </div>

  );
}

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

//Search.propTypes = {
//value: PropTypes.any.isRequired,
//children: PropTypes.any.isRequired,
//onChange: PropTypes.any.isRequired,
//onSubmit: PropTypes.any.isRequired,
//};

//Componente funcional
const Table = ({
  list,
  pattern,
  onDismiss,
  isSortReverse,
  sortKey,
  onSort, }) => {
  const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
  //<!--filter(isSearched(pattern))-->
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse
    ? sortedList.reverse()
    : sortedList;
  return (
    <div className="table">
      <div className="table-header">
        <span style={{ width: '40%' }}>
          <Sort
            sortKey={'TITLE'}
            onSort={onSort}
            activeSortKey={sortKey}
            reverse={isSortReverse}
          >
            Title
          </Sort>
        </span>
        <span style={{ width: '30%' }}>
          <Sort
            sortKey={'AUTHOR'}
            onSort={onSort}
            activeSortKey={sortKey}
            reverse={isSortReverse}
          >
            Author
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          <Sort
            sortKey={'COMMENTS'}
            onSort={onSort}
            activeSortKey={sortKey}
            reverse={isSortReverse}
          >
            Comments
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          <Sort
            sortKey={'POINTS'}
            onSort={onSort}
            activeSortKey={sortKey}
            reverse={isSortReverse}
          >
            Points
          </Sort>
        </span>
        <span style={{ width: '10%' }}>
          Archive
        </span>
      </div>
      {reverseSortedList.map(item =>
        <div key={item.objectID} className="table-row">
          <span style={{ width: '40%' }}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={{ width: '30%' }}>{item.author}</span>
          <span style={{ width: '10%' }}>{item.num_comments}</span>
          <span style={{ width: '10%' }}>{item.points}</span>
          <span style={{ width: '10%' }}>
            <Button onClick={() => onDismiss(item.objectID)}>
              Dismiss
              </Button>
          </span>
        </div>
      )}
    </div>
  );
}
/*
(<div><Search
  value={searchTerm}
  onChange={this.onSearchChange}
  onSubmit={this.onSearchSubmit}
>
  Search
</Search>
  <Table
    list={list}
    pattern={searchTerm}
    onDismiss={this.onDismiss}
  /></div>);
*/
const withList = (Component) => ({ value, onChange, onSubmit, ...rest }) => {
  return (<div>
    <Search
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
    > Search</Search>

    <Component {...rest} />
  </div>);
}
const ListWithSearch = withList(Table);

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

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

const Loading = () =>
  <div>
    <FontAwesomeIcon icon="spinner" color="#ddd" spin />
  </div>

const withLoading = (Component) => ({ isLoading, ...rest }) => {
  return isLoading
    ? <Loading />
    : <Component {...rest} />
}
const ButtonWithLoading = withLoading(Button);
Button.defaultProps = {
  className: '',
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default App;

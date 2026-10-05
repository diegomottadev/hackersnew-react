import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import './Search.css';

const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
  <form className="search" role="search" onSubmit={onSubmit}>
    <div className="search-field">
      <label htmlFor="search-input" className="visually-hidden">
        Search stories
      </label>
      <FontAwesomeIcon icon={faSearch} className="search-icon" />
      <input
        id="search-input"
        className="search-input"
        type="search"
        placeholder="Search Hacker News…"
        autoComplete="off"
        value={value}
        onChange={onChange}
      />
    </div>
    <Button type="submit" variant="primary">
      {children}
    </Button>
  </form>

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Search;

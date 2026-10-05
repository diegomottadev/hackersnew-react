import React from 'react';
import PropTypes from 'prop-types';
import Sort from '../Sort';
import { SORT_OPTIONS, SORT_KEYS } from '../../constants/sorts';
import { getSortDirection } from '../../utils/sort';
import './SortBar.css';

const SortBar = ({
  sortKey,
  isSortReverse,
  onSort,
  count
}) =>
  <div className="sort-bar">
    <div className="sort-bar-options" role="group" aria-label="Sort stories">
      <span className="sort-bar-label">Sort by</span>
      {SORT_OPTIONS.map(option =>
        <Sort
          key={option.sortKey}
          sortKey={option.sortKey}
          direction={getSortDirection(option, sortKey, isSortReverse)}
          onSort={onSort}
        >
          {option.label}
        </Sort>
      )}
    </div>
    <p className="sort-bar-count" aria-live="polite">
      {count} {count === 1 ? 'story' : 'stories'}
    </p>
  </div>

SortBar.propTypes = {
  sortKey: PropTypes.oneOf(SORT_KEYS).isRequired,
  isSortReverse: PropTypes.bool.isRequired,
  onSort: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
};

export default SortBar;

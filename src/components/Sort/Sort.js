import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { sortDirectionPropType } from '../../types/story';
import './Sort.css';

const Sort = ({
  sortKey,
  direction,
  onSort,
  children
}) => {
  const isActive = direction !== 'none';
  return (
    <button
      type="button"
      className={classNames('sort', { 'sort-active': isActive })}
      aria-pressed={isActive}
      onClick={() => onSort(sortKey)}
    >
      {children}
      {isActive && <FontAwesomeIcon icon={direction === 'descending' ? faArrowDown : faArrowUp} />}
      {isActive && <span className="visually-hidden">, {direction}</span>}
    </button>
  );
}

Sort.propTypes = {
  sortKey: PropTypes.string.isRequired,
  direction: sortDirectionPropType.isRequired,
  onSort: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Sort;

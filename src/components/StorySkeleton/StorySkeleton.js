import React from 'react';
import PropTypes from 'prop-types';
import './StorySkeleton.css';

const StorySkeleton = ({ count = 6 }) =>
  Array.from({ length: count }, (_, index) =>
    <li key={index} className="story-skeleton" aria-hidden="true" />
  )

StorySkeleton.propTypes = {
  count: PropTypes.number,
};

export default StorySkeleton;

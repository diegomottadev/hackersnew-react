import React from 'react';
import PropTypes from 'prop-types';
import './EmptyState.css';

const EmptyState = ({ children }) =>
  <li className="empty-state">
    {children}
  </li>

EmptyState.propTypes = {
  children: PropTypes.node.isRequired,
};

export default EmptyState;

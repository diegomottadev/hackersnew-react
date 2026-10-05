import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import './ErrorAlert.css';

const ErrorAlert = ({ onRetry, children }) =>
  <div className="error-alert" role="alert">
    <span>{children}</span>
    <Button onClick={onRetry}>Retry</Button>
  </div>

ErrorAlert.propTypes = {
  onRetry: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default ErrorAlert;

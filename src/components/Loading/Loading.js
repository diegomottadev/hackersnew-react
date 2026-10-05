import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './Loading.css';

const Loading = () =>
  <span className="loading" role="status">
    <FontAwesomeIcon icon={faSpinner} spin />
    Loading…
  </span>

export default Loading;

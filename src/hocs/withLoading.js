import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../components/Loading';
import getDisplayName from '../utils/getDisplayName';

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
};

export default withLoading;

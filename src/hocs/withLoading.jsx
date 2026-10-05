import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../components/Loading';
import getDisplayName from '../utils/getDisplayName';

// HOC: shows a spinner instead of the wrapped component while isLoading is true.
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

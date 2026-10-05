import React from 'react';
import PropTypes from 'prop-types';
import Search from '../components/Search';
import getDisplayName from '../utils/getDisplayName';

// HOC: renders a search form above the wrapped component.
const withSearch = (Component) => {
  const WithSearch = ({ value, onChange, onSubmit, ...rest }) =>
    <>
      <Search
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
      >
        Search
      </Search>
      <Component {...rest} />
    </>;
  WithSearch.displayName = `withSearch(${getDisplayName(Component)})`;
  WithSearch.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };
  return WithSearch;
};

export default withSearch;

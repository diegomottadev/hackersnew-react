import React from 'react';
import PropTypes from 'prop-types';
import Search from '../components/Search';
import getDisplayName from '../utils/getDisplayName';

// HOC: antepone un formulario de búsqueda al componente.
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

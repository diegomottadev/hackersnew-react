import PropTypes from 'prop-types';

export const storyPropType = PropTypes.shape({
  objectID: PropTypes.string.isRequired,
  title: PropTypes.string,
  story_title: PropTypes.string,
  author: PropTypes.string,
  url: PropTypes.string,
  num_comments: PropTypes.number,
  points: PropTypes.number,
  created_at: PropTypes.string,
});

export const sortDirectionPropType = PropTypes.oneOf(['ascending', 'descending', 'none']);

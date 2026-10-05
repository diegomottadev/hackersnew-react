import React from 'react';
import PropTypes from 'prop-types';
import SortBar from '../SortBar';
import StoryItem from '../StoryItem';
import StorySkeleton from '../StorySkeleton';
import EmptyState from '../EmptyState';
import { storyPropType } from '../../types/story';
import { SORT_KEYS } from '../../constants/sorts';
import { sortStories } from '../../utils/sort';
import './StoryList.css';

const StoryList = ({
  list,
  isLoading,
  onDismiss,
  isSortReverse,
  sortKey,
  onSort,
}) => {
  const renderItems = () => {
    if (list.length > 0) {
      return sortStories(list, sortKey, isSortReverse).map(story =>
        <StoryItem key={story.objectID} story={story} onDismiss={onDismiss} />
      );
    }
    return isLoading
      ? <StorySkeleton />
      : <EmptyState>No stories found. Try a different search.</EmptyState>;
  };

  return (
    <section className="story-list" aria-busy={isLoading}>
      <SortBar
        sortKey={sortKey}
        isSortReverse={isSortReverse}
        onSort={onSort}
        count={list.length}
      />
      <ul className="story-list-items">
        {renderItems()}
      </ul>
    </section>
  );
}

StoryList.propTypes = {
  list: PropTypes.arrayOf(storyPropType).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  sortKey: PropTypes.oneOf(SORT_KEYS).isRequired,
  onSort: PropTypes.func.isRequired,
  isSortReverse: PropTypes.bool.isRequired,
};

export default StoryList;

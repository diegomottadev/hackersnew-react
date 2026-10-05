import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import { storyPropType } from '../../types/story';
import { getStoryUrl, getStoryTitle, getItemUrl, getDomain } from '../../utils/story';
import { formatNumber, formatRelativeTime } from '../../utils/format';
import './StoryItem.css';

// External links open in a new tab. noopener stops the new page from controlling this one.
const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' };

const StoryItem = ({ story, onDismiss }) => {
  const title = getStoryTitle(story);
  const domain = getDomain(story.url);
  const points = formatNumber(story.points);
  const createdAt = formatRelativeTime(story.created_at);
  return (
    <li className="story">
      <div className="story-points" aria-hidden="true">
        {points}
        <span className="story-points-label">points</span>
      </div>
      <div className="story-title">
        <a className="story-link" href={getStoryUrl(story)} {...NEW_TAB}>
          {title}
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
        {domain && <span className="story-domain">{domain}</span>}
      </div>
      <div className="story-meta">
        <span className="story-meta-points">{points} points</span>
        <span>by {story.author}</span>
        {createdAt && <time dateTime={story.created_at}>{createdAt}</time>}
        <a className="story-comments" href={getItemUrl(story)} {...NEW_TAB}>
          {formatNumber(story.num_comments)} comments
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      </div>
      <div className="story-action">
        <Button
          variant="icon"
          onClick={() => onDismiss(story.objectID)}
          aria-label={`Dismiss “${title}”`}
          title="Dismiss"
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </div>
    </li>
  );
}

StoryItem.propTypes = {
  story: storyPropType.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default StoryItem;

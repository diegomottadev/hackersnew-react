const HN_ITEM_URL = 'https://news.ycombinator.com/item?id=';

export const getItemUrl = story => `${HN_ITEM_URL}${story.objectID}`;

// "Ask HN" posts don't have a url, so we link to the discussion.
export const getStoryUrl = story => story.url || getItemUrl(story);

// Algolia also returns comments. They have no title, only the title of their story.
export const getStoryTitle = story => story.title || story.story_title || '(untitled)';

// Returns the hostname without "www.", or null if the url is missing or invalid.
export const getDomain = url => {
  if (!url) {
    return null;
  }
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (e) {
    return null;
  }
};

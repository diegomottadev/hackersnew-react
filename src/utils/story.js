const HN_ITEM_URL = 'https://news.ycombinator.com/item?id=';

export const getItemUrl = story => `${HN_ITEM_URL}${story.objectID}`;

// Las historias tipo "Ask HN" no tienen url: se enlaza a la discusión.
export const getStoryUrl = story => story.url || getItemUrl(story);

export const getStoryTitle = story => story.title || story.story_title || '(untitled)';

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

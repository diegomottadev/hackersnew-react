import { describe, it, expect } from 'vitest';
import { getItemUrl, getStoryUrl, getStoryTitle, getDomain } from './story';

describe('story helpers', () => {
  it('links to the story url when there is one', () => {
    expect(getStoryUrl({ objectID: '1', url: 'https://example.com/post' })).toBe('https://example.com/post');
  });

  it('links to the HN discussion when there is no url', () => {
    const story = { objectID: '42', url: null };
    expect(getStoryUrl(story)).toBe('https://news.ycombinator.com/item?id=42');
    expect(getItemUrl(story)).toBe('https://news.ycombinator.com/item?id=42');
  });

  it('falls back to story_title, then to a placeholder', () => {
    expect(getStoryTitle({ title: 'Own title', story_title: 'Parent' })).toBe('Own title');
    expect(getStoryTitle({ title: null, story_title: 'Parent' })).toBe('Parent');
    expect(getStoryTitle({})).toBe('(untitled)');
  });

  it('gets the domain without www', () => {
    expect(getDomain('https://www.github.com/facebook/react')).toBe('github.com');
    expect(getDomain('https://blog.example.org/a?b=c')).toBe('blog.example.org');
  });

  it('returns null for a missing or invalid url', () => {
    expect(getDomain(null)).toBeNull();
    expect(getDomain('not a url')).toBeNull();
  });
});

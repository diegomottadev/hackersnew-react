const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';
const DEFAULT_HPP = '100';

const buildSearchUrl = (searchTerm, page) =>
  `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${encodeURIComponent(searchTerm)}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;

// Busca historias en Hacker News vía Algolia. Resuelve con { hits, page }.
export const searchStories = (searchTerm, page) =>
  fetch(buildSearchUrl(searchTerm, page)).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  });

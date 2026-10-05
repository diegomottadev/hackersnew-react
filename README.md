# HN Search

I started learning React in 2019, and this was one of my first projects.

I built it step by step alongside *The Road to React* by Robin Wieruch, and it's where I picked up the fundamentals: components, state and props, fetching from an API, higher-order components. You can read the book [on GitHub](https://github.com/the-road-to-learn-react/the-road-to-react).

The app is a small Hacker News search client. It talks straight to the public [Algolia HN Search API](https://hn.algolia.com/api), so there's no server or API key to set up.

## What it does

- Searches HN and caches results per search term. Go back to a term you already searched and it renders instantly, without another request.
- Loads 100 stories per page. "Load more" sits at the bottom of the list, where your thumb already is.
- Sorts by title, author, comments or points. Click the same option again to flip the order.
- Lets you dismiss stories you don't care about. They come back on reload (nothing is saved).
- Opens stories and comment threads in a new tab.
- Follows your system's light or dark mode, and switches to a card layout under 560px.

## Stack

React 16.14 built with Vite 8, tested with Vitest. Also PropTypes, lodash, classnames and Font Awesome. Styles are plain CSS with custom properties and OKLCH colors.

`App` is a class component, matching the chapters I followed in the book.

## Getting started

You need Node 20.19 or newer, and npm.

```bash
git clone https://github.com/diegomottadev/hackersnew-react.git
cd hackersnew-react
npm install
npm run dev
```

It opens on http://localhost:5173 (Vite picks the next free port if that one's taken).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload (`npm start` does the same) |
| `npm test` | Vitest in watch mode (`npx vitest run` runs once and exits) |
| `npm run build` | Production build in `build/` |
| `npm run preview` | Serves the production build locally |

## Project structure

```
src/
├── index.jsx / index.css    # entry point; index.css holds the design tokens
├── api/hackerNews.js        # searchStories(term, page)
├── constants/               # default query, sort functions and sort options
├── types/story.js           # shared PropTypes
├── utils/                   # pure helpers: sorting, story URLs, number and date formatting
├── hocs/                    # withSearch, withLoading
└── components/
    ├── App/                 # the only stateful component, plus its test
    ├── Header/  Search/  Button/  Loading/
    ├── SortBar/  Sort/
    ├── StoryList/  StoryItem/  StorySkeleton/
    └── EmptyState/  ErrorAlert/
```

A few rules I stuck to:

- `App` owns all the state. Every other component gets props and renders.
- Each component lives in its own folder with its `.jsx`, its CSS and an `index.js`, so imports read `import Button from '../Button'`.
- `api/hackerNews.js` is the only file that knows Algolia's URL format. Swap the data source there and nothing else moves.
- Colors, spacing and type sizes are CSS variables in `src/index.css`. Components only reference `var(--...)`, which is how dark mode works with a single media query.

## Adding a sort option

2 edits in `src/constants/sorts.js`. Say you want to sort by date:

```js
export const SORTS = {
  // ...
  DATE: list => sortBy(list, 'created_at').reverse(),
};

export const SORT_OPTIONS = [
  // ...
  { sortKey: 'DATE', label: 'Date', isDescending: true },
];
```

`isDescending` tells the arrow icon which way the list is actually sorted. The sort bar picks up the new option on its own.

## Tests

There's 1 test right now: `src/components/App/App.test.jsx` mounts the app and checks it doesn't crash. The API is mocked with `vi.mock`, so it runs offline.

```bash
npx vitest run
```

## Known issues

- React is still on 16.14 and mounts with `ReactDOM.render`. Moving to React 18 or 19 means switching to `createRoot`, and probably rewriting `App` with hooks.
- There's no linter. ESLint used to come bundled with `react-scripts`, and it left with it.
- Dismissed stories only live in memory.

## Changelog

### 2026 revisit

I came back to this project in 2026 to clean it up and close it out. What changed:

**Bugs fixed**

- A slow response could land under the wrong search term. If you searched "redux" and then "react" fast enough, the "redux" results showed up as "react". Each response is now stored under the term that requested it.
- Searching for something like `c++ & rust` broke the request URL. The term is encoded now.
- A failed request left the loading spinner on forever. Errors now show a message with a Retry button.
- Sorting with the reverse toggle mutated the list in state.
- Submitting a search before the first response arrived crashed the app.

**Structure**

- `App.js` was 1 file with 389 lines holding everything. It's split into 12 components, each in its own folder, plus separate folders for the API layer, constants, PropTypes, utils and HOCs.
- Dead code is gone: a duplicated `isSearched`, an unused `pattern` prop, commented-out JSX, debug `console.log`s.
- Font Awesome icons are imported where they're used. Before, they were registered globally in `index.js`, and a missing registration only showed up as a console error.
- Sort options come from a single config array, so adding one takes 2 edits (see above).
- Code comments are in English now, and only where the code doesn't explain itself. Exported functions in `api/` and `utils/` have JSDoc.

**Design and UX**

- New look: design tokens as CSS variables, light and dark mode, fluid type, card layout on mobile.
- Loading skeletons, an empty state and an error state with Retry.
- "Load more" moved to the bottom of the list.
- Each story shows its domain, how long ago it was posted and a link to the HN discussion. Stories without a URL (like Ask HN) link to the discussion instead of nowhere.
- Links open in a new tab.
- Keyboard focus is visible again. The old CSS removed the outline on every element.
- Labels and ARIA attributes for screen readers, 44px tap targets and support for `prefers-reduced-motion`.

**Tooling**

- Migrated from Create React App (`react-scripts` 3.2) to Vite 8, and from Jest to Vitest. This closed all 94 Dependabot alerts: `npm audit` now reports 0 vulnerabilities. Almost all of them came from `react-scripts` dependencies. The other 4 were in `lodash`, now on 4.18.1.
- The `NODE_OPTIONS=--openssl-legacy-provider` workaround for Node 17+ isn't needed anymore.
- React went from 16.11 to 16.14 for the automatic JSX runtime.
- `lodash` is imported per function (`lodash/sortBy`), which cut the JS bundle from about 80 kB to 62 kB gzipped.
- The dev server listens on `localhost` only. CRA exposed it to the whole local network.
- Dropped `@fortawesome/free-brands-svg-icons`, which nothing used.

## Credits

Built following [*The Road to React*](https://github.com/the-road-to-learn-react/the-road-to-react) by Robin Wieruch. Story data comes from [HN Search by Algolia](https://hn.algolia.com/).

Made by [@diegomottadev](https://github.com/diegomottadev). There's no license file yet.

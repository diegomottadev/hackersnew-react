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

React 16.11 on Create React App (`react-scripts` 3.2), with PropTypes, lodash, classnames and Font Awesome. Styles are plain CSS with custom properties.

`App` is a class component, matching the chapters I followed in the book.

## Getting started

You need Node and npm.

```bash
git clone https://github.com/diegomottadev/hackersnew-react.git
cd hackersnew-react
npm install
npm start
```

It opens on http://localhost:3000.

**On Node 17 or newer**, `react-scripts` 3 crashes on start with `ERR_OSSL_EVP_UNSUPPORTED`. Webpack 4 uses a hash that OpenSSL 3 dropped. Either switch to Node 16 or run it with the legacy provider:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
```

Same flag for `npm run build`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Dev server with hot reload on port 3000 |
| `npm test` | Jest in watch mode (`CI=true npm test` runs once and exits) |
| `npm run build` | Production build in `build/` |

## Project structure

```
src/
├── index.js / index.css     # entry point; index.css holds the design tokens
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
- Each component lives in its own folder with its CSS and an `index.js`, so imports read `import Button from '../Button'`.
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

There's 1 test right now: `src/components/App/App.test.js` mounts the app and checks it doesn't crash. The API is mocked with `jest.mock`, so it runs offline.

```bash
CI=true npm test
```

## Known issues

- `react-scripts` 3.2 is from 2019, and its CSS minifier chokes on `oklch()` and on bare math inside `clamp()`. That's why the colors are hex/rgba and every `clamp()` wraps its middle value in `calc()`. Moving to Vite would fix it (and drop the OpenSSL flag too).
- Dismissed stories only live in memory.
- `@fortawesome/free-brands-svg-icons` and `@fortawesome/fontawesome-svg-core` are still in `package.json` but nothing imports them anymore.

## Credits

Built following [*The Road to React*](https://github.com/the-road-to-learn-react/the-road-to-react) by Robin Wieruch. Story data comes from [HN Search by Algolia](https://hn.algolia.com/).

Made by [@diegomottadev](https://github.com/diegomottadev). There's no license file yet.

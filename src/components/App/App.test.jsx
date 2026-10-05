import React from 'react';
import ReactDOM from 'react-dom';
import { it, vi } from 'vitest';
import App from './App';

vi.mock('../../api/hackerNews', () => ({
  searchStories: vi.fn(() => Promise.resolve({ hits: [], page: 0 })),
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

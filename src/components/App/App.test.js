import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

jest.mock('../../api/hackerNews', () => ({
  searchStories: jest.fn(() => Promise.resolve({ hits: [], page: 0 })),
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

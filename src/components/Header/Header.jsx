import React from 'react';
import './Header.css';

const Header = () =>
  <header className="header">
    <span className="header-logo" aria-hidden="true">Y</span>
    <div>
      <h1 className="header-title">HN Search</h1>
      <p className="header-subtitle">Stories from Hacker News, via Algolia</p>
    </div>
  </header>

export default Header;

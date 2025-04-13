import React from 'react';
import './HomePage.css';
import { AiOutlineComment } from 'react-icons/ai';

function HomePage() {
  return (
    <div className="homepage-container">
      {/* NAVIGATION BAR */}
      <nav className="navbar">
        <div className="navbar-logo">STOCK Linqed</div>
        <div className="navbar-links">
          <a href="#chat">Chat</a>
          <a href="#profile">Profile</a>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* LEFT COLUMN */}
        <div className="left-column">
          {/* FEED SECTION */}
          <div className="card feed">
            <h3>Is NVDA Overvalued or the Future?</h3>
            <div className="feed-options">
              <button>Overvalued</button>
              <button>Fairly Priced</button>
              <button>Buy the Dip</button>
            </div>
          </div>

          {/* WATCHLIST SECTION */}
          <div className="card watchlist">
            <h2>Watchlist</h2>
            <ul>
              <li>TSLA <span>$123</span></li>
              <li>NVDA <span>$200</span></li>
              <li>CMI <span>$259</span></li>
            </ul>
          </div>
        </div>

        {/* MIDDLE COLUMN */}
        <div className="middle-column">
          {/* LATEST SENTIMENT ALERTS */}
          <div className="card latest-sentiment-alerts">
            <h2>Latest Sentiment Alerts</h2>
            <ul>
              <li>
                Meta CEO announces new META AI version &mdash; <a href="#read">Read Here</a>
              </li>
              <li>
                CMI reports new Q3 data &mdash; <a href="#read">Read Here</a>
              </li>
            </ul>
          </div>

          {/* MARKET MOOD */}
          <div className="card market-mood">
            <h2>Market Mood</h2>
            <div className="mood-options">
              <button >Bullish</button>
              <button >Bearish</button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="right-column">
          {/* STOCK SENTIMENT SEARCH */}
          <div className="card stock-sentiment-search">
            <h2>Stock Sentiment Search</h2>
            <p>Enter Stock Symbol Here</p>
            <input type="text" placeholder=" AAPL" />
            <button className="lookup-btn">Look Up</button>
          </div>
        </div>
      </div>

      {/* ASK LINQBOT FLOATING BUTTON/CHAT ICON */}
      <div className="ask-linqbot">
        <button>
          <AiOutlineComment className="ask-linqbot-icon" />
          <span className="ask-linqbot-text">Ask LinqBot</span>
        </button>
      </div>
    </div>
  );
}

export default HomePage;

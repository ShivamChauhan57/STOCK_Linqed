import { useState, useEffect } from 'react';
import { fetchStockData } from '../services/stockService';
import SentimentAnalysis from './SentimentAnalysis';
import './Stock.css';
import './SentimentAnalysis.css';

const Stock = () => {
  const [stockData, setStockData] = useState({
    symbol: '',
    price: 0,
    change: 0,
    changePercent: 0
  });
  const [searchSymbol, setSearchSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchSymbol.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await fetchStockData(searchSymbol.toUpperCase());
      setStockData(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Failed to fetch stock data. Please try again.');
      setStockData({ symbol: '', price: 0, change: 0, changePercent: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stock-container">
      <h2>Stock Tracker</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchSymbol}
          onChange={(e) => setSearchSymbol(e.target.value)}
          placeholder="Enter stock symbol (e.g., AAPL, MSFT)"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {stockData.symbol && (
        <div className="stock-info">
          <h3>{stockData.symbol}</h3>
          <div className="stock-price">
            <span className="price">${stockData.price.toFixed(2)}</span>
            <span 
              className={`change ${stockData.change >= 0 ? 'positive' : 'negative'}`}
            >
              {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
            </span>
          </div>
          
          {/* Sentiment Analysis Component */}
          <SentimentAnalysis symbol={stockData.symbol} />
        </div>
      )}
    </div>
  );
};

export default Stock;
import { useState, useEffect } from 'react';

const Stock = () => {
  const [stockData, setStockData] = useState({
    symbol: '',
    price: 0,
    change: 0,
    changePercent: 0
  });
  const [searchSymbol, setSearchSymbol] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to fetch stock data
    try {
      // Placeholder for API implementation
      console.log('Searching for:', searchSymbol);
    } catch (error) {
      console.error('Error fetching stock data:', error);
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
          placeholder="Enter stock symbol"
        />
        <button type="submit">Search</button>
      </form>

      {stockData.symbol && (
        <div className="stock-info">
          <h3>{stockData.symbol}</h3>
          <p>Price: ${stockData.price}</p>
          <p>Change: {stockData.change}</p>
          <p>Change %: {stockData.changePercent}%</p>
        </div>
      )}
    </div>
  );
};

export default Stock;
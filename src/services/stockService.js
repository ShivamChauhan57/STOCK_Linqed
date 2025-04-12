const API_KEY = 'YOUR_API_KEY'; // You'll need to replace this with your actual API key
const BASE_URL = 'https://www.alphavantage.co/query';

export const fetchStockData = async (symbol) => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    const data = await response.json();
    
    if (data['Global Quote']) {
      const quote = data['Global Quote'];
      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', ''))
      };
    }
    throw new Error('No stock data found');
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};
// Sentiment Analysis Service
// This service fetches and analyzes sentiment data from Twitter, Reddit, and Google News

// Environment variables should be loaded in the main application
const TWITTER_BEARER_TOKEN = import.meta.env.VITE_TWITTER_BEARER_TOKEN;
const REDDIT_CLIENT_ID = import.meta.env.VITE_REDDIT_CLIENT_ID;
const REDDIT_CLIENT_SECRET = import.meta.env.VITE_REDDIT_CLIENT_SECRET;
const REDDIT_USER_AGENT = import.meta.env.VITE_REDDIT_USER_AGENT;
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Twitter API endpoints
const TWITTER_API_URL = 'https://api.twitter.com/2/tweets/search/recent';

// Reddit API endpoints
const REDDIT_API_URL = 'https://oauth.reddit.com/r';
const REDDIT_AUTH_URL = 'https://www.reddit.com/api/v1/access_token';

// News API endpoints
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

/**
 * Fetch tweets related to a specific stock symbol
 * @param {string} symbol - Stock symbol (e.g., AAPL, TSLA)
 * @returns {Promise<Array>} - Array of tweets
 */
export const fetchTwitterSentiment = async (symbol) => {
  try {
    if (!TWITTER_BEARER_TOKEN) {
      console.error('Twitter Bearer Token is missing');
      return [];
    }

    const query = `${symbol} stock OR ${symbol} market OR $${symbol}`;
    const params = new URLSearchParams({
      query: query,
      max_results: '20',
      'tweet.fields': 'created_at,public_metrics,text',
    });

    const response = await fetch(`${TWITTER_API_URL}?${params}`, {
      headers: {
        Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
      },
    });

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    return [];
  }
};

/**
 * Fetch Reddit posts related to a specific stock symbol
 * @param {string} symbol - Stock symbol (e.g., AAPL, TSLA)
 * @returns {Promise<Array>} - Array of Reddit posts
 */
export const fetchRedditSentiment = async (symbol) => {
  try {
    if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET) {
      console.error('Reddit API credentials are missing');
      return [];
    }

    // Get Reddit access token
    const tokenResponse = await fetch(REDDIT_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error('Failed to obtain Reddit access token');
    }

    // Fetch posts from relevant subreddits
    const subreddits = ['wallstreetbets', 'stocks', 'investing'];
    let allPosts = [];

    for (const subreddit of subreddits) {
      const response = await fetch(
        `${REDDIT_API_URL}/${subreddit}/search.json?q=${symbol}&limit=10&sort=hot`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': REDDIT_USER_AGENT,
          },
        }
      );

      const data = await response.json();
      if (data.data && data.data.children) {
        allPosts = [...allPosts, ...data.data.children.map(child => child.data)];
      }
    }

    return allPosts;
  } catch (error) {
    console.error('Error fetching Reddit data:', error);
    return [];
  }
};

/**
 * Fetch news articles related to a specific stock symbol
 * @param {string} symbol - Stock symbol (e.g., AAPL, TSLA)
 * @returns {Promise<Array>} - Array of news articles
 */
export const fetchNewsArticles = async (symbol) => {
  try {
    if (!NEWS_API_KEY) {
      console.error('News API Key is missing');
      return [];
    }

    const companyNames = {
      AAPL: 'Apple',
      MSFT: 'Microsoft',
      GOOGL: 'Google',
      AMZN: 'Amazon',
      META: 'Meta',
      TSLA: 'Tesla',
      NVDA: 'Nvidia',
      // Add more mappings as needed
    };

    const companyName = companyNames[symbol] || symbol;
    const query = `${companyName} OR ${symbol} stock`;

    const response = await fetch(
      `${NEWS_API_URL}?q=${encodeURIComponent(query)}&apiKey=${NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=10`
    );

    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return [];
  }
};

/**
 * Analyze sentiment of text using Gemini API
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} - Sentiment analysis result
 */
export const analyzeSentiment = async (text) => {
  try {
    if (!GEMINI_API_KEY) {
      console.error('Gemini API Key is missing');
      return { sentiment: 'neutral', score: 0 };
    }

    const response = await fetch('https://api.correctendpoint.com/v1/sentiment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        text: text
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return { sentiment: 'neutral', score: 0 };
  }
};

/**
 * Get aggregated sentiment data for a stock symbol from all sources
 * @param {string} symbol - Stock symbol (e.g., AAPL, TSLA)
 * @returns {Promise<Object>} - Aggregated sentiment data
 */
export const getStockSentiment = async (symbol) => {
  try {
    // Fetch data from all sources in parallel
    const [tweets, redditPosts, newsArticles] = await Promise.all([
      fetchTwitterSentiment(symbol),
      fetchRedditSentiment(symbol),
      fetchNewsArticles(symbol),
    ]);

    // Process Twitter data
    const twitterSentiment = await processSocialMediaSentiment(tweets, 'text');

    // Process Reddit data
    const redditSentiment = await processSocialMediaSentiment(redditPosts, 'title');

    // Process News data
    const newsSentiment = await processSocialMediaSentiment(newsArticles, 'title');

    // Calculate overall sentiment
    const allScores = [
      ...twitterSentiment.scores,
      ...redditSentiment.scores,
      ...newsSentiment.scores,
    ];

    const overallScore = allScores.length > 0
      ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length
      : 0;

    // Determine if there's a sentiment spike
    const sentimentSpike = detectSentimentSpike(allScores);

    return {
      symbol,
      overallSentiment: getSentimentLabel(overallScore),
      overallScore,
      sentimentSpike,
      sources: {
        twitter: {
          data: tweets,
          sentiment: twitterSentiment.sentiment,
          score: twitterSentiment.averageScore,
        },
        reddit: {
          data: redditPosts,
          sentiment: redditSentiment.sentiment,
          score: redditSentiment.averageScore,
        },
        news: {
          data: newsArticles,
          sentiment: newsSentiment.sentiment,
          score: newsSentiment.averageScore,
        },
      },
    };
  } catch (error) {
    console.error('Error getting stock sentiment:', error);
    return {
      symbol,
      overallSentiment: 'neutral',
      overallScore: 0,
      sentimentSpike: false,
      sources: {
        twitter: { data: [], sentiment: 'neutral', score: 0 },
        reddit: { data: [], sentiment: 'neutral', score: 0 },
        news: { data: [], sentiment: 'neutral', score: 0 },
      },
    };
  }
};

/**
 * Process sentiment for social media posts or news articles
 * @param {Array} items - Array of items to analyze
 * @param {string} textField - Field name containing the text to analyze
 * @returns {Promise<Object>} - Processed sentiment data
 */
async function processSocialMediaSentiment(items, textField) {
  const scores = [];
  const analyzedItems = [];

  // Analyze sentiment for each item
  for (const item of items.slice(0, 5)) { // Limit to 5 items to avoid API rate limits
    const text = item[textField];
    if (text) {
      const sentimentResult = await analyzeSentiment(text);
      scores.push(sentimentResult.score);
      analyzedItems.push({
        ...item,
        sentiment: sentimentResult.sentiment,
        score: sentimentResult.score,
      });
    }
  }

  // Calculate average sentiment score
  const averageScore = scores.length > 0
    ? scores.reduce((sum, score) => sum + score, 0) / scores.length
    : 0;

  return {
    sentiment: getSentimentLabel(averageScore),
    averageScore,
    scores,
    analyzedItems,
  };
}

/**
 * Get sentiment label based on score
 * @param {number} score - Sentiment score (-1 to 1)
 * @returns {string} - Sentiment label
 */
function getSentimentLabel(score) {
  if (score > 0.3) return 'bullish';
  if (score < -0.3) return 'bearish';
  return 'neutral';
}

/**
 * Detect if there's a significant sentiment spike
 * @param {Array<number>} scores - Array of sentiment scores
 * @returns {boolean} - True if there's a sentiment spike
 */
function detectSentimentSpike(scores) {
  if (scores.length < 3) return false;

  // Calculate standard deviation
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  // Check if any score deviates significantly from the mean
  const threshold = 1.5; // 1.5 standard deviations
  return scores.some(score => Math.abs(score - mean) > threshold * stdDev);
}
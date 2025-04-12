import { useState, useEffect } from 'react';
import { getStockSentiment } from '../services/sentimentService';
import { format } from 'date-fns';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FaTwitter, FaReddit } from 'react-icons/fa';
import { BiNews } from 'react-icons/bi';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SentimentAnalysis = ({ symbol }) => {
  const [sentimentData, setSentimentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSentimentData = async () => {
      if (!symbol) return;
      
      setLoading(true);
      setError('');
      
      try {
        const data = await getStockSentiment(symbol);
        setSentimentData(data);
      } catch (err) {
        console.error('Error fetching sentiment data:', err);
        setError('Failed to fetch sentiment data');
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentData();
  }, [symbol]);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'bullish': return '#4caf50';
      case 'bearish': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getScoreData = () => {
    if (!sentimentData) return null;
    
    // Prepare data for chart
    const sources = ['Twitter', 'Reddit', 'News', 'Overall'];
    const scores = [
      sentimentData.sources.twitter.score,
      sentimentData.sources.reddit.score,
      sentimentData.sources.news.score,
      sentimentData.overallScore
    ];

    return {
      labels: sources,
      datasets: [
        {
          label: 'Sentiment Score',
          data: scores,
          backgroundColor: scores.map(score => {
            if (score > 0.3) return 'rgba(76, 175, 80, 0.2)';
            if (score < -0.3) return 'rgba(244, 67, 54, 0.2)';
            return 'rgba(158, 158, 158, 0.2)';
          }),
          borderColor: scores.map(score => {
            if (score > 0.3) return '#4caf50';
            if (score < -0.3) return '#f44336';
            return '#9e9e9e';
          }),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Sentiment Analysis for ${symbol}`,
      },
    },
    scales: {
      y: {
        min: -1,
        max: 1,
        ticks: {
          callback: (value) => {
            if (value === 1) return 'Bullish';
            if (value === 0) return 'Neutral';
            if (value === -1) return 'Bearish';
            return '';
          }
        }
      }
    }
  };

  if (loading) return <div className="sentiment-loading">Loading sentiment data...</div>;
  if (error) return <div className="sentiment-error">{error}</div>;
  if (!sentimentData) return null;

  const chartData = getScoreData();

  return (
    <div className="sentiment-container">
      <h3>Market Sentiment</h3>
      
      <div className="sentiment-summary">
        <div className="overall-sentiment" style={{ color: getSentimentColor(sentimentData.overallSentiment) }}>
          <h4>Overall: {sentimentData.overallSentiment.toUpperCase()}</h4>
          <p>Score: {sentimentData.overallScore.toFixed(2)}</p>
          {sentimentData.sentimentSpike && (
            <div className="sentiment-alert">⚠️ Significant sentiment change detected</div>
          )}
        </div>
      </div>

      {chartData && (
        <div className="sentiment-chart">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}

      <div className="sentiment-sources">
        <div className="source-item">
          <div className="source-header">
            <FaTwitter /> <h4>Twitter</h4>
          </div>
          <p style={{ color: getSentimentColor(sentimentData.sources.twitter.sentiment) }}>
            {sentimentData.sources.twitter.sentiment.toUpperCase()} ({sentimentData.sources.twitter.score.toFixed(2)})
          </p>
          <p>Sample size: {sentimentData.sources.twitter.data.length} tweets</p>
        </div>

        <div className="source-item">
          <div className="source-header">
            <FaReddit /> <h4>Reddit</h4>
          </div>
          <p style={{ color: getSentimentColor(sentimentData.sources.reddit.sentiment) }}>
            {sentimentData.sources.reddit.sentiment.toUpperCase()} ({sentimentData.sources.reddit.score.toFixed(2)})
          </p>
          <p>Sample size: {sentimentData.sources.reddit.data.length} posts</p>
        </div>

        <div className="source-item">
          <div className="source-header">
            <BiNews /> <h4>News</h4>
          </div>
          <p style={{ color: getSentimentColor(sentimentData.sources.news.sentiment) }}>
            {sentimentData.sources.news.sentiment.toUpperCase()} ({sentimentData.sources.news.score.toFixed(2)})
          </p>
          <p>Sample size: {sentimentData.sources.news.data.length} articles</p>
        </div>
      </div>

      <div className="sentiment-scraps">
        <h3>Top Sentiment Data</h3>
        <div className="scrap-list">
          {[
            ...sentimentData.sources.twitter.data.map(item => ({ ...item, source: 'twitter' })),
            ...sentimentData.sources.reddit.data.map(item => ({ ...item, source: 'reddit' })),
            ...sentimentData.sources.news.data.map(item => ({ ...item, source: 'news' }))
          ]
            .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
            .slice(0, 10)
            .map((item, index) => (
              <div key={index} className="scrap-item">
                <div className="scrap-source">
                  {item.source === 'twitter' && <FaTwitter />}
                  {item.source === 'reddit' && <FaReddit />}
                  {item.source === 'news' && <BiNews />}
                  <span>{item.source.charAt(0).toUpperCase() + item.source.slice(1)}</span>
                </div>
                <div className="scrap-content">
                  {item.text || item.title}
                  <div className="scrap-time">
                    {format(new Date(item.created_at || item.publishedAt), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
                <div className="scrap-score" style={{ color: getSentimentColor(item.sentiment) }}>
                  {item.score > 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {Math.abs(item.score).toFixed(2)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
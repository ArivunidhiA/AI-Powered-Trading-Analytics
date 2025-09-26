// Client-side API functions for static deployment
import yahooFinance from 'yahoo-finance2';

// Mock data for when APIs fail
const mockMarketData = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 256.87,
  change: 4.56,
  changePercent: 1.81,
  volume: 50836929,
  marketCap: 3812050862080,
  data: [
    { timestamp: '2025-09-20T13:30:00.000Z', open: 250.0, high: 258.0, low: 248.0, close: 256.87, volume: 50000000 },
    { timestamp: '2025-09-21T13:30:00.000Z', open: 256.0, high: 260.0, low: 254.0, close: 258.5, volume: 45000000 },
    { timestamp: '2025-09-22T13:30:00.000Z', open: 258.0, high: 262.0, low: 256.0, close: 260.2, volume: 48000000 },
    { timestamp: '2025-09-23T13:30:00.000Z', open: 260.0, high: 264.0, low: 258.0, close: 262.8, volume: 52000000 },
    { timestamp: '2025-09-24T13:30:00.000Z', open: 262.0, high: 266.0, low: 260.0, close: 264.5, volume: 47000000 },
    { timestamp: '2025-09-25T13:30:00.000Z', open: 264.0, high: 268.0, low: 262.0, close: 256.87, volume: 50000000 }
  ]
};

const mockPortfolio = {
  totalValue: 8741.89,
  totalPnl: 3841.89,
  totalPnlPercent: 78.41,
  positions: [
    { symbol: 'AAPL', name: 'Apple Inc.', quantity: 10, avgPrice: 150, currentPrice: 256.87, value: 2568.7, pnl: 1068.7, pnlPercent: 71.25 },
    { symbol: 'TSLA', name: 'Tesla Inc.', quantity: 5, avgPrice: 200, currentPrice: 423.39, value: 2116.95, pnl: 1116.95, pnlPercent: 111.69 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 8, avgPrice: 300, currentPrice: 507.03, value: 4056.24, pnl: 1656.24, pnlPercent: 69.01 }
  ],
  watchlist: ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'NVDA']
};

const mockSignals = [
  {
    id: '1',
    symbol: 'AAPL',
    recommendation: 'HOLD' as const,
    confidence: 0.5,
    reasoning: 'MACD shows bearish momentum. Short-term trend is above long-term trend.',
    technicalIndicators: [
      { name: 'RSI', value: 33.71, signal: 'neutral' as const, description: 'Relative Strength Index' },
      { name: 'MACD', value: -7.3462, signal: 'bearish' as const, description: 'Moving Average Convergence Divergence' },
      { name: 'SMA20', value: 220.39, signal: 'bearish' as const, description: '20-day Simple Moving Average' },
      { name: 'SMA50', value: 214.05, signal: 'bearish' as const, description: '50-day Simple Moving Average' }
    ],
    timestamp: new Date().toISOString()
  }
];

const mockNews = [
  {
    id: '1',
    title: 'Federal Reserve Signals Potential Rate Cuts Amid Economic Uncertainty',
    summary: 'The Federal Reserve hinted at possible interest rate cuts in the coming months as economic indicators show signs of slowing growth.',
    source: 'Financial Times',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    url: 'https://example.com/news1',
    sentiment: 'negative' as const,
    sentimentScore: -0.3
  },
  {
    id: '2',
    title: 'Tech Stocks Rally on Strong Q4 Earnings Reports',
    summary: 'Major technology companies reported better-than-expected earnings, driving a significant rally in tech stocks across all major indices.',
    source: 'Bloomberg',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    url: 'https://example.com/news2',
    sentiment: 'positive' as const,
    sentimentScore: 0.7
  },
  {
    id: '3',
    title: 'Oil Prices Surge on Supply Concerns and Geopolitical Tensions',
    summary: 'Crude oil prices jumped 5% following reports of supply disruptions and escalating tensions in key oil-producing regions.',
    source: 'Reuters',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    url: 'https://example.com/news3',
    sentiment: 'neutral' as const,
    sentimentScore: 0.1
  }
];

export async function fetchMarketData(symbol: string) {
  try {
    // Try to fetch real data first
    const result = await yahooFinance.quote(symbol);
    const historical = await yahooFinance.historical(symbol, {
      period1: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      period2: new Date(),
      interval: '1d'
    });

    return {
      success: true,
      data: {
        symbol: result.symbol,
        name: result.longName || result.shortName || result.symbol,
        price: result.regularMarketPrice || 0,
        change: result.regularMarketChange || 0,
        changePercent: result.regularMarketChangePercent || 0,
        volume: result.regularMarketVolume || 0,
        marketCap: result.marketCap || 0,
        data: historical.map(item => ({
          timestamp: item.date.toISOString(),
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume
        }))
      }
    };
  } catch (error) {
    console.log('Yahoo Finance API failed, using mock data:', error);
    return {
      success: true,
      data: { ...mockMarketData, symbol }
    };
  }
}

export async function fetchPortfolio() {
  try {
    // In a real app, this would fetch from your backend
    return {
      success: true,
      data: mockPortfolio
    };
  } catch (error) {
    console.log('Using mock data for portfolio:', error);
    return {
      success: true,
      data: mockPortfolio
    };
  }
}

export async function fetchSignals(symbol: string) {
  try {
    // Try to get real market data first
    const marketData = await fetchMarketData(symbol);
    
    if (marketData.success && process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      // Use OpenAI to analyze the data
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: `Analyze this stock data for ${symbol}: Price: $${marketData.data.price}, Change: ${marketData.data.changePercent}%. Provide a trading recommendation (BUY/SELL/HOLD) with confidence score (0-1) and reasoning. Format as JSON with: recommendation, confidence, reasoning, technicalIndicators array with name, value, signal, description.`
          }]
        })
      });
      
      const aiResponse = await response.json();
      const analysis = JSON.parse(aiResponse.choices[0].message.content);
      
      return {
        success: true,
        data: {
          id: `ai-${Date.now()}`,
          symbol,
          recommendation: analysis.recommendation,
          confidence: analysis.confidence,
          reasoning: analysis.reasoning,
          technicalIndicators: analysis.technicalIndicators || [],
          timestamp: new Date().toISOString()
        }
      };
    }
    
    throw new Error('No AI analysis available');
  } catch (error) {
    console.log('OpenAI API failed, using mock data:', error);
    return {
      success: true,
      data: { ...mockSignals[0], symbol }
    };
  }
}

export async function fetchNews(limit: number = 10) {
  try {
    // Try to fetch real news data from Finnhub
    const response = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`);
    const newsData = await response.json();
    
    if (newsData && newsData.length > 0) {
      const processedNews = newsData.slice(0, limit).map((item: any, index: number) => ({
        id: `real-${index}`,
        title: item.headline,
        summary: item.summary || item.headline,
        source: item.source,
        publishedAt: new Date(item.datetime * 1000).toISOString(),
        url: item.url,
        sentiment: 'neutral' as const, // Would need AI analysis
        sentimentScore: 0
      }));
      
      return {
        success: true,
        data: processedNews
      };
    }
    
    throw new Error('No news data received');
  } catch (error) {
    console.log('Finnhub API failed, using mock data:', error);
    return {
      success: true,
      data: mockNews.slice(0, limit)
    };
  }
}

export async function fetchRiskMetrics(symbol: string) {
  try {
    // Mock risk data
    return {
      success: true,
      data: {
        volatility: 32.2,
        sharpeRatio: -0.28,
        maxDrawdown: -32.9,
        beta: 1.28,
        var95: -2.47,
        cvar95: -4.48,
        riskLevel: 'High',
        riskAdjustedReturn: 'Poor',
        marketCorrelation: 'High correlation'
      }
    };
  } catch (error) {
    console.log('Using mock data for risk:', error);
    return {
      success: true,
      data: {
        volatility: 32.2,
        sharpeRatio: -0.28,
        maxDrawdown: -32.9,
        beta: 1.28,
        var95: -2.47,
        cvar95: -4.48,
        riskLevel: 'High',
        riskAdjustedReturn: 'Poor',
        marketCorrelation: 'High correlation'
      }
    };
  }
}

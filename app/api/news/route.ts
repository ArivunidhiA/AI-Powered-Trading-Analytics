import { NextRequest, NextResponse } from 'next/server';
import { NewsItem, ApiResponse } from '@/types';

// Mock news data - in a real app, this would fetch from Finnhub or other news APIs
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Federal Reserve Signals Potential Rate Cuts Amid Economic Uncertainty',
    summary: 'The Federal Reserve hinted at possible interest rate cuts in the coming months as economic indicators show signs of slowing growth.',
    url: 'https://example.com/news/1',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    source: 'Financial Times',
    sentiment: 'negative',
    sentimentScore: -0.3,
  },
  {
    id: '2',
    title: 'Tech Stocks Rally on Strong Q4 Earnings Reports',
    summary: 'Major technology companies reported better-than-expected earnings, driving a significant rally in tech stocks across all major indices.',
    url: 'https://example.com/news/2',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    source: 'Bloomberg',
    sentiment: 'positive',
    sentimentScore: 0.7,
  },
  {
    id: '3',
    title: 'Oil Prices Surge on Supply Concerns and Geopolitical Tensions',
    summary: 'Crude oil prices jumped 5% following reports of supply disruptions and escalating tensions in key oil-producing regions.',
    url: 'https://example.com/news/3',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    source: 'Reuters',
    sentiment: 'neutral',
    sentimentScore: 0.1,
  },
  {
    id: '4',
    title: 'Cryptocurrency Market Shows Signs of Recovery',
    summary: 'Bitcoin and other major cryptocurrencies have shown strong recovery signals, with trading volumes increasing significantly.',
    url: 'https://example.com/news/4',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    source: 'CoinDesk',
    sentiment: 'positive',
    sentimentScore: 0.6,
  },
  {
    id: '5',
    title: 'Manufacturing Sector Reports Mixed Results for December',
    summary: 'The latest manufacturing data shows mixed results across different sectors, with some industries showing growth while others continue to struggle.',
    url: 'https://example.com/news/5',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
    source: 'Wall Street Journal',
    sentiment: 'neutral',
    sentimentScore: 0.0,
  },
  {
    id: '6',
    title: 'European Markets Close Higher on Positive Economic Data',
    summary: 'European stock markets closed higher today following the release of positive economic indicators from major European economies.',
    url: 'https://example.com/news/6',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    source: 'Financial Times',
    sentiment: 'positive',
    sentimentScore: 0.4,
  },
  {
    id: '7',
    title: 'Banking Sector Faces Regulatory Challenges',
    summary: 'Major banks are preparing for new regulatory requirements that could impact their profitability and operational efficiency.',
    url: 'https://example.com/news/7',
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
    source: 'Reuters',
    sentiment: 'negative',
    sentimentScore: -0.5,
  },
  {
    id: '8',
    title: 'Renewable Energy Stocks Gain Momentum',
    summary: 'Shares of renewable energy companies are seeing increased investor interest as governments announce new green energy initiatives.',
    url: 'https://example.com/news/8',
    publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), // 16 hours ago
    source: 'Bloomberg',
    sentiment: 'positive',
    sentimentScore: 0.8,
  },
];

// Simple sentiment analysis function (in a real app, this would use OpenAI API)
function analyzeSentiment(text: string): { sentiment: 'positive' | 'negative' | 'neutral'; score: number } {
  const positiveWords = ['strong', 'growth', 'gain', 'rise', 'surge', 'rally', 'positive', 'better', 'increase', 'recovery', 'momentum'];
  const negativeWords = ['decline', 'fall', 'drop', 'crash', 'uncertainty', 'struggle', 'challenge', 'concern', 'tension', 'disruption'];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
    if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
  });
  
  const score = (positiveCount - negativeCount) / Math.max(words.length, 1);
  
  if (score > 0.1) return { sentiment: 'positive', score: Math.min(score, 1) };
  if (score < -0.1) return { sentiment: 'negative', score: Math.max(score, -1) };
  return { sentiment: 'neutral', score: 0 };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || 'all';

    // Filter news by category if specified
    let filteredNews = mockNews;
    if (category !== 'all') {
      // In a real app, you would filter by actual categories
      filteredNews = mockNews.slice(0, Math.min(limit, mockNews.length));
    }

    // Apply limit
    const limitedNews = filteredNews.slice(0, Math.min(limit, filteredNews.length));

    // In a real app, you would:
    // 1. Fetch news from Finnhub API or other news sources
    // 2. Use OpenAI API for sentiment analysis
    // 3. Store and cache results

    const response: ApiResponse<NewsItem[]> = {
      success: true,
      data: limitedNews,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('News fetch error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch news',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Text is required for sentiment analysis',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Analyze sentiment
    const sentimentResult = analyzeSentiment(text);

    const response: ApiResponse<{ sentiment: string; score: number }> = {
      success: true,
      data: sentimentResult,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to analyze sentiment',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

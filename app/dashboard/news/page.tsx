'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NewsFeed from '@/components/NewsFeed';
import { NewsItem } from '@/types';
import { RefreshCw, Filter, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/news?limit=20');
      const data = await response.json();
      
      if (data.success) {
        setNews(data.data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = news.filter(item => {
    const matchesFilter = filter === 'all' || item.sentiment === filter;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sentimentStats = {
    positive: news.filter(item => item.sentiment === 'positive').length,
    negative: news.filter(item => item.sentiment === 'negative').length,
    neutral: news.filter(item => item.sentiment === 'neutral').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">News Feed</h1>
          <p className="text-gray-400 mt-1">Latest financial news with AI sentiment analysis</p>
        </div>
        
        <button
          onClick={fetchNews}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-blue rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </motion.div>

      {/* Sentiment Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-sm text-gray-400">Positive</span>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-green-400">{sentimentStats.positive}</p>
            <p className="text-sm text-gray-400">Bullish news</p>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-sm text-gray-400">Negative</span>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-red-400">{sentimentStats.negative}</p>
            <p className="text-sm text-gray-400">Bearish news</p>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Minus className="w-6 h-6 text-yellow-500" />
            </div>
            <span className="text-sm text-gray-400">Neutral</span>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-yellow-400">{sentimentStats.neutral}</p>
            <p className="text-sm text-gray-400">Neutral news</p>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-effect rounded-xl p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Search News</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search headlines and content..."
                className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple"
              />
            </div>
          </div>

          {/* Sentiment Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Sentiment</label>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All', icon: Filter },
                { value: 'positive', label: 'Positive', icon: TrendingUp },
                { value: 'negative', label: 'Negative', icon: TrendingDown },
                { value: 'neutral', label: 'Neutral', icon: Minus },
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === option.value
                        ? 'bg-neon-purple text-white'
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* News Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-effect rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Latest News</h2>
          <span className="text-sm text-gray-400">
            {filteredNews.length} of {news.length} articles
          </span>
        </div>
        
        {filteredNews.length > 0 ? (
          <NewsFeed news={filteredNews} />
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-400">No news found</p>
            <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </motion.div>

      {/* AI Sentiment Analysis Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-effect rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4">AI Sentiment Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-white mb-2">How It Works</h3>
            <p className="text-sm text-gray-400 mb-3">
              Our AI analyzes news headlines and content using natural language processing to determine market sentiment.
            </p>
            <ul className="space-y-1 text-xs text-gray-500">
              <li>• Analyzes keywords and phrases</li>
              <li>• Considers context and tone</li>
              <li>• Provides confidence scores</li>
              <li>• Updates in real-time</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Sentiment Scores</h3>
            <p className="text-sm text-gray-400 mb-3">
              Sentiment scores range from -100% (very negative) to +100% (very positive).
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full" />
                <span className="text-sm text-gray-300">Positive: +10% to +100%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <span className="text-sm text-gray-300">Neutral: -10% to +10%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <span className="text-sm text-gray-300">Negative: -100% to -10%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

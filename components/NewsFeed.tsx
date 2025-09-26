'use client';

import { motion } from 'framer-motion';
import { NewsItem } from '@/types';
import { ExternalLink, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';

interface NewsFeedProps {
  news: NewsItem[];
}

export default function NewsFeed({ news }: NewsFeedProps) {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'border-green-400/30 bg-green-400/5';
      case 'negative':
        return 'border-red-400/30 bg-red-400/5';
      default:
        return 'border-yellow-400/30 bg-yellow-400/5';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const published = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {news.map((item, index) => (
        <motion.article
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-lg border ${getSentimentColor(item.sentiment)} hover:bg-dark-700/30 transition-colors cursor-pointer hover-glow`}
          whileHover={{ scale: 1.02 }}
          onClick={() => window.open(item.url, '_blank')}
        >
          {/* News Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-white text-sm leading-tight mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-2">
                {item.summary}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-3">
              {getSentimentIcon(item.sentiment)}
            </div>
          </div>

          {/* News Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className="font-medium">{item.source}</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(item.publishedAt)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                item.sentiment === 'positive' ? 'bg-green-400/20 text-green-400' :
                item.sentiment === 'negative' ? 'bg-red-400/20 text-red-400' :
                'bg-yellow-400/20 text-yellow-400'
              }`}>
                {item.sentiment}
              </span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Sentiment Score */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Sentiment Score</span>
              <span className={`text-xs font-medium ${
                item.sentimentScore > 0.1 ? 'text-green-400' :
                item.sentimentScore < -0.1 ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {(item.sentimentScore * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.abs(item.sentimentScore) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                className={`h-1 rounded-full ${
                  item.sentimentScore > 0.1 ? 'bg-green-400' :
                  item.sentimentScore < -0.1 ? 'bg-red-400' : 'bg-yellow-400'
                }`}
              />
            </div>
          </div>
        </motion.article>
      ))}

      {news.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-gray-400 text-xl">📰</span>
          </div>
          <p className="text-gray-400">No news available</p>
          <p className="text-sm text-gray-500">Check back later for updates</p>
        </div>
      )}
    </div>
  );
}

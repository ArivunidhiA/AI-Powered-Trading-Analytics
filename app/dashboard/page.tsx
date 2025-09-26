'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle } from 'lucide-react';
import MarketChart from '@/components/MarketChart';
import PortfolioSummary from '@/components/PortfolioSummary';
import AISignals from '@/components/AISignals';
import NewsFeed from '@/components/NewsFeed';
import { MarketData, Portfolio, AISignal, NewsItem } from '@/types';
import { fetchMarketData, fetchPortfolio, fetchSignals, fetchNews } from '@/lib/api';

export default function Dashboard() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [signals, setSignals] = useState<AISignal[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel using client-side API
        const [marketData, portfolioData, signalsData, newsData] = await Promise.all([
          fetchMarketData('AAPL'),
          fetchPortfolio(),
          fetchSignals('AAPL'),
          fetchNews(5)
        ]);

        if (marketData.success) setMarketData(marketData.data);
        if (portfolioData.success) setPortfolio(portfolioData.data);
        if (signalsData.success) setSignals([signalsData.data]);
        if (newsData.success) setNews(newsData.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Trading Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's your market overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Last updated</p>
          <p className="text-white font-medium">{new Date().toLocaleTimeString()}</p>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Market Performance */}
        <motion.div 
          className="glass-effect rounded-xl p-6 hover-glow cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => window.location.href = '/dashboard/market'}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-neon-purple/20 rounded-lg icon-glow">
              <TrendingUp className="w-6 h-6 text-neon-purple" />
            </div>
            <span className="text-sm text-gray-400">Market</span>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">
              {marketData ? `$${marketData.price.toFixed(2)}` : '--'}
            </p>
            <div className="flex items-center gap-2">
              {marketData && marketData.change >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${
                marketData && marketData.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {marketData ? `${marketData.changePercent.toFixed(2)}%` : '--'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Value */}
        <motion.div 
          className="glass-effect rounded-xl p-6 hover-glow cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => window.location.href = '/dashboard/portfolio'}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-neon-blue/20 rounded-lg icon-glow">
              <DollarSign className="w-6 h-6 text-neon-blue" />
            </div>
            <span className="text-sm text-gray-400">Portfolio</span>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">
              {portfolio ? `$${portfolio.totalValue.toLocaleString()}` : '--'}
            </p>
            <div className="flex items-center gap-2">
              {portfolio && portfolio.totalPnl >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${
                portfolio && portfolio.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolio ? `$${portfolio.totalPnl.toLocaleString()}` : '--'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* AI Signals */}
        <motion.div 
          className="glass-effect rounded-xl p-6 hover-glow cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => window.location.href = '/dashboard/signals'}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-neon-pink/20 rounded-lg icon-glow">
              <Activity className="w-6 h-6 text-neon-pink" />
            </div>
            <span className="text-sm text-gray-400">AI Signals</span>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">
              {signals.length > 0 ? signals[0].recommendation : '--'}
            </p>
            <p className="text-sm text-gray-400">
              {signals.length > 0 ? `${(signals[0].confidence * 100).toFixed(0)}% confidence` : 'No signals'}
            </p>
          </div>
        </motion.div>

        {/* Risk Level */}
        <motion.div 
          className="glass-effect rounded-xl p-6 hover-glow cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => window.location.href = '/dashboard/risk'}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg icon-glow">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <span className="text-sm text-gray-400">Risk Level</span>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">Medium</p>
            <p className="text-sm text-gray-400">Portfolio risk</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Market Overview</h2>
            {marketData ? (
              <MarketChart data={marketData} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Loading chart data...
              </div>
            )}
          </div>
        </motion.div>

        {/* Portfolio Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Portfolio</h2>
            {portfolio ? (
              <PortfolioSummary portfolio={portfolio} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Loading portfolio data...
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">AI Trading Signals</h2>
            {signals.length > 0 ? (
              <AISignals signals={signals} />
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400">
                Loading AI signals...
              </div>
            )}
          </div>
        </motion.div>

        {/* News Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Latest News</h2>
            {news.length > 0 ? (
              <NewsFeed news={news} />
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400">
                Loading news...
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

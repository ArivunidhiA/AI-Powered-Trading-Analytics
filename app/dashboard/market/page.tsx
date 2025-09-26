'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MarketChart from '@/components/MarketChart';
import { MarketData } from '@/types';
import { STOCKS, searchStocks } from '@/data/stocks';
import { Search, TrendingUp, TrendingDown, Volume, DollarSign, ChevronDown, X } from 'lucide-react';
import { fetchMarketData } from '@/lib/api';

export default function MarketPage() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [searchSymbol, setSearchSymbol] = useState('AAPL');
  const [loading, setLoading] = useState(false);
  const [showStockSelector, setShowStockSelector] = useState(false);
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');

  const fetchMarketDataForSymbol = async (symbol: string) => {
    try {
      setLoading(true);
      const data = await fetchMarketData(symbol);
      
      if (data.success) {
        setMarketData(data.data);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketDataForSymbol(searchSymbol);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchSymbol.trim()) {
      fetchMarketDataForSymbol(searchSymbol.trim());
    }
  };

  const handleStockSelect = (symbol: string) => {
    setSearchSymbol(symbol);
    setShowStockSelector(false);
    setStockSearchQuery('');
    fetchMarketDataForSymbol(symbol);
  };

  const getFilteredStocks = () => {
    let filtered = STOCKS;
    
    if (selectedSector !== 'All') {
      filtered = filtered.filter(stock => stock.sector === selectedSector);
    }
    
    if (stockSearchQuery.trim()) {
      filtered = searchStocks(stockSearchQuery);
    }
    
    return filtered.slice(0, 20); // Limit to 20 results for performance
  };

  const sectors = ['All', ...Array.from(new Set(STOCKS.map(stock => stock.sector)))];

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
          <h1 className="text-3xl font-bold text-white">Market Overview</h1>
          <p className="text-gray-400 mt-1">Real-time market data and analysis</p>
        </div>
        
        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
              placeholder="Search symbol (e.g., AAPL)"
              className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple"
            />
          </div>
          <button
            onClick={() => setShowStockSelector(!showStockSelector)}
            className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white font-medium hover:bg-dark-600 transition-colors flex items-center gap-2 button-glow"
          >
            Browse Stocks
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-blue rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 button-glow"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </motion.div>

      {/* Stock Selector Modal */}
      {showStockSelector && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowStockSelector(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-800 rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Select a Stock</h2>
              <button
                onClick={() => setShowStockSelector(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  value={stockSearchQuery}
                  onChange={(e) => setStockSearchQuery(e.target.value)}
                  placeholder="Search by symbol, name, or sector..."
                  className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple"
                />
              </div>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-neon-purple"
              >
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>

            {/* Stock List */}
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getFilteredStocks().map((stock) => (
                  <motion.button
                    key={stock.symbol}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStockSelect(stock.symbol)}
                    className="p-4 bg-dark-700 rounded-lg text-left hover:bg-dark-600 transition-colors border border-dark-600 hover:border-neon-purple hover-glow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-lg">{stock.symbol}</span>
                      <span className="text-xs text-gray-400">{stock.sector}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-1">{stock.name}</p>
                    <p className="text-xs text-gray-500">
                      Market Cap: ${(stock.marketCap / 1e9).toFixed(1)}B
                    </p>
                  </motion.button>
                ))}
              </div>
              {getFilteredStocks().length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No stocks found matching your criteria</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {marketData ? (
        <>
          {/* Market Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Current Price */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-neon-purple/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-neon-purple" />
                </div>
                <span className="text-sm text-gray-400">Current Price</span>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-white">
                  ${marketData.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-2">
                  {marketData.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    marketData.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {marketData.change >= 0 ? '+' : ''}{marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Volume */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-neon-blue/20 rounded-lg">
                  <Volume className="w-6 h-6 text-neon-blue" />
                </div>
                <span className="text-sm text-gray-400">Volume</span>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-white">
                  {marketData.volume.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Shares traded</p>
              </div>
            </div>

            {/* Market Cap */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-neon-pink/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-neon-pink" />
                </div>
                <span className="text-sm text-gray-400">Market Cap</span>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-white">
                  {marketData.marketCap ? `$${(marketData.marketCap / 1e9).toFixed(1)}B` : 'N/A'}
                </p>
                <p className="text-sm text-gray-400">Total value</p>
              </div>
            </div>

            {/* 52W High/Low */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-sm text-gray-400">52W Range</span>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-white">
                  ${Math.max(...marketData.data.map(d => d.high)).toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">
                  High: ${Math.max(...marketData.data.map(d => d.high)).toFixed(2)} / 
                  Low: ${Math.min(...marketData.data.map(d => d.low)).toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-effect rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Price Chart</h2>
            <MarketChart data={marketData} />
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Search for a Symbol</h3>
          <p className="text-gray-400">Enter a stock symbol to view market data and charts</p>
        </motion.div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AISignals from '@/components/AISignals';
import { AISignal } from '@/types';
import { STOCKS, searchStocks } from '@/data/stocks';
import { Search, RefreshCw, Brain, Target, ChevronDown, X } from 'lucide-react';

export default function SignalsPage() {
  const [signals, setSignals] = useState<AISignal[]>([]);
  const [searchSymbol, setSearchSymbol] = useState('AAPL');
  const [loading, setLoading] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [showStockSelector, setShowStockSelector] = useState(false);
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');

  const fetchSignal = async (symbol: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/signals?symbol=${symbol}`);
      const data = await response.json();
      
      if (data.success) {
        setSignals(prev => {
          const existingIndex = prev.findIndex(s => s.symbol === symbol);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = data.data;
            return updated;
          } else {
            return [...prev, data.data];
          }
        });
      }
    } catch (error) {
      console.error('Error fetching signal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchSymbol.trim()) {
      setSelectedSymbol(searchSymbol.trim());
      fetchSignal(searchSymbol.trim());
    }
  };

  const refreshAllSignals = async () => {
    setLoading(true);
    const symbols = signals.map(s => s.symbol);
    if (symbols.length === 0) symbols.push('AAPL');
    
    await Promise.all(symbols.map(symbol => fetchSignal(symbol)));
    setLoading(false);
  };

  const handleStockSelect = (symbol: string) => {
    setSearchSymbol(symbol);
    setShowStockSelector(false);
    setStockSearchQuery('');
    fetchSignal(symbol);
  };

  const getFilteredStocks = () => {
    let filtered = STOCKS;
    
    if (selectedSector !== 'All') {
      filtered = filtered.filter(stock => stock.sector === selectedSector);
    }
    
    if (stockSearchQuery.trim()) {
      filtered = searchStocks(stockSearchQuery);
    }
    
    return filtered.slice(0, 20);
  };

  const sectors = ['All', ...Array.from(new Set(STOCKS.map(stock => stock.sector)))];

  useEffect(() => {
    fetchSignal('AAPL');
  }, []);

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
          <h1 className="text-3xl font-bold text-white">AI Trading Signals</h1>
          <p className="text-gray-400 mt-1">AI-powered trading recommendations and analysis</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={refreshAllSignals}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white font-medium hover:bg-dark-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh All
          </button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-effect rounded-xl p-6"
      >
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Search Symbol</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
                placeholder="Enter symbol (e.g., AAPL, TSLA, MSFT)"
                className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple"
              />
            </div>
          </div>
          <div className="flex items-end gap-2">
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
              className="px-6 py-2 bg-gradient-to-r from-neon-purple to-neon-blue rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 button-glow"
            >
              {loading ? 'Analyzing...' : 'Get Signal'}
            </button>
          </div>
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

      {/* Signals Grid */}
      {signals.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {signals.map((signal, index) => (
            <motion.div
              key={signal.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AISignals signals={[signal]} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Signals Available</h3>
          <p className="text-gray-400">Search for a symbol to generate AI trading signals</p>
        </motion.div>
      )}

      {/* AI Features Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-effect rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4">AI Analysis Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Target className="w-6 h-6" />,
              title: "Technical Analysis",
              description: "RSI, MACD, Moving Averages, and more"
            },
            {
              icon: <Brain className="w-6 h-6" />,
              title: "Machine Learning",
              description: "Pattern recognition and trend analysis"
            },
            {
              icon: <RefreshCw className="w-6 h-6" />,
              title: "Real-time Updates",
              description: "Continuous monitoring and signal updates"
            },
            {
              icon: <Target className="w-6 h-6" />,
              title: "Confidence Scoring",
              description: "Risk-adjusted recommendations"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-neon-purple mb-3 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

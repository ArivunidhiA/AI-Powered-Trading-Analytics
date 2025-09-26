'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiskMetrics } from '@/types';
import { Shield, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Search } from 'lucide-react';
import { fetchRiskMetrics as fetchRiskData } from '@/lib/api';

export default function RiskPage() {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [searchSymbol, setSearchSymbol] = useState('AAPL');
  const [loading, setLoading] = useState(false);

  const fetchRiskMetricsData = async (symbol: string) => {
    try {
      setLoading(true);
      const data = await fetchRiskData(symbol);
      
      if (data.success) {
        setRiskMetrics(data.data);
      }
    } catch (error) {
      console.error('Error fetching risk metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchSymbol.trim()) {
      fetchRiskMetricsData(searchSymbol.trim());
    }
  };

  useEffect(() => {
    fetchRiskMetricsData('AAPL');
  }, []);

  const getRiskLevel = (volatility: number) => {
    if (volatility < 15) return { level: 'Low', color: 'text-green-400', bgColor: 'bg-green-400/20' };
    if (volatility < 25) return { level: 'Medium', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' };
    return { level: 'High', color: 'text-red-400', bgColor: 'bg-red-400/20' };
  };

  const getSharpeRating = (sharpe: number) => {
    if (sharpe > 1) return { rating: 'Excellent', color: 'text-green-400' };
    if (sharpe > 0.5) return { rating: 'Good', color: 'text-yellow-400' };
    if (sharpe > 0) return { rating: 'Fair', color: 'text-orange-400' };
    return { rating: 'Poor', color: 'text-red-400' };
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
          <h1 className="text-3xl font-bold text-white">Risk Monitor</h1>
          <p className="text-gray-400 mt-1">Comprehensive risk analysis and portfolio metrics</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-effect rounded-xl p-6"
      >
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Analyze Symbol</label>
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
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-neon-purple to-neon-blue rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Risk'}
            </button>
          </div>
        </form>
      </motion.div>

      {riskMetrics ? (
        <>
          {/* Risk Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Volatility */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-neon-purple/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-neon-purple" />
                </div>
                <span className="text-sm text-gray-400">Volatility</span>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-white">
                  {riskMetrics.volatility.toFixed(1)}%
                </p>
                <div className={`px-2 py-1 rounded text-xs font-medium ${getRiskLevel(riskMetrics.volatility).bgColor} ${getRiskLevel(riskMetrics.volatility).color}`}>
                  {getRiskLevel(riskMetrics.volatility).level} Risk
                </div>
              </div>
            </div>

            {/* Sharpe Ratio */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-neon-blue/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-neon-blue" />
                </div>
                <span className="text-sm text-gray-400">Sharpe Ratio</span>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-white">
                  {riskMetrics.sharpeRatio.toFixed(2)}
                </p>
                <div className={`text-sm font-medium ${getSharpeRating(riskMetrics.sharpeRatio).color}`}>
                  {getSharpeRating(riskMetrics.sharpeRatio).rating}
                </div>
              </div>
            </div>

            {/* Max Drawdown */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-red-500" />
                </div>
                <span className="text-sm text-gray-400">Max Drawdown</span>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-red-400">
                  -{riskMetrics.maxDrawdown.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-400">Worst loss period</p>
              </div>
            </div>

            {/* Beta */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Shield className="w-6 h-6 text-yellow-500" />
                </div>
                <span className="text-sm text-gray-400">Beta</span>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-white">
                  {riskMetrics.beta.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">
                  {riskMetrics.beta > 1 ? 'More volatile' : 'Less volatile'} than market
                </p>
              </div>
            </div>
          </motion.div>

          {/* Advanced Risk Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* VaR and CVaR */}
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Value at Risk</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">VaR (95%)</p>
                    <p className="text-2xl font-bold text-white">
                      {riskMetrics.var95.toFixed(2)}%
                    </p>
                    <p className="text-xs text-gray-500">Daily loss probability</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-400">CVaR (95%)</p>
                    <p className="text-2xl font-bold text-white">
                      {riskMetrics.cvar95.toFixed(2)}%
                    </p>
                    <p className="text-xs text-gray-500">Expected loss beyond VaR</p>
                  </div>
                  <Shield className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>

            {/* Risk Summary */}
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Risk Summary</h2>
              <div className="space-y-4">
                <div className="p-4 bg-dark-700/50 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Risk Level</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      getRiskLevel(riskMetrics.volatility).level === 'Low' ? 'bg-green-400' :
                      getRiskLevel(riskMetrics.volatility).level === 'Medium' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                    <span className={`font-medium ${getRiskLevel(riskMetrics.volatility).color}`}>
                      {getRiskLevel(riskMetrics.volatility).level}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 bg-dark-700/50 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Risk-Adjusted Return</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      getSharpeRating(riskMetrics.sharpeRatio).rating === 'Excellent' ? 'bg-green-400' :
                      getSharpeRating(riskMetrics.sharpeRatio).rating === 'Good' ? 'bg-yellow-400' :
                      getSharpeRating(riskMetrics.sharpeRatio).rating === 'Fair' ? 'bg-orange-400' : 'bg-red-400'
                    }`} />
                    <span className={`font-medium ${getSharpeRating(riskMetrics.sharpeRatio).color}`}>
                      {getSharpeRating(riskMetrics.sharpeRatio).rating}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-dark-700/50 rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Market Correlation</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      riskMetrics.beta > 1.2 ? 'bg-red-400' :
                      riskMetrics.beta < 0.8 ? 'bg-green-400' : 'bg-yellow-400'
                    }`} />
                    <span className="text-white font-medium">
                      {riskMetrics.beta > 1.2 ? 'High correlation' :
                       riskMetrics.beta < 0.8 ? 'Low correlation' : 'Moderate correlation'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Risk Data Available</h3>
          <p className="text-gray-400">Search for a symbol to analyze its risk metrics</p>
        </motion.div>
      )}

      {/* Risk Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-effect rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Understanding Risk Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-white mb-2">Volatility</h3>
            <p className="text-sm text-gray-400 mb-3">
              Measures the degree of price variation over time. Higher volatility indicates greater price swings.
            </p>
            <div className="space-y-1 text-xs text-gray-500">
              <p>• Low: &lt; 15% (Stable)</p>
              <p>• Medium: 15-25% (Moderate)</p>
              <p>• High: &gt; 25% (Volatile)</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Sharpe Ratio</h3>
            <p className="text-sm text-gray-400 mb-3">
              Risk-adjusted return measure. Higher values indicate better risk-adjusted performance.
            </p>
            <div className="space-y-1 text-xs text-gray-500">
              <p>• Excellent: &gt; 1.0</p>
              <p>• Good: 0.5 - 1.0</p>
              <p>• Fair: 0 - 0.5</p>
              <p>• Poor: &lt; 0</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

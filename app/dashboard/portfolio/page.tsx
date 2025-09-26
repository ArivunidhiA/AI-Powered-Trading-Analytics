'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Portfolio, Position } from '@/types';
import { TrendingUp, TrendingDown, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { fetchPortfolio } from '@/lib/api';

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPosition, setNewPosition] = useState({
    symbol: '',
    quantity: 0,
    price: 0
  });

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const data = await fetchPortfolio();
      
      if (data.success) {
        setPortfolio(data.data);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_position',
          ...newPosition
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setPortfolio(data.data);
        setNewPosition({ symbol: '', quantity: 0, price: 0 });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding position:', error);
    }
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
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
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Portfolio</h1>
          <p className="text-gray-400 mt-1">Manage your investments and track performance</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-blue rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Position
        </button>
      </motion.div>

      {/* Add Position Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Add New Position</h2>
          <form onSubmit={handleAddPosition} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
              <input
                type="text"
                value={newPosition.symbol}
                onChange={(e) => setNewPosition({ ...newPosition, symbol: e.target.value.toUpperCase() })}
                placeholder="e.g., AAPL"
                className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
              <input
                type="number"
                value={newPosition.quantity}
                onChange={(e) => setNewPosition({ ...newPosition, quantity: Number(e.target.value) })}
                placeholder="0"
                className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price per Share</label>
              <input
                type="number"
                step="0.01"
                value={newPosition.price}
                onChange={(e) => setNewPosition({ ...newPosition, price: Number(e.target.value) })}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple"
                required
              />
            </div>
            <div className="md:col-span-3 flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-neon-purple to-neon-blue rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
              >
                Add Position
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white font-medium hover:bg-dark-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {portfolio && (
        <>
          {/* Portfolio Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Total Value */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-neon-purple/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-neon-purple" />
                </div>
                <span className="text-sm text-gray-400">Total Value</span>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(portfolio.totalValue)}
                </p>
                <div className="flex items-center gap-2">
                  {portfolio.totalPnl >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    portfolio.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {portfolio.totalPnl >= 0 ? '+' : ''}{formatCurrency(portfolio.totalPnl)} ({portfolio.totalPnlPercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Total P&L */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-neon-blue/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-neon-blue" />
                </div>
                <span className="text-sm text-gray-400">Total P&L</span>
              </div>
              <div className="space-y-2">
                <p className={`text-3xl font-bold ${
                  portfolio.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {portfolio.totalPnl >= 0 ? '+' : ''}{formatCurrency(portfolio.totalPnl)}
                </p>
                <p className="text-sm text-gray-400">
                  {portfolio.totalPnlPercent >= 0 ? '+' : ''}{portfolio.totalPnlPercent.toFixed(2)}% return
                </p>
              </div>
            </div>

            {/* Positions Count */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-neon-pink/20 rounded-lg">
                  <Eye className="w-6 h-6 text-neon-pink" />
                </div>
                <span className="text-sm text-gray-400">Positions</span>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-white">
                  {portfolio.positions.length}
                </p>
                <p className="text-sm text-gray-400">
                  Active positions
                </p>
              </div>
            </div>
          </motion.div>

          {/* Positions Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-effect rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Positions</h2>
            
            {portfolio.positions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-600">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Symbol</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Quantity</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Avg Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Current Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Value</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">P&L</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.positions.map((position, index) => (
                      <motion.tr
                        key={position.symbol}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-white">{position.symbol}</p>
                            <p className="text-sm text-gray-400">{position.name}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white">{position.quantity}</td>
                        <td className="py-3 px-4 text-white">{formatCurrency(position.avgPrice)}</td>
                        <td className="py-3 px-4 text-white">{formatCurrency(position.currentPrice)}</td>
                        <td className="py-3 px-4 text-white">{formatCurrency(position.value)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {position.pnl >= 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-400" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-400" />
                            )}
                            <span className={`font-medium ${
                              position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {position.pnl >= 0 ? '+' : ''}{formatCurrency(position.pnl)} ({position.pnlPercent.toFixed(2)}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button className="p-1 text-red-400 hover:text-red-300 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <EyeOff className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No positions found</p>
                <p className="text-sm text-gray-500">Add your first position to get started</p>
              </div>
            )}
          </motion.div>

          {/* Watchlist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-effect rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Watchlist</h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.watchlist.map((symbol, index) => (
                <motion.span
                  key={symbol}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-3 py-1 bg-dark-700 rounded-full text-sm text-gray-300 hover:text-white hover:bg-dark-600 transition-colors cursor-pointer"
                >
                  {symbol}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

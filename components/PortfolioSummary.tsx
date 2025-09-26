'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Portfolio, Position } from '@/types';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';

interface PortfolioSummaryProps {
  portfolio: Portfolio;
}

export default function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  // Prepare data for pie chart
  const pieData = portfolio.positions.map(position => ({
    name: position.symbol,
    value: position.value,
    color: position.pnl >= 0 ? '#10B981' : '#EF4444'
  }));

  const COLORS = ['#8B5CF6', '#06B6D4', '#EC4899', '#10B981', '#F59E0B'];

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="space-y-4">
      {/* Portfolio Summary */}
      <div className="text-center">
        <p className="text-2xl font-bold text-white">{formatCurrency(portfolio.totalValue)}</p>
        <div className="flex items-center justify-center gap-2 mt-1">
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

      {/* Pie Chart */}
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={50}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Value']}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Holdings List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-300">Holdings</h4>
          <button className="p-1 text-neon-purple hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {portfolio.positions.slice(0, 3).map((position, index) => (
            <motion.div
              key={position.symbol}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-2 rounded-lg bg-dark-700/50 hover:bg-dark-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium text-white">{position.symbol}</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-white">{formatCurrency(position.value)}</p>
                <p className={`text-xs ${
                  position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(1)}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Watchlist */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-300">Watchlist</h4>
        <div className="flex flex-wrap gap-2">
          {portfolio.watchlist.slice(0, 4).map((symbol, index) => (
            <motion.span
              key={symbol}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="px-2 py-1 bg-dark-700 rounded text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              {symbol}
            </motion.span>
          ))}
          {portfolio.watchlist.length > 4 && (
            <span className="px-2 py-1 bg-dark-700 rounded text-xs text-gray-400">
              +{portfolio.watchlist.length - 4} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

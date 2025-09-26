'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import { MarketData } from '@/types';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface MarketChartProps {
  data: MarketData;
}

export default function MarketChart({ data }: MarketChartProps) {
  const [chartType, setChartType] = useState<'line' | 'volume'>('line');

  // Transform data for charts
  const chartData = data.data.map(item => ({
    ...item,
    timestamp: new Date(item.timestamp).toLocaleDateString(),
    date: new Date(item.timestamp).getTime(),
  }));

  const formatPrice = (value: number) => `$${value.toFixed(2)}`;

  return (
    <div className="space-y-4">
      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">{data.symbol}</h3>
          <span className="text-sm text-gray-400">{data.name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType('line')}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'line'
                ? 'bg-neon-purple text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Line
          </button>
          <button
            onClick={() => setChartType('volume')}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'volume'
                ? 'bg-neon-purple text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Volume
          </button>
        </div>
      </div>

      {/* Price Info */}
      <div className="flex items-center gap-6">
        <div>
          <p className="text-3xl font-bold text-white">{formatPrice(data.price)}</p>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${
              data.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="text-right text-sm text-gray-400">
          <p>Volume: {data.volume.toLocaleString()}</p>
          {data.marketCap && (
            <p>Market Cap: ${(data.marketCap / 1e9).toFixed(1)}B</p>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatPrice}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value: number) => [formatPrice(value), 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#8B5CF6' }}
              />
            </LineChart>
          ) : (
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatPrice}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value: number, name: string) => [
                  name === 'volume' ? value.toLocaleString() : formatPrice(value), 
                  name === 'volume' ? 'Volume' : 'Price'
                ]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar
                dataKey="volume"
                fill="#06B6D4"
                opacity={0.3}
              />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#8B5CF6' }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

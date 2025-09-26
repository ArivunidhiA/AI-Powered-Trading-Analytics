'use client';

import { motion } from 'framer-motion';
import { AISignal } from '@/types';
import { TrendingUp, TrendingDown, Minus, Brain, Target } from 'lucide-react';

interface AISignalsProps {
  signals: AISignal[];
}

export default function AISignals({ signals }: AISignalsProps) {
  const getSignalIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'SELL':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <Minus className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getSignalColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return 'border-green-400 bg-green-400/10';
      case 'SELL':
        return 'border-red-400 bg-red-400/10';
      default:
        return 'border-yellow-400 bg-yellow-400/10';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-4">
      {signals.map((signal, index) => (
        <motion.div
          key={signal.symbol}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-lg border-2 ${getSignalColor(signal.recommendation)}`}
        >
          {/* Signal Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neon-purple/20 rounded-lg">
                <Brain className="w-5 h-5 text-neon-purple" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{signal.symbol}</h3>
                <p className="text-sm text-gray-400">AI Signal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getSignalIcon(signal.recommendation)}
              <span className="font-bold text-white">{signal.recommendation}</span>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Confidence</span>
              <span className={`text-sm font-medium ${getConfidenceColor(signal.confidence)}`}>
                {(signal.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${signal.confidence * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-2 rounded-full ${
                  signal.confidence >= 0.8 ? 'bg-green-400' :
                  signal.confidence >= 0.6 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
              />
            </div>
          </div>

          {/* Reasoning */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Analysis</h4>
            <p className="text-sm text-gray-400 leading-relaxed">{signal.reasoning}</p>
          </div>

          {/* Technical Indicators */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Technical Indicators</h4>
            <div className="grid grid-cols-2 gap-2">
              {signal.technicalIndicators.map((indicator, idx) => (
                <motion.div
                  key={indicator.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + idx * 0.1 }}
                  className="p-2 bg-dark-700/50 rounded text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300">{indicator.name}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      indicator.signal === 'bullish' ? 'bg-green-400' :
                      indicator.signal === 'bearish' ? 'bg-red-400' : 'bg-yellow-400'
                    }`} />
                  </div>
                  <p className="text-gray-400 truncate">{indicator.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Timestamp */}
          <div className="mt-3 pt-3 border-t border-dark-600">
            <p className="text-xs text-gray-500">
              Generated: {new Date(signal.timestamp).toLocaleString()}
            </p>
          </div>
        </motion.div>
      ))}

      {signals.length === 0 && (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-400">No AI signals available</p>
          <p className="text-sm text-gray-500">Check back later for new recommendations</p>
        </div>
      )}
    </div>
  );
}

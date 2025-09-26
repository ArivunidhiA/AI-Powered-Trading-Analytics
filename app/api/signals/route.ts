import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import { AISignal, TechnicalIndicator, ApiResponse } from '@/types';

// Technical Analysis Functions
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macd = ema12 - ema26;
  
  // Simplified signal line (9-period EMA of MACD)
  const signal = calculateEMA([macd], 9);
  const histogram = macd - signal;

  return { macd, signal, histogram };
}

function calculateEMA(prices: number[], period: number): number {
  if (prices.length === 0) return 0;
  if (prices.length === 1) return prices[0];

  const multiplier = 2 / (period + 1);
  let ema = prices[0];

  for (let i = 1; i < prices.length; i++) {
    ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
  }

  return ema;
}

function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1] || 0;
  
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
}

function generateAISignal(symbol: string, indicators: TechnicalIndicator[]): AISignal {
  const rsi = indicators.find(i => i.name === 'RSI');
  const macd = indicators.find(i => i.name === 'MACD');
  const sma20 = indicators.find(i => i.name === 'SMA20');
  const sma50 = indicators.find(i => i.name === 'SMA50');

  let recommendation: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
  let confidence = 0.5;
  let reasoning = '';

    // Simple signal logic
    if (rsi && macd && sma20 && sma50) {
      let bullishSignals = 0;
      let bearishSignals = 0;

    // RSI signals
    if (rsi.value < 30) {
      bullishSignals++;
      reasoning += 'RSI indicates oversold conditions. ';
    } else if (rsi.value > 70) {
      bearishSignals++;
      reasoning += 'RSI indicates overbought conditions. ';
    }

    // MACD signals
    if (macd.signal === 'bullish') {
      bullishSignals++;
      reasoning += 'MACD shows bullish momentum. ';
    } else if (macd.signal === 'bearish') {
      bearishSignals++;
      reasoning += 'MACD shows bearish momentum. ';
    }

    // Moving average signals
    if (sma20.value > sma50.value) {
      bullishSignals++;
      reasoning += 'Short-term trend is above long-term trend. ';
    } else {
      bearishSignals++;
      reasoning += 'Short-term trend is below long-term trend. ';
    }

    // Determine recommendation
    if (bullishSignals > bearishSignals) {
      recommendation = 'BUY';
      confidence = Math.min(0.9, 0.5 + (bullishSignals - bearishSignals) * 0.1);
    } else if (bearishSignals > bullishSignals) {
      recommendation = 'SELL';
      confidence = Math.min(0.9, 0.5 + (bearishSignals - bullishSignals) * 0.1);
    } else {
      recommendation = 'HOLD';
      confidence = 0.5;
    }

    if (reasoning === '') {
      reasoning = 'Mixed signals from technical indicators.';
    }
  }

  return {
    symbol,
    recommendation,
    confidence,
    reasoning,
    technicalIndicators: indicators,
    timestamp: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'AAPL';

    // Fetch historical data
    const historical = await yahooFinance.historical(symbol, {
      period1: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      period2: new Date(),
      interval: '1d',
    });

    if (historical.length === 0) {
      throw new Error('No historical data available');
    }

    const prices = historical.map((item: any) => item.close).reverse();
    const currentPrice = prices[prices.length - 1];

    // Calculate technical indicators
    const rsi = calculateRSI(prices);
    const macdData = calculateMACD(prices);
    const sma20 = calculateSMA(prices, 20);
    const sma50 = calculateSMA(prices, 50);

    const indicators: TechnicalIndicator[] = [
      {
        name: 'RSI',
        value: rsi,
        signal: rsi < 30 ? 'bullish' : rsi > 70 ? 'bearish' : 'neutral',
        description: `RSI: ${rsi.toFixed(2)} - ${rsi < 30 ? 'Oversold' : rsi > 70 ? 'Overbought' : 'Neutral'}`,
      },
      {
        name: 'MACD',
        value: macdData.macd,
        signal: macdData.histogram > 0 ? 'bullish' : 'bearish',
        description: `MACD: ${macdData.macd.toFixed(4)}, Signal: ${macdData.signal.toFixed(4)}`,
      },
      {
        name: 'SMA20',
        value: sma20,
        signal: currentPrice > sma20 ? 'bullish' : 'bearish',
        description: `20-day SMA: $${sma20.toFixed(2)}`,
      },
      {
        name: 'SMA50',
        value: sma50,
        signal: currentPrice > sma50 ? 'bullish' : 'bearish',
        description: `50-day SMA: $${sma50.toFixed(2)}`,
      },
    ];

    // Generate AI signal
    const signal = generateAISignal(symbol, indicators);

    const response: ApiResponse<AISignal> = {
      success: true,
      data: signal,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Signals fetch error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to generate trading signals',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

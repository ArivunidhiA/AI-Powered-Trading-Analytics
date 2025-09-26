import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import { RiskMetrics, ApiResponse } from '@/types';

function calculateVolatility(returns: number[]): number {
  if (returns.length < 2) return 0;
  
  const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / (returns.length - 1);
  
  return Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility
}

function calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.02): number {
  if (returns.length < 2) return 0;
  
  const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const volatility = calculateVolatility(returns);
  
  if (volatility === 0) return 0;
  
  return (meanReturn * 252 - riskFreeRate) / volatility; // Annualized Sharpe ratio
}

function calculateMaxDrawdown(prices: number[]): number {
  if (prices.length < 2) return 0;
  
  let maxPrice = prices[0];
  let maxDrawdown = 0;
  
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > maxPrice) {
      maxPrice = prices[i];
    } else {
      const drawdown = (maxPrice - prices[i]) / maxPrice;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  }
  
  return maxDrawdown;
}

function calculateBeta(assetReturns: number[], marketReturns: number[]): number {
  if (assetReturns.length !== marketReturns.length || assetReturns.length < 2) return 1;
  
  const assetMean = assetReturns.reduce((sum, ret) => sum + ret, 0) / assetReturns.length;
  const marketMean = marketReturns.reduce((sum, ret) => sum + ret, 0) / marketReturns.length;
  
  let covariance = 0;
  let marketVariance = 0;
  
  for (let i = 0; i < assetReturns.length; i++) {
    const assetDiff = assetReturns[i] - assetMean;
    const marketDiff = marketReturns[i] - marketMean;
    
    covariance += assetDiff * marketDiff;
    marketVariance += marketDiff * marketDiff;
  }
  
  return marketVariance === 0 ? 1 : covariance / marketVariance;
}

function calculateVaR(returns: number[], confidence: number = 0.95): number {
  if (returns.length === 0) return 0;
  
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sortedReturns.length);
  
  return sortedReturns[index] || 0;
}

function calculateCVaR(returns: number[], confidence: number = 0.95): number {
  const var95 = calculateVaR(returns, confidence);
  const tailReturns = returns.filter(ret => ret <= var95);
  
  if (tailReturns.length === 0) return var95;
  
  return tailReturns.reduce((sum, ret) => sum + ret, 0) / tailReturns.length;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'AAPL';
    const benchmark = searchParams.get('benchmark') || '^GSPC'; // S&P 500

    // Fetch historical data for the asset
    const assetHistorical = await yahooFinance.historical(symbol, {
      period1: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
      period2: new Date(),
      interval: '1d',
    });

    // Fetch historical data for the benchmark
    const benchmarkHistorical = await yahooFinance.historical(benchmark, {
      period1: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
      period2: new Date(),
      interval: '1d',
    });

    if (assetHistorical.length === 0) {
      throw new Error('No historical data available for the asset');
    }

    // Calculate daily returns
    const assetPrices = assetHistorical.map((item: any) => item.close).reverse();
    const assetReturns = [];
    for (let i = 1; i < assetPrices.length; i++) {
      assetReturns.push((assetPrices[i] - assetPrices[i - 1]) / assetPrices[i - 1]);
    }

    // Calculate benchmark returns if available
    let benchmarkReturns: number[] = [];
    if (benchmarkHistorical.length > 0) {
      const benchmarkPrices = benchmarkHistorical.map((item: any) => item.close).reverse();
      for (let i = 1; i < benchmarkPrices.length; i++) {
        benchmarkReturns.push((benchmarkPrices[i] - benchmarkPrices[i - 1]) / benchmarkPrices[i - 1]);
      }
    }

    // Calculate risk metrics
    const volatility = calculateVolatility(assetReturns);
    const sharpeRatio = calculateSharpeRatio(assetReturns);
    const maxDrawdown = calculateMaxDrawdown(assetPrices);
    const beta = benchmarkReturns.length > 0 ? calculateBeta(assetReturns, benchmarkReturns) : 1;
    const var95 = calculateVaR(assetReturns, 0.95);
    const cvar95 = calculateCVaR(assetReturns, 0.95);

    const riskMetrics: RiskMetrics = {
      volatility: volatility * 100, // Convert to percentage
      sharpeRatio,
      maxDrawdown: maxDrawdown * 100, // Convert to percentage
      beta,
      var95: var95 * 100, // Convert to percentage
      cvar95: cvar95 * 100, // Convert to percentage
    };

    const response: ApiResponse<RiskMetrics> = {
      success: true,
      data: riskMetrics,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Risk metrics calculation error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to calculate risk metrics',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

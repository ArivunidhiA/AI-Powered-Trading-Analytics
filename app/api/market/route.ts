import { NextRequest, NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import { MarketData, OHLCData, ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'AAPL';
    const interval = searchParams.get('interval') || '1d';
    const range = searchParams.get('range') || '1mo';

    // Fetch data from Yahoo Finance
    const quote = await yahooFinance.quote(symbol);
    const historical = await yahooFinance.historical(symbol, {
      period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      period2: new Date(),
      interval: interval as any,
    });

    // Transform data to our format
    const ohlcData: OHLCData[] = historical.map((item: any) => ({
      timestamp: item.date.toISOString(),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    const marketData: MarketData = {
      symbol: symbol.toUpperCase(),
      name: quote.longName || quote.shortName || symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume || 0,
      marketCap: quote.marketCap,
      data: ohlcData,
    };

    const response: ApiResponse<MarketData> = {
      success: true,
      data: marketData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Market data fetch error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch market data',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

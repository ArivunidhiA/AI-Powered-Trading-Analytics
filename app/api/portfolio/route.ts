import { NextRequest, NextResponse } from 'next/server';
import { Portfolio, Position, ApiResponse } from '@/types';
import yahooFinance from 'yahoo-finance2';

// Mock portfolio data - in a real app, this would be stored in a database
let mockPortfolio: Portfolio = {
  totalValue: 0,
  totalPnl: 0,
  totalPnlPercent: 0,
  positions: [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: 10,
      avgPrice: 150.00,
      currentPrice: 0,
      value: 0,
      pnl: 0,
      pnlPercent: 0,
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      quantity: 5,
      avgPrice: 200.00,
      currentPrice: 0,
      value: 0,
      pnl: 0,
      pnlPercent: 0,
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      quantity: 8,
      avgPrice: 300.00,
      currentPrice: 0,
      value: 0,
      pnl: 0,
      pnlPercent: 0,
    },
  ],
  watchlist: ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'],
};

export async function GET() {
  try {
    // Update current prices for all positions
    const updatedPositions = await Promise.all(
      mockPortfolio.positions.map(async (position) => {
        try {
          const quote = await yahooFinance.quote(position.symbol);
          const currentPrice = quote.regularMarketPrice || position.avgPrice;
          const value = position.quantity * currentPrice;
          const pnl = value - (position.quantity * position.avgPrice);
          const pnlPercent = (pnl / (position.quantity * position.avgPrice)) * 100;

          return {
            ...position,
            currentPrice,
            value,
            pnl,
            pnlPercent,
          };
        } catch (error) {
          console.error(`Error fetching price for ${position.symbol}:`, error);
          return position;
        }
      })
    );

    // Calculate totals
    const totalValue = updatedPositions.reduce((sum, pos) => sum + pos.value, 0);
    const totalCost = updatedPositions.reduce((sum, pos) => sum + (pos.quantity * pos.avgPrice), 0);
    const totalPnl = totalValue - totalCost;
    const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

    const updatedPortfolio: Portfolio = {
      ...mockPortfolio,
      positions: updatedPositions,
      totalValue,
      totalPnl,
      totalPnlPercent,
    };

    const response: ApiResponse<Portfolio> = {
      success: true,
      data: updatedPortfolio,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch portfolio data',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, symbol, quantity, price } = body;

    if (action === 'add_position') {
      // Add new position logic
      const newPosition: Position = {
        symbol: symbol.toUpperCase(),
        name: symbol, // In real app, fetch company name
        quantity: quantity || 0,
        avgPrice: price || 0,
        currentPrice: price || 0,
        value: (quantity || 0) * (price || 0),
        pnl: 0,
        pnlPercent: 0,
      };

      mockPortfolio.positions.push(newPosition);
    } else if (action === 'add_watchlist') {
      if (!mockPortfolio.watchlist.includes(symbol.toUpperCase())) {
        mockPortfolio.watchlist.push(symbol.toUpperCase());
      }
    }

    const response: ApiResponse<Portfolio> = {
      success: true,
      data: mockPortfolio,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Portfolio update error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update portfolio',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

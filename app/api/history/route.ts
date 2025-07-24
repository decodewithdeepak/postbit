import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        requests: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
        message: 'Database not configured. History is not available.',
      });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    try {
      const { getHistory } = await import('@/lib/getHistory');
      const result = await getHistory(page, limit);
      return NextResponse.json({
        requests: result.requests.map(req => ({
          id: req.id,
          method: req.method,
          url: req.url,
          headers: typeof req.headers === 'string' ? JSON.parse(req.headers) : (req.headers || {}),
          body: req.body,
          response: typeof req.response === 'string' ? JSON.parse(req.response) : (req.response || {}),
          createdAt: req.created_at ? new Date(req.created_at).toISOString() : undefined,
        })),
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (dbError) {
      console.warn('Database connection failed:', dbError);
      return NextResponse.json({
        requests: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
        message: 'Database connection failed. History is not available.',
      });
    }
  } catch (error: any) {
    console.error('History Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
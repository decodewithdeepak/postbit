import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { method, url, headers, body } = await request.json();

    let responseData;
    const startTime = Date.now();

    try {
      // Make the HTTP request
      const response = await axios({
        method: method.toLowerCase(),
        url,
        headers,
        data: body ? JSON.parse(body) : undefined,
        timeout: 30000,
        validateStatus: () => true, // Don't throw on any status code
      });

      const duration = Date.now() - startTime;

      responseData = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        duration,
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;

      responseData = {
        status: 0,
        statusText: 'Network Error',
        headers: {},
        data: { error: error.message },
        duration,
      };
    }

    // Try to save to database using pg driver if configured
    let requestId = null;
    if (process.env.DATABASE_URL) {
      try {
        const { saveHistory } = await import('@/lib/saveHistory');
        requestId = await saveHistory({
          method,
          url,
          headers,
          body,
          response: responseData,
        });
      } catch (dbError) {
        console.warn('Failed to save to database:', dbError);
      }
    }
    return NextResponse.json({
      id: requestId,
      response: responseData,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
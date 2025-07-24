// lib/saveHistory.ts
import { Client } from 'pg';

export async function saveHistory(request: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: string;
    response?: any;
}) {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    const query = `INSERT INTO api_request (method, url, headers, body, response, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id`;
    const values = [
        request.method,
        request.url,
        JSON.stringify(request.headers || {}),
        request.body || '',
        JSON.stringify(request.response || {}),
    ];
    try {
        const res = await client.query(query, values);
        await client.end();
        return res.rows[0].id;
    } catch (err) {
        await client.end();
        return null;
    }
}

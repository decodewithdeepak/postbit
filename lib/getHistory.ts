// lib/getHistory.ts
import { Client } from 'pg';

export async function getHistory(page: number = 1, limit: number = 10) {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    const offset = (page - 1) * limit;
    const query = `SELECT * FROM api_request ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
    try {
        const res = await client.query(query, [limit, offset]);
        const countRes = await client.query('SELECT COUNT(*) FROM api_request');
        await client.end();
        return {
            requests: res.rows,
            total: parseInt(countRes.rows[0].count, 10),
        };
    } catch (err) {
        await client.end();
        return {
            requests: [],
            total: 0,
            error: err,
        };
    }
}

import { NextRequest } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('shareId');

  const result = await sql`
      SELECT *
      FROM shopping_list
      WHERE share_id = ${query}
      LIMIT 1;
    `;
  const data = result[0];
  return Response.json(data);
}

export async function POST(req: Request) {
  const { name, items, categories, shareId } = await req.json();

  const listData = {
    name,
    items,
    categories,
  };

  const result = await sql`
    INSERT INTO shopping_list (share_id, list)
    VALUES (${shareId}, ${listData})
    RETURNING *;
  `;

  return Response.json(result[0]);
}

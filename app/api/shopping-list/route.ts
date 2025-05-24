import { supabase } from '@/lib/supabaseClient';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('id');

  if (query) {
    const { data } = await supabase.from('shopping_list').select('*').eq('id', query).single();
    return Response.json(data);
  }

  const { data } = await supabase.from('shopping_list').select('*');
  return Response.json(data);
}

export async function POST(req: Request) {
  const { title } = await req.json();
  const { data } = await supabase.from('shopping_list').insert({ title }).select().single();

  return Response.json(data);
}

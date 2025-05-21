import { supabase } from '@/lib/supabaseClient';
import { NextRequest } from 'next/server';

export async function POST(req: Request) {
  const { name, shopping_list_id } = await req.json();
  const { data } = await supabase
    .from('shopping_item')
    .insert({ name: name, shopping_list_id: shopping_list_id })
    .select()
    .single();

  return Response.json(data);
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('shopping_list_id');

  const { data } = await supabase.from('shopping_item').select('*').eq('shopping_list_id', query);

  return Response.json(data);
}

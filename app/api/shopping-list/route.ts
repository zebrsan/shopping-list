import { supabase } from '@/lib/supabaseClient';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('shareId');

  if (query) {
    const { data } = await supabase
      .from('shopping_list')
      .select('*')
      .eq('share_id', query)
      .single();
    return Response.json(data);
  }

  const { data } = await supabase.from('shopping_list').select('*');
  return Response.json(data);
}

export async function POST(req: Request) {
  const { name, items, categories, shareId } = await req.json();
  const { data } = await supabase
    .from('shopping_list')
    .insert({ share_id: shareId, list: { name: name, items: items, categories: categories } })
    .select()
    .single();

  return Response.json(data);
}

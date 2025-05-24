import { supabase } from '@/lib/supabaseClient';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('shopping_list_id');

  const { data } = await supabase
    .from('shopping_category')
    .select('*')
    .eq('shopping_list_id', query);

  return Response.json(data);
}

export async function POST(req: Request) {
  const { name, shopping_list_id, sort_order } = await req.json();
  const { data } = await supabase
    .from('shopping_category')
    .insert({ name: name, shopping_list_id: shopping_list_id, sort_order: sort_order })
    .select()
    .single();

  return Response.json(data);
}

export async function PUT(req: Request) {
  const { id, name, sort_order } = await req.json();
  const { data } = await supabase
    .from('shopping_category')
    .update({ name, sort_order })
    .eq('id', id)
    .select()
    .single();

  return Response.json(data);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await supabase.from('shopping_category').delete().eq('id', id);

  return new Response(null, { status: 204 });
}

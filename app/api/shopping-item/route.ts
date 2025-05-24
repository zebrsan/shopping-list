import { supabase } from '@/lib/supabaseClient';
import { NextRequest } from 'next/server';

export async function POST(req: Request) {
  const { name, shopping_list_id, category_id } = await req.json();
  console.log(category_id);
  const { data } = await supabase
    .from('shopping_item')
    .insert({ name: name, shopping_list_id: shopping_list_id, category_id: category_id })
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

export async function PUT(req: Request) {
  const { id, name, checked, category_id } = await req.json();
  const { data } = await supabase
    .from('shopping_item')
    .update({ name, checked, category_id })
    .eq('id', id)
    .select()
    .single();

  return Response.json(data);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await supabase.from('shopping_item').delete().eq('id', id);

  return new Response(null, { status: 204 });
}

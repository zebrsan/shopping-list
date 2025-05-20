import { supabase } from '@/lib/supabaseClient';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  const { data } = await supabase.from('shopping_list').select('*').eq('id', id).single(); // idが一意である場合は .single() を使うと便利

  return Response.json(data);
}

// export async function POST(req: Request) {
//   const { title } = await req.json();
//   const { data } = await supabase.from('shopping_list').insert({ title }).select().single();

//   return Response.json(data);
// }

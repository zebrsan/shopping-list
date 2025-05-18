import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  const { data } = await supabase.from('shopping_list').select('*');

  return Response.json(data);
}

export async function POST(req: Request) {
  const { title } = await req.json();
  const { data } = await supabase.from('shopping_list').insert({ title }).select().single();

  return Response.json(data);
}

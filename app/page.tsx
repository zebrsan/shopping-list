import { ShoppingBasket } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold">ホーム</h1>
      </div>
      <div className="p-4">
        <Link href="/shopping-list" className="flex rounded-md border border-neutral-200 p-4">
          <ShoppingBasket className="text-sky-400" />
          <span className="ml-2 font-bold text-sky-400">買い物リスト</span>
        </Link>
      </div>
    </>
  );
}

'use client';

import { Ellipsis, Plus } from 'lucide-react';
import Link from 'next/link';

// TODO: Mock data for own shopping list
const mockOwnShoppingList = [
  { id: '79c68bfc-09f7-470e-91b8-219dbfe4e0a2', title: '業務スーパー' },
  { id: 'f2b5c3d4-1a0e-4c8b-9f6e-7a2d3f4e5b6c', title: 'イオン' },
  { id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2g3h4i5j6', title: 'マルエツ' },
  { id: 'b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7', title: 'セブンイレブン' },
  { id: 'c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r', title: 'ファミリーマート' },
];

// TODO: Mock data for shared shopping list
const mockSharedShoppingList = [
  { id: 'd4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s', title: 'ローソン' },
  { id: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t', title: 'ドラックストア' },
  { id: 'f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u', title: 'コストコ' },
];

export default function Home() {
  return (
    <>
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="text-sm underline">
          戻る
        </Link>
        <button className="flex items-center text-sky-400">
          <Plus size={20} />
          <span className="text-sm font-bold">リストを追加</span>
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-neutral-400">自分が作成した買い物リスト</p>
        <div className="mt-2 flex flex-col gap-2">
          {mockOwnShoppingList.map(({ id, title }) => (
            <div
              key={id}
              className="flex items-center justify-between rounded-md border border-neutral-200 px-4 py-2"
            >
              <Link href={`/shopping-list/${id}`}>{title}</Link>
              <Ellipsis />
            </div>
          ))}
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-neutral-400">シェアされた買い物リスト</p>
        <div className="mt-2 flex flex-col gap-2">
          {mockSharedShoppingList.map(({ id, title }) => (
            <div
              key={id}
              className="flex items-center justify-between rounded-md border border-neutral-200 px-4 py-2"
            >
              <Link href={`/shopping-list/${id}`}>{title}</Link>
              <Ellipsis />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex justify-center">
        <Image src="/top.png" alt="caumonoイメージ画像" width={400} height={400} />
      </div>
      <div>
        <div className="text-center text-xl font-bold">”買うもの”をキレイに整理。</div>
        <div className="px-6 py-2 text-sm">
          買うものをカテゴリーや順番ごとに整理して、ムダなくスマートなお買い物をサポートします。
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center">
        <Button asChild>
          <Link href="/shopping-list">はじめる</Link>
        </Button>
      </div>
    </div>
  );
}

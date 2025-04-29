'use client';

import { Check, Plus, SkipBack, SkipForward } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const mockShoppingList = [
  { id: '1', title: 'じゃがいも', checked: false },
  { id: '2', title: 'にんじん', checked: false },
  { id: '3', title: 'たまねぎ', checked: false },
  { id: '4', title: 'キャベツ', checked: false },
  { id: '5', title: 'ブロッコリー', checked: false },
  { id: '6', title: 'トマト', checked: false },
  { id: '7', title: 'きゅうり', checked: false },
  { id: '8', title: 'なす', checked: false },
  { id: '9', title: 'ピーマン', checked: false },
  { id: '10', title: 'ほうれん草', checked: false },
  { id: '11', title: '小松菜', checked: false },
  { id: '12', title: '大根', checked: false },
  { id: '13', title: '白菜', checked: false },
  { id: '14', title: 'セロリ', checked: false },
  { id: '15', title: 'パセリ', checked: false },
  { id: '16', title: 'バジル', checked: false },
];

export default function ShoppingListPage() {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [list, setList] = useState(mockShoppingList);

  const handleCheckboxChange = (index: number) => {
    const updatedList = [...list];
    updatedList[index].checked = !updatedList[index].checked;
    setList(updatedList);
  };

  return (
    <>
      <div className="flex h-14 items-center px-4">
        <Link href="/shopping-list" className="text-sm underline">
          戻る
        </Link>
      </div>
      <div className="p-4">
        <h1 className="text-xl font-bold">タイトル</h1>
      </div>
      <div className="mb-16 p-2">
        {list.map(({ id, title, checked }, index) => (
          <div
            key={id}
            className={`flex items-center gap-x-2 p-2 ${currentItemIndex === index && 'bg-sky-50 outline-2 outline-sky-400'}`}
          >
            {/* 非表示のチェックボックス */}
            <input
              type="checkbox"
              checked={checked}
              onChange={() => handleCheckboxChange(index)}
              className="hidden"
              id={`checkbox-${id}`}
            />
            {/* カスタムチェックボックス */}
            <label
              htmlFor={`checkbox-${id}`}
              className={`flex h-6 w-6 items-center justify-center rounded border ${
                checked ? 'border-sky-500 bg-sky-500' : 'border-neutral-300 bg-neutral-100'
              }`}
            >
              {checked && <Check size={16} color="white" />}
            </label>
            <div className="text-md">{title}</div>
          </div>
        ))}
        <button className="flex items-center gap-x-2 p-2 text-sky-400">
          <Plus size={20} />
          <span className="text-md font-bold">チェックアイテムを追加</span>
        </button>
      </div>
      <div className="fixed bottom-0 flex h-16 w-full items-center justify-center gap-x-4 border-t border-neutral-200 bg-white">
        <button
          className={`flex h-10 w-10 items-center justify-center rounded ${currentItemIndex === 0 && 'opacity-20'}`}
          disabled={currentItemIndex === 0}
          onClick={() => setCurrentItemIndex((prev) => prev - 1)}
        >
          <SkipBack />
        </button>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-900 text-white"
          onClick={() => handleCheckboxChange(currentItemIndex)}
        >
          <Check />
        </button>
        <button
          className={`flex h-10 w-10 items-center justify-center rounded bg-white ${currentItemIndex === mockShoppingList.length - 1 && 'opacity-50'}`}
          disabled={currentItemIndex === mockShoppingList.length - 1}
          onClick={() => setCurrentItemIndex((prev) => prev + 1)}
        >
          <SkipForward />
        </button>
      </div>
    </>
  );
}

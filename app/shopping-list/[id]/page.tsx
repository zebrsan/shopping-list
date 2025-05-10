'use client';

import {
  Check,
  ChevronLeft,
  Ellipsis,
  ListTodo,
  PencilRuler,
  Plus,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ShoppingListItem = {
  id: string;
  title: string;
  checked: boolean;
};

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
  const [isEdit, setIsEdit] = useState(false);
  const [list, setList] = useState(mockShoppingList);

  const handleAddItem = (newItem: ShoppingListItem) => {
    setList([newItem, ...list]);
  };

  const handleCheckboxChange = (index: number) => {
    console.log(index);
    const updatedList = [...list];
    updatedList[index].checked = !updatedList[index].checked;
    setList(updatedList);
  };

  const handleDeleteItem = (index: number) => {
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);
  };

  return (
    <>
      <div className="flex h-14 items-center justify-between bg-white px-4">
        <div className="flex items-center gap-x-2">
          <Link href="/shopping-list" className="text-sm underline">
            <ChevronLeft />
          </Link>
          <div className="font-bold">タイトル</div>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="flex h-8 items-center gap-x-0.5 rounded border border-neutral-200 bg-neutral-100 p-1">
            <button
              className={`rounded p-1 text-sm ${!isEdit && 'bg-white text-white'}`}
              onClick={() => setIsEdit(false)}
            >
              <ListTodo size={16} className={!isEdit ? 'text-teal-400' : 'text-neutral-400'} />
            </button>
            <button
              className={`rounded p-1 text-sm ${isEdit && 'bg-white text-white'}`}
              onClick={() => setIsEdit(true)}
            >
              <PencilRuler size={16} className={isEdit ? 'text-teal-400' : 'text-neutral-400'} />
            </button>
          </div>
        </div>
      </div>
      <div>
        {isEdit ? (
          <EditMode data={list} onAdd={handleAddItem} onDelete={handleDeleteItem} />
        ) : (
          <CheckMode data={list} onCheck={handleCheckboxChange} />
        )}
      </div>
    </>
  );
}

function CheckMode({
  data,
  onCheck,
}: {
  data: { id: string; title: string; checked: boolean }[];
  onCheck: (index: number) => void;
}) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  return (
    <>
      <div className="mb-16 p-2">
        {data.map(({ id, title, checked }, index) => (
          <div key={id}>
            <div
              className={`flex items-center gap-x-2 p-2 ${currentItemIndex === index && 'rounded-sm bg-teal-50 outline-2 outline-teal-400'}`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onCheck(index)}
                className="hidden"
                id={`checkbox-${id}`}
              />
              <label
                htmlFor={`checkbox-${id}`}
                className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded border ${
                  checked ? 'border-teal-400 bg-teal-400' : 'border-neutral-300 bg-white'
                }`}
              >
                {checked && <Check size={16} color="white" />}
              </label>
              <div className="text-md">{title}</div>
            </div>
          </div>
        ))}
      </div>
      <div>
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
            onClick={() => onCheck(currentItemIndex)}
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
      </div>
    </>
  );
}

function EditMode({
  data,
  onAdd,
  onDelete,
}: {
  data: { id: string; title: string; checked: boolean }[];
  onAdd: (newItem: ShoppingListItem) => void;
  onDelete: (index: number) => void;
}) {
  const [value, setValue] = useState('');

  return (
    <>
      <div className="flex gap-x-2 p-4">
        <input
          value={value}
          placeholder="買い物リストを追加"
          className="h-10 w-full rounded-md border border-neutral-300 bg-neutral-100 px-2"
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          className="flex items-center justify-center rounded-md bg-neutral-800 p-2 text-white"
          onClick={() => {
            onAdd({ id: String(data.length + 1), title: value, checked: false });
            setValue('');
          }}
        >
          <Plus />
        </button>
      </div>
      <div className="mb-16 p-2">
        {data.map(({ id, title }, index) => (
          <div key={id} className="relative flex items-center justify-between gap-x-2 p-2">
            <div className="text-sm">{title}</div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onDelete(index)}>削除</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 flex h-14 w-full items-center justify-center gap-x-4 border-t border-neutral-200 bg-white px-4">
        <button className="text-md h-10 w-full rounded bg-black font-bold text-white">
          チェックリストを更新
        </button>
      </div>
    </>
  );
}

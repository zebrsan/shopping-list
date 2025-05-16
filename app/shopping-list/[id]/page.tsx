'use client';

import { Check, ChevronLeft, Ellipsis, Plus, SkipBack, SkipForward } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ShoppingListItem = {
  id: string;
  title: string;
  checked: boolean;
  category: string;
};

const mockShoppingList = [
  { id: '1', title: 'じゃがいも', checked: false, category: '野菜' },
  { id: '2', title: 'にんじん', checked: false, category: '野菜' },
  { id: '3', title: 'たまねぎ', checked: false, category: '野菜' },
  { id: '4', title: 'キャベツ', checked: false, category: '野菜' },
  { id: '5', title: 'ブロッコリー', checked: false, category: '野菜' },
  { id: '6', title: 'トマト', checked: false, category: '野菜' },
  { id: '7', title: 'きゅうり', checked: false, category: '野菜' },
  { id: '8', title: 'なす', checked: false, category: '野菜' },
  { id: '9', title: 'ピーマン', checked: false, category: '野菜' },
  { id: '10', title: 'ほうれん草', checked: false, category: '野菜' },
  { id: '11', title: '小松菜', checked: false, category: '野菜' },
  { id: '12', title: '大根', checked: false, category: '野菜' },
  { id: '13', title: '白菜', checked: false, category: '野菜' },
  { id: '14', title: 'セロリ', checked: false, category: '野菜' },
  { id: '15', title: 'パセリ', checked: false, category: '野菜' },
  { id: '16', title: 'バジル', checked: false, category: '野菜' },
];

const mockCategories = [
  { id: '1', name: '野菜' },
  { id: '2', name: '果物' },
  { id: '3', name: '肉' },
];

export default function ShoppingListPage() {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(mockShoppingList);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [categoryManagement, setCategoryManagement] = useState(false);
  const [cateogories, setCategories] = useState(mockCategories);
  const [value, setValue] = useState('');
  const [categoryValue, setCategoryValue] = useState('');

  // アイテム操作
  const handleAddItem = () => {
    setValue('');
    const newItem: ShoppingListItem = {
      id: String(list.length + 1),
      title: value,
      checked: false,
      category: categoryValue,
    };
    setList([newItem, ...list]);
  };

  const handleCheckboxChange = (index: number) => {
    const updatedList = [...list];
    updatedList[index].checked = !updatedList[index].checked;
    setList(updatedList);
  };

  const handleDeleteItem = (index: number) => {
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);
  };

  // カテゴリ操作
  const handleAddCategory = (newCategory: { id: string; name: string }) => {
    setCategories([newCategory, ...cateogories]);
  };
  const handleDeleteCategory = (index: number) => {
    const updatedCategories = cateogories.filter((_, i) => i !== index);
    setCategories(updatedCategories);
  };

  // const handleEditCategory = (index: number, newName: string) => {
  //   const updatedCategories = [...cateogories];
  //   updatedCategories[index].name = newName;
  //   setCategories(updatedCategories);
  // };

  const handleSelectCategory = (index: number, id: string) => {
    const updatedList = list.map((item) => {
      if (item.id === id) {
        return { ...item, category: cateogories[index].name };
      }
      return item;
    });
    // カテゴリごとに並び替える
    const sorted = sortByCategory(updatedList);
    setList(sorted);
  };

  const sortByCategory = (items: ShoppingListItem[]) => {
    console.log('sortByCategory', items);
    return [...items].sort((a, b) => {
      const aIndex = cateogories.findIndex((category) => category.name === a.category);
      const bIndex = cateogories.findIndex((category) => category.name === b.category);
      return aIndex - bIndex;
    });
  };

  if (categoryManagement) {
    return (
      <div className="">
        <div>カテゴリ管理</div>
        <div className="">
          <CategoryManagement
            list={cateogories}
            onAdd={handleAddCategory}
            onDelete={handleDeleteCategory}
          />
          <button onClick={() => setCategoryManagement(false)}>閉じる</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-14 items-center justify-between bg-white px-4">
        <div className="flex items-center gap-x-2">
          <Link href="/shopping-list" className="text-sm underline">
            <ChevronLeft />
          </Link>
          <div className="font-bold">タイトル</div>
        </div>
        <div className="flex items-center gap-x-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Plus />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>チェックアイテムを追加</DialogTitle>
              </DialogHeader>
              <div>
                <div>
                  <div>カテゴリ</div>
                  <div>
                    <Select onValueChange={setCategoryValue}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="カテゴリを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {cateogories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <div>アイテム名</div>
                  <div>
                    <input
                      value={value}
                      placeholder="アイテム名を入力"
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <button
                  className="text-md h-10 w-full rounded bg-black font-bold text-white"
                  onClick={() => {
                    setOpen(false);
                    handleAddItem();
                  }}
                >
                  チェックリストに追加
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCategoryManagement(true)}>
                カテゴリを管理
              </DropdownMenuItem>
              <DropdownMenuItem>タイトルを編集</DropdownMenuItem>
              <DropdownMenuItem>シートを共有</DropdownMenuItem>
              <DropdownMenuItem>シートを削除</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div>
        <div className="flex justify-end px-4"></div>
        <div className="mb-16 p-2">
          {list.map(({ id, title, checked, category }, index) => (
            <div key={id}>
              {list[index - 1]?.category !== category && (
                <div className="relative my-5 h-[1px] w-full bg-neutral-400">
                  <div className="absolute top-1/2 left-0 flex h-4 w-full -translate-y-1/2 items-center justify-center">
                    <div className="rounded border border-neutral-400 bg-white px-2 py-0.5 text-[13px]">
                      {category}
                    </div>
                  </div>
                </div>
              )}
              <div
                className={`flex items-center justify-between gap-x-2 p-2 ${
                  currentItemIndex === index && 'rounded-sm bg-teal-50 outline-2 outline-teal-400'
                }`}
              >
                <div className="flex items-center gap-x-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleCheckboxChange(index)}
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
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Ellipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>カテゴリ選択</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="p-0">
                        <Command>
                          <CommandList>
                            <CommandEmpty>カテゴリがありません</CommandEmpty>
                            <CommandGroup>
                              {cateogories.map((category, catIndex) => (
                                <CommandItem
                                  key={category.id}
                                  value={category.name}
                                  onSelect={() => {
                                    handleSelectCategory(catIndex, id);
                                    setOpen(false);
                                  }}
                                >
                                  {category.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem>編集</DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleDeleteItem(index)}>
                      削除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="fixed bottom-0 flex h-16 w-full items-center justify-center gap-x-6 bg-black">
          <button
            className={`flex h-10 w-10 items-center justify-center text-white ${currentItemIndex === 0 && 'opacity-50'}`}
            disabled={currentItemIndex === 0}
            onClick={() => setCurrentItemIndex((prev) => prev - 1)}
          >
            <SkipBack />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center text-white"
            onClick={() => handleCheckboxChange(currentItemIndex)}
          >
            <Check />
          </button>
          <button
            className={`flex h-10 w-10 items-center justify-center text-white ${currentItemIndex === mockShoppingList.length - 1 && 'opacity-50'}`}
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

function CategoryManagement({
  list,
  onAdd,
  onDelete,
}: {
  list: { id: string; name: string }[];
  onAdd: (category: { id: string; name: string }) => void;
  onDelete: (index: number) => void;
}) {
  const [value, setValue] = useState('');

  // TODO: カテゴリ名の並び順制御（チェックリスト画面にもその並び順でカテゴリが並ぶようにする）

  return (
    <div>
      <h2>カテゴリ管理</h2>
      <div>
        <input value={value} placeholder="カテゴリ名" onChange={(e) => setValue(e.target.value)} />
        <button onClick={() => onAdd({ id: String(list.length + 1), name: value })}>追加</button>
      </div>
      <div>
        <ul>
          {list.map((category, index) => (
            <li key={category.id} className="flex items-center justify-between">
              <span>{category.name}</span>
              <button onClick={() => onDelete(index)}>削除</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

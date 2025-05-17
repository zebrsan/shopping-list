'use client';

import { Check, ChevronLeft, Ellipsis, Plus, SkipBack, SkipForward } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryManagement } from './category-management';

type ShoppingListItem = {
  id: string;
  title: string;
  checked: boolean;
  category: string;
};

type CategoryItem = {
  id: string;
  name: string;
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

const modes = {
  CATEGORY_MANAGEMENT: 'category_management',
  CHECK_LIST: 'check_list',
} as const;

export default function ShoppingListPage() {
  const [list, setList] = useState(mockShoppingList);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [cateogories, setCategories] = useState(mockCategories);
  const [value, setValue] = useState('');
  const [categoryValue, setCategoryValue] = useState('');
  const [mode, setMode] = useState<(typeof modes)[keyof typeof modes]>(modes.CHECK_LIST);

  // チェックリスト追加ダイアログ
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);

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

  const handleEditCategory = (newItem: CategoryItem) => {
    setCategories(
      cateogories.map((category) => {
        if (category.id === newItem.id) return { ...category, name: newItem.name };
        return category;
      }),
    );
  };

  const handleSelectCategory = (index: number, id: string) => {
    const updatedList = list.map((item) => {
      if (item.id === id) {
        return { ...item, category: cateogories[index].name };
      }
      return item;
    });
    // TODO: warningが表示される（ドロップダウンが閉じ切っていない状態で画面外に行った際に警告が出る）
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

  if (mode === modes.CHECK_LIST) {
    return (
      <>
        {/* header */}
        <div className="flex h-14 items-center justify-between bg-white px-4">
          <div className="flex items-center gap-x-2">
            <Link href="/shopping-list" className="text-sm underline">
              <ChevronLeft />
            </Link>
            <div className="font-bold">タイトル</div>
          </div>
          <div className="flex items-center gap-x-4">
            <button onClick={() => setOpenAddItemDialog(true)}>
              <Plus />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Ellipsis />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setMode(modes.CATEGORY_MANAGEMENT)}>
                  カテゴリを管理
                </DropdownMenuItem>
                <DropdownMenuItem>タイトルを編集</DropdownMenuItem>
                <DropdownMenuItem>シートを共有</DropdownMenuItem>
                <DropdownMenuItem>シートを削除</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* body */}
        <div>
          <div className="flex justify-end px-4"></div>
          <div className="mb-16 p-2">
            {list.map((item, index) => (
              <div key={item.id}>
                {/* カテゴリの区切り */}
                {list[index - 1]?.category !== item.category && (
                  <div className="relative my-5 h-[1px] w-full bg-neutral-400">
                    <div className="absolute top-1/2 left-0 flex h-4 w-full -translate-y-1/2 items-center justify-center">
                      <div className="rounded border border-neutral-400 bg-white px-2 py-0.5 text-[13px]">
                        {item.category}
                      </div>
                    </div>
                  </div>
                )}
                <CheckListItem
                  data={item}
                  index={index}
                  categories={cateogories}
                  currentItemIndex={currentItemIndex}
                  handleCheckboxChange={() => handleCheckboxChange(index)}
                  handleDeleteItem={() => handleDeleteItem(index)}
                  handleSelectCategory={handleSelectCategory}
                />
              </div>
            ))}
          </div>
        </div>
        {/* footer */}
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
        <Dialog open={openAddItemDialog} onOpenChange={setOpenAddItemDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>チェックアイテムを追加</DialogTitle>
              <DialogDescription />
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
                  setOpenAddItemDialog(false);
                  handleAddItem();
                }}
              >
                チェックリストに追加
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (mode === modes.CATEGORY_MANAGEMENT) {
    return (
      <CategoryManagement
        list={cateogories}
        onChageMode={() => setMode(modes.CHECK_LIST)}
        onAdd={handleAddCategory}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />
    );
  }
}

function CheckListItem({
  data,
  index,
  currentItemIndex,
  categories,
  handleCheckboxChange,
  handleDeleteItem,
  handleSelectCategory,
}: {
  data: ShoppingListItem;
  index: number;
  currentItemIndex: number;
  categories: { id: string; name: string }[];
  handleCheckboxChange: (index: number) => void;
  handleDeleteItem: (index: number) => void;
  handleSelectCategory: (index: number, id: string) => void;
}) {
  const { id, title, checked } = data;

  return (
    <>
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
        {/* <DropdownMenu>
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
                      {categories.map((category, catIndex) => (
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

            <DropdownMenuItem onClick={() => handleDeleteItem(index)}>削除</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>カテゴリ変更</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {categories.map((category, i) => (
                      <DropdownMenuItem
                        key={category.id}
                        onSelect={() => {
                          handleSelectCategory(i, id);
                        }}
                      >
                        {category.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem>編集</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteItem(index)}>削除</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

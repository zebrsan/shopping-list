'use client';

import { Check, ChevronLeft, Ellipsis, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
import { useParams } from 'next/navigation';
import {
  getShoppingList,
  getShoppingItem,
  getShoppingCategory,
  addShoppingItem,
  deleteShoppingItem,
  updateShoppingItem,
  deleteShoppingCategory,
  updateShoppingCategory,
} from '@/lib/apiHandle';
import { ShoppingItemData } from '@/types/shoppingItem';
import { ShoppingCategoryData } from '@/types/shoppingCategory';

const modes = {
  CATEGORY_MANAGEMENT: 'category_management',
  CHECK_LIST: 'check_list',
} as const;

export default function ShoppingListPage() {
  const [list, setList] = useState<ShoppingItemData[]>([]);
  const [categories, setCategories] = useState<ShoppingCategoryData[]>([]); // shopping_category
  const [categoryValue, setCategoryValue] = useState<string | undefined>(undefined);
  const [value, setValue] = useState('');
  const [mode, setMode] = useState<(typeof modes)[keyof typeof modes]>(modes.CHECK_LIST);
  const [title, setTitle] = useState('');

  const params = useParams();
  // チェックリスト追加ダイアログ
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);

  // アイテム操作
  const handleAddItem = async () => {
    setValue('');
    setCategoryValue('');
    if (typeof params.id === 'string') {
      const res = await addShoppingItem(value, params.id, categoryValue ?? null);
      setList([res, ...list]);
    }
  };

  const handleEditItem = async (item: ShoppingItemData) => {
    const updateList = list.map((l) => {
      if (l.id === item.id) {
        return item;
      }
      return l;
    });
    await updateShoppingItem(item.id, item.name, item.checked, item.category_id);
    setList(updateList);
  };

  const handleDeleteItem = async (id: string) => {
    const updatedList = list.filter((_) => _.id !== id);
    await deleteShoppingItem(id);
    setList(updatedList);
  };

  // カテゴリ操作
  const handleAddCategory = (newCategory: ShoppingCategoryData) => {
    setCategories([...categories, newCategory]);
  };

  const handleDeleteCategory = async (shoppingCategoryId: string) => {
    const updatedCategories = categories.filter((category) => category.id !== shoppingCategoryId);
    await deleteShoppingCategory(shoppingCategoryId);
    setCategories(updatedCategories);
  };

  const handleEditCategory = async (newItem: ShoppingCategoryData) => {
    await updateShoppingCategory(newItem.id, newItem.name, newItem.sort_order);
    setCategories(
      categories.map((category) => {
        if (category.id === newItem.id) return { ...category, name: newItem.name };
        return category;
      }),
    );
  };

  const handleSelectCategory = async (categoryId: string, id: string) => {
    // 非同期処理をすべて待つ
    const updatedList = await Promise.all(
      list.map(async (item) => {
        if (item.id === id) {
          const updated = { ...item, category_id: categoryId };
          await updateShoppingItem(item.id, item.name, item.checked, categoryId);
          return updated;
        }
        return item;
      }),
    );

    const sorted = sortItemsByCategory(updatedList, categories);
    setList(sorted);
  };

  const sortItemsByCategory = (
    items: ShoppingItemData[],
    _categories: ShoppingCategoryData[],
  ): ShoppingItemData[] => {
    const categoryMap = new Map(_categories.map((c) => [c.id, c]));

    return [...items].sort((a, b) => {
      const aCat = categoryMap.get(a.category_id);
      const bCat = categoryMap.get(b.category_id);

      // カテゴリがない場合の処理
      const aOrder = aCat ? aCat.sort_order : -Infinity;
      const bOrder = bCat ? bCat.sort_order : -Infinity;

      return aOrder - bOrder;
    });
  };

  useEffect(() => {
    const init = async () => {
      if (typeof params.id === 'string') {
        const title = await getShoppingList(params.id);
        const shoppingItem = await getShoppingItem(params.id);
        const category = await getShoppingCategory(params.id);
        setTitle(title);
        setCategories(category);
        const sorted = sortItemsByCategory(shoppingItem, category);
        setList(sorted);
      }
    };
    init();
  }, [params.id]);

  if (mode === modes.CHECK_LIST) {
    return (
      <>
        {/* header */}
        <div className="flex h-14 items-center justify-between bg-white px-4">
          <div className="flex items-center gap-x-2">
            <Link href="/shopping-list" className="text-sm underline">
              <ChevronLeft />
            </Link>
            <div className="font-bold">{title}</div>
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
              <div key={index}>
                {list.length > 1 && list[index - 1]?.category_id !== item.category_id && (
                  <div className="relative my-5 h-[1px] w-full bg-neutral-400">
                    <div className="absolute top-1/2 left-0 flex h-4 w-full -translate-y-1/2 items-center justify-center">
                      <div className="rounded border border-neutral-400 bg-white px-2 py-0.5 text-[13px]">
                        {categories.find((c) => c.id === item.category_id)?.name ?? 'カテゴリなし'}
                      </div>
                    </div>
                  </div>
                )}
                <CheckListItem
                  data={item}
                  categories={categories}
                  handleDeleteItem={handleDeleteItem}
                  handleSelectCategory={handleSelectCategory}
                  onEdit={handleEditItem}
                />
              </div>
            ))}
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
                  <Select
                    value={categoryValue}
                    onValueChange={setCategoryValue}
                    disabled={categories.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="カテゴリを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
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
        list={categories}
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
  categories,
  handleDeleteItem,
  handleSelectCategory,
  onEdit,
}: {
  data: ShoppingItemData;
  categories: { id: string; name: string }[];
  handleDeleteItem: (id: string) => void;
  handleSelectCategory: (categoryId: string, id: string) => void;
  onEdit: (data: ShoppingItemData) => void;
}) {
  const { id, name, checked, category_id } = data;
  const [openEditItemDialog, setOpenEditItemDialog] = useState(false);
  const [value, setValue] = useState(name);

  const categoryName = categories.find((c) => c.id === category_id);

  return (
    <>
      <div className={`flex items-center justify-between gap-x-2 p-2`}>
        <div className="flex items-center gap-x-2">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onEdit({ ...data, checked: e.target.checked })}
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
          <div className="text-md">{name}</div>
          <div className="rounded bg-teal-100 px-1 py-0.5 text-xs text-teal-600">
            {categoryName?.name ?? 'カテゴリなし'}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  disabled={categories.length === 0}
                  className={`${categories.length === 0 && 'text-muted-foreground'}`}
                >
                  カテゴリ変更
                </DropdownMenuSubTrigger>

                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category.id}
                        onSelect={() => {
                          handleSelectCategory(category.id, id);
                        }}
                      >
                        {category.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={() => setOpenEditItemDialog(true)}>編集</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteItem(id)}>削除</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={openEditItemDialog} onOpenChange={setOpenEditItemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>アイテム名を変更</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div>
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
                setOpenEditItemDialog(false);
                onEdit({ ...data, name: value });
              }}
            >
              更新
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

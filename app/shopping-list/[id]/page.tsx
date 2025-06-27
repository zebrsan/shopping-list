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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CategoryManagement } from './category-management';
import { useParams } from 'next/navigation';
import { getLocalStorage, localStorageKey, setLocalStorage } from '@/lib/localStorage';
import { ShoppingCategoryModel, ShoppingItemModel, ShoppingListModel } from '@/types/shopping-list';
import { ShareDialog } from './share-dialog';

const modes = {
  CATEGORY_MANAGEMENT: 'category_management',
  CHECK_LIST: 'check_list',
} as const;

export default function ShoppingListPage() {
  const params = useParams();
  const [list, setList] = useState<ShoppingItemModel[]>([]);
  const [categories, setCategories] = useState<ShoppingCategoryModel[]>([]); // shopping_category
  const [categoryValue, setCategoryValue] = useState<string | undefined>(undefined);
  const [value, setValue] = useState('');
  const [mode, setMode] = useState<(typeof modes)[keyof typeof modes]>(modes.CHECK_LIST);
  const [title, setTitle] = useState('');
  const [shareId, setShareId] = useState<string | null>(null); // shareId
  const [shareDialog, setShareDialog] = useState(false);

  // TODO: 共有機能を追加
  const shareShoppingList = async (shareId: string) => {
    try {
      await fetch('/api/shopping-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: params.id,
          name: title,
          items: list,
          categories: categories,
          shareId: shareId,
        }),
      });
    } catch (e) {
      console.error('Failed to add shopping list:', e);
      throw new Error('Failed to add shopping list');
    }
  };

  const handleShare = async () => {
    const data = getLocalStorage<ShoppingListModel[]>(localStorageKey.SHOPPING_LIST);
    if (!data) return;
    const target = data.find((d) => {
      if (d.id === params.id) return d;
    });
    // shareIdがあればPOSTしない
    if (target?.shareId) {
      return;
    }

    const id = crypto.randomUUID();
    setShareId(id);
    const updateList = data.map((l) => {
      if (l.id === params.id) {
        return {
          ...l,
          shareId: id,
        };
      } else {
        return l;
      }
    });
    setLocalStorage(localStorageKey.SHOPPING_LIST, updateList);

    shareShoppingList(id);
  };

  // チェックリスト追加ダイアログ
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);

  // アイテム操作
  const handleAddItem = () => {
    setValue('');
    setCategoryValue(undefined);
    const newList = [
      ...list,
      { id: crypto.randomUUID(), name: value, categoryId: categoryValue ?? null, checked: false },
    ];
    const data = getLocalStorage<ShoppingListModel[]>(localStorageKey.SHOPPING_LIST);
    if (!data) return;
    const updateList = data.map((l) => {
      if (l.id === params.id) {
        return {
          ...l,
          items: newList,
        };
      } else {
        return l;
      }
    });
    setLocalStorage(localStorageKey.SHOPPING_LIST, updateList);
    const sorted = sortItemsByCategory(newList, categories);
    setList(sorted);
  };

  const handleEditItem = async (item: ShoppingItemModel) => {
    const newList = list.map((l) => {
      if (l.id === item.id) {
        return item;
      }
      return l;
    });
    setList(newList);
    const data = getLocalStorage<ShoppingListModel[]>(localStorageKey.SHOPPING_LIST);
    if (!data) return;
    const updateList = data.map((l) => {
      if (l.id === params.id) {
        return {
          ...l,
          items: newList,
        };
      } else {
        return l;
      }
    });
    setLocalStorage(localStorageKey.SHOPPING_LIST, updateList);
  };

  const handleDeleteItem = (id: string) => {
    const updatedList = list.filter((_) => _.id !== id);
    setList(updatedList);
    const data = getLocalStorage<ShoppingListModel[]>(localStorageKey.SHOPPING_LIST);
    if (!data) return;
    const updateList = data.map((l) => {
      if (l.id === params.id) {
        return {
          ...l,
          items: updatedList,
        };
      } else {
        return l;
      }
    });
    setLocalStorage(localStorageKey.SHOPPING_LIST, updateList);
  };

  const handleSelectCategory = (categoryId: string | null, id: string) => {
    const newList = list.map((l) => {
      if (l.id === id) {
        return { ...l, categoryId };
      } else {
        return l;
      }
    });

    const data = getLocalStorage<ShoppingListModel[]>(localStorageKey.SHOPPING_LIST);
    if (!data) return;
    const updateList = data.map((l) => {
      if (l.id === params.id) {
        return {
          ...l,
          items: newList,
        };
      } else {
        return l;
      }
    });
    setLocalStorage(localStorageKey.SHOPPING_LIST, updateList);

    const sorted = sortItemsByCategory(newList, categories);
    setList(sorted);
  };

  // カテゴリ操作
  const handleAddCategory = (newCategory: ShoppingCategoryModel) => {
    const newCategories = [...categories, newCategory];
    setCategories(newCategories);
    const data = getLocalStorage<ShoppingListModel[]>(localStorageKey.SHOPPING_LIST);
    if (!data) return;
    const updateList = data.map((l) => {
      if (l.id === params.id) {
        return {
          ...l,
          categories: newCategories,
        };
      } else {
        return l;
      }
    });
    setLocalStorage(localStorageKey.SHOPPING_LIST, updateList);
  };

  const handleUpdateCategories = (items: ShoppingCategoryModel[]) => {
    setCategories(items);
    const data = getLocalStorage<ShoppingListModel[]>(localStorageKey.SHOPPING_LIST);
    if (!data) return;
    const updateList = data.map((l) => {
      if (l.id === params.id) {
        return {
          ...l,
          categories: items,
        };
      } else {
        return l;
      }
    });
    setLocalStorage(localStorageKey.SHOPPING_LIST, updateList);
  };

  const handleDeleteCategory = (shoppingCategoryId: string) => {
    const updatedItems = list.map((item) => {
      if (item.categoryId === shoppingCategoryId) {
        return { ...item, categoryId: null };
      } else {
        return item;
      }
    });
    const updatedCategories = categories.filter((category) => category.id !== shoppingCategoryId);
    const sorted = sortItemsByCategory(updatedItems, updatedCategories);
    setList(sorted);
    setCategories(updatedCategories);
    const data = getLocalStorage<ShoppingListModel[]>(localStorageKey.SHOPPING_LIST);
    if (!data) return;
    const updateList = data.map((l) => {
      if (l.id === params.id) {
        return {
          ...l,
          items: sorted,
          categories: updatedCategories,
        };
      } else {
        return l;
      }
    });
    setLocalStorage(localStorageKey.SHOPPING_LIST, updateList);
  };

  const handleEditCategory = (newItem: ShoppingCategoryModel) => {
    const newCategories = categories.map((category) => {
      if (category.id === newItem.id) return { ...category, name: newItem.name };
      return category;
    });
    setCategories(newCategories);
    const data = getLocalStorage<ShoppingListModel[]>(localStorageKey.SHOPPING_LIST);
    if (!data) return;
    const updateList = data.map((l) => {
      if (l.id === params.id) {
        return {
          ...l,
          categories: newCategories,
        };
      } else {
        return l;
      }
    });
    setLocalStorage(localStorageKey.SHOPPING_LIST, updateList);
  };

  const sortItemsByCategory = (
    items: ShoppingItemModel[],
    _categories: ShoppingCategoryModel[],
  ): ShoppingItemModel[] => {
    const categoryOrderMap = new Map(_categories.map((category, index) => [category.id, index]));

    return [...items].sort((a, b) => {
      const aOrder = categoryOrderMap.get(a.categoryId ?? '') ?? Infinity;
      const bOrder = categoryOrderMap.get(b.categoryId ?? '') ?? Infinity;
      return aOrder - bOrder;
    });
  };

  const sortItems = () => {
    const sorted = sortItemsByCategory(list, categories);
    setList(sorted);
  };

  // fetch shoppinglist data from localstorage
  useEffect(() => {
    const loadShoppingList = () => {
      const data = getLocalStorage<ShoppingListModel[]>(localStorageKey.SHOPPING_LIST);
      if (!data) return;
      const shoppingList = data.find((d) => d.id === params.id);
      if (!shoppingList) return;
      setShareId(shoppingList.shareId);
      setTitle(shoppingList.name);
      setCategories(shoppingList.categories);
      setList(() => sortItemsByCategory(shoppingList.items, shoppingList.categories));
    };
    loadShoppingList();
  }, [params.id]);

  if (mode === modes.CHECK_LIST) {
    return (
      <>
        {/* header */}
        <div className="sticky top-0 z-20 flex h-14 items-center justify-between bg-white px-4">
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
                <DropdownMenuItem onClick={() => setShareDialog(true)}>
                  シートを共有
                </DropdownMenuItem>
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
                {list[index - 1]?.categoryId !== item.categoryId && (
                  <div className="relative my-5 h-[1px] w-full bg-neutral-200">
                    <div className="absolute top-1/2 left-0 flex h-4 w-full -translate-y-1/2 items-center justify-start">
                      <div className="rounded bg-white px-2 py-0.5 text-[13px] text-neutral-500">
                        {categories.find((c) => c.id === item.categoryId)?.name ?? 'その他'}
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
            <div className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="name">カテゴリ</Label>
                <Select onValueChange={setCategoryValue} disabled={categories.length === 0}>
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
              <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="name">アイテム名</Label>
                <Input
                  id="name"
                  value={value}
                  placeholder="アイテム名を入力"
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="default"
                disabled={value.trim() === ''}
                onClick={() => {
                  setOpenAddItemDialog(false);
                  handleAddItem();
                }}
              >
                追加
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <ShareDialog
          open={shareDialog}
          shareId={shareId}
          onOpenChange={setShareDialog}
          onSubmit={handleShare}
        />
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
        onUpdate={handleUpdateCategories}
        onSort={sortItems}
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
  data: ShoppingItemModel;
  categories: { id: string; name: string }[];
  handleDeleteItem: (id: string) => void;
  handleSelectCategory: (categoryId: string | null, id: string) => void;
  onEdit: (data: ShoppingItemModel) => void;
}) {
  const { id, name, checked } = data;
  const [openEditItemDialog, setOpenEditItemDialog] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (openEditItemDialog) {
      setValue(name);
    }
  }, [openEditItemDialog, name]);

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
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
                    <DropdownMenuItem
                      onSelect={() => {
                        handleSelectCategory(null, id);
                      }}
                    >
                      その他
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={() => setOpenEditItemDialog(true)}>編集</DropdownMenuItem>
              <DropdownMenuItem className="text-rose-600" onClick={() => handleDeleteItem(id)}>
                削除
              </DropdownMenuItem>
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
            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="name">アイテム名</Label>
              <Input
                id="name"
                value={value}
                placeholder="アイテム名を入力"
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              disabled={value.trim() === ''}
              onClick={() => {
                setOpenEditItemDialog(false);
                onEdit({ ...data, name: value });
              }}
            >
              変更を保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

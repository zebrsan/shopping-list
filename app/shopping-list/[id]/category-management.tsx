'use client';

import { useState } from 'react';
// icons
import { ChevronLeft, Ellipsis, GripVertical, Plus } from 'lucide-react';
// components
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ShoppingCategoryData } from '@/types/shoppingCategory';
import { ShoppingCategory } from '@/types/shoppingList';

export function CategoryManagement({
  list,
  onChageMode,
  onAdd,
  onEdit,
  onDelete,
}: {
  list: { id: string; name: string }[];
  onChageMode: () => void;
  onAdd: (category: ShoppingCategory) => void;
  onEdit: (item: ShoppingCategoryData) => void;
  onDelete: (id: string) => void;
}) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const handleAddItem = () => {
    setValue('');
    addShoppingCategory();
    setOpen(false);
  };

  const addShoppingCategory = () => {
    onAdd({ id: crypto.randomUUID(), name: value, order: list.length + 1 });
  };

  // TODO: カテゴリ名の並び順制御（チェックリスト画面にもその並び順でカテゴリが並ぶようにする）

  return (
    <>
      <div className="flex h-14 items-center justify-between bg-white px-4">
        <div className="flex items-center gap-x-2">
          <button className="text-sm underline" onClick={onChageMode}>
            <ChevronLeft />
          </button>
          <div className="font-bold">カテゴリ管理</div>
        </div>
      </div>
      <div className="px-2">
        {list.map((item) => (
          <CategoryItem
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={() => onDelete(item.id)}
          />
        ))}
      </div>
      <div className="px-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div className="flex cursor-pointer items-center gap-x-2 rounded p-2 text-teal-400 hover:bg-teal-50">
              <Plus />
              <div className="font-bold">リストを追加</div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>リストを追加</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <div>
              <div>
                <div className="mb-1 text-sm text-neutral-400">リスト名</div>
                <div>
                  <Input
                    value={value}
                    placeholder="リスト名を入力"
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <button className="text-md h-10 w-full rounded border border-neutral-200 bg-white text-black">
                  キャンセル
                </button>
              </DialogClose>
              <button
                className="text-md h-10 w-full rounded bg-black font-bold text-white"
                onClick={() => {
                  setOpen(false);
                  handleAddItem();
                }}
              >
                追加
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

function CategoryItem({
  item,
  onEdit,
  onDelete,
}: {
  item: { id: string; name: string };
  onEdit: (item: ShoppingCategoryData) => void;
  onDelete: () => void;
}) {
  const { id, name } = item;

  const [value, setValue] = useState(name);
  const [isEdit, setIsEdit] = useState(false);

  const handleEdit = () => {
    setIsEdit(false);
    onEdit({ id, name: value, sort_order: 1 });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-x-2 p-2">
        <div className="flex items-center gap-x-2">
          <GripVertical />
          <div className="text-md">{name}</div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEdit(true)}>編集</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>削除</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={isEdit} onOpenChange={setIsEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>リスト名を編集</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div>
            <div>
              <div className="mb-1 text-sm text-neutral-400">リスト名</div>
              <div>
                <Input
                  value={value}
                  placeholder="アイテム名を入力"
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button className="text-md h-10 w-full rounded border border-neutral-200 bg-white text-black">
                キャンセル
              </button>
            </DialogClose>
            <button
              className="text-md h-10 w-full rounded bg-black font-bold text-white"
              onClick={handleEdit}
            >
              変更を保存
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

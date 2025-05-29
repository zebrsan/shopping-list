'use client';

import { Ellipsis, Plus, StickyNote } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import { useEffect, useRef, useState } from 'react';
import { getLocalStorage, localStorageKey, setLocalStorage } from '@/lib/localStorage';
import { ShoppingList } from '@/types/shoppingList';

export default function ShoppingListsPage() {
  const [open, setOpen] = useState(false); // ショッピングリストの追加ダイアログ表示制御
  const [value, setValue] = useState(''); // ショッピングリストの追加value
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]); // ショッピングリスト一覧

  const isFirstRender = useRef(true);

  // 買い物リスト追加処理
  const handleAddItem = async () => {
    if (value.trim() === '') return;

    const list = { id: crypto.randomUUID(), name: value, items: [], categories: [] };

    setShoppingLists([...shoppingLists, list]);
    setValue('');
    setOpen(false);
  };

  const handleEdit = ({ id, name }: { id: string; name: string }) => {
    setShoppingLists(
      shoppingLists.map((item) => {
        if (item.id === id) {
          return { ...item, name: name };
        }
        return item;
      }),
    );
    setValue('');
    setOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    setShoppingLists(shoppingLists.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const data = getLocalStorage<ShoppingList[]>(localStorageKey.SHOPPING_LIST);
    if (data === undefined) return;
    setShoppingLists(data);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setLocalStorage<ShoppingList[]>(localStorageKey.SHOPPING_LIST, shoppingLists);
  }, [shoppingLists]);

  return (
    <>
      <div className="py-10">
        <div className="px-4 text-[13px] text-neutral-400">あなたの買い物リスト</div>
        <div className="mt-2 flex flex-col px-2">
          {shoppingLists.map(({ id, name }) => (
            <List key={id} data={{ id, name }} onEdit={handleEdit} onDelete={handleDeleteItem} />
          ))}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <div
                className="flex cursor-pointer items-center gap-x-2 rounded p-2 text-teal-400 hover:bg-teal-50"
                onClick={handleAddItem}
              >
                <Plus />
                <div className="font-bold">リストを追加</div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>リストを追加</DialogTitle>
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
                <button
                  className="text-md h-10 w-full rounded border border-neutral-200 bg-white text-black"
                  onClick={() => setOpen(false)}
                >
                  キャンセル
                </button>
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
      </div>
    </>
  );
}

function List({
  data,
  onEdit,
  onDelete,
}: {
  data: { id: string; name: string };
  onEdit: (list: { id: string; name: string }) => void;
  onDelete: (id: string) => void;
}) {
  const { id, name } = data;
  const [value, setValue] = useState(name);
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    onEdit({ id, name: value });
  };
  const handleDelete = () => onDelete(id);

  return (
    <>
      <div className="flex items-center justify-between gap-x-2 rounded p-2 hover:bg-neutral-100">
        <Link href={`/shopping-list/${id}`} className="flex flex-1 items-center gap-2">
          <StickyNote className="text-neutral-400" />
          <div>{name}</div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded hover:bg-neutral-200">
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-md py-2"
              onClick={() => toast('共有リンクをコピーしました🥳')}
            >
              共有リンクをコピー
            </DropdownMenuItem>
            <DropdownMenuItem className="text-md py-2" onClick={() => setOpen(true)}>
              リスト名を編集
            </DropdownMenuItem>
            <DropdownMenuItem className="text-md py-2" onClick={handleDelete}>
              リストを削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>リスト名を編集</DialogTitle>
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
            <button
              className="text-md h-10 w-full rounded border border-neutral-200 bg-white text-black"
              onClick={() => setOpen(false)}
            >
              キャンセル
            </button>
            <button
              className="text-md h-10 w-full rounded bg-black font-bold text-white"
              onClick={() => {
                setOpen(false);
                handleEdit();
              }}
            >
              変更を保存
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

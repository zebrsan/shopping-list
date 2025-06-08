'use client';

import { Button } from '@/components/ui/button';
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ellipsis, StickyNote } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function ShoppingList({
  data,
  onEdit,
  onDelete,
}: {
  data: { id: string; name: string };
  onEdit: (list: { id: string; name: string }) => void;
  onDelete: (id: string) => void;
}) {
  const { id, name } = data;
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    onEdit({ id, name: value });
  };
  const handleDelete = () => onDelete(id);

  useEffect(() => {
    setValue(name);
  }, [open, name]);

  return (
    <>
      <div className="flex items-center justify-between gap-x-2 rounded p-2 hover:bg-neutral-100">
        <Link href={`/shopping-list/${id}`} className="flex flex-1 items-center gap-2">
          <StickyNote className="text-neutral-400" />
          {name}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded hover:bg-neutral-200">
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toast('共有リンクをコピーしました🥳')}>
              共有リンクをコピー
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>リスト名を編集</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>リストを削除</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>リスト名を編集</DialogTitle>
          </DialogHeader>
          <div>
            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="name" className="text-neutral-600">
                リスト名
              </Label>
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
              variant="default"
              disabled={value.trim() === ''}
              onClick={() => {
                setOpen(false);
                handleEdit();
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

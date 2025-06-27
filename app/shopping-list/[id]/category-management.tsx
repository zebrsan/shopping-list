'use client';

import { useEffect, useState } from 'react';
// icons
import { ChevronLeft, Ellipsis, GripVertical, Plus } from 'lucide-react';
// components
import {
  Dialog,
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
import { ShoppingCategoryModel } from '@/types/shopping-list';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function CategoryManagement({
  list,
  onChageMode,
  onAdd,
  onEdit,
  onDelete,
  onUpdate,
  onSort,
}: {
  list: { id: string; name: string }[];
  onChageMode: () => void;
  onAdd: (category: ShoppingCategoryModel) => void;
  onEdit: (item: ShoppingCategoryModel) => void;
  onDelete: (id: string) => void;
  onUpdate: (items: ShoppingCategoryModel[]) => void;
  onSort: () => void;
}) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const handleAddItem = () => {
    setValue('');
    addShoppingCategory();
    setOpen(false);
  };

  const addShoppingCategory = () => {
    onAdd({ id: crypto.randomUUID(), name: value });
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (over && active.id !== over.id) {
      const oldIndex = list.findIndex((item) => item.id === active.id);
      const newIndex = list.findIndex((item) => item.id === over.id);

      const newArray = arrayMove(list, oldIndex, newIndex);
      onUpdate(newArray);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    onSort();
  }, [list]);

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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={list} strategy={verticalListSortingStrategy}>
            {list.map((item) => (
              <div key={item.id}>
                <CategoryItem
                  key={item.id}
                  item={item}
                  onEdit={onEdit}
                  onDelete={() => onDelete(item.id)}
                />
              </div>
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <div className="px-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div className="flex cursor-pointer items-center gap-x-2 rounded p-2 text-teal-400 hover:bg-teal-50">
              <Plus />
              <div className="font-bold">カテゴリを追加</div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>カテゴリを追加</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="name">カテゴリ名</Label>
              <Input
                id="name"
                value={value}
                placeholder="カテゴリ名を入力"
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                disabled={value.trim() === ''}
                onClick={() => {
                  setOpen(false);
                  handleAddItem();
                }}
              >
                追加
              </Button>
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
  onEdit: (item: ShoppingCategoryModel) => void;
  onDelete: () => void;
}) {
  const { id, name } = item;

  const [value, setValue] = useState(name);
  const [isEdit, setIsEdit] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleEdit = () => {
    setIsEdit(false);
    onEdit({ id, name: value });
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center justify-between gap-x-2 p-2">
        <div className="flex items-center gap-x-2">
          <div className="bg-neutral-100 p-1">
            <GripVertical {...listeners} size={18} className="cursor-grab text-neutral-400" />
          </div>
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
            <DialogTitle>カテゴリ名を編集</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="name">カテゴリ名</Label>
            <Input
              id="name"
              value={value}
              placeholder="カテゴリ名を入力"
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" disabled={value.trim() === ''} onClick={handleEdit}>
              変更を保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

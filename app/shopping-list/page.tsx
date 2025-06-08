'use client';

import { useEffect, useState } from 'react';
// icons
import { Plus } from 'lucide-react';
// lib
import { getLocalStorage, localStorageKey, setLocalStorage } from '@/lib/localStorage';
// types
import { ShoppingListData } from '@/types/shoppingList';
// components
import { AddShoppingListDialog } from './add-shopping-list-dialog';
import { ShoppingList } from './shopping-list';

export default function ShoppingListsPage() {
  const [shoppingLists, setShoppingLists] = useState<ShoppingListData[]>([]);
  const [openShoppingListDialog, setOpenShoppingListDialog] = useState(false);

  // Update React state and persist the updated shopping lists to localStorage
  const updateShoppingLists = (next: ShoppingListData[]) => {
    setShoppingLists(next);
    setLocalStorage(localStorageKey.SHOPPING_LIST, next);
  };

  const handleAddShoppingList = (name: string) => {
    const newList = {
      id: crypto.randomUUID(),
      name: name,
      items: [],
      categories: [],
      shareId: null,
    };
    updateShoppingLists([...shoppingLists, newList]);
  };

  const handleEditShoppingList = ({ id, name }: { id: string; name: string }) => {
    const next = shoppingLists.map((item) => {
      if (item.id === id) {
        return { ...item, name };
      }
      return item;
    });
    updateShoppingLists(next);
  };

  const handleDeleteShoppingList = (id: string) => {
    const next = shoppingLists.filter((item) => item.id !== id);
    updateShoppingLists(next);
  };

  useEffect(() => {
    const data = getLocalStorage<ShoppingListData[]>(localStorageKey.SHOPPING_LIST);
    if (data) setShoppingLists(data);
  }, []);

  return (
    <>
      <div className="py-10">
        <div className="px-4 text-[13px] text-neutral-400">買い物リスト一覧</div>
        <div className="mt-2 px-2">
          {shoppingLists.map(({ id, name }) => (
            <ShoppingList
              key={id}
              data={{ id, name }}
              onEdit={handleEditShoppingList}
              onDelete={handleDeleteShoppingList}
            />
          ))}
          <div
            className="inline-flex cursor-pointer items-center gap-x-2 rounded p-2 text-teal-400 hover:bg-teal-50"
            onClick={() => setOpenShoppingListDialog(true)}
          >
            <Plus />
            <div className="font-bold">リストを追加</div>
          </div>
        </div>
      </div>
      <AddShoppingListDialog
        open={openShoppingListDialog}
        onOpenChange={setOpenShoppingListDialog}
        onSubmit={handleAddShoppingList}
        onClose={() => setOpenShoppingListDialog(false)}
      />
    </>
  );
}

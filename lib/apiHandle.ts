import { ShoppingListData } from '@/types/shoppingList';
import { ShoppingItemData } from '@/types/shoppingItem';

// shopping_list
export const addShoppingList = async (title: string): Promise<ShoppingListData> => {
  try {
    const res = await fetch('/api/shopping-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.error('Failed to add shopping list:', e);
    throw new Error('Failed to add shopping list');
  }
};

export const getShoppingList = async (shopingListId: string) => {
  const res = await fetch(`/api/shopping-list?id=${shopingListId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const { title } = await res.json();
  return title;
};

// shopping_item
export const getShoppingItem = async (shopingListId: string) => {
  const res = await fetch(`/api/shopping-item?shopping_list_id=${shopingListId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  return data;
};

export const addShoppingItem = async (
  name: string,
  shoppingListId: string,
  categoryId: string,
): Promise<ShoppingItemData> => {
  const res = await fetch('/api/shopping-item', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: name, shopping_list_id: shoppingListId, category_id: categoryId }),
  });
  const data = await res.json();
  return data;
};

export const updateShoppingItem = async (
  id: string,
  name: string,
  checked: boolean,
  categoryId: string,
) => {
  await fetch('/api/shopping-item', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: id, name: name, checked: checked, category_id: categoryId }),
  });
};

export const deleteShoppingItem = async (id: string) => {
  await fetch('/api/shopping-item', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: id }),
  });
};

// shopping_category
export const getShoppingCategory = async (shopingListId: string) => {
  const res = await fetch(`/api/shopping-category?shopping_list_id=${shopingListId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  return data;
};

export const deleteShoppingCategory = async (id: string) => {
  await fetch('/api/shopping-category', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: id }),
  });
};

export const updateShoppingCategory = async (id: string, name: string, sort_order: number) => {
  await fetch('/api/shopping-category', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: id, name: name, sort_order: sort_order }),
  });
};

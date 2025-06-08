export type ShoppingListData = {
  id: string;
  name: string;
  items: ShoppingItem[] | [];
  categories: ShoppingCategory[] | [];
  shareId: string | null;
};

export type ShoppingItem = {
  id: string;
  name: string;
  categoryId: string | null;
  checked: boolean;
};

export type ShoppingCategory = {
  id: string;
  name: string;
};

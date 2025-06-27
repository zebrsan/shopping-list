export type ShoppingListModel = {
  id: string;
  name: string;
  items: ShoppingItemModel[] | [];
  categories: ShoppingCategoryModel[] | [];
  shareId: string | null;
};

export type ShoppingItemModel = {
  id: string;
  name: string;
  categoryId: string | null;
  checked: boolean;
};

export type ShoppingCategoryModel = {
  id: string;
  name: string;
};

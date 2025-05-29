export const localStorageKey = {
  SHOPPING_LIST: 'shopping_list',
  SHOPPING_LISTS: 'shopping_lists',
} as const;

type LocalStorageValueKey = (typeof localStorageKey)[keyof typeof localStorageKey];

export const getLocalStorage = <T>(key: LocalStorageValueKey): T | undefined => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : undefined;
};

export const setLocalStorage = <T>(key: LocalStorageValueKey, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

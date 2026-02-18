import { useState, useCallback } from 'react';
import { ShoppingList, ShoppingItem, AppSettings } from '@/types/shopping';

export type { AppSettings };

const LISTS_KEY = 'shopping_lists';
const SETTINGS_KEY = 'shopping_settings';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  defaultSort: 'category',
  defaultSortDirection: 'asc',
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function loadLists(): ShoppingList[] {
  try {
    const data = localStorage.getItem(LISTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLists(lists: ShoppingList[]): void {
  localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
}

export function loadSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function useShoppingLists() {
  const [lists, setLists] = useState<ShoppingList[]>(loadLists);

  const persist = useCallback((updated: ShoppingList[]) => {
    setLists(updated);
    saveLists(updated);
  }, []);

  // Create a new list
  const createList = useCallback((title: string): ShoppingList => {
    const newList: ShoppingList = {
      id: generateId(),
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
      archived: false,
    };
    persist([newList, ...lists]);
    return newList;
  }, [lists, persist]);

  // Update list title
  const updateListTitle = useCallback((listId: string, title: string) => {
    persist(lists.map(l => l.id === listId ? { ...l, title, updatedAt: new Date().toISOString() } : l));
  }, [lists, persist]);

  // Delete list
  const deleteList = useCallback((listId: string) => {
    persist(lists.filter(l => l.id !== listId));
  }, [lists, persist]);

  // Archive list
  const archiveList = useCallback((listId: string) => {
    persist(lists.map(l => l.id === listId ? { ...l, archived: true, updatedAt: new Date().toISOString() } : l));
  }, [lists, persist]);

  // Restore archived list
  const restoreList = useCallback((listId: string) => {
    persist(lists.map(l => l.id === listId ? { ...l, archived: false, updatedAt: new Date().toISOString() } : l));
  }, [lists, persist]);

  // Duplicate list
  const duplicateList = useCallback((listId: string): ShoppingList => {
    const original = lists.find(l => l.id === listId);
    if (!original) throw new Error('List not found');
    const copy: ShoppingList = {
      ...original,
      id: generateId(),
      title: `${original.title} (cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: original.items.map(item => ({ ...item, id: generateId() })),
      archived: false,
    };
    persist([copy, ...lists]);
    return copy;
  }, [lists, persist]);

  // Add item
  const addItem = useCallback((listId: string, item: Omit<ShoppingItem, 'id' | 'order'>): ShoppingItem => {
    const list = lists.find(l => l.id === listId);
    if (!list) throw new Error('List not found');
    const maxOrder = list.items.length > 0 ? Math.max(...list.items.map(i => i.order)) : 0;
    const newItem: ShoppingItem = { ...item, id: generateId(), order: maxOrder + 1 };
    persist(lists.map(l => l.id === listId
      ? { ...l, items: [...l.items, newItem], updatedAt: new Date().toISOString() }
      : l
    ));
    return newItem;
  }, [lists, persist]);

  // Update item
  const updateItem = useCallback((listId: string, itemId: string, updates: Partial<ShoppingItem>) => {
    persist(lists.map(l => l.id === listId
      ? {
          ...l,
          updatedAt: new Date().toISOString(),
          items: l.items.map(i => i.id === itemId ? { ...i, ...updates } : i),
        }
      : l
    ));
  }, [lists, persist]);

  // Delete item
  const deleteItem = useCallback((listId: string, itemId: string) => {
    persist(lists.map(l => l.id === listId
      ? { ...l, updatedAt: new Date().toISOString(), items: l.items.filter(i => i.id !== itemId) }
      : l
    ));
  }, [lists, persist]);

  // Toggle item bought
  const toggleItemBought = useCallback((listId: string, itemId: string) => {
    persist(lists.map(l => l.id === listId
      ? {
          ...l,
          updatedAt: new Date().toISOString(),
          items: l.items.map(i => i.id === itemId ? { ...i, bought: !i.bought } : i),
        }
      : l
    ));
  }, [lists, persist]);

  // Reorder items
  const reorderItems = useCallback((listId: string, items: ShoppingItem[]) => {
    persist(lists.map(l => l.id === listId
      ? { ...l, updatedAt: new Date().toISOString(), items }
      : l
    ));
  }, [lists, persist]);

  // Mark all items as bought
  const markAllBought = useCallback((listId: string, bought: boolean) => {
    persist(lists.map(l => l.id === listId
      ? { ...l, updatedAt: new Date().toISOString(), items: l.items.map(i => ({ ...i, bought })) }
      : l
    ));
  }, [lists, persist]);

  // Clear bought items
  const clearBoughtItems = useCallback((listId: string) => {
    persist(lists.map(l => l.id === listId
      ? { ...l, updatedAt: new Date().toISOString(), items: l.items.filter(i => !i.bought) }
      : l
    ));
  }, [lists, persist]);

  const getList = useCallback((listId: string) => lists.find(l => l.id === listId), [lists]);

  const activeLists = lists.filter(l => !l.archived);
  const archivedLists = lists.filter(l => l.archived);

  return {
    lists,
    activeLists,
    archivedLists,
    getList,
    createList,
    updateListTitle,
    deleteList,
    archiveList,
    restoreList,
    duplicateList,
    addItem,
    updateItem,
    deleteItem,
    toggleItemBought,
    reorderItems,
    markAllBought,
    clearBoughtItems,
  };
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

export function formatCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const number = parseInt(digits, 10) / 100;
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function listTotalValue(list: ShoppingList): number {
  return list.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function listProgress(list: ShoppingList): number {
  if (list.items.length === 0) return 0;
  return (list.items.filter(i => i.bought).length / list.items.length) * 100;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function listToText(list: ShoppingList): string {
  const lines: string[] = [`🛒 ${list.title}`, `📅 ${formatDate(list.createdAt)}`, ''];
  
  const byCategory: Record<string, ShoppingItem[]> = {};
  list.items.forEach(item => {
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  });

  Object.entries(byCategory).forEach(([cat, items]) => {
    lines.push(`📦 ${cat}`);
    items.forEach(item => {
      const price = item.unitPrice > 0 ? ` — ${formatCurrency(item.unitPrice)}/un` : '';
      const status = item.bought ? '✅' : '⬜';
      lines.push(`  ${status} ${item.name} (${item.quantity}${price})`);
    });
    lines.push('');
  });

  const total = listTotalValue(list);
  if (total > 0) lines.push(`💰 Total: ${formatCurrency(total)}`);

  return lines.join('\n');
}

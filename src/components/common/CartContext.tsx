'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: string | number;
  name: string;
  price: string;
  priceNum: number;
  image: string;
  quantity: number;
  slug?: string;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalQty: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, 'priceNum'> & { priceNum?: number }) => void;
  updateQty: (id: string | number, delta: number) => void;
  removeItem: (id: string | number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const STORAGE_KEY = 'kshithija_cart_v1';

export function parsePrice(priceStr?: string | number): number {
  if (priceStr === undefined || priceStr === null) return 0;
  const clean = String(priceStr).replace(/[^0-9.]/g, '');
  return parseFloat(clean) || 0;
}

function readStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event('cart-updated'));
    } catch {}
  }, []);

  useEffect(() => {
    setItems(readStoredCart());
    const onStorage = () => setItems(readStoredCart());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, 'priceNum'> & { priceNum?: number }) => {
      const current = readStoredCart();
      const existing = current.find((i) => String(i.id) === String(item.id));
      const qty = item.quantity || 1;
      let next: CartItem[];
      if (existing) {
        next = current.map((i) =>
          String(i.id) === String(item.id) ? { ...i, quantity: (i.quantity || 1) + qty } : i
        );
      } else {
        next = [
          ...current,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            priceNum: item.priceNum ?? parsePrice(item.price),
            image: item.image,
            quantity: qty,
            slug: item.slug,
          },
        ];
      }
      persist(next);
      open();
    },
    [open, persist]
  );

  const updateQty = useCallback(
    (id: string | number, delta: number) => {
      const current = readStoredCart();
      const next = current
        .map((i) => (String(i.id) === String(id) ? { ...i, quantity: (i.quantity || 1) + delta } : i))
        .filter((i) => i.quantity > 0);
      persist(next);
    },
    [persist]
  );

  const removeItem = useCallback(
    (id: string | number) => {
      const current = readStoredCart();
      persist(current.filter((i) => String(i.id) !== String(id)));
    },
    [persist]
  );

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  // Expose window.KshithijaCart and global [data-add-to-cart] click delegation for compatibility
  useEffect(() => {
    (window as unknown as { KshithijaCart?: unknown }).KshithijaCart = {
      getItems: () => readStoredCart(),
      addItem,
      updateQty,
      removeItem,
      clear,
      open,
      close,
    };

    const handleDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest('[data-add-to-cart]') as HTMLElement | null;
      if (!btn) return;
      e.preventDefault();
      const id = btn.getAttribute('data-product-id');
      const name = btn.getAttribute('data-product-name');
      const price = btn.getAttribute('data-product-price') || '₹349';
      const image = btn.getAttribute('data-product-image') || '';
      const qtyInput = document.getElementById('detail-qty') as HTMLInputElement | null;
      const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

      if (id && name) {
        addItem({ id, name, price, image, quantity: qty });
        const labelEl = btn.querySelector('.btn-label') || btn;
        const originalHtml = labelEl.innerHTML;
        labelEl.innerHTML = '<span class="text-emerald-300">✓ Added!</span>';
        setTimeout(() => {
          labelEl.innerHTML = originalHtml;
        }, 1400);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('click', handleDocClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleDocClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [addItem, clear, close, open, removeItem, updateQty]);

  const totalQty = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = items.reduce(
    (sum, item) => sum + (item.priceNum || parsePrice(item.price)) * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalQty,
        subtotal,
        addItem,
        updateQty,
        removeItem,
        clear,
        open,
        close,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CompositionEntry = {
  name: string;
  nameEn: string;
  quantity: number;
};

export type CartItem = {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  quantity: number;
  size?: string;
  sizeEn?: string;
  image?: string;
  composition?: CompositionEntry[];
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

const getItemKey = (id: string, size?: string) => `${id}-${size || "default"}`;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        set((state) => {
          const key = getItemKey(item.id, item.size);
          const existing = state.items.find(
            (i) => getItemKey(i.id, i.size) === key
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                getItemKey(i.id, i.size) === key
                  ? { ...i, quantity: Math.round((i.quantity + quantity) * 100) / 100 }
                  : i
              ),
            };
          }

          return { items: [...state.items, { ...item, quantity }] };
        });
      },

      removeItem: (id, size) => {
        const key = getItemKey(id, size);
        set((state) => ({
          items: state.items.filter(
            (i) => getItemKey(i.id, i.size) !== key
          ),
        }));
      },

      updateQuantity: (id, quantity, size) => {
        const key = getItemKey(id, size);
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter(
              (i) => getItemKey(i.id, i.size) !== key
            ),
          }));
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            getItemKey(i.id, i.size) === key ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "mesara-sisko-cart",
    }
  )
);

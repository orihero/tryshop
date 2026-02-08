import { create } from 'zustand';

export interface CartItem {
  productId: string;
  title: string;
  image: string | null;
  price: number;
  size: string;
  color: string;
  quantity: number;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (
    productId: string,
    size: string,
    color: string,
    delta: number
  ) => void;
  removeItem: (productId: string, size: string, color: string) => void;
}

const findItemIndex = (
  items: CartItem[],
  productId: string,
  size: string,
  color: string
) =>
  items.findIndex(
    (i) => i.productId === productId && i.size === size && i.color === color
  );

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => {
    const qty = item.quantity ?? 1;
    set((state) => {
      const idx = findItemIndex(
        state.items,
        item.productId,
        item.size,
        item.color
      );
      const next =
        idx >= 0
          ? state.items.map((it) =>
              it === state.items[idx]
                ? {
                    ...it,
                    quantity: Math.min(it.quantity + qty, it.maxStock),
                  }
                : it
            )
          : [
              ...state.items,
              {
                ...item,
                quantity: Math.min(qty, item.maxStock),
              } as CartItem,
            ];
      return { items: next };
    });
  },
  updateQuantity: (productId, size, color, delta) => {
    set((state) => {
      const idx = findItemIndex(state.items, productId, size, color);
      if (idx < 0) return state;
      const item = state.items[idx];
      const nextQty = Math.max(0, Math.min(item.quantity + delta, item.maxStock));
      const next =
        nextQty === 0
          ? state.items.filter((_, i) => i !== idx)
          : state.items.map((it) =>
              it === item ? { ...it, quantity: nextQty } : it
            );
      return { items: next };
    });
  },
  removeItem: (productId, size, color) => {
    set((state) => ({
      items: state.items.filter(
        (i) =>
          !(i.productId === productId && i.size === size && i.color === color)
      ),
    }));
  },
}));

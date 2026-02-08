import { useCartStore } from '@/stores/cartStore';

export const useCart = () => {
  const items = useCartStore((s) => s.items);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return {
    items,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
  };
};

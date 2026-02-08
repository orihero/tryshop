import { motion } from 'framer-motion';
import { IoRemove, IoAdd, IoTrashOutline } from 'react-icons/io5';
import { LiquidGlass } from '@liquidglass/react';
import type { CartItem as CartItemType } from '@/stores/cartStore';

const formatPrice = (price: number): string =>
  price.toLocaleString('ru-RU').replace(/,/g, ' ') + ' UZS';

interface CartItemCardProps {
  item: CartItemType;
  onQuantityChange: (delta: number) => void;
  onRemove: () => void;
}

const CartItemCard = ({
  item,
  onQuantityChange,
  onRemove,
}: CartItemCardProps) => {
  const canDecrement = item.quantity > 1;
  const canIncrement = item.quantity < item.maxStock;

  return (
    <LiquidGlass
      borderRadius={16}
      blur={5}
      contrast={1.2}
      brightness={0.8}
      saturation={1.2}
      shadowIntensity={0.25}
      displacementScale={1}
      elasticity={0.6}
      className="overflow-hidden"
    >
      <div className="flex gap-4 p-4 bg-white/60">
        <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-gray-400 text-xs text-center px-1">
              {item.title}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
            {item.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {item.size} · {item.color}
          </p>
          <p className="font-bold text-gray-900 mt-1" style={{ color: '#008B8B' }}>
            {formatPrice(item.price)}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onQuantityChange(-1)}
                disabled={!canDecrement}
                className="w-6 h-6 rounded-full flex items-center justify-center text-gray-700 disabled:text-gray-300 transition-colors"
              >
                <IoRemove className="text-sm" />
              </motion.button>
              <span className="text-sm font-semibold text-gray-900 w-4 text-center">
                {item.quantity}
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onQuantityChange(1)}
                disabled={!canIncrement}
                className="w-6 h-6 rounded-full flex items-center justify-center text-gray-700 disabled:text-gray-300 transition-colors"
              >
                <IoAdd className="text-sm" />
              </motion.button>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onRemove}
              className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
              aria-label="Remove item"
            >
              <IoTrashOutline className="text-lg" />
            </motion.button>
          </div>
        </div>
      </div>
    </LiquidGlass>
  );
};

export default CartItemCard;

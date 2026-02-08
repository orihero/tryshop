import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { IoRemove, IoAdd } from 'react-icons/io5';

interface AddToCartBarProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  maxStock: number;
  onAddToCart: () => void;
}

const AddToCartBar = ({
  quantity,
  onIncrement,
  onDecrement,
  maxStock,
  onAddToCart,
}: AddToCartBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-4">
        {/* Quantity picker */}
        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-2">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onDecrement}
            disabled={quantity <= 1}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-700 disabled:text-gray-300 transition-colors"
          >
            <IoRemove className="text-lg" />
          </motion.button>
          <span className="text-base font-semibold text-gray-900 w-5 text-center">
            {quantity}
          </span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onIncrement}
            disabled={quantity >= maxStock}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-700 disabled:text-gray-300 transition-colors"
          >
            <IoAdd className="text-lg" />
          </motion.button>
        </div>

        {/* Add to cart button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onAddToCart}
          className="flex-1 bg-[#3D4A5C] text-white font-semibold text-base py-3.5 rounded-full shadow-lg active:shadow-md transition-shadow"
        >
          {t('addToCart')}
        </motion.button>
      </div>
    </div>
  );
};

export default AddToCartBar;

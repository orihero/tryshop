import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBack, IoBagHandleOutline, IoRemove, IoAdd } from 'react-icons/io5';
import { LiquidGlass } from '@liquidglass/react';

interface ProductDetailsTopBarProps {
  onBack: () => void;
  cartOpen: boolean;
  onCartOpen: () => void;
  quantity: number;
  onQuantityDecrement: () => void;
  onQuantityIncrement: () => void;
  maxStock: number;
}

const ProductDetailsTopBar = ({
  onBack,
  cartOpen,
  onCartOpen,
  quantity,
  onQuantityDecrement,
  onQuantityIncrement,
  maxStock,
}: ProductDetailsTopBarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-20">
      <div className="flex items-center justify-between px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <LiquidGlass
          borderRadius={100}
          blur={5}
          contrast={1.2}
          brightness={0.8}
          saturation={1.2}
          shadowIntensity={0.25}
          displacementScale={1}
          elasticity={0.6}
          className="max-w-11 min-h-11"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-full h-full rounded-full flex items-center justify-center"
            aria-label="Back"
          >
            <IoChevronBack className="text-xl text-gray-700" />
          </motion.button>
        </LiquidGlass>
        <div className="w-[100%]" />
        <motion.div
          animate={{ width: cartOpen ? 140 : 44 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="h-11 relative"
        >
          <LiquidGlass
            borderRadius={100}
            blur={5}
            contrast={1.2}
            brightness={0.8}
            saturation={1.2}
            shadowIntensity={0.25}
            displacementScale={1}
            elasticity={0.6}
            className="w-full min-h-11"
          >
            <AnimatePresence mode="wait" initial={false}>
              {!cartOpen ? (
                <motion.button
                  key="cart-icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onCartOpen}
                  className="min-w-11 w-full h-full rounded-full flex items-center justify-center"
                  aria-label="Cart"
                >
                  <IoBagHandleOutline className="text-xl text-gray-700" />
                </motion.button>
              ) : (
                <motion.div
                  key="cart-controls"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="w-full h-full flex items-center justify-between px-2 gap-1"
                >
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={onQuantityDecrement}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700"
                    aria-label="Decrease quantity"
                  >
                    <IoRemove className="text-lg" />
                  </motion.button>
                  <span className="text-sm font-semibold text-gray-800 min-w-[20px] text-center select-none">
                    {quantity}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={onQuantityIncrement}
                    disabled={quantity >= maxStock}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 disabled:text-gray-300"
                    aria-label="Increase quantity"
                  >
                    <IoAdd className="text-lg" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </LiquidGlass>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailsTopBar;

import { motion } from 'framer-motion';
import { IoCheckmark } from 'react-icons/io5';
import { LiquidGlass } from '@liquidglass/react';
import type { Product, ProductColor } from '@/types/appwrite';
import ProductDetailsTopBar from '@/pages/ProductDetails/components/ProductDetailsTopBar';

interface TryOnLayoutProps {
  photoUrl: string;
  product: Product;
  colors: ProductColor[];
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  setSelectedColor: (hex: string) => void;
  quantity: number;
  cartOpen: boolean;
  onBack: () => void;
  onCartOpen: () => void;
  onQuantityDecrement: () => void;
  onQuantityIncrement: () => void;
  generating?: boolean;
}

const TryOnLayout = ({
  photoUrl,
  product,
  colors,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  quantity,
  cartOpen,
  onBack,
  onCartOpen,
  onQuantityDecrement,
  onQuantityIncrement,
  generating = false,
}: TryOnLayoutProps) => {
  const sizes = product.sizes || [];

  return (
    <div className="font-roboto fixed inset-0 flex flex-col bg-[#FAF9F6]">
      {/* Full-screen uploaded or result photo */}
      <div className="absolute inset-0 z-0">
        <img
          src={photoUrl}
          alt="Try on"
          className="w-full h-full object-contain object-center"
        />
        {generating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 z-[1]">
            <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-white font-medium text-sm">
              Generating try-on…
            </p>
          </div>
        )}
      </div>

      {/* Top bar: back + cart (same as Product Details) */}
      <ProductDetailsTopBar
        onBack={onBack}
        cartOpen={cartOpen}
        onCartOpen={onCartOpen}
        quantity={quantity}
        onQuantityDecrement={onQuantityDecrement}
        onQuantityIncrement={onQuantityIncrement}
        maxStock={product.stock}
      />

      {/* Size pickers: horizontal at bottom */}
      {sizes.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-10 px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <LiquidGlass
            borderRadius={24}
            blur={5}
            contrast={1.2}
            brightness={0.8}
            saturation={1.2}
            shadowIntensity={0.25}
            displacementScale={1}
            elasticity={0.6}
            className="inline-block"
          >
            <div className="flex gap-2.5 py-2 px-3">
              {sizes.map((size) => {
                const isSelected = size === selectedSize;
                return (
                  <motion.button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    whileTap={{ scale: 0.92 }}
                    className={`min-w-[44px] h-[44px] rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#3D4A5C] text-white shadow-md'
                        : 'bg-white/80 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {size}
                  </motion.button>
                );
              })}
            </div>
          </LiquidGlass>
        </div>
      )}

      {/* Color pickers: vertical, middle right */}
      {colors.length > 0 && (
        <div className="fixed right-4 top-1/2 z-10 -translate-y-1/2">
          <LiquidGlass
            borderRadius={24}
            blur={5}
            contrast={1.2}
            brightness={0.8}
            saturation={1.2}
            shadowIntensity={0.25}
            displacementScale={1}
            elasticity={0.6}
            className="inline-block"
          >
            <div className="flex flex-col gap-3 py-2 px-2">
              {colors.map((color) => {
                const isSelected = color.hex === selectedColor;
                return (
                  <motion.button
                    key={color.hex}
                    onClick={() => setSelectedColor(color.hex)}
                    whileTap={{ scale: 0.9 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'ring-2 ring-offset-2 ring-[#3D4A5C]' : ''
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {isSelected && (
                      <IoCheckmark className="text-white text-lg drop-shadow-md" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </LiquidGlass>
        </div>
      )}
    </div>
  );
};

export default TryOnLayout;

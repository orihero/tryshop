import { motion } from 'framer-motion';
import { IoStar, IoCheckmark } from 'react-icons/io5';
import { useTranslation } from '@/hooks/useTranslation';
import type { ProductColor, ProductProperty } from '@/types/appwrite';

interface ProductInfoProps {
  title: string;
  stock: number;
  price: number;
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  colors: ProductColor[];
  selectedColor: string;
  onSelectColor: (hex: string) => void;
  properties: ProductProperty[];
  rating?: number;
  reviewCount?: number;
}

/**
 * Format price to UZS display with space-separated thousands: "1 890 000 UZS"
 */
const formatPriceUZS = (price: number): string => {
  return price.toLocaleString('ru-RU').replace(/,/g, ' ') + ' UZS';
};

/**
 * Get the localized label for a color based on the current language.
 */
const getColorLabel = (color: ProductColor, language: string): string => {
  switch (language) {
    case 'ru':
      return color.label_ru || color.label_en;
    case 'uz':
      return color.label_uz || color.label_en;
    default:
      return color.label_en;
  }
};

const ProductInfo = ({
  title,
  stock,
  price,
  sizes,
  selectedSize,
  onSelectSize,
  colors,
  selectedColor,
  onSelectColor,
  properties,
  rating = 4.9,
  reviewCount = 320,
}: ProductInfoProps) => {
  const { t, language } = useTranslation();

  return (
    <div className="px-5 pt-4 space-y-4">
      {/* Rating */}
      <div className="flex items-center gap-1.5">
        <IoStar className="text-amber-400 text-base" />
        <span className="text-sm font-semibold text-gray-800">
          {rating} / 5
        </span>
        <span className="text-sm text-gray-400">
          ({reviewCount} {t('reviews')})
        </span>
      </div>

      {/* Title + Stock */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-xl font-bold text-gray-900 leading-tight">
          {title}
        </h1>
        <span className="text-sm text-gray-400 whitespace-nowrap mt-1">
          {stock} {t('inStock')}
        </span>
      </div>

      {/* Size selector */}
      {sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            {t('size')}
          </h3>
          <div className="flex gap-2.5 flex-wrap">
            {sizes.map((size) => {
              const isSelected = size === selectedSize;
              return (
                <motion.button
                  key={size}
                  onClick={() => onSelectSize(size)}
                  whileTap={{ scale: 0.92 }}
                  className={`min-w-[44px] h-[44px] rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#3D4A5C] text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  {size}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color picker */}
      {colors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            {t('color')}
            {selectedColor && (
              <span className="font-normal text-gray-400 ml-2">
                — {getColorLabel(
                  colors.find((c) => c.hex === selectedColor) || colors[0],
                  language
                )}
              </span>
            )}
          </h3>
          <div className="flex gap-3 flex-wrap">
            {colors.map((color) => {
              const isSelected = color.hex === selectedColor;
              return (
                <motion.button
                  key={color.hex}
                  onClick={() => onSelectColor(color.hex)}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-[#3D4A5C]'
                      : ''
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
        </div>
      )}

      {/* Price */}
      <p className="text-2xl font-bold text-gray-900">
        {formatPriceUZS(price)}
      </p>

      {/* Product properties */}
      {properties.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">
            {t('properties')}
          </h3>
          <div className="space-y-1.5">
            {properties.map((prop) => (
              <div
                key={prop.$id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-500">{prop.key}</span>
                <span className="text-gray-800 font-medium">{prop.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;

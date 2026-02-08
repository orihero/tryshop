import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import type { Product } from '@/types/appwrite';
import { motion } from 'framer-motion';
import { IoBagAddOutline } from 'react-icons/io5';

// Default placeholder colors when product doesn't specify one
const DEFAULT_BACKGROUNDS = [
  '#B0E0E6', // Light teal
  '#E6E6FA', // Light purple
  '#FFFACD', // Light yellow
  '#E0F7FA', // Light cyan
  '#FFF0F5', // Lavender blush
  '#F0FFF0', // Honeydew
];

/**
 * Format price from minor units (e.g., 1890000 UZS) to a readable string.
 * Outputs: "1 890 000 UZS"
 */
const formatPrice = (price: number): string => {
  return price.toLocaleString('ru-RU').replace(/,/g, ' ') + ' UZS';
};

interface HomeProductCardProps {
  product: Product;
  index?: number;
}

const HomeProductCard = ({ product, index = 0 }: HomeProductCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const backgroundColor =
    product.backgroundColor || DEFAULT_BACKGROUNDS[index % DEFAULT_BACKGROUNDS.length];
  const priceColor = product.priceColor || '#008B8B';

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      }}
      className="font-roboto w-full min-w-0 h-72 cursor-pointer"
      onClick={() => navigate(`/product/${product.$id}`)}
    >

      <div
        className="rounded-3xl p-4 relative overflow-hidden h-full"
        style={{ backgroundColor }}
      >
        {/* Add to cart button overlay */}
        <button className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors">
          <IoBagAddOutline className="text-white text-lg" />
        </button>

        {/* Product image */}
        <div className="w-full h-40 mb-3 flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center px-2">
              {product.title}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-1">
          <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">
            {product.title}
          </h3>
          <p className="font-bold text-lg" style={{ color: priceColor }}>
            {formatPrice(product.price)}
          </p>
          <p className="text-gray-600 text-xs">
            {product.stock} {t('inStock')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeProductCard;

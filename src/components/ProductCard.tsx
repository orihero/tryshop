import { motion } from 'framer-motion';
import { LiquidGlass } from '@liquidglass/react';
import type { ReactNode } from 'react';

interface ProductCardProps {
  image: string;
  alt?: string;
  children?: ReactNode;
  index?: number;
}

const ProductCard = ({ image, alt = 'Product', children, index = 0 }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: 'easeOut',
      }}
      className="flex-shrink-0"
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
      >
        <div className="w-32 h-40 md:w-40 md:h-48 rounded-2xl overflow-hidden bg-white/10 p-2">
          <img
            src={image}
            alt={alt}
            className="w-full h-full object-contain"
          />
          {children}
        </div>
      </LiquidGlass>
    </motion.div>
  );
};

export default ProductCard;

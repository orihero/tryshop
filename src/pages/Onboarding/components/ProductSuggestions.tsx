import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import ProductCard from '@/components/ProductCard';
import jacket1Image from '@/assets/images/onboarding/sjacket.png';
import jacket2Image from '@/assets/images/onboarding/suite.png';
import jacket3Image from '@/assets/images/onboarding/bjacket.png';

const ProductSuggestions = () => {
  const { t } = useTranslation();

  const products = [
    { image: jacket1Image, alt: 'Jacket' },
    { image: jacket2Image, alt: 'Suit' },
    { image: jacket3Image, alt: 'Sport Jacket' },
  ];

  return (
    <motion.div
      className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-10"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <motion.h2
          className="text-white font-gothic text-lg md:text-xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.3,
            duration: 0.4,
          }}
        >
          {t('aiSuggestions')}
        </motion.h2>
        <div className="flex gap-4">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              image={product.image}
              alt={product.alt}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductSuggestions;

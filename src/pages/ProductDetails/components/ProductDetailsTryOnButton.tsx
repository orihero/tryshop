import { motion } from 'framer-motion';
import { LiquidGlass } from '@liquidglass/react';
import { useTranslation } from '@/hooks/useTranslation';

interface ProductDetailsTryOnButtonProps {
  isLoggedIn: boolean;
  onTryOn: () => void;
}

const ProductDetailsTryOnButton = ({ isLoggedIn, onTryOn }: ProductDetailsTryOnButtonProps) => {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <LiquidGlass
        borderRadius={9999}
        blur={12}
        contrast={1.2}
        brightness={0.7}
        saturation={1.3}
        shadowIntensity={0.3}
        displacementScale={1}
        elasticity={0.5}
        className="w-full"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onTryOn}
          className="w-full font-semibold text-base py-4 rounded-full text-white"
        >
          {isLoggedIn ? t('tryOn') : t('signInToTryOn')}
        </motion.button>
      </LiquidGlass>
    </div>
  );
};

export default ProductDetailsTryOnButton;

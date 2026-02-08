import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LiquidGlass } from '@liquidglass/react';
import { useTranslation } from '@/hooks/useTranslation';
import Button from '@/components/Button';

const BrandsCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/home');
  };

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-md px-4"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: 0.3,
        duration: 0.5,
        ease: 'easeOut',
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <LiquidGlass
          borderRadius={24}
          blur={1}
          contrast={1.2}
          brightness={0.8}
          saturation={1.2}
          shadowIntensity={0.25}
          displacementScale={1}
          elasticity={0.6}
        >
          <div className="px-6 py-8">
            <h2 className="text-white font-gothic text-xl md:text-2xl text-center leading-tight">
              {t('exploreTopBrands')}
            </h2>
          </div>
        </LiquidGlass>
        <Button liquidGlass={{ borderRadius: 100, blur: 1 }} onClick={handleGetStarted} className="px-8 py-4">
          <span className="text-white font-gothic text-lg">{t('getStarted')}</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default BrandsCard;

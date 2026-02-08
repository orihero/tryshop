import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import TopText from './TopText';
import BackgroundScene from './BackgroundScene';
import JacketDisplay from './JacketDisplay';
import type { JacketNumber } from '../useOnboardingHook';

interface OnboardingMainScreenProps {
  showProductSuggestions: boolean;
  currentJacket: JacketNumber;
  isManualTransition: boolean;
  isFirstCycle: boolean;
}

const OnboardingMainScreen = forwardRef<HTMLDivElement, OnboardingMainScreenProps>(
  (
    {
      showProductSuggestions,
      currentJacket,
      isManualTransition,
      isFirstCycle,
    },
    ref
  ) => {
    const { t } = useTranslation();

    return (
      <motion.div
        ref={ref}
        key="main-screen"
        className="fixed inset-0 overflow-hidden"
        style={{
          width: '100vw',
          height: '100vh',
        }}
        initial={{ x: 0, opacity: 1 }}
        exit={{ x: '-100%', opacity: 0 }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
        }}
      >
        <TopText
          text={
            showProductSuggestions ? t('buildYourWardrobe') : t('tryOutfitsVirtually')
          }
        />
        <BackgroundScene isZoomedOut={showProductSuggestions}>
          <JacketDisplay
            currentJacket={currentJacket}
            isManualTransition={isManualTransition}
            isFirstCycle={isFirstCycle}
          />
        </BackgroundScene>
      </motion.div>
    );
  }
);

OnboardingMainScreen.displayName = 'OnboardingMainScreen';

export default OnboardingMainScreen;

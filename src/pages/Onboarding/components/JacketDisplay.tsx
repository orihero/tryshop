import { AnimatePresence, motion } from 'framer-motion';
import type { JacketNumber } from '../useOnboardingHook';
import jacket1Image from '@/assets/images/onboarding/jacket1.png';
import jacket2Image from '@/assets/images/onboarding/jacket2.png';
import jacket3Image from '@/assets/images/onboarding/jacket3.png';

interface JacketDisplayProps {
  currentJacket: JacketNumber;
  isManualTransition: boolean;
  isFirstCycle: boolean;
}

const jacketConfig = {
  1: {
    image: jacket1Image,
    animate: {
      scale: 1,
      x: 0,
      y: 0,
      opacity: 1,
    },
  },
  2: {
    image: jacket2Image,
    animate: {
      scale: 0.95,
      x: 0,
      y: '-6%',
      opacity: 1,
    },
  },
  3: {
    image: jacket3Image,
    animate: {
      scale: 0.93,
      x: '-.5%',
      y: '-2.5%',
      opacity: 1,
    },
  },
} as const;

const JacketDisplay = ({
  currentJacket,
  isManualTransition,
  isFirstCycle,
}: JacketDisplayProps) => {
  const getJacketDelay = (jacket: JacketNumber): number => {
    if (jacket === 1) {
      return isManualTransition || !isFirstCycle ? 0 : 0.8;
    }
    if (jacket === 2) {
      return isManualTransition ? 0 : 0.7;
    }
    // jacket === 3
    return 0.7;
  };

  return (
    <AnimatePresence mode="wait">
      {currentJacket === 1 && (
        <motion.div
          key="jacket-1"
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{
            scale: 0.5,
            x: '100%',
            y: 0,
            opacity: 0,
          }}
          animate={jacketConfig[1].animate}
          exit={{
            x: '-100%',
            y: 0,
            scale: 0.5,
            opacity: 0,
            transition: {
              duration: 0.6,
              ease: 'easeIn',
            },
          }}
          transition={{
            delay: getJacketDelay(1),
            duration: 0.6,
            ease: 'easeOut',
          }}
        >
          <img
            src={jacketConfig[1].image}
            alt="Jacket 1"
            className="max-h-full max-w-full object-contain"
            style={{
              mixBlendMode: 'normal',
            }}
          />
        </motion.div>
      )}

      {currentJacket === 2 && (
        <motion.div
          key="jacket-2"
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{
            scale: 0.5,
            x: '100%',
            y: '-6%',
            opacity: 0,
          }}
          animate={jacketConfig[2].animate}
          exit={{
            x: '-100%',
            y: '-6%',
            scale: 0.5,
            opacity: 0,
            transition: {
              duration: 0.6,
              ease: 'easeIn',
            },
          }}
          transition={{
            delay: getJacketDelay(2),
            duration: 0.6,
            ease: 'easeOut',
          }}
        >
          <img
            src={jacketConfig[2].image}
            alt="Jacket 2"
            className="max-h-full max-w-full object-contain"
            style={{
              mixBlendMode: 'normal',
            }}
          />
        </motion.div>
      )}

      {currentJacket === 3 && (
        <motion.div
          key="jacket-3"
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{
            scale: 0.5,
            x: '100%',
            y: '-2.5%',
            opacity: 0,
          }}
          animate={jacketConfig[3].animate}
          exit={{
            x: '-100%',
            y: '-2.5%',
            scale: 0.5,
            opacity: 0,
            transition: {
              duration: 0.6,
              ease: 'easeIn',
            },
          }}
          transition={{
            delay: getJacketDelay(3),
            duration: 0.6,
            ease: 'easeOut',
          }}
        >
          <img
            src={jacketConfig[3].image}
            alt="Jacket 3"
            className="max-h-full max-w-full object-contain"
            style={{
              mixBlendMode: 'normal',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JacketDisplay;

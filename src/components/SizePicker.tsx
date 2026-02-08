import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@liquidglass/react';
import type { Size } from '@/pages/Onboarding/useOnboardingHook';

interface SizePickerProps {
  sizes: Size[];
  selectedSize: Size;
  highlighted?: boolean;
  xlButtonPressed?: boolean;
  visible?: boolean;
}

const SizePicker = ({
  sizes,
  selectedSize,
  highlighted = false,
  xlButtonPressed = false,
  visible = true,
}: SizePickerProps) => {
  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            key="size-picker"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: highlighted ? 1.2 : 1,
              opacity: 1,
            }}
            exit={{
              scale: 0,
              opacity: 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              mass: 1,
              delay: 0.1,
              duration: 0.3,
            }}
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
          <div className="flex gap-3 py-1 px-1">
            {sizes.map((size) => {
              const isXL = size === 'XL';
              const isPressed = isXL && xlButtonPressed;
              const isSelected = selectedSize === size;

              return (
                <LiquidGlass
                  key={size}
                  borderRadius={100}
                  blur={5}
                  contrast={1.2}
                  brightness={0.8}
                  saturation={1.2}
                  shadowIntensity={0.25}
                  displacementScale={1}
                  elasticity={0.6}
                >
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors pointer-events-none ${
                      isSelected
                        ? 'bg-amber-800 text-white'
                        : 'bg-white/20 text-white'
                    }`}
                    animate={{
                      scale: isPressed ? 0.85 : 1,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: 'easeOut',
                    }}
                  >
                    <span className="font-gothic text-lg font-semibold">{size}</span>
                  </motion.div>
                </LiquidGlass>
              );
            })}
          </div>
        </LiquidGlass>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SizePicker;

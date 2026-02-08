import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@liquidglass/react';
import type { Color, ColorId } from '@/pages/Onboarding/useOnboardingHook';

interface ColorPickerProps {
  colors: Color[];
  selectedColor: ColorId;
  highlighted?: boolean;
  orangeButtonPressed?: boolean;
  blueButtonPressed?: boolean;
  visible?: boolean;
}

const ColorPicker = ({
  colors,
  selectedColor,
  highlighted = false,
  orangeButtonPressed = false,
  blueButtonPressed = false,
  visible = true,
}: ColorPickerProps) => {
  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-10">
          <motion.div
            key="color-picker"
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
          <div className="flex flex-col gap-3 py-1 px-1">
            {colors.map((color) => {
              const isOrange = color.id === 'orange';
              const isBlue = color.id === 'blue';
              const isPressed =
                (isOrange && orangeButtonPressed) || (isBlue && blueButtonPressed);
              const isSelected = selectedColor === color.id;

              return (
                <LiquidGlass
                  key={color.id}
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
                    className="w-12 h-12 rounded-full flex items-center justify-center pointer-events-none"
                    style={{
                      backgroundColor: color.value,
                      border: isSelected ? '2px solid white' : 'none',
                    }}
                    animate={{
                      scale: isPressed ? 0.85 : 1,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: 'easeOut',
                    }}
                  >
                    <motion.svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: isSelected ? 1 : 0,
                        opacity: isSelected ? 1 : 0,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: 'easeOut',
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </motion.svg>
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

export default ColorPicker;

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@liquidglass/react';
import { useTranslation } from '@/contexts/TranslationContext';
import sceneImage from '@/assets/images/onboarding/scene.png';
import modelImage from '@/assets/images/onboarding/model.png';
import jacket1Image from '@/assets/images/onboarding/jacket1.png';
import jacket2Image from '@/assets/images/onboarding/jacket2.png';
import jacket3Image from '@/assets/images/onboarding/jacket3.png';

const Onboarding = () => {
  const { t } = useTranslation();
  const [showButton, setShowButton] = useState(false);
  const [selectedColor, setSelectedColor] = useState('blue');
  const [selectedSize, setSelectedSize] = useState('M');
  const [currentJacket, setCurrentJacket] = useState(1);
  const [isManualTransition, setIsManualTransition] = useState(false);
  const [isFirstCycle, setIsFirstCycle] = useState(true);
  const [colorPickerHighlighted, setColorPickerHighlighted] = useState(false);
  const [sizePickerHighlighted, setSizePickerHighlighted] = useState(false);
  const [orangeButtonPressed, setOrangeButtonPressed] = useState(false);
  const [blueButtonPressed, setBlueButtonPressed] = useState(false);
  const [xlButtonPressed, setXlButtonPressed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = [
    { id: 'blue', value: '#3B82F6' },
    { id: 'orange', value: '#F97316' },
    { id: 'black', value: '#000000' },
  ];

  const sizes = ['S', 'M', 'L', 'XL'];

  useEffect(() => {
    // Show button after zoom animation completes (300ms delay + animation duration)
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 800); // 300ms delay + ~500ms animation duration

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only trigger when jacket1 is displayed (not during manual transitions)
    if (currentJacket !== 1 || isManualTransition) return;
    
    // Calculate delay based on whether it's looping or first time
    // First time: 0.8s (jacket delay) + 0.6s (animation) + 0.7s (stay) = 2.1s
    // Loop: 0s (no delay) + 0.6s (animation) + 0.7s (stay) = 1.3s
    const delay = isFirstCycle ? 2100 : 1300;
    
    // After jacket1 appears and stays for 700ms, trigger orange color selection
    const timer = setTimeout(() => {
      // Step 1: Scale up color picker
      setColorPickerHighlighted(true);
      // Step 2: After scale up animation, press orange button
      setTimeout(() => {
        setOrangeButtonPressed(true);
        // Step 3: After button press animation, change color and jacket
        setTimeout(() => {
          setSelectedColor('orange');
          setCurrentJacket(2);
          // Mark that first cycle is complete
          setIsFirstCycle(false);
          // Step 4: Scale down color picker after jacket change starts
          setTimeout(() => {
            setColorPickerHighlighted(false);
          }, 100);
        }, 300); // Wait for button press animation to complete
      }, 400); // Wait for scale up animation
    }, delay);

    return () => clearTimeout(timer);
  }, [currentJacket, isManualTransition, isFirstCycle]);

  useEffect(() => {
    // Only trigger when jacket2 is displayed (not during manual transitions)
    if (currentJacket !== 2 || isManualTransition) return;
    
    // After jacket2 appears and stays for 700ms
    // jacket2 starts at: 2.1s (jacket1 complete + stay) + 0.4s (scale up) + 0.3s (button press) + 0.7s (delay) = 3.5s
    // jacket2 animation completes at: 3.5s + 0.6s = 4.1s
    // jacket2 stays for 700ms, so trigger at: 4.1s + 0.7s = 4.8s
    const timer = setTimeout(() => {
      // Step 1: Scale up size picker and color picker (for blue)
      setSizePickerHighlighted(true);
      setColorPickerHighlighted(true);
      // Step 2: After scale up animation, press XL and blue buttons
      setTimeout(() => {
        setXlButtonPressed(true);
        setBlueButtonPressed(true);
        // Step 3: After button press animation, change size, color, and jacket
        setTimeout(() => {
          setSelectedSize('XL');
          setSelectedColor('blue');
          setCurrentJacket(3);
          // Step 4: Scale down pickers after jacket change starts
          setTimeout(() => {
            setSizePickerHighlighted(false);
            setColorPickerHighlighted(false);
          }, 100);
        }, 300); // Wait for button press animation to complete
      }, 400); // Wait for scale up animation
    }, 4800); // Wait for jacket2 animation to complete + 700ms stay time

    return () => clearTimeout(timer);
  }, [currentJacket, isManualTransition]);

  // Loop animation: After jacket3 appears and stays for 700ms, loop back to jacket1
  useEffect(() => {
    if (currentJacket === 3 && !isManualTransition) {
      // jacket3 starts at: 4.8s (jacket2 complete + stay) + 0.4s (scale up) + 0.3s (button press) + 0.7s (delay) = 6.2s
      // jacket3 animation completes at: 6.2s + 0.6s = 6.8s
      // jacket3 stays for 700ms, so trigger at: 6.8s + 0.7s = 7.5s
      const timer = setTimeout(() => {
        // Reset all button states
        setOrangeButtonPressed(false);
        setBlueButtonPressed(false);
        setXlButtonPressed(false);
        
        // Reset manual transition flag for the loop
        setIsManualTransition(false);
        
        // Loop back to jacket1: blue color, M size
        setSelectedColor('blue');
        setSelectedSize('M');
        setCurrentJacket(1);
      }, 7500); // Wait for jacket3 animation to complete + 700ms stay time

      return () => clearTimeout(timer);
    }
  }, [currentJacket, isManualTransition]);

  const handleContinue = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    
    // If jacket3 is on, randomly pick jacket1 or jacket2 and animate to it
    if (currentJacket === 3) {
      setIsManualTransition(true);
      const randomJacket = Math.random() < 0.5 ? 1 : 2;
      
      if (randomJacket === 1) {
        // Switch to jacket1: blue color, M size
        setSelectedColor('blue');
        setSelectedSize('M');
        setCurrentJacket(1);
      } else {
        // Switch to jacket2: orange color, M size
        setSelectedColor('orange');
        setSelectedSize('M');
        setCurrentJacket(2);
      }
    }
    // If jacket1 or jacket2 is already on, do nothing (keep it as is)
    
    console.log('Continue clicked');
  }, [currentJacket]);

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 overflow-hidden"
        style={{
          width: '100vw',
          height: '100vh',
        }}
      >
        {/* Top Text */}
        <motion.div
          className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.6,
            ease: 'easeOut',
          }}
        >
          <h1 className="text-white font-gothic text-2xl md:text-3xl text-center">
            {t('tryOutfitsVirtually')}
          </h1>
        </motion.div>

        {/* Zoom Container - scales both background and model together */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1, y: 0 }}
          animate={{ scale: 1.5, y: '20%' }}
          transition={{
            delay: 0.3,
            duration: 0.5,
            ease: 'easeOut',
          }}
          style={{
            transformOrigin: 'center center',
          }}
        >
          {/* Background Scene */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${sceneImage})`,
            }}
          />

          {/* Centered Model */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={modelImage}
              alt="Model"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Jacket 1 - slides in and gets on the model */}
          <AnimatePresence mode="wait">
            {currentJacket === 1 && (
              <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ 
                scale: 0.5, 
                x: '100%',
                opacity: 0 
              }}
              animate={{ 
                scale: 1, 
                x: 0,
                opacity: 1 
              }}
              exit={{
                x: '-100%',
                scale: 0.5,
                opacity: 0,
                transition: {
                  duration: 0.6,
                  ease: 'easeIn',
                },
              }}
              transition={{
                delay: (isManualTransition || !isFirstCycle) ? 0 : 0.8, // Start after zoom animation completes (0.3s delay + 0.5s duration) or immediately if manual/looping
                duration: 0.6,
                ease: 'easeOut',
              }}
            >
              <img
                src={jacket1Image}
                alt="Jacket 1"
                className="max-h-full max-w-full object-contain"
                style={{
                  mixBlendMode: 'normal',
                }}
              />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Jacket 2 - appears after orange color selection */}
          <AnimatePresence mode="wait">
            {currentJacket === 2 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ 
                scale: 0.5, 
                x: '100%',
                y: 0,
                opacity: 0 
              }}
              animate={{ 
                scale: 0.95, 
                x: 0,
                y: '-6%',
                opacity: 1 
              }}
              exit={{
                x: '-100%',
                scale: 0.5,
                opacity: 0,
                transition: {
                  duration: 0.6,
                  ease: 'easeIn',
                },
              }}
              transition={{
                delay: isManualTransition ? 0 : 0.7, // Delay after scale up (0.4s) + button press (0.3s)
                duration: 0.6,
                ease: 'easeOut',
              }}
            >
              <img
                src={jacket2Image}
                alt="Jacket 2"
                className="max-h-full max-w-full object-contain"
                style={{
                  mixBlendMode: 'normal',
                }}
              />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Jacket 3 - appears after XL size selection */}
          <AnimatePresence mode="wait">
            {currentJacket === 3 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ 
                scale: 0.5, 
                x: '100%',
                y: 0,
                opacity: 0 
              }}
              animate={{ 
                scale: 0.93, 
                x: "-.5%",
                y: '-2.5%',
                opacity: 1 
              }}
              exit={{
                x: '-100%',
                scale: 0.5,
                opacity: 0,
                transition: {
                  duration: 0.6,
                  ease: 'easeIn',
                },
              }}
              transition={{
                delay: 0.7, // Delay after scale up (0.4s) + button press (0.3s)
                duration: 0.6,
                ease: 'easeOut',
              }}
            >
              <img
                src={jacket3Image}
                alt="Jacket 3"
                className="max-h-full max-w-full object-contain"
                style={{
                  mixBlendMode: 'normal',
                }}
              />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Color Picker - Right Side */}
      {showButton && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-10">
          <motion.div
            key="color-picker"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: colorPickerHighlighted ? 1.2 : 1,
              opacity: 1 
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              mass: 1,
              delay: 0.1,
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
                  const isPressed = (isOrange && orangeButtonPressed) || (isBlue && blueButtonPressed);
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

      {/* Size Picker - Bottom */}
      {showButton && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            key="size-picker"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: sizePickerHighlighted ? 1.2 : 1,
              opacity: 1 
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              mass: 1,
              delay: 0.1,
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

      {/* Continue Button - Outside overflow-hidden container to allow blur to render */}
      {showButton && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <LiquidGlass
            borderRadius={100}
            blur={5}
            contrast={1.2}
            brightness={.8}
            saturation={1.2}
            shadowIntensity={0.25}
            displacementScale={1}
            elasticity={0.6}
          >
            <motion.div
              key="continue-button"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                mass: 1,
              }}
            >
              <div
                onClick={handleContinue}
                className="cursor-pointer px-8 py-4"
                style={{ display: 'inline-block' }}
              >
                <span className="text-white font-gothic text-lg">Continue</span>
              </div>
            </motion.div>
          </LiquidGlass>
        </div>
      )}
    </>
  );
};

export default Onboarding;

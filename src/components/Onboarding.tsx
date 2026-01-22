import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import LiquidGlass from 'liquid-glass-react';
import sceneImage from '@/assets/images/onboarding/scene.png';
import modelImage from '@/assets/images/onboarding/model.png';

const Onboarding = () => {
  const [showButton, setShowButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show button after zoom animation completes (300ms delay + animation duration)
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 800); // 300ms delay + ~500ms animation duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{
        width: '100vw',
        height: '100vh',
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
        <motion.img
          src={modelImage}
          alt="Model"
          className="max-h-full max-w-full object-contain"
          initial={{ scale: 1 }}
          animate={{ scale: 1.2 }}
          transition={{
            delay: 0.3,
            duration: 0.5,
            ease: 'easeOut',
          }}
        />
      </div>

      {/* Continue Button */}
      {showButton && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              mass: 1,
            }}
          >
            <LiquidGlass
              displacementScale={100}
              blurAmount={0.5}
              saturation={140}
              aberrationIntensity={2}
              elasticity={0.35}
              cornerRadius={100}
              padding="16px 32px"
              mouseContainer={containerRef}
              className="cursor-pointer"
              onClick={() => {
                // Handle continue action
                console.log('Continue clicked');
              }}
            >
              <span className="text-white font-gothic text-lg">Continue</span>
            </LiquidGlass>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;

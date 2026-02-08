import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import sceneImage from '@/assets/images/onboarding/scene.png';
import modelImage from '@/assets/images/onboarding/model.png';

interface BackgroundSceneProps {
  children: ReactNode;
  isZoomedOut?: boolean;
}

const BackgroundScene = ({ children, isZoomedOut = false }: BackgroundSceneProps) => {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ scale: 1, y: 0 }}
      animate={{ 
        scale: isZoomedOut ? 1 : 1.5, 
        y: isZoomedOut ? 0 : '20%' 
      }}
      transition={{
        delay: isZoomedOut ? 0 : 0.3,
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

      {/* Children (Jackets) */}
      {children}
    </motion.div>
  );
};

export default BackgroundScene;

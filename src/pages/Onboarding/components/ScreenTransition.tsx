import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

interface ScreenTransitionProps {
  children: ReactNode;
  show: boolean;
}

const ScreenTransition = ({ children, show }: ScreenTransitionProps) => {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="brands-screen"
          className="fixed inset-0 w-full h-full z-10"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScreenTransition;

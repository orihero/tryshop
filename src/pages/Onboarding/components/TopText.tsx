import { motion, AnimatePresence } from 'framer-motion';

interface TopTextProps {
  text: string;
}

const TopText = ({ text }: TopTextProps) => {
  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-20">
      <AnimatePresence mode="wait">
        <motion.h1
          key={text}
          className="text-white font-gothic text-2xl md:text-3xl text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.4,
            ease: 'easeOut',
          }}
        >
          {text}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};

export default TopText;

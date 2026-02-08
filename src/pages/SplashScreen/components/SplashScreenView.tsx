import { motion } from 'framer-motion';
import tryshopLogo from '@/assets/images/tryshop.svg';

const SplashScreenView = () => {
  return (
    <div className="fixed inset-0 bg-wheat flex items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center justify-center">
        <motion.img
          src={tryshopLogo}
          alt="TryShop Logo"
          className="w-28 h-auto mb-6 brightness-0 invert"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            mass: 1,
          }}
        />
        <motion.h1
          className="font-gothic text-5xl text-black"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            mass: 1,
          }}
        >
          TRYSHOP
        </motion.h1>
      </div>
    </div>
  );
};

export default SplashScreenView;

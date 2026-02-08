import { motion } from 'framer-motion';
import { IoChevronBack, IoLogOutOutline } from 'react-icons/io5';
import { LiquidGlass } from '@liquidglass/react';

interface ProfileTopBarProps {
  onBack: () => void;
  onLogout: () => void;
}

const ProfileTopBar = ({ onBack, onLogout }: ProfileTopBarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-20">
      <div className="flex items-center justify-between px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <LiquidGlass
          borderRadius={100}
          blur={5}
          contrast={1.2}
          brightness={0.8}
          saturation={1.2}
          shadowIntensity={0.25}
          displacementScale={1}
          elasticity={0.6}
          className="max-w-11 min-h-11"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-full h-full rounded-full flex items-center justify-center"
            aria-label="Back"
          >
            <IoChevronBack className="text-xl text-gray-700" />
          </motion.button>
        </LiquidGlass>
        <div className="w-[100%]" />
        <LiquidGlass
          borderRadius={100}
          blur={5}
          contrast={1.2}
          brightness={0.8}
          saturation={1.2}
          shadowIntensity={0.25}
          displacementScale={1}
          elasticity={0.6}
          className="max-w-11 min-h-11"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onLogout}
            className="w-full h-full rounded-full flex items-center justify-center"
            aria-label="Logout"
          >
            <IoLogOutOutline className="text-xl text-gray-700" />
          </motion.button>
        </LiquidGlass>
      </div>
    </div>
  );
};

export default ProfileTopBar;

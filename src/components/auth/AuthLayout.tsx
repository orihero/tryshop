import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { IoChevronBack } from 'react-icons/io5';
import { LiquidGlass } from '@liquidglass/react';
import loginBg from '@/assets/images/auth/login-illustration.jpg';

interface AuthLayoutProps {
  children: ReactNode;
  onBack: () => void;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
}

const AuthLayout = ({ children, onBack, contentClassName, contentStyle }: AuthLayoutProps) => {
  return (
    <div className="font-roboto fixed inset-0 flex flex-col bg-[#1a1a2e]">
      <div className="absolute inset-0 z-0">
        <img
          src={loginBg}
          alt=""
          className="w-full h-full object-cover object-top blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 flex items-center px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          aria-label="Back"
        >
          <IoChevronBack className="text-xl text-white" />
        </motion.button>
        <h1 className="flex-1 text-center text-white text-xl font-gothic tracking-wide pr-10">
          Tryshop
        </h1>
      </div>

      <div className="relative z-10 mt-auto">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.1 }}
        >
          <div className="overflow-hidden" style={{ borderRadius: '32px 32px 0 0' }}>
            <LiquidGlass
              borderRadius={0}
              blur={20}
              contrast={1.2}
              brightness={0.8}
              saturation={1.2}
              shadowIntensity={0.3}
              displacementScale={1}
              elasticity={0.5}
              className="w-full"
            >
              <div
                className={contentClassName ?? 'px-6 pt-8 pb-6 flex flex-col'}
                style={{ minHeight: '70vh', ...contentStyle }}
              >
                {children}
              </div>
            </LiquidGlass>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;

import { motion, type HTMLMotionProps } from 'framer-motion';
import { LiquidGlass } from '@liquidglass/react';
import type { ReactNode } from 'react';

/** Configurable LiquidGlass effect props. All fields are optional overrides. */
export interface LiquidGlassConfig {
  borderRadius?: number;
  blur?: number;
  contrast?: number;
  brightness?: number;
  saturation?: number;
  shadowIntensity?: number;
  displacementScale?: number;
  elasticity?: number;
  zIndex?: number;
  className?: string;
}

const DEFAULT_LIQUID_GLASS: Required<Omit<LiquidGlassConfig, 'className'>> = {
  borderRadius: 100,
  blur: 5,
  contrast: 1.2,
  brightness: 0.8,
  saturation: 1.2,
  shadowIntensity: 0.25,
  displacementScale: 1,
  elasticity: 0.6,
  zIndex: 9999,
};

interface ButtonProps {
  onClick?: (e?: React.MouseEvent) => void;
  children: ReactNode;
  className?: string;
  /** @deprecated Use liquidGlass.borderRadius instead */
  borderRadius?: number;
  /** LiquidGlass effect configuration. Override any property to customize the glass look. */
  liquidGlass?: LiquidGlassConfig;
  initial?: HTMLMotionProps<'div'>['initial'];
  animate?: HTMLMotionProps<'div'>['animate'];
  transition?: HTMLMotionProps<'div'>['transition'];
}

const Button = ({
  onClick,
  children,
  className = '',
  borderRadius,
  liquidGlass,
  initial = { scale: 0 },
  animate = { scale: 1 },
  transition = {
    type: 'spring',
    stiffness: 200,
    damping: 15,
    mass: 1,
  },
}: ButtonProps) => {
  const glass = { ...DEFAULT_LIQUID_GLASS, ...liquidGlass };
  const resolvedBorderRadius = borderRadius ?? liquidGlass?.borderRadius ?? glass.borderRadius;

  return (
    <LiquidGlass
      borderRadius={resolvedBorderRadius}
      blur={glass.blur}
      contrast={glass.contrast}
      brightness={glass.brightness}
      saturation={glass.saturation}
      shadowIntensity={glass.shadowIntensity}
      displacementScale={glass.displacementScale}
      elasticity={glass.elasticity}
      zIndex={glass.zIndex}
      className={liquidGlass?.className}
    >
      <motion.div
        initial={initial}
        animate={animate}
        transition={transition}
      >
        <div
          onClick={onClick}
          className={`cursor-pointer ${className}`}
          style={{ display: 'inline-block' }}
        >
          {children}
        </div>
      </motion.div>
    </LiquidGlass>
  );
};

export default Button;

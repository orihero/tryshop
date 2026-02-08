import { LiquidGlass } from '@liquidglass/react';
import { IoCartOutline } from 'react-icons/io5';
import { useTranslation } from '@/hooks/useTranslation';
import { useCart } from '../useCart';

const CartTopBar = () => {
  const { t } = useTranslation();
  const { itemCount } = useCart();

  return (
    <div className="fixed top-0 left-0 right-0 z-20">
      <div className="flex items-center justify-between px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h1 className="text-lg font-bold text-gray-900">{t('cart')}</h1>
        <div className="relative">
          <LiquidGlass
            borderRadius={100}
            blur={5}
            contrast={1.2}
            brightness={0.8}
            saturation={1.2}
            shadowIntensity={0.25}
            displacementScale={1}
            elasticity={0.6}
            className="w-11 h-11 flex items-center justify-center p-2"
          >
            <IoCartOutline className="text-xl text-gray-700" />
          </LiquidGlass>
          {itemCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-5 h-5 flex items-center justify-center px-1">
              <span className="text-white text-xs font-bold">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartTopBar;

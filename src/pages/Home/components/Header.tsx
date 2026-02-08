import { LiquidGlass } from '@liquidglass/react';
import { IoGridOutline, IoBagOutline } from 'react-icons/io5';
import { useTranslation } from '@/hooks/useTranslation';
import { useCartStore } from '@/stores/cartStore';

const Header = () => {
  const { t } = useTranslation();
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  return (
    <LiquidGlass
      borderRadius={0}
      blur={1}
      contrast={1.2}
      brightness={0.8}
      saturation={1.2}
      shadowIntensity={0.25}
      displacementScale={1}
      elasticity={0.6}
      className="w-full font-roboto"
    >
      <div className="px-4 py-4 flex items-center justify-between">
        {/* Left side - Grid icon and delivery location */}
        <div className="flex items-center gap-3">
          <IoGridOutline className="text-gray-800 text-2xl" />
          <div className="flex flex-col">
            <span className="text-gray-600 text-xs">{t('deliveryTo')}</span>
            <span className="text-gray-900 text-base font-bold">San Fransisco</span>
          </div>
        </div>

        {/* Right side - Shopping bag with badge */}
        <div className="relative">
          <IoBagOutline className="text-gray-800 text-2xl" />
          {itemCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{itemCount}</span>
            </div>
          )}
        </div>
      </div>
    </LiquidGlass>
  );
};

export default Header;

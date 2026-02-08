import { LiquidGlass } from '@liquidglass/react';
import { IoHome, IoPersonOutline, IoCartOutline } from 'react-icons/io5';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';

type Tab = 'home' | 'profile' | 'cart';

const tabLabelKeys: Record<Tab, string> = {
  home: 'tabHome',
  profile: 'tabProfile',
  cart: 'tabCart',
};

const tabPaths: Record<Tab, string> = {
  home: '/home',
  profile: '/profile',
  cart: '/cart',
};

// Tab bar: semicircular left/right ends (pill shape) with center notch
const BAR_PATH =
  'M 35 16 L 145 16 C 160 16, 165 0, 195 0 C 225 0, 230 16, 245 16 L 355 16 A 34.5 34.5 0 0 1 355 85 L 35 85 A 34.5 34.5 0 0 1 35 16 Z';

function getActiveTab(pathname: string): Tab {
  if (pathname === '/profile') return 'profile';
  if (pathname === '/cart') return 'cart';
  if (pathname === '/home') return 'home';
  return 'home';
}

const BottomTabBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = getActiveTab(location.pathname);
  const cartItemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  const handleTabClick = (tab: Tab) => {
    navigate(tabPaths[tab]);
  };

  // Position of sliding indicator: left % for each tab (center of each third)
  const indicatorLeft: Record<Tab, string> = {
    cart: '30%',
    home: '50%',
    profile: '70%',
  };

  return (
    <div className="font-roboto fixed bottom-0 left-0 right-0 z-50 px-4 pb-3 pt-10 overflow-visible flex justify-center">
      <div className="relative w-full max-w-[256px] h-[90px] overflow-visible">
        {/* SVG clipPath definition — lives outside any clipped container */}
        <svg className="absolute w-0 h-0" aria-hidden>
          <defs>
            <clipPath id="tabbar-shape-clip" clipPathUnits="objectBoundingBox">
              <path
                transform="scale(0.002564 0.011111)"
                d={BAR_PATH}
              />
            </clipPath>
          </defs>
        </svg>

        {/*
          LiquidGlass with "tabbar-shape" class so clip-path and backdrop-filter
          are on the SAME element — this avoids the parent-clip-path bug.
        */}
        <LiquidGlass
          borderRadius={0}
          blur={5}
          contrast={1.2}
          brightness={0.5}
          saturation={1.2}
          shadowIntensity={0.25}
          displacementScale={1}
          elasticity={0.6}
          className="w-full h-full min-h-full tabbar-shape"
        >
          <div className="relative w-full h-full">
            {/* Tabs: Cart | Home (spacer) | Profile */}
            <div className="relative w-full h-full grid grid-cols-3 items-end justify-items-center pb-3">
              {/* Cart tab */}
              <button
                onClick={() => handleTabClick('cart')}
                className="flex flex-col items-center justify-end py-1 col-span-1 relative"
                aria-label="cart"
              >
                <span className="relative inline-block">
                  <IoCartOutline
                    className={`text-xl flex-shrink-0 transition-colors ${activeTab === 'cart' ? 'text-white' : 'text-[#9A9A9A]'}`}
                  />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-4 h-4 flex items-center justify-center px-1">
                      <span className="text-white text-[10px] font-bold">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    </span>
                  )}
                </span>
                <span
                  className={`text-[10px] mt-0.5 font-medium ${activeTab === 'cart' ? 'text-white' : 'text-[#9A9A9A]'}`}
                >
                  {t(tabLabelKeys.cart)}
                </span>
                <div className="mt-1 h-1 w-7" aria-hidden />
              </button>

              {/* Center spacer */}
              <div className="col-span-1" aria-hidden />

              {/* Profile tab */}
              <button
                onClick={() => handleTabClick('profile')}
                className="flex flex-col items-center justify-end py-1 col-span-1 relative"
                aria-label="profile"
              >
                <IoPersonOutline
                  className={`text-xl flex-shrink-0 transition-colors ${activeTab === 'profile' ? 'text-white' : 'text-[#9A9A9A]'}`}
                />
                <span
                  className={`text-[10px] mt-0.5 font-medium ${activeTab === 'profile' ? 'text-white' : 'text-[#9A9A9A]'}`}
                >
                  {t(tabLabelKeys.profile)}
                </span>
                <div className="mt-1 h-1 w-7" aria-hidden />
              </button>
            </div>

            {/* Center Home button */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 translate-y-[10%] flex flex-col items-center pointer-events-none">
              <div className="pointer-events-auto flex flex-col items-center">
                <button
                  onClick={() => handleTabClick('home')}
                  className="flex flex-col items-center"
                  aria-label="home"
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg hover:opacity-90 active:scale-95 transition-all"
                    style={{ backgroundColor: '#3F6BFF' }}
                  >
                    <IoHome className="text-xl text-white" />
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-medium ${activeTab === 'home' ? 'text-white' : 'text-[#9A9A9A]'}`}
                  >
                    {t('tabHome')}
                  </span>
                  <div className="mt-1 h-1 w-7" aria-hidden />
                </button>
              </div>
            </div>


          </div>
        </LiquidGlass>
      </div>
      {/* Sliding green active indicator */}
      <div
        className="z-1 absolute bottom-7 left-0 w-7 h-1 pointer-events-none flex justify-center"
        style={{
          left: indicatorLeft[activeTab],
          transform: 'translateX(-50%)',
          transition: 'left 0.25s ease-out',
        }}
      >
        <div
          className="w-7 h-5 rounded-sm flex-shrink-0"
          style={{ backgroundColor: '#2DFF57' }}
        />
      </div>
    </div>
  );
};

export default BottomTabBar;

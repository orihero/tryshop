import { useTranslation } from '@/hooks/useTranslation';
import { useCart } from './useCart';
import CartTopBar from './components/CartTopBar';
import CartItemCard from './components/CartItemCard';
import { LiquidGlass } from '@liquidglass/react';
import emptyCartImage from '@/assets/images/cart/empty-cart.gif';

const CartLayout = () => {
  const { t } = useTranslation();
  const { items, updateQuantity, removeItem } = useCart();

  const isEmpty = items.length === 0;
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const formatPrice = (price: number): string =>
    price.toLocaleString('ru-RU').replace(/,/g, ' ') + ' UZS';

  return (
    <div className="font-roboto min-h-screen bg-white relative overflow-x-hidden">
      <CartTopBar />

      <div className="pt-16 pb-36 px-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <img
              src={emptyCartImage}
              alt=""
              className="w-48 h-48 object-contain mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {t('emptyCart')}
            </h2>
            <p className="text-gray-500 text-sm">{t('emptyCartMessage')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemCard
                key={`${item.productId}-${item.size}-${item.color}`}
                item={item}
                onQuantityChange={(delta) =>
                  updateQuantity(item.productId, item.size, item.color, delta)
                }
                onRemove={() =>
                  removeItem(item.productId, item.size, item.color)
                }
              />
            ))}
          </div>
        )}
      </div>

      {!isEmpty && (
        <div className="fixed bottom-20 left-4 right-4 z-30">
          <LiquidGlass
            borderRadius={24}
            blur={5}
            contrast={1.2}
            brightness={0.8}
            saturation={1.2}
            shadowIntensity={0.25}
            displacementScale={1}
            elasticity={0.6}
            className="w-full"
          >
            <div className="flex items-center justify-between px-6 py-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">{items.length} items</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(totalPrice)}
                </p>
              </div>
              <button
                type="button"
                className="flex-1 max-w-[200px] bg-[#3D4A5C] text-white font-semibold py-3.5 rounded-full shadow-lg hover:bg-[#2d3847] active:scale-[0.98] transition-all"
              >
                {t('checkout')}
              </button>
            </div>
          </LiquidGlass>
        </div>
      )}
    </div>
  );
};

export default CartLayout;

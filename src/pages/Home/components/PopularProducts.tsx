import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useCategoryStore } from '@/stores/categoryStore';
import { useProductStore } from '@/stores/productStore';
import HomeProductCard from '@/components/HomeProductCard';

const PopularProducts = () => {
  const { t } = useTranslation();
  const activeCategory = useCategoryStore((s) => s.activeCategory);
  const { products, loading, fetchProducts, getProductsByCategory } =
    useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = activeCategory
    ? getProductsByCategory(activeCategory)
    : products;

  if (loading && products.length === 0) {
    return (
      <div className="font-roboto mb-6">
        <h2 className="text-gray-900 font-bold text-xl mb-4 px-4">
          {t('popularProducts')}
        </h2>
        <div className="grid grid-cols-2 gap-4 px-4 pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-full aspect-square rounded-3xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="font-roboto mb-6">
      <h2 className="text-gray-900 font-bold text-xl mb-4 px-4">
        {t('popularProducts')}
      </h2>
      <div className="grid grid-cols-2 gap-4 px-4 pb-2">
        {filteredProducts.map((product, index) => (
          <HomeProductCard
            key={product.$id}
            product={product}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;

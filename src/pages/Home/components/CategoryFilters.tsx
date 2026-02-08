import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCategoryStore } from '@/stores/categoryStore';
import { useTranslation } from '@/hooks/useTranslation';
import manImage from '@/assets/images/home/man-category.png';
import womanImage from '@/assets/images/home/woman-cateogry.webp';
import childImage from '@/assets/images/home/child-category.png';

// Fallback images mapped by category slug
const categoryImages: Record<string, string> = {
  men: manImage,
  women: womanImage,
  kids: childImage,
};

const CategoryFilters = () => {
  const { t } = useTranslation();
  const { categories, activeCategory, loading, fetchCategories, setActiveCategory } =
    useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading && categories.length === 0) {
    return (
      <div className="font-roboto px-4 mb-6">
        <div className="flex gap-3 pt-6 pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 w-24 rounded-full bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const isAllActive = activeCategory === null;

  return (
    <div className="font-roboto px-4 mb-6">
      {/* Extra top padding so overflowing images aren't clipped */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pt-6 pb-2">
        {/* "All" button — always first */}
        <motion.button
          onClick={() => setActiveCategory(null)}
          className={`flex items-center px-5 py-1.5 rounded-full whitespace-nowrap transition-colors ${
            isAllActive
              ? 'bg-orange-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm font-medium">{t('all')}</span>
        </motion.button>

        {categories.map((category) => {
          const isActive = activeCategory === category.slug;
          const image = category.image || categoryImages[category.slug];
          return (
            <motion.button
              key={category.$id}
              onClick={() => setActiveCategory(category.slug)}
              className={`relative flex items-center gap-2 pl-10 pr-4 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {/* Image overflows the pill vertically */}
              {image && (
                <img
                  src={image}
                  alt={category.name}
                  className="absolute -left-1 -top-6 w-12 h-14 object-contain pointer-events-none drop-shadow-sm"
                />
              )}
              <span className="text-sm font-medium">{category.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilters;

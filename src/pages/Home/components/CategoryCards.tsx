import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import modelImage from '@/assets/images/onboarding/model.png';

const CategoryCards = () => {
  const { t } = useTranslation();

  const categories = [
    {
      title: t('mostSoldProducts'),
      backgroundColor: '#FFFACD', // Light yellow
      image: modelImage,
    },
    {
      title: t('productsOnSale'),
      backgroundColor: '#E0F7FA', // Light blue
      image: modelImage,
    },
  ];

  return (
    <div className="font-roboto mb-24">
      <h2 className="text-gray-900 font-bold text-xl mb-4 px-4">
        {t('chooseByCategory')}
      </h2>
      <div className="flex gap-4 px-4">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: index * 0.1,
              duration: 0.4,
            }}
            className="flex-1 rounded-3xl p-4 relative overflow-hidden"
            style={{ backgroundColor: category.backgroundColor }}
          >
            <h3 className="font-bold text-gray-900 text-sm mb-8">
              {category.title}
            </h3>
            <div className="relative h-32">
              <img
                src={category.image}
                alt={category.title}
                className="absolute bottom-0 left-0 h-full object-contain"
              />
              {index === 0 && (
                <div className="absolute bottom-2 left-2 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-orange-500"
                    />
                  ))}
                </div>
              )}
            </div>
            <button className="mt-4 text-gray-900 text-sm font-bold flex items-center gap-1 hover:opacity-80 transition-opacity">
              {t('explore')} →
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;

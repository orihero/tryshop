import { useTranslation } from '@/hooks/useTranslation';

interface ProductDescriptionProps {
  description: string | null;
}

const ProductDescription = ({ description }: ProductDescriptionProps) => {
  const { t } = useTranslation();

  if (!description) return null;

  return (
    <div className="px-5 pt-4 pb-6">
      <h2 className="text-base font-bold text-gray-900 mb-2">
        {t('productDetails')}
      </h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default ProductDescription;

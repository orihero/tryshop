import { motion } from 'framer-motion';
import type { Product, ProductColor, ProductProperty } from '@/types/appwrite';
import ProductDetailsTopBar from './ProductDetailsTopBar';
import ProductDetailsTryOnButton from './ProductDetailsTryOnButton';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import AddToCartBar from './AddToCartBar';
import ProductDescription from './ProductDescription';
import TryOnUploadSheet from './TryOnUploadSheet';
import type { TryOnUploadPayload } from './TryOnUploadSheet';

interface ProductDetailsLayoutProps {
  product: Product;
  colors: ProductColor[];
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  setSelectedColor: (hex: string) => void;
  quantity: number;
  cartOpen: boolean;
  tryOnSheetOpen: boolean;
  tryOnUploading: boolean;
  tryOnError: string | null;
  properties: ProductProperty[];
  user: unknown;
  onBack: () => void;
  onTryOn: () => void;
  onTryOnUploadStart: (file: File) => void;
  onTryOnPhotoUploaded: (payload: TryOnUploadPayload) => void;
  onTryOnSheetExitComplete: () => void;
  onTryOnSheetClose: () => void;
  onCartOpen: () => void;
  onQuantityDecrement: () => void;
  onQuantityIncrement: () => void;
  onAddToCart: () => void;
}

const ProductDetailsLayout = ({
  product,
  colors,
  selectedImageIndex,
  setSelectedImageIndex,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  quantity,
  cartOpen,
  tryOnSheetOpen,
  tryOnUploading,
  tryOnError,
  properties,
  user,
  onBack,
  onTryOn,
  onTryOnUploadStart,
  onTryOnPhotoUploaded: _onTryOnPhotoUploaded,
  onTryOnSheetExitComplete,
  onTryOnSheetClose,
  onCartOpen,
  onQuantityDecrement,
  onQuantityIncrement,
  onAddToCart,
}: ProductDetailsLayoutProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="font-roboto min-h-screen bg-[#FAF9F6] pb-24"
    >
      <ProductDetailsTopBar
        onBack={onBack}
        cartOpen={cartOpen}
        onCartOpen={onCartOpen}
        quantity={quantity}
        onQuantityDecrement={onQuantityDecrement}
        onQuantityIncrement={onQuantityIncrement}
        maxStock={product.stock}
      />
      <ProductImageGallery
        mainImage={product.image}
        gallery={product.gallery || []}
        selectedImageIndex={selectedImageIndex}
        onSelectImage={setSelectedImageIndex}
        title={product.title}
      />
      <ProductInfo
        title={product.title}
        stock={product.stock}
        price={product.price}
        sizes={product.sizes || []}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        colors={colors}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        properties={properties}
      />
      <AddToCartBar
        quantity={quantity}
        onIncrement={onQuantityIncrement}
        onDecrement={onQuantityDecrement}
        maxStock={product.stock}
        onAddToCart={onAddToCart}
      />
      <ProductDescription description={product.description} />
      <ProductDetailsTryOnButton isLoggedIn={!!user} onTryOn={onTryOn} />
      <TryOnUploadSheet
        isOpen={tryOnSheetOpen}
        onClose={onTryOnSheetClose}
        onUploadStart={onTryOnUploadStart}
        onExitComplete={onTryOnSheetExitComplete}
        uploading={tryOnUploading}
        uploadError={tryOnError}
      />
    </motion.div>
  );
};

export default ProductDetailsLayout;

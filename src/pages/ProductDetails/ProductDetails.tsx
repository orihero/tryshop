import { useProductDetails } from './useProductDetails';
import ProductDetailsLoading from './components/ProductDetailsLoading';
import ProductDetailsLayout from './components/ProductDetailsLayout';

const ProductDetails = () => {
  const props = useProductDetails();
  if (props.loading) return <ProductDetailsLoading />;
  if (!props.product) return null;
  return (
    <ProductDetailsLayout
      product={props.product}
      colors={props.colors}
      selectedImageIndex={props.selectedImageIndex}
      setSelectedImageIndex={props.setSelectedImageIndex}
      selectedSize={props.selectedSize}
      setSelectedSize={props.setSelectedSize}
      selectedColor={props.selectedColor}
      setSelectedColor={props.setSelectedColor}
      quantity={props.quantity}
      cartOpen={props.cartOpen}
      tryOnSheetOpen={props.tryOnSheetOpen}
      tryOnUploading={props.tryOnUploading}
      tryOnError={props.tryOnError}
      properties={props.properties}
      user={props.user}
      onBack={props.onBack}
      onTryOn={props.onTryOn}
      onTryOnUploadStart={props.onTryOnUploadStart}
      onTryOnPhotoUploaded={props.onTryOnPhotoUploaded}
      onTryOnSheetExitComplete={props.onTryOnSheetExitComplete}
      onTryOnSheetClose={props.onTryOnSheetClose}
      onCartOpen={props.onCartOpen}
      onQuantityDecrement={props.onQuantityDecrement}
      onQuantityIncrement={props.onQuantityIncrement}
      onAddToCart={props.onAddToCart}
    />
  );
};

export default ProductDetails;

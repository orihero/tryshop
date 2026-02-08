import { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTryOn } from './useTryOn';
import TryOnLayout from './components/TryOnLayout';

interface TryOnLocationState {
  tryOnId?: string;
  uploadedImageUrl?: string;
  photoUrl?: string;
}

const TryOn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const state = (location.state as TryOnLocationState | null) || {};
  const tryOnId = state.tryOnId;
  const uploadedImageUrl = state.uploadedImageUrl ?? state.photoUrl;

  const props = useTryOn(tryOnId);

  const displayImageUrl = props.resultImageUrl ?? uploadedImageUrl;

  useEffect(() => {
    if (!uploadedImageUrl && !displayImageUrl && !props.loading) {
      if (id) {
        navigate(`/product/${id}`, { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    }
  }, [uploadedImageUrl, displayImageUrl, props.loading, id, navigate]);

  if (!displayImageUrl && !uploadedImageUrl) {
    if (props.loading) return null;
    return null;
  }

  if (props.loading || !props.product) {
    return null;
  }

  return (
    <TryOnLayout
      photoUrl={(displayImageUrl || uploadedImageUrl) ?? ''}
      product={props.product}
      colors={props.colors}
      selectedSize={props.selectedSize}
      setSelectedSize={props.setSelectedSize}
      selectedColor={props.selectedColor}
      setSelectedColor={props.setSelectedColor}
      quantity={props.quantity}
      cartOpen={props.cartOpen}
      onBack={props.onBack}
      onCartOpen={props.onCartOpen}
      onQuantityDecrement={props.onQuantityDecrement}
      onQuantityIncrement={props.onQuantityIncrement}
      generating={props.generating}
    />
  );
};

export default TryOn;

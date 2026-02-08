import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Query } from 'appwrite';
import { saveRedirectPath } from '@/lib/redirectStorage';
import { useProductStore } from '@/stores/productStore';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import {
  databases,
  functions,
  DATABASE_ID,
  TRY_ON_FUNCTION_ID,
  TABLES,
} from '@/lib/appwrite';
import {
  uploadTryOnImage,
  getUserProfileId,
  createTryOnDocument,
} from '@/lib/tryOnUpload';
import type { Product, ProductColor, ProductProperty } from '@/types/appwrite';
import type { TryOnUploadPayload } from './components/TryOnUploadSheet';

const parseColors = (raw: string | null): ProductColor[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const useProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProductStore();
  const user = useAuthStore((s) => s.user);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [tryOnSheetOpen, setTryOnSheetOpen] = useState(false);
  const [tryOnUploading, setTryOnUploading] = useState(false);
  const [tryOnError, setTryOnError] = useState<string | null>(null);
  const pendingTryOnPayload = useRef<TryOnUploadPayload | null>(null);
  const [properties, setProperties] = useState<ProductProperty[]>([]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      const found = products.find((p) => p.$id === id);
      if (found) {
        setProduct(found);
        setSelectedSize(found.sizes?.[0] || '');
        const colors = parseColors(found.colors);
        setSelectedColor(colors[0]?.hex || '');
        const propsResponse = await databases.listDocuments<ProductProperty>(
          DATABASE_ID,
          TABLES.PRODUCT_PROPERTY,
          [Query.equal('product', id), Query.limit(100)]
        );
        setProperties(propsResponse.documents);
        setLoading(false);
        return;
      }

      try {
        const doc = await databases.getDocument<Product>(
          DATABASE_ID,
          TABLES.PRODUCT,
          id
        );
        setProduct(doc);
        setSelectedSize(doc.sizes?.[0] || '');
        const colors = parseColors(doc.colors);
        setSelectedColor(colors[0]?.hex || '');
        const propsResponse = await databases.listDocuments<ProductProperty>(
          DATABASE_ID,
          TABLES.PRODUCT_PROPERTY,
          [Query.equal('product', id), Query.limit(100)]
        );
        setProperties(propsResponse.documents);
      } catch {
        setProperties([]);
        navigate('/home', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, products, navigate]);

  const colors = product ? parseColors(product.colors) : [];

  const onBack = () => navigate(-1);
  const onTryOn = () => {
    if (!product) return;
    if (user) {
      setTryOnSheetOpen(true);
    } else {
      saveRedirectPath(`/product/${product.$id}`);
      navigate('/signin');
    }
  };
  const onTryOnUploadStart = async (file: File) => {
    if (!product || !user) return;
    setTryOnError(null);
    setTryOnUploading(true);
    try {
      const uploadedImageUrl = await uploadTryOnImage(file);
      const userProfileId = await getUserProfileId(user.$id);
      if (!userProfileId) {
        setTryOnError('Complete your profile to try on');
        return;
      }
      const tryOnId = await createTryOnDocument({
        userProfileId,
        productId: product.$id,
        imageUrls: [uploadedImageUrl],
      });
      const localFnUrl = import.meta.env.VITE_LOCAL_FUNCTION_URL;
      if (localFnUrl) {
        // Dev mode: call local Appwrite function directly
        await fetch(localFnUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tryOnId }),
        });
      } else if (TRY_ON_FUNCTION_ID) {
        await functions.createExecution(
          TRY_ON_FUNCTION_ID,
          JSON.stringify({ tryOnId }),
          true
        );
      }
      onTryOnPhotoUploaded({ tryOnId, uploadedImageUrl });
    } catch (err) {
      setTryOnError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setTryOnUploading(false);
    }
  };
  const onTryOnPhotoUploaded = (payload: TryOnUploadPayload) => {
    if (!product) return;
    pendingTryOnPayload.current = payload;
    setTryOnSheetOpen(false);
  };
  const onTryOnSheetExitComplete = () => {
    if (product && pendingTryOnPayload.current) {
      const payload = pendingTryOnPayload.current;
      pendingTryOnPayload.current = null;
      navigate(`/try-on/${product.$id}`, {
        state: {
          tryOnId: payload.tryOnId,
          uploadedImageUrl: payload.uploadedImageUrl,
        },
      });
    }
  };
  const onTryOnSheetClose = () => {
    setTryOnSheetOpen(false);
    setTryOnError(null);
  };
  const onCartOpen = () => setCartOpen(true);
  const onCartClose = () => setCartOpen(false);
  const onQuantityDecrement = () => {
    if (quantity <= 1) {
      setQuantity(1);
      setCartOpen(false);
    } else {
      setQuantity((q) => q - 1);
    }
  };
  const onQuantityIncrement = () => {
    if (!product) return;
    setQuantity((q) => Math.min(q + 1, product.stock));
  };

  const onAddToCart = () => {
    if (!product) return;
    useCartStore.getState().addItem({
      productId: product.$id,
      title: product.title,
      image: product.image,
      price: product.price,
      size: selectedSize || '-',
      color: selectedColor || '-',
      maxStock: product.stock,
      quantity,
    });
  };

  return {
    product,
    loading,
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
    setTryOnError,
    properties,
    user,
    onBack,
    onTryOn,
    onTryOnUploadStart,
    onTryOnPhotoUploaded,
    onTryOnSheetExitComplete,
    onTryOnSheetClose,
    onCartOpen,
    onCartClose,
    onQuantityDecrement,
    onQuantityIncrement,
    onAddToCart,
  };
};

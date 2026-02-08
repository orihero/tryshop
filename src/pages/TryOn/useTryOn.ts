import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '@/stores/productStore';
import { databases, DATABASE_ID, TABLES } from '@/lib/appwrite';
import type { Product, ProductColor, TryOn } from '@/types/appwrite';

const parseColors = (raw: string | null): ProductColor[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const POLL_INTERVAL_MS = 3000;

export const useTryOn = (tryOnId: string | null | undefined) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProductStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [tryOn, setTryOn] = useState<TryOn | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      const found = products.find((p) => p.$id === id);
      if (found) {
        setProduct(found);
        setSelectedSize(found.sizes?.[0] || '');
        const colors = parseColors(found.colors);
        setSelectedColor(colors[0]?.hex || '');
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
      } catch {
        navigate('/home', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, products, navigate]);

  useEffect(() => {
    if (!tryOnId) {
      setTryOn(null);
      return;
    }

    const TERMINAL_STATUSES = ['completed', 'error', 'canceled'];

    const fetchTryOn = async () => {
      try {
        const doc = await databases.getDocument<TryOn>(
          DATABASE_ID,
          TABLES.TRY_ON,
          tryOnId
        );
        setTryOn(doc);

        // Stop polling once the tryOn reaches a terminal status
        if (doc.status && TERMINAL_STATUSES.includes(doc.status)) {
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      } catch {
        setTryOn(null);
      }
    };
    fetchTryOn();
    pollRef.current = setInterval(fetchTryOn, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [tryOnId]);

  const colors = product ? parseColors(product.colors) : [];
  const resultImageUrl =
    tryOn?.resultImageUrls?.length ? tryOn.resultImageUrls[0] : null;
  const generating =
    !!tryOnId && !!tryOn && (tryOn.status === 'new' || tryOn.status === 'processing');
  const tryOnStatus = tryOn?.status ?? null;

  const onBack = () => navigate(-1);
  const onCartOpen = () => setCartOpen(true);
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

  return {
    product,
    loading,
    tryOn,
    resultImageUrl,
    generating,
    tryOnStatus,
    colors,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    quantity,
    cartOpen,
    onBack,
    onCartOpen,
    onQuantityDecrement,
    onQuantityIncrement,
  };
};

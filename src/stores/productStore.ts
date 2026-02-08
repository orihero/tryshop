import { create } from 'zustand';
import { Query } from 'appwrite';
import { databases, DATABASE_ID, TABLES } from '@/lib/appwrite';
import type { Product } from '@/types/appwrite';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProductsByCategory: (categorySlug: string) => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    const { products } = get();
    if (products.length > 0) return; // Already fetched

    set({ loading: true, error: null });
    try {
      // Fetch all products (paginated — Appwrite default limit is 25)
      const firstPage = await databases.listDocuments<Product>(
        DATABASE_ID,
        TABLES.PRODUCT,
        [Query.limit(25)]
      );

      let allProducts = [...firstPage.documents];

      // If there are more products, fetch the remaining pages
      if (firstPage.total > 25) {
        const remaining = await databases.listDocuments<Product>(
          DATABASE_ID,
          TABLES.PRODUCT,
          [Query.limit(25), Query.offset(25)]
        );
        allProducts = [...allProducts, ...remaining.documents];
      }

      set({ products: allProducts, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch products',
        loading: false,
      });
    }
  },

  getProductsByCategory: (categorySlug: string) => {
    const { products } = get();
    return products.filter((p) => {
      // category can be a string (ID) or a Category object
      if (typeof p.category === 'string') {
        return p.category === categorySlug;
      }
      return p.category?.slug === categorySlug;
    });
  },
}));

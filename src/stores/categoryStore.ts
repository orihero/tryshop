import { create } from 'zustand';
import { Query } from 'appwrite';
import { databases, DATABASE_ID, TABLES } from '@/lib/appwrite';
import type { Category } from '@/types/appwrite';

interface CategoryState {
  categories: Category[];
  activeCategory: string | null;
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  setActiveCategory: (slug: string | null) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  activeCategory: null,
  loading: false,
  error: null,

  fetchCategories: async () => {
    const { categories } = get();
    if (categories.length > 0) return; // Already fetched

    set({ loading: true, error: null });
    try {
      const response = await databases.listDocuments<Category>(
        DATABASE_ID,
        TABLES.CATEGORY,
        [Query.orderAsc('order')]
      );
      const cats = response.documents;
      set({
        categories: cats,
        activeCategory: null, // "All" is the default
        loading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch categories',
        loading: false,
      });
    }
  },

  setActiveCategory: (slug: string | null) => {
    set({ activeCategory: slug });
  },
}));

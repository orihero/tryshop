import type { Models } from 'appwrite';

export interface Category extends Models.Document {
  name: string;
  slug: string;
  order: number;
  image: string | null;
}

export interface ProductColor {
  hex: string;
  label_en: string;
  label_uz: string;
  label_ru: string;
}

export interface Product extends Models.Document {
  title: string;
  stock: number;
  backgroundColor: string | null;
  priceColor: string;
  price: number;
  description: string | null;
  image: string | null;
  gallery: string[];
  colors: string | null;
  sizes: string[];
  category: string | Category;
  properties?: ProductProperty[];
}

export interface ProductProperty extends Models.Document {
  key: string;
  value: string;
  product: string | Product;
}

export interface UserProfile extends Models.Document {
  userId: string;
  name: string | null;
  deliveryLocation: string | null;
  email: string | null;
  preferredLanguage: 'en' | 'uz' | 'ru';
}

export type TryOnStatus = 'new' | 'processing' | 'completed' | 'error' | 'canceled';

export interface TryOn extends Models.Document {
  userProfileId: string;
  imageUrls: string[];
  resultImageUrls: string[];
  prompt: string | null;
  product: string | Product;
  status: TryOnStatus | null;
}

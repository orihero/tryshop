import { Client, Databases, Account, Storage, Functions } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

/** Bucket for user try-on uploads (create in Appwrite Console if missing). */
export const TRY_ON_BUCKET_ID =
  import.meta.env.VITE_APPWRITE_TRY_ON_BUCKET_ID || import.meta.env.VITE_APPWRITE_BUCKET_ID || '';

/** Deployed Appwrite Function ID for generating try-on via FASHN. */
export const TRY_ON_FUNCTION_ID = import.meta.env.VITE_APPWRITE_FUNCTION_TRYON_ID || '';

export const TABLES = {
  CATEGORY: 'category',
  PRODUCT: 'product',
  PRODUCT_PROPERTY: 'productProperty',
  USER_PROFILE: 'userProfile',
  TRY_ON: 'tryOn',
} as const;

export default client;

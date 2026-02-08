import { ID, Query } from 'appwrite';
import {
  storage,
  databases,
  DATABASE_ID,
  TABLES,
  TRY_ON_BUCKET_ID,
} from '@/lib/appwrite';
import type { TryOn, UserProfile } from '@/types/appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || '';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';

function getFileViewUrl(fileId: string): string {
  return `${endpoint}/storage/buckets/${TRY_ON_BUCKET_ID}/files/${fileId}/view?project=${projectId}`;
}

/**
 * Upload a file to the try-on bucket and return its view URL.
 */
export async function uploadTryOnImage(file: File): Promise<string> {
  if (!TRY_ON_BUCKET_ID) {
    throw new Error('VITE_APPWRITE_TRY_ON_BUCKET_ID is not set');
  }
  const ext = file.name.split('.').pop() || 'jpg';
  const fileId = `${ID.unique()}.${ext}`;
  await storage.createFile(TRY_ON_BUCKET_ID, fileId, file);
  return getFileViewUrl(fileId);
}

/**
 * Get userProfile document ID by Appwrite user ID.
 */
export async function getUserProfileId(userId: string): Promise<string | null> {
  const res = await databases.listDocuments<UserProfile>(
    DATABASE_ID,
    TABLES.USER_PROFILE,
    [Query.equal('userId', userId), Query.limit(1)]
  );
  const profile = res.documents[0];
  return profile?.$id ?? null;
}

export interface CreateTryOnParams {
  userProfileId: string;
  productId: string;
  imageUrls: string[];
}

/**
 * Create a TryOn document and return its ID.
 */
export async function createTryOnDocument(
  params: CreateTryOnParams
): Promise<string> {
  const doc = await databases.createDocument<TryOn>(
    DATABASE_ID,
    TABLES.TRY_ON,
    ID.unique(),
    {
      userProfileId: params.userProfileId,
      imageUrls: params.imageUrls,
      resultImageUrls: [],
      product: params.productId,
      status: 'new',
    }
  );
  return doc.$id;
}

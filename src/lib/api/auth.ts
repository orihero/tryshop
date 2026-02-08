import { ID } from 'appwrite';
import { account, databases, DATABASE_ID, TABLES } from '@/lib/appwrite';
import { useAuthStore } from '@/stores/authStore';

/**
 * Converts phone (E.164 format) to a derived email for Appwrite's email/password API.
 * Appwrite's createEmailPasswordSession expects an email; we use a synthetic format.
 */
function phoneToEmail(phone: string): string {
  const normalized = phone.replace(/\s/g, '').trim();
  return `${normalized}@phone.tryshop.local`;
}

/**
 * Extract error message from Appwrite or generic errors.
 */
function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    return (err as { message: string }).message;
  }
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred';
}

export interface SignInParams {
  phone: string;
  password: string;
}

export interface SignUpParams {
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Sign in with phone and password.
 * Uses derived email format for Appwrite compatibility.
 */
export async function signIn({ phone, password }: SignInParams): Promise<void> {
  const email = phoneToEmail(phone);
  await account.createEmailPasswordSession(email, password);
  const user = await account.get();
  useAuthStore.getState().setUser(user);
}

/**
 * Sign up with phone, password, and name.
 * Creates account with derived email, then auto-logs in, then creates a userProfile row.
 */
export async function signUp({
  phone,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<void> {
  const email = phoneToEmail(phone);
  const name = `${firstName} ${lastName}`.trim();

  await account.create({
    userId: ID.unique(),
    email,
    password,
    name,
  });

  await account.createEmailPasswordSession(email, password);
  const user = await account.get();
  useAuthStore.getState().setUser(user);

  await databases.createDocument(
    DATABASE_ID,
    TABLES.USER_PROFILE,
    ID.unique(),
    {
      userId: user.$id,
      name,
      email,
      deliveryLocation: null,
      preferredLanguage: 'en',
    },
    [`read("user:${user.$id}")`, `update("user:${user.$id}")`]
  );
}

export { getErrorMessage };

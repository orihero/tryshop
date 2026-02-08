const STORAGE_KEY = 'tryshop_auth_redirect';

/**
 * Validates that the path is a safe internal path (no open redirect).
 * Allows: /product/123, /home, /try-on/xyz, etc.
 */
function isValidRedirectPath(path: string): boolean {
  if (!path || typeof path !== 'string') return false;
  const trimmed = path.trim();
  return trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.includes('://');
}

/**
 * Saves the path to redirect to after sign-in/sign-up.
 * Only stores valid internal paths.
 */
export function saveRedirectPath(path: string): void {
  if (!isValidRedirectPath(path)) return;
  try {
    localStorage.setItem(STORAGE_KEY, path.trim());
  } catch {
    // localStorage may be unavailable (private browsing, etc.)
  }
}

/**
 * Reads and removes the stored redirect path.
 * Returns the path or null if none stored.
 */
export function getAndClearRedirectPath(): string | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    return value && isValidRedirectPath(value) ? value : null;
  } catch {
    return null;
  }
}

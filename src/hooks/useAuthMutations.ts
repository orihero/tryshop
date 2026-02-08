import { useMutation } from '@tanstack/react-query';
import { signIn as signInApi, signUp as signUpApi, getErrorMessage } from '@/lib/api/auth';
import type { SignInParams, SignUpParams } from '@/lib/api/auth';

export function useSignInMutation() {
  return useMutation({
    mutationFn: (params: SignInParams) => signInApi(params),
    onError: (err) => {
      // Error is surfaced via mutation.error
      console.error('Sign in failed:', err);
    },
  });
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (params: SignUpParams) => signUpApi(params),
    onError: (err) => {
      console.error('Sign up failed:', err);
    },
  });
}

export { getErrorMessage };

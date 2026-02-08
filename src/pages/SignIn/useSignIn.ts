import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignInMutation, getErrorMessage } from '@/hooks/useAuthMutations';
import { getAndClearRedirectPath } from '@/lib/redirectStorage';
import { DEFAULT_COUNTRY, type Country } from '@/components/PhoneInput';

export const useSignIn = () => {
  const navigate = useNavigate();
  const signInMutation = useSignInMutation();

  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const fullPhoneNumber = `${selectedCountry.dialCode}${phone.replace(/\s/g, '')}`;
  const error = signInMutation.isError ? getErrorMessage(signInMutation.error) : '';

  const handleLogin = () => {
    if (!phone || !password) return;
    signInMutation.mutate(
      { phone: fullPhoneNumber, password },
      {
        onSuccess: () => {
          const redirect = getAndClearRedirectPath();
          redirect ? navigate(redirect) : navigate('/home');
        },
      }
    );
  };

  const handleTogglePassword = () => setShowPassword((v) => !v);
  const handleBack = () => navigate(-1);
  const handleNavigateToSignUp = () => navigate('/signup');

  return {
    phone,
    setPhone,
    selectedCountry,
    setSelectedCountry,
    password,
    setPassword,
    showPassword,
    handleTogglePassword,
    error,
    isPending: signInMutation.isPending,
    handleLogin,
    handleBack,
    handleNavigateToSignUp,
  };
};

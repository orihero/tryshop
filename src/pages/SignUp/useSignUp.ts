import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { getAndClearRedirectPath } from '@/lib/redirectStorage';
import { useSignUpMutation, getErrorMessage } from '@/hooks/useAuthMutations';
import { DEFAULT_COUNTRY, type Country } from '@/components/PhoneInput';

export const useSignUp = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const signUpMutation = useSignUpMutation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const fullPhoneNumber = `${selectedCountry.dialCode}${phone.replace(/\s/g, '')}`;
  const mutationError = signUpMutation.isError ? getErrorMessage(signUpMutation.error) : '';
  const error = validationError || mutationError;

  const canSubmit =
    !!firstName.trim() &&
    !!lastName.trim() &&
    !!phone &&
    !!password &&
    !!confirmPassword &&
    !signUpMutation.isPending;

  const handleRegister = () => {
    if (!canSubmit) return;
    if (password !== confirmPassword) {
      setValidationError(t('passwordsDoNotMatch'));
      return;
    }
    setValidationError('');
    signUpMutation.mutate(
      {
        phone: fullPhoneNumber,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
      {
        onSuccess: () => {
          const redirect = getAndClearRedirectPath();
          redirect ? navigate(redirect) : navigate('/home');
        },
      }
    );
  };

  const handleTogglePassword = () => setShowPassword((v) => !v);
  const handleToggleConfirmPassword = () => setShowConfirmPassword((v) => !v);
  const handleBack = () => navigate(-1);
  const handleNavigateToSignIn = () => navigate('/signin');

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
    selectedCountry,
    setSelectedCountry,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    showConfirmPassword,
    handleTogglePassword,
    handleToggleConfirmPassword,
    error,
    canSubmit,
    isPending: signUpMutation.isPending,
    handleRegister,
    handleBack,
    handleNavigateToSignIn,
  };
};

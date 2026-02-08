import { motion } from 'framer-motion';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { useTranslation } from '@/hooks/useTranslation';
import PhoneInput from '@/components/PhoneInput';
import type { useSignUp } from '../useSignUp';

type SignUpFormProps = ReturnType<typeof useSignUp>;

const SignUpForm = ({
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
  isPending,
  handleRegister,
  handleNavigateToSignIn,
}: SignUpFormProps) => {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="text-2xl font-bold text-white text-center">
        {t('createAccount')}
      </h2>

      <div className="mt-8 flex flex-col gap-5 flex-1">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            {t('firstName')}
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={t('firstName')}
            className="w-full px-5 py-4 rounded-full border border-white/30 bg-transparent text-white text-sm
                       placeholder:text-white/40 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400
                       transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            {t('lastName')}
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={t('lastName')}
            className="w-full px-5 py-4 rounded-full border border-white/30 bg-transparent text-white text-sm
                       placeholder:text-white/40 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400
                       transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            {t('phoneNumber')}
          </label>
          <PhoneInput
            value={phone}
            onChange={setPhone}
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            {t('password')}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-full border border-white/30 bg-transparent text-white text-sm
                         placeholder:text-white/40 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400
                         transition-colors pr-14"
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <IoEyeOutline className="text-xl" />
              ) : (
                <IoEyeOffOutline className="text-xl" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            {t('confirmPassword')}
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-full border border-white/30 bg-transparent text-white text-sm
                         placeholder:text-white/40 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400
                         transition-colors pr-14"
            />
            <button
              type="button"
              onClick={handleToggleConfirmPassword}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? (
                <IoEyeOutline className="text-xl" />
              ) : (
                <IoEyeOffOutline className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 text-center"
          >
            {error}
          </motion.p>
        )}

        <div className="flex-1" />

        <p className="text-sm text-white/60 text-center">
          {t('alreadyHaveAccount')}{' '}
          <button
            type="button"
            onClick={handleNavigateToSignIn}
            className="text-blue-400 font-semibold"
          >
            {t('login')}
          </button>
        </p>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleRegister}
          disabled={!canSubmit || isPending}
          className="w-full py-4 rounded-full bg-[#2196F3] text-white font-semibold text-base
                     disabled:opacity-50 disabled:cursor-not-allowed transition-opacity
                     mb-[max(0.5rem,env(safe-area-inset-bottom))]"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            t('register')
          )}
        </motion.button>
      </div>
    </>
  );
};

export default SignUpForm;

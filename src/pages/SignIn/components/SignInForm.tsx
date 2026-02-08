import { motion } from 'framer-motion';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { useTranslation } from '@/hooks/useTranslation';
import PhoneInput from '@/components/PhoneInput';
import type { useSignIn } from '../useSignIn';

type SignInFormProps = ReturnType<typeof useSignIn>;

const SignInForm = ({
  phone,
  setPhone,
  selectedCountry,
  setSelectedCountry,
  password,
  setPassword,
  showPassword,
  handleTogglePassword,
  error,
  isPending,
  handleLogin,
  handleNavigateToSignUp,
}: SignInFormProps) => {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="text-2xl font-bold text-white text-center">
        {t('welcomeBack')}
      </h2>

      <div className="mt-8 flex flex-col gap-5 flex-1">
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

        <button
          type="button"
          className="text-sm text-blue-400 font-medium text-left -mt-1"
        >
          {t('forgotPassword')}
        </button>

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
          {t('dontHaveAccount')}{' '}
          <button
            type="button"
            onClick={handleNavigateToSignUp}
            className="text-blue-400 font-semibold"
          >
            {t('register')}
          </button>
        </p>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogin}
          disabled={isPending || !phone || !password}
          className="w-full py-4 rounded-full bg-[#2196F3] text-white font-semibold text-base
                     disabled:opacity-50 disabled:cursor-not-allowed transition-opacity
                     mb-[max(0.5rem,env(safe-area-inset-bottom))]"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            t('login')
          )}
        </motion.button>
      </div>
    </>
  );
};

export default SignInForm;

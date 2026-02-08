import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import Button from '@/components/Button';

interface OnboardingContinueButtonProps {
  visible: boolean;
  onContinue: (e?: React.MouseEvent) => void;
}

const OnboardingContinueButton = ({ visible, onContinue }: OnboardingContinueButtonProps) => {
  const { t } = useTranslation();

  if (!visible) return null;

  return (
    <motion.div
      key="continue-button"
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      initial={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{
        duration: 0.4,
        ease: 'easeIn',
      }}
    >
      <Button onClick={onContinue} className="px-8 py-4">
        <span className="text-white font-gothic text-lg">{t('continue')}</span>
      </Button>
    </motion.div>
  );
};

export default OnboardingContinueButton;

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LiquidGlass } from '@liquidglass/react';
import { useTranslation } from '@/hooks/useTranslation';

export interface TryOnUploadPayload {
  tryOnId: string;
  uploadedImageUrl: string;
}

interface TryOnUploadSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadStart: (file: File) => void;
  onExitComplete?: () => void;
  uploading?: boolean;
  uploadError?: string | null;
}

const TryOnUploadSheet = ({
  isOpen,
  onClose,
  onUploadStart,
  onExitComplete,
  uploading = false,
  uploadError = null,
}: TryOnUploadSheetProps) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasBeenOpen, setHasBeenOpen] = useState(false);

  useEffect(() => {
    if (isOpen) setHasBeenOpen(true);
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    onUploadStart(file);
    e.target.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSheetAnimationComplete = () => {
    if (!isOpen) {
      setHasBeenOpen(false);
      onExitComplete?.();
    }
  };

  if (!hasBeenOpen && !isOpen) return null;

  return (
    <>
      <motion.div
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-0 z-40 bg-black/40 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        initial={false}
        animate={{ y: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onAnimationComplete={handleSheetAnimationComplete}
        className="fixed bottom-0 left-0 right-0 z-50 overflow-hidden"
        style={{ borderRadius: '24px 24px 0 0' }}
      >
        <LiquidGlass
          borderRadius={0}
          blur={20}
          contrast={1.2}
          brightness={0.8}
          saturation={1.2}
          shadowIntensity={0.3}
          displacementScale={1}
          elasticity={0.5}
          className="w-full"
        >
          <div className="px-6 pt-8 pb-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
            <p className="text-center text-gray-800 text-base mb-6">
              {t('tryOnUploadPrompt')}
            </p>
            {uploadError && (
              <p className="text-center text-red-600 text-sm mb-3">
                {uploadError}
              </p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {uploading ? (
              <div className="flex flex-col items-center justify-center py-6 gap-3">
                <div className="w-10 h-10 border-2 border-[#3D4A5C] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-600">{t('uploading')}</p>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleUploadClick}
                className="w-full font-semibold text-base py-4 rounded-full bg-[#3D4A5C] text-white"
              >
                {t('uploadPhoto')}
              </motion.button>
            )}
          </div>
        </LiquidGlass>
      </motion.div>
    </>
  );
};

export default TryOnUploadSheet;

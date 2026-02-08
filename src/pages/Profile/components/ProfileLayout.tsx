import { useState } from 'react';
import { motion } from 'framer-motion';
import ProfileTopBar from './ProfileTopBar';
import ProfileImage from './ProfileImage';
import ProfileSettingsMenu from './ProfileSettingsMenu';
import UploadedPhotosSection from './UploadedPhotosSection';
import LogoutConfirmModal from './LogoutConfirmModal';

interface ProfileLayoutProps {
  avatarUrl?: string | null;
  userName?: string | null;
  uploadedPhotos: string[];
  onBack: () => void;
  onLogout: () => void;
}

const ProfileLayout = ({
  avatarUrl,
  userName,
  uploadedPhotos,
  onBack,
  onLogout,
}: ProfileLayoutProps) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };
  const handleLogoutCancel = () => setShowLogoutConfirm(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="font-roboto min-h-screen bg-[#FAF9F6] pb-24"
    >
      <ProfileTopBar onBack={onBack} onLogout={handleLogoutClick} />
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />

      <div className="pt-[max(4rem,calc(env(safe-area-inset-top)+3rem))] px-4 pb-8">
        {/* Profile image - centered */}
        <div className="flex justify-center mb-8">
          <ProfileImage avatarUrl={avatarUrl} userName={userName} />
        </div>

        {/* Settings menu */}
        <div className="mb-8">
          <ProfileSettingsMenu />
        </div>

        {/* Uploaded photos section */}
        <UploadedPhotosSection photoUrls={uploadedPhotos} />
      </div>
    </motion.div>
  );
};

export default ProfileLayout;

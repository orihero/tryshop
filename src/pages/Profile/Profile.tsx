import { useProfile } from './useProfile';
import ProfileLayout from './components/ProfileLayout';

const Profile = () => {
  const props = useProfile();

  if (props.loading) {
    return (
      <div className="font-roboto min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!props.user) {
    return null;
  }

  const userName = props.profile?.name ?? props.user.name ?? props.user.email ?? null;
  const avatarUrl = null; // No avatar in UserProfile yet - placeholder only

  return (
    <ProfileLayout
      avatarUrl={avatarUrl}
      userName={userName}
      uploadedPhotos={props.uploadedPhotos}
      onBack={props.onBack}
      onLogout={props.onLogout}
    />
  );
};

export default Profile;

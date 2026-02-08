import { IoPersonCircleOutline } from 'react-icons/io5';

interface ProfileImageProps {
  avatarUrl?: string | null;
  userName?: string | null;
}

const ProfileImage = ({ avatarUrl, userName }: ProfileImageProps) => {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={userName || 'Profile'}
        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-md"
      />
    );
  }

  return (
    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 shadow-md">
      <IoPersonCircleOutline className="text-5xl text-gray-500" />
    </div>
  );
};

export default ProfileImage;

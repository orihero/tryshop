import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Query } from 'appwrite';
import { useAuthStore } from '@/stores/authStore';
import { saveRedirectPath } from '@/lib/redirectStorage';
import { getUserProfileId } from '@/lib/tryOnUpload';
import { databases, DATABASE_ID, TABLES } from '@/lib/appwrite';
import type { UserProfile, TryOn } from '@/types/appwrite';

export const useProfile = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      saveRedirectPath('/profile');
      navigate('/signin', { replace: true });
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const userProfileId = await getUserProfileId(user.$id);
        if (userProfileId) {
          try {
            const [profileRes, tryOnRes] = await Promise.all([
              databases.getDocument<UserProfile>(
                DATABASE_ID,
                TABLES.USER_PROFILE,
                userProfileId
              ),
              databases.listDocuments<TryOn>(DATABASE_ID, TABLES.TRY_ON, [
                Query.equal('userProfileId', userProfileId),
                Query.orderDesc('createdAt'),
                Query.limit(50),
              ]),
            ]);
            setProfile(profileRes);
            const urls = tryOnRes.documents.flatMap((doc) => doc.imageUrls || []);
            setUploadedPhotos(urls);
          } catch {
            // Profile or TryOn fetch failed - keep defaults
          }
        }
      } catch {
        setProfile(null);
        setUploadedPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, navigate]);

  const onBack = () => navigate(-1);

  const onLogout = async () => {
    await logout();
    navigate('/signin', { replace: true });
  };

  return {
    user,
    profile,
    uploadedPhotos,
    loading,
    onBack,
    onLogout,
  };
};

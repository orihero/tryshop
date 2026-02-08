import { useTranslation } from '@/hooks/useTranslation';

interface UploadedPhotosSectionProps {
  photoUrls: string[];
}

const UploadedPhotosSection = ({ photoUrls }: UploadedPhotosSectionProps) => {
  const { t } = useTranslation();

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-800 mb-3 px-1">
        {t('uploadedPhotos')}
      </h2>
      {photoUrls.length === 0 ? (
        <div className="rounded-2xl bg-gray-100/80 border-2 border-dashed border-gray-300 py-12 px-4 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm text-center">
            {t('noUploadedPhotos')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {photoUrls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="aspect-square rounded-xl overflow-hidden bg-gray-200"
            >
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default UploadedPhotosSection;

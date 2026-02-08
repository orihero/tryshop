import { motion, AnimatePresence } from 'framer-motion';

interface ProductImageGalleryProps {
  mainImage: string | null;
  gallery: string[];
  selectedImageIndex: number;
  onSelectImage: (index: number) => void;
  title: string;
}

const ProductImageGallery = ({
  mainImage,
  gallery,
  selectedImageIndex,
  onSelectImage,
  title,
}: ProductImageGalleryProps) => {
  // Build the full images list: main image first, then gallery
  const allImages = [
    ...(mainImage ? [mainImage] : []),
    ...gallery,
  ];

  const activeImage = allImages[selectedImageIndex] || mainImage;

  return (
    <div className="relative w-full bg-[#F5F0EA] pb-6">
      {/* Main image area */}
      <div className="relative flex items-center justify-center px-12 pt-14 pb-4 min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImageIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full flex items-center justify-center"
          >
            {activeImage ? (
              <img
                src={activeImage}
                alt={title}
                className="max-w-full max-h-[260px] object-contain drop-shadow-lg"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-gray-400 text-sm">
                {title}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Color variant thumbnails - right side */}
        {allImages.length > 1 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            {allImages.map((img, index) => (
              <motion.button
                key={index}
                onClick={() => onSelectImage(index)}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                  index === selectedImageIndex
                    ? 'border-[#3D4A5C] shadow-md'
                    : 'border-transparent bg-white/60'
                }`}
              >
                <img
                  src={img}
                  alt={`${title} variant ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery;

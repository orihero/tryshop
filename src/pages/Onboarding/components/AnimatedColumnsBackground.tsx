import { useState } from 'react';
import { motion } from 'framer-motion';

// Placeholder clothing image URLs - can be replaced with actual URLs later
const clothingImages = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1594938291221-94f313b0e0e2?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1594938291221-94f313b0e0e2?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1594938291221-94f313b0e0e2?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1594938291221-94f313b0e0e2?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1594938291221-94f313b0e0e2?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
];

// Split images into 4 columns (6 images per column = 24 total)
const getColumnImages = (columnIndex: number) => {
  const imagesPerColumn = 6;
  const startIndex = columnIndex * imagesPerColumn;
  return clothingImages.slice(startIndex, startIndex + imagesPerColumn);
};

interface AnimatedColumnProps {
  images: string[];
  direction: 'up' | 'down';
}

const AnimatedColumn = ({ images, direction }: AnimatedColumnProps) => {
  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  // Precompute random styles once at mount (lazy init); avoids Math.random during render
  const [randomStyles] = useState(() =>
    Array.from({ length: images.length * 2 }, () => ({
      transform: `rotate(${Math.random() * 4 - 2}deg)`,
      marginLeft: `${Math.random() * 10 - 5}px`,
    }))
  );

  return (
    <div className="flex-1 h-full overflow-hidden relative">
      <motion.div
        className="flex flex-col gap-4"
        animate={{
          y: direction === 'up' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          width: '100%',
        }}
      >
        {duplicatedImages.map((image, index) => (
          <motion.div
            key={`${image}-${index}`}
            className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm"
            style={{
              width: '100%',
              aspectRatio: '3/4',
              ...randomStyles[index],
            }}
          >
            <img
              src={image}
              alt={`Clothing ${index}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const AnimatedColumnsBackground = () => {
  const column1Images = getColumnImages(0);
  const column2Images = getColumnImages(1);
  const column3Images = getColumnImages(2);
  const column4Images = getColumnImages(3);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
      <div
        className="absolute flex gap-2 md:gap-4 w-[150%] h-[150%] left-1/2 top-1/2"
        style={{
          transform: 'translate(-50%, -50%) rotate(30deg)',
          transformOrigin: 'center',
        }}
      >
        <AnimatedColumn images={column1Images} direction="up" />
        <AnimatedColumn images={column2Images} direction="down" />
        <AnimatedColumn images={column3Images} direction="up" />
        <AnimatedColumn images={column4Images} direction="down" />
      </div>
    </div>
  );
};

export default AnimatedColumnsBackground;

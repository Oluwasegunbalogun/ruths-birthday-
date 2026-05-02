import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, FadeIn } from './ui/Layout';
import { Contribution } from '../lib/types';
import { GALLERY_IMAGES } from '../lib/data';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoGalleryProps {
  contributions?: Contribution[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ contributions = [] }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Combine static gallery images with dynamic ones from contributions
  const dynamicImages = contributions.flatMap(c => 
    (c.media || [])
      .filter(m => m.type === 'image')
      .map(m => m.url)
  );

  const allImages = [...GALLERY_IMAGES, ...dynamicImages];

  return (
    <Section className="bg-transparent">
      <FadeIn>
        <h2 className="text-5xl md:text-8xl font-black text-white mb-16 text-center drop-shadow-2xl">
          Captured Moments
        </h2>
      </FadeIn>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl w-full">
        {allImages.map((img, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative aspect-square rounded-[32px] overflow-hidden cursor-pointer shadow-2xl border border-white/10 ${
              i === 0 ? 'md:col-span-2 md:row-span-2' : ''
            }`}
            onClick={() => setSelectedImage(i)}
          >
            <img src={img} alt={`Moment ${i}`} className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-8 text-white hover:text-[#FF2D55] cursor-pointer transition-colors z-[110]"
            >
              <X size={48} strokeWidth={3} />
            </button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={allImages[selectedImage]}
              className="max-h-[85vh] max-w-full rounded-[40px] shadow-2xl object-contain border border-white/10"
            />

            <div className="absolute bottom-10 flex gap-12 z-[110]">
              <button
                onClick={() => setSelectedImage((prev) => (prev! - 1 + allImages.length) % allImages.length)}
                className="text-white hover:text-[#FF2D55] cursor-pointer p-2 transition-all active:scale-90"
              >
                <ChevronLeft size={64} strokeWidth={3} />
              </button>
              <button
                onClick={() => setSelectedImage((prev) => (prev! + 1) % allImages.length)}
                className="text-white hover:text-[#FF2D55] cursor-pointer p-2 transition-all active:scale-90"
              >
                <ChevronRight size={64} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};
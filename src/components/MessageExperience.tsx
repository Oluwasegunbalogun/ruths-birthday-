import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, FadeIn } from './ui/Layout';
import { Contribution, MediaItem } from '../lib/types';
import { Quote, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface MessageExperienceProps {
  contributions: Contribution[];
}

const MediaCarousel: React.FC<{ media: MediaItem[] }> = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure video is paused when slide changes or component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        try {
          videoRef.current.pause();
        } catch (e) {
          // Ignore errors during unmount/transition
        }
      }
    };
  }, [currentIndex]);

  if (media.length === 0) return (
    <div className="aspect-[4/5] rounded-[40px] bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/10">
      <Heart className="text-[#FF2D55]/20" size={120} />
    </div>
  );

  const next = () => setCurrentIndex((prev) => (prev + 1) % media.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);

  return (
    <div className="relative rounded-[40px] overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-[4/5] bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full h-full"
        >
          {media[currentIndex].type === 'video' ? (
            <video 
              ref={videoRef}
              src={media[currentIndex].url} 
              controls 
              className="w-full h-full object-cover" 
              autoPlay={false}
              muted={false}
              loop
              playsInline
            />
          ) : (
            <img 
              src={media[currentIndex].url} 
              alt={`Memory ${currentIndex + 1}`} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {media.length > 1 && (
        <>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {media.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all shadow-sm ${i === currentIndex ? 'bg-[#FF2D55] w-8' : 'bg-white/60'}`}
              />
            ))}
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-[#FF2D55] text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-[#FF2D55] text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export const MessageExperience: React.FC<MessageExperienceProps> = ({ contributions }) => {
  if (contributions.length === 0) return null;

  return (
    <Section className="bg-transparent">
      <FadeIn>
        <div className="text-center mb-24 space-y-4">
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tight drop-shadow-2xl">
            Words of Love
          </h2>
          <p className="text-[#FF2D55] uppercase tracking-[0.4em] text-sm font-black drop-shadow-md">
            Messages from your world
          </p>
        </div>
      </FadeIn>

      <div className="w-full space-y-40">
        {contributions.map((item, index) => (
          <div key={item.id} className="max-w-5xl w-full mx-auto px-6">
            <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
              {/* Media Section */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-full md:w-1/2"
              >
                <MediaCarousel media={item.media || []} />
              </motion.div>

              {/* Content Section */}
              <motion.div 
                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-full md:w-1/2 space-y-8"
              >
                <Quote className="text-[#FF2D55]" size={64} />
                
                <div className="space-y-6">
                  <p className="text-3xl md:text-4xl font-black text-white leading-relaxed italic drop-shadow-lg">
                    "{item.message}"
                  </p>
                  
                  {item.memory && (
                    <div className="p-8 bg-white/10 backdrop-blur-xl rounded-[40px] border border-white/20 shadow-2xl">
                      <span className="text-xs font-black text-[#FF2D55] uppercase tracking-[0.3em] block mb-3 drop-shadow-sm">Memory</span>
                      <p className="text-white text-xl font-bold leading-relaxed drop-shadow-md">
                        {item.memory}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6">
                  <div className="space-y-1">
                    <p className="text-white font-black text-2xl drop-shadow-md">— {item.author_name || 'Someone who loves you'}</p>
                    <p className="text-[#FF2D55] text-sm font-bold uppercase tracking-widest drop-shadow-sm">Birthday Celebration</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
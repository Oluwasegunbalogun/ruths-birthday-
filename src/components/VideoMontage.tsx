import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Section, FadeIn } from './ui/Layout';
import { Contribution } from '../lib/types';
import { Play, ExternalLink } from 'lucide-react';

interface VideoMontageProps {
  contributions: Contribution[];
}

const VideoItem: React.FC<{ video: any; index: number }> = ({ video, index }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const handleMouseEnter = async () => {
    if (!videoRef.current) return;

    try {
      // Start playback and store the promise
      playPromiseRef.current = videoRef.current.play();
      
      if (playPromiseRef.current !== undefined) {
        await playPromiseRef.current;
      }
    } catch (error: any) {
      // AbortError is expected when pause() interrupts play()
      if (error.name !== 'AbortError') {
        console.error("Playback error:", error);
      }
    }
  };

  const handleMouseLeave = async () => {
    if (!videoRef.current) return;

    try {
      // If there's an ongoing play promise, wait for it before pausing
      // to avoid "The play() request was interrupted by a call to pause()"
      if (playPromiseRef.current) {
        await playPromiseRef.current;
      }
      
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    } catch (error) {
      // If play failed, just ensure it's paused
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    } finally {
      playPromiseRef.current = null;
    }
  };

  // Cleanup to ensure video is paused when component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative aspect-video rounded-[40px] overflow-hidden bg-black/40 border border-white/10 shadow-2xl"
    >
      <video 
        ref={videoRef}
        src={video.url} 
        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
        muted
        loop
        playsInline
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="w-20 h-20 rounded-full bg-[#FF2D55]/20 backdrop-blur-xl flex items-center justify-center text-white mb-6 border border-white/20 shadow-xl"
        >
          <Play fill="currentColor" size={32} />
        </motion.div>
        
        <div className="space-y-2">
          <p className="text-white font-black text-xl drop-shadow-md">From {video.author || 'Anonymous'}</p>
          <p className="text-white font-bold text-sm truncate max-w-[250px] drop-shadow-sm">"{video.message}"</p>
        </div>
      </div>

      <a 
        href={video.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute top-8 right-8 p-4 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-[#FF2D55] transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/10 shadow-lg"
      >
        <ExternalLink size={20} />
      </a>
    </motion.div>
  );
};

export const VideoMontage: React.FC<VideoMontageProps> = ({ contributions }) => {
  // Extract all video items from all contributions
  const allVideos = contributions.flatMap(c => 
    (c.media || [])
      .filter(m => m.type === 'video')
      .map(m => ({
        ...m,
        id: c.id,
        author: c.author_name,
        message: c.message
      }))
  );

  if (allVideos.length === 0) return null;

  return (
    <Section className="bg-transparent">
      <FadeIn>
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tight drop-shadow-2xl">
            Cinematic Montage
          </h2>
          <p className="text-[#FF2D55] uppercase tracking-[0.4em] text-sm font-black drop-shadow-md">
            A collection of moments in motion
          </p>
        </div>
      </FadeIn>

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
        {allVideos.map((video, index) => (
          <VideoItem key={`${video.id}-${index}`} video={video} index={index} />
        ))}
      </div>

      <div className="mt-24">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "150px" }}
          className="h-[3px] bg-[#FF2D55] mx-auto rounded-full drop-shadow-lg"
        />
      </div>
    </Section>
  );
};
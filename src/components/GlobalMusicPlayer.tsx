import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Music, Volume2, X } from 'lucide-react';
import ReactPlayer from 'react-player';

export const GlobalMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isReady, setIsReady] = useState(false);

  const youtubeUrl = "https://www.youtube.com/watch?v=XS4ZTYn_2EY&t=11s";

  // Using 'any' as a workaround for react-player type mismatches in this environment
  const Player = ReactPlayer as any;

  const handleTogglePlay = () => {
    // Don't toggle if the player isn't ready to handle playback commands
    if (isReady) {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 
        The Player is kept OUTSIDE of the AnimatePresence block to prevent 
        it from being unmounted when the UI collapses. This avoids the 
        "media was removed from the document" runtime error and allows 
        the music to keep playing while the UI is collapsed.
      */}
      <div className="hidden pointer-events-none opacity-0 invisible" aria-hidden="true">
        <Player
          url={youtubeUrl}
          playing={isPlaying && isReady}
          volume={volume}
          loop={true}
          width="0"
          height="0"
          onReady={() => setIsReady(true)}
          config={{
            youtube: {
              playerVars: {
                start: 11,
                rel: 0,
                autoplay: 1,
              }
            }
          }}
        />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="mb-4 p-6 bg-white/95 backdrop-blur-xl border border-[#FF2D55]/10 rounded-[32px] shadow-2xl w-[300px] overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FF2D55]/10 flex items-center justify-center text-[#FF2D55]">
                  <Music size={24} className={isPlaying ? "animate-pulse" : ""} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1D1D1F] line-clamp-1">Refiner</p>
                  <p className="text-[10px] text-[#FF2D55] uppercase tracking-wider font-bold">Maverick City Music</p>
                </div>
              </div>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-[#1D1D1F]/20 hover:text-[#FF2D55] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="h-1 bg-[#FF2D55]/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#FF2D55]"
                  initial={{ width: 0 }}
                  animate={{ width: (isPlaying && isReady) ? '100%' : '0%' }}
                  transition={{ duration: 240, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 group relative">
                  <Volume2 size={16} className="text-[#1D1D1F]/40" />
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume} 
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-[#FF2D55]/10 rounded-full appearance-none cursor-pointer accent-[#FF2D55]"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleTogglePlay}
                    disabled={!isReady}
                    className={`w-14 h-14 flex items-center justify-center rounded-full shadow-xl shadow-[#FF2D55]/20 hover:scale-110 active:scale-95 transition-all ${
                      !isReady ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#FF2D55] text-white'
                    }`}
                  >
                    {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                  </button>
                </div>
                <div className="w-16" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 ${
          isExpanded ? 'bg-white text-[#FF2D55] border border-[#FF2D55]/10' : 'bg-[#FF2D55] text-white'
        }`}
      >
        {isExpanded ? <Music size={24} /> : (
          <motion.div
            animate={isPlaying ? { 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            } : { scale: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Music size={24} />
          </motion.div>
        )}
      </button>
    </div>
  );
};
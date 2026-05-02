import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Lock, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    // Clear temporary session data but keep the lock state if already entered?
    // Actually, to "reinstate" it, maybe we should clear it once to force user to see it again if they refreshed.
    // However, keeping it for smooth navigation is better.
    localStorage.removeItem('ruth_bday_submitted_session');
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FFF6F9]">
      {/* Background Image with Overlay - Enhanced visibility */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] scale-105"
        style={{ 
          backgroundImage: "url('https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200807142_BK_GROUND.jpg')",
          opacity: 0.8
        }}
      />
      {/* Subtle overlay to maintain text readability */}
      <div className="absolute inset-0 z-0 bg-white/30" />

      <div className="relative z-10 text-center px-6 max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <div className="flex justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <Heart className="text-[#FF2D55]" fill="#FF2D55" size={64} />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="text-[#FF2D55]/40" size={32} />
              </motion.div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-[#1D1D1F] heading-pop">
              A Birthday Story
            </h1>
            <p className="text-3xl md:text-5xl font-black text-[#1D1D1F] max-w-2xl mx-auto leading-tight text-pop tracking-tight">
              Every memory is a piece of magic. Let us make Ruth's day unforgettable.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
            <Link to="/contribute" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:px-10 py-6 bg-[#FF2D55] text-white rounded-full text-xl font-black shadow-2xl shadow-[#FF2D55]/30 flex items-center justify-center gap-3 transition-all hover:bg-[#E6294D] border-none"
              >
                <span>Leave a message</span>
                <Heart size={24} fill="currentColor" />
              </motion.button>
            </Link>

            <Link to="/her" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:px-10 py-6 bg-white text-[#FF2D55] border-2 border-[#FF2D55] rounded-full text-xl font-black shadow-2xl shadow-[#FF2D55]/30 flex items-center justify-center gap-3 transition-all hover:bg-[#FFF6F9] ring-4 ring-[#FF2D55]/20 border-none"
              >
                <span className="tracking-widest uppercase">Unlock Experience</span>
                <Lock size={24} className="text-[#FF2D55]" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-br from-[#FF2D55]/10 to-transparent rounded-full blur-3xl"
            style={{
              width: Math.random() * 400 + 200,
              height: Math.random() * 400 + 200,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};
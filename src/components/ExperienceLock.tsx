import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Heart, ArrowRight, Sparkles, Home, ShieldCheck } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ExperienceLockProps {
  onUnlock: () => void;
}

const MAGIC_WORDS = ['fair havens', 'secret', 'ruth'];

export const ExperienceLock: React.FC<ExperienceLockProps> = ({ onUnlock }) => {
  const [magicWord, setMagicWord] = useState('');
  const [isError, setIsError] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const navigate = useNavigate();

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const word = magicWord.toLowerCase().trim();
    
    if (MAGIC_WORDS.includes(word)) {
      onUnlock();
      toast.success('Access Granted! Welcome to the magic 💖');
    } else {
      setIsError(true);
      setAttemptCount(prev => prev + 1);
      
      const hint = attemptCount >= 1 
        ? "Hint: Acts 27:8 - 'The ____ ______'" 
        : "Incorrect secret key. Try something meaningful.";
        
      toast.error(hint);
      setTimeout(() => setIsError(false), 500);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-black overflow-hidden">
      {/* Background with cinematic blur */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 opacity-50 scale-105"
        style={{ backgroundImage: "url('https://storage.googleapis.com/dala-prod-public-storage/generated-images/8d61fd64-91e9-459e-aea1-7a56faa84f67/experience-lock-bg-new-1eb6f5f4-1776244405681.webp')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-black/50" />

      {/* Navigation - Back to Home */}
      <div className="absolute top-8 left-8 z-50">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full h-12 px-6 text-white hover:bg-[#FF2D55] hover:border-[#FF2D55] transition-all flex items-center gap-2 shadow-2xl font-bold"
        >
          <Home size={18} />
          <span className="text-sm font-black uppercase tracking-widest">Exit to Home</span>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md text-center"
      >
        <div className="mb-12 space-y-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block p-6 rounded-full bg-[#FF2D55]/10 backdrop-blur-3xl border border-[#FF2D55]/20"
          >
            <ShieldCheck className="text-[#FF2D55]" size={40} />
          </motion.div>
          
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
              Secret Access
            </h1>
            <p className="text-white font-bold text-lg drop-shadow-md">
              Enter the magic word to reveal the experience
            </p>
          </div>
        </div>

        <motion.form 
          onSubmit={handleUnlock}
          className={`space-y-6 p-8 rounded-[48px] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl transition-all duration-300 ${isError ? 'animate-shake border-red-500/50' : ''}`}
        >
          <div className="space-y-4 text-left">
            <label className="text-[10px] uppercase tracking-[0.4em] text-[#FF2D55] font-black ml-4 drop-shadow-sm">
              Access Code Required
            </label>
            <div className="relative">
              <Input 
                type="text"
                placeholder="Type here..."
                className="h-20 bg-black/40 border-white/10 text-white text-center text-2xl placeholder:text-white/20 rounded-full focus:ring-[#FF2D55]/50 focus:border-[#FF2D55]/50 transition-all uppercase tracking-[0.2em] font-bold"
                value={magicWord}
                onChange={(e) => setMagicWord(e.target.value)}
                autoFocus
              />
              <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            </div>
            
            <AnimatePresence>
              {attemptCount >= 1 && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white font-black text-[10px] text-center tracking-[0.2em] uppercase bg-white/10 py-2 rounded-full mt-2 drop-shadow-sm"
                >
                  Hint: Acts 27:8
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <Button 
            type="submit"
            className="w-full h-20 rounded-full bg-[#FF2D55] hover:bg-[#E6294D] text-white text-xl font-bold shadow-2xl shadow-[#FF2D55]/40 group transition-all border-none"
          >
            <span>Unlock Experience</span>
            <ArrowRight size={24} className="ml-3 group-hover:translate-x-2 transition-transform" />
          </Button>
        </motion.form>

        <div className="mt-12">
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex items-center justify-center gap-3 text-white text-[10px] tracking-[0.5em] uppercase font-black drop-shadow-md"
          >
            <Heart size={14} fill="currentColor" className="text-[#FF2D55]" />
            <span>Private Collection</span>
            <Heart size={14} fill="currentColor" className="text-[#FF2D55]" />
          </motion.div>
        </div>
      </motion.div>

      {/* Cinematic Overlays */}
      <div className="absolute top-0 left-0 w-full h-60 bg-gradient-to-b from-black to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-60 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
};
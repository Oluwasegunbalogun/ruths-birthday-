import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Loader2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

import { Hero } from '../components/Hero';
import { MemoryTimeline } from '../components/MemoryTimeline';
import { MessageExperience } from '../components/MessageExperience';
import { GuessingGame } from '../components/GuessingGame';
import { FinalLetter } from '../components/FinalLetter';
import { ExperienceLock } from '../components/ExperienceLock';

import { supabase } from '../lib/supabase';
import { Contribution } from '../lib/types';
import { Button } from '../components/ui/button';

export const ExperiencePage: React.FC = () => {
  // Reset experience state on every refresh (persistence removed)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);
  
  // Game completion state reset on refresh
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  
  const navigate = useNavigate();
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Handle scroll section detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const { offsetTop, offsetHeight } = ref;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch contributions
  useEffect(() => {
    document.title = "Ruth's Birthday Story | Experience";
    
    const fetchContributions = async () => {
      try {
        const { data, error } = await supabase
          .from('contributions')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (!error && data) {
          setContributions(data);
        }
      } catch (err) {
        console.error('Error fetching contributions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  const scrollToSection = (index: number) => {
    const ref = sectionRefs.current[index];
    if (ref) {
      window.scrollTo({
        top: ref.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // Lock Gating Logic
  if (!isUnlocked) {
    return <ExperienceLock onUnlock={() => setIsUnlocked(true)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#FF2D55]" size={40} />
        <p className="text-white/80 font-bold tracking-[0.2em] uppercase text-sm drop-shadow-md">Preparing your magic...</p>
      </div>
    );
  }

  const sectionData = [
    { label: 'Beginning', id: 'hero' },
    { label: 'Evolution', id: 'timeline' },
    { label: 'The Game', id: 'game' },
    { label: 'Words of Love', id: 'messages' },
    { label: 'The Letter', id: 'letter' },
  ];

  return (
    <div className="bg-transparent relative min-h-screen">
       {/* Background Image Container */}
       <div 
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url('https://storage.googleapis.com/dala-prod-public-storage/attachments/880a0d03-0913-42ba-a21e-f1ef9a1fa28b/1776200807142_BK_GROUND.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.35,
          }}
        />
        {/* Darkening Overlay */}
        <div className="fixed inset-0 z-0 bg-black/60 pointer-events-none" />

      <div className="fixed top-8 left-8 z-50 flex flex-col gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="bg-white/80 backdrop-blur-md border border-[#FF2D55]/10 rounded-full h-12 w-12 p-0 text-[#1D1D1F] hover:text-[#FF2D55] shadow-lg shadow-black/[0.2] font-bold"
          >
            <Home size={20} />
          </Button>
        </motion.div>
      </div>

      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-6">
        <div className="flex flex-col gap-4">
          {sectionData.map((section, idx) => (
            <button
              key={idx}
              onClick={() => scrollToSection(idx)}
              className="group relative flex items-center justify-end"
            >
              <span className={`mr-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 drop-shadow-md ${currentSection === idx ? 'text-[#FF2D55] opacity-100' : 'text-white/60 opacity-0 group-hover:opacity-100'}`}>
                {section.label}
              </span>
              <div 
                className={`w-2 h-2 rounded-full transition-all duration-500 border-2 ${currentSection === idx ? 'bg-[#FF2D55] border-[#FF2D55] scale-150' : 'bg-transparent border-[#FF2D55]/60 hover:border-[#FF2D55]'}`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {/* Section 0: Hero */}
        <div ref={(el) => { sectionRefs.current[0] = el; }}>
          <Hero onBegin={scrollToNext} />
        </div>

        {/* Section 1: MemoryTimeline */}
        <div ref={(el) => { sectionRefs.current[1] = el; }}>
          <MemoryTimeline />
        </div>

        {/* Section 2: GuessingGame */}
        <div ref={(el) => { sectionRefs.current[2] = el; }}>
          <GuessingGame 
            contributions={contributions} 
            onComplete={() => setIsGameCompleted(true)} 
          />
        </div>

        {/* Section 3: Words of Love (Gated) */}
        <div ref={(el) => { sectionRefs.current[3] = el; }}>
          {isGameCompleted ? (
            <MessageExperience contributions={contributions} />
          ) : (
            <div className="min-h-[60vh] flex items-center justify-center bg-transparent px-6 py-20">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 bg-black/40 backdrop-blur-2xl p-12 rounded-[48px] border border-white/20 max-w-lg w-full shadow-2xl"
              >
                 <div className="w-20 h-20 bg-[#FF2D55]/20 rounded-full flex items-center justify-center mx-auto text-[#FF2D55]">
                    <Lock size={32} />
                 </div>
                 <div className="space-y-4">
                   <p className="text-sm uppercase tracking-[0.4em] text-[#FF2D55] font-black drop-shadow-sm">Locked Content</p>
                   <h3 className="text-3xl font-bold text-white drop-shadow-md">A Surprise Awaits</h3>
                   <p className="text-white font-medium leading-relaxed drop-shadow-sm">Finish the guessing game above to reveal the beautiful messages left just for you 💖</p>
                 </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Section 4: FinalLetter */}
        <div ref={(el) => { sectionRefs.current[4] = el; }}>
          <FinalLetter />
        </div>
      </div>
    </div>
  );
};
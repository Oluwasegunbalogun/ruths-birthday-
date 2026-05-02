import React from 'react';
import { motion } from 'framer-motion';
import { Section, FadeIn } from './ui/Layout';
import { Heart } from 'lucide-react';

export const FinalLetter: React.FC = () => {
  return (
    <Section className="bg-black/40 text-white backdrop-blur-md">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, #FF2D55 0%, transparent 60%)',
              'radial-gradient(circle at 80% 80%, #FF2D55 0%, transparent 60%)',
              'radial-gradient(circle at 20% 20%, #FF2D55 0%, transparent 60%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="w-full h-full"
        />
      </div>

      <div className="max-w-3xl w-full text-center z-10">
        <FadeIn>
          <div className="flex justify-center mb-16">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[#FF2D55] drop-shadow-[0_0_20px_rgba(255,45,85,0.4)]"
            >
              <Heart size={64} fill="currentColor" />
            </motion.div>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <h2 className="text-5xl md:text-8xl font-black mb-16 leading-tight drop-shadow-2xl">
            To the next 25 years...
          </h2>
        </FadeIn>

        <FadeIn delay={0.8}>
          <div className="space-y-12 text-2xl md:text-4xl font-bold text-white leading-relaxed italic drop-shadow-lg">
            <p>
              "For 25 years, the world has been better because of you. Your laughter is the melody we all love to hear, and your kindness is the light that guides us."
            </p>
            <p>
              "May this year bring you as much joy as you have given to every single person in this room (and on this screen)."
            </p>
            <p>
              "Happy Birthday, beautiful soul. The best is yet to come."
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={1.5}>
          <div className="mt-24 bg-white/10 p-10 rounded-[40px] border border-white/10 backdrop-blur-xl shadow-2xl">
            <p className="text-[#FF2D55] font-black tracking-[0.4em] uppercase mb-4 text-sm drop-shadow-sm">Forever Yours,</p>
            <p className="text-4xl md:text-5xl font-black drop-shadow-md">Everyone who loves you</p>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
};
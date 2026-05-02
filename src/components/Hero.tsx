import React from 'react';
import { motion } from 'framer-motion';
import { Section, FadeIn } from './ui/Layout';
import { ChevronDown } from 'lucide-react';

export const Hero: React.FC<{ onBegin: () => void }> = ({ onBegin }) => {
  return (
    <Section className="bg-transparent">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#FF8FA3]/10"
            style={{
              width: Math.random() * 20 + 10,
              height: Math.random() * 20 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="text-center z-10">
        <FadeIn>
          <h2 className="text-xl md:text-2xl font-black text-[#FF2D55] mb-4 tracking-[0.4em] uppercase drop-shadow-md">
            Today is for you
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <h1 className="text-6xl md:text-9xl font-black text-white mb-8 drop-shadow-2xl">
            Hey Love <span className="text-[#FF2D55]">💖</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.4}>
          <p className="text-xl md:text-3xl font-bold text-white mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            This is your story, 25 years in the making. Let's take a journey through your magic.
          </p>
        </FadeIn>
        <FadeIn delay={0.6}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBegin}
            className="px-14 py-6 bg-[#FF2D55] text-white rounded-full text-2xl font-black shadow-2xl shadow-[#FF2D55]/60 transition-all hover:bg-[#E6294D] border-none"
          >
            Enter Experience
          </motion.button>
        </FadeIn>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#FF2D55]"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={40} className="drop-shadow-lg" />
      </motion.div>
    </Section>
  );
};
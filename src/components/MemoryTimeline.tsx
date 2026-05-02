import React from 'react';
import { motion } from 'framer-motion';
import { Section, FadeIn } from './ui/Layout';
import { MEMORIES } from '../lib/data';

export const MemoryTimeline: React.FC = () => {
  return (
    <div className="bg-transparent">
      <Section className="bg-transparent py-40 min-h-[60vh] flex items-center justify-center">
        <FadeIn>
          <div className="text-center space-y-6">
            <h2 className="text-6xl md:text-9xl font-black text-white tracking-tight drop-shadow-2xl">
              Her Evolution
            </h2>
            <div className="w-32 h-[3px] bg-[#FF2D55] mx-auto rounded-full drop-shadow-md" />
            <p className="text-[#FF2D55] font-black tracking-[0.5em] uppercase text-base drop-shadow-lg">A Cinematic Journey</p>
          </div>
        </FadeIn>
      </Section>

      <div className="space-y-20">
        {MEMORIES.map((memory, index) => (
          <MemoryItem key={memory.id} memory={memory} index={index} />
        ))}
      </div>
    </div>
  );
};

const MemoryItem: React.FC<{ memory: typeof MEMORIES[0]; index: number }> = ({ memory, index }) => {
  const isEven = index % 2 === 0;
  
  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-6">
      <div className={`max-w-7xl mx-auto flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-32`}>
        {/* Image Section with Apple-style Parallax/Zoom */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-20%" }}
          className="w-full md:w-3/5 group"
        >
          <div className="relative aspect-[4/5] md:aspect-[16/10] rounded-[48px] overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
            <motion.img
              src={memory.imageUrl}
              alt={memory.title}
              loading="lazy"
              className="w-full h-full object-cover"
              initial={{ scale: 1.15 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className={`w-full md:w-2/5 flex flex-col ${isEven ? 'items-start text-left' : 'items-start md:items-end md:text-right'} space-y-8`}
        >
          <div className="space-y-4 w-full">
            <motion.span 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              transition={{ delay: 0.5 }}
              className="text-base md:text-lg font-black tracking-[0.5em] text-[#FF2D55] uppercase block drop-shadow-sm"
            >
              {memory.year}
            </motion.span>
            <h3 className="text-5xl md:text-7xl font-black text-white leading-[1.1] drop-shadow-2xl">
              {memory.title}
            </h3>
          </div>
          
          <div className={`w-24 h-[4px] bg-[#FF2D55] rounded-full drop-shadow-md ${!isEven ? 'md:ml-auto' : ''}`} />

          <p className="text-2xl md:text-3xl text-white font-bold leading-relaxed max-w-sm md:max-w-lg drop-shadow-lg">
            {memory.description}
          </p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3 text-white font-black text-sm uppercase tracking-widest drop-shadow-md"
          >
            <span className="text-[#FF2D55]">Memory Moment</span>
            <div className="w-2 h-2 rounded-full bg-[#FF2D55]" />
            <span>0{index + 1}</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
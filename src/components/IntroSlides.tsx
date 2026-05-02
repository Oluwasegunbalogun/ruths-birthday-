import React from 'react';
import { motion } from 'framer-motion';
import { Section } from './ui/Layout';

const slides = [
  { text: "You are kind 💖", color: "#FFF6F9" },
  { text: "You are beautiful 🌸", color: "#FFF0F5" },
  { text: "You are deeply loved 💖", color: "#FFF6F9" },
];

export const IntroSlides: React.FC = () => {
  return (
    <div className="relative">
      {slides.map((slide, index) => (
        <Section key={index} className={`sticky top-0 h-screen shadow-2xl`} style={{ backgroundColor: slide.color }}>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.5 }}
            className="text-5xl md:text-8xl font-black text-[#1D1D1F] text-center max-w-5xl px-6 leading-tight drop-shadow-sm"
          >
            {slide.text}
          </motion.h2>
        </Section>
      ))}
    </div>
  );
};
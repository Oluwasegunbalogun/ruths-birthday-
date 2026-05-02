import React from 'react';
import { motion, Variants } from 'framer-motion';

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export const Section: React.FC<SectionProps> = ({ children, className = '', id, style }) => {
  return (
    <section
      id={id}
      style={style}
      className={`min-h-screen w-full flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden ${className}`}
    >
      {children}
    </section>
  );
};

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'none';
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  direction = 'up',
}) => {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={variants}>
      {children}
    </motion.div>
  );
};
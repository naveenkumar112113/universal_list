import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, glowColor, ...props }) => {
  return (
    <motion.div
      className={cn(
        "relative rounded-3xl overflow-hidden",
        "bg-white/5 dark:bg-[#0f172a]/60 backdrop-blur-xl",
        "border border-white/10 dark:border-white/5",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]",
        className
      )}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      {...props}
    >
      {/* Optional Glow Effect */}
      {glowColor && (
        <div 
          className="absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100" 
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${glowColor}, transparent 40%)`
          }}
        />
      )}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
};

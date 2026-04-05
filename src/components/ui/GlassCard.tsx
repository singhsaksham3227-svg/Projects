import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  noHover?: boolean;
  [key: string]: any;
}

export function GlassCard({ children, className, noHover = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'glass-card',
        !noHover && 'hover:scale-[1.01]',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

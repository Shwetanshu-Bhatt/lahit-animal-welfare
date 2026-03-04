'use client';

import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = true,
  padding = 'lg',
  onClick,
}) {
  const baseStyles = 'bg-white rounded-2xl overflow-hidden';
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const combinedClasses = `${baseStyles} ${paddings[padding]} ${className}`;

  if (hover) {
    return (
      <motion.div
        className={combinedClasses}
        onClick={onClick}
        whileHover={{ 
          y: -8, 
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' 
        }}
        transition={{ duration: 0.3 }}
        style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div 
      className={combinedClasses}
      onClick={onClick}
      style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl font-bold text-[#401E01] ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-[#401E01]/70 mt-2 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-6 pt-4 border-t border-[#401E01]/10 ${className}`}>
      {children}
    </div>
  );
}

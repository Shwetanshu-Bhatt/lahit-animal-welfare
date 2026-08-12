'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
  type = 'button',
  disabled = false,
  loading = false,
  icon: Icon,
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-full border font-bold tracking-[-0.01em] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2';
  
  const variants = {
    primary: 'border-primary bg-primary text-primary-content hover:bg-[#164a36] hover:border-[#164a36]',
    secondary: 'border-secondary bg-secondary text-secondary-content hover:bg-[#ef603c] hover:border-[#ef603c]',
    outline: 'border-primary/30 bg-transparent text-primary hover:border-primary hover:bg-primary hover:text-primary-content',
    outlineWhite: 'border-white/50 bg-transparent text-white hover:border-white hover:bg-white hover:text-primary',
    accent: 'border-accent bg-accent text-accent-content hover:bg-white hover:border-white',
    ghost: 'border-transparent bg-transparent text-primary hover:bg-primary/8',
    success: 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700',
    error: 'border-red-600 bg-red-600 text-white hover:bg-red-700',
    warning: 'border-amber-400 bg-amber-400 text-primary hover:bg-amber-300',
  };

  const sizes = {
    sm: 'min-h-10 px-5 text-sm',
    md: 'min-h-12 px-6 text-sm',
    lg: 'min-h-14 px-7 text-base',
    xl: 'min-h-16 px-9 text-lg',
  };

  const combinedClasses = `${baseStyles} ${variants[variant] || ''} ${sizes[size] || ''} ${className} ${disabled || loading ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`;

  const MotionComponent = href ? motion.a : motion.button;

  const isDisabled = disabled || loading;

  return (
    <MotionComponent
      href={href}
      type={href ? undefined : type}
      onClick={onClick}
      disabled={isDisabled}
      className={combinedClasses}
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.95 }}
    >
      {loading && <Loader2 size={size === 'sm' ? 16 : size === 'lg' || size === 'xl' ? 24 : 20} className="animate-spin" />}
      {!loading && Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' || size === 'xl' ? 24 : 20} />}
      {children}
    </MotionComponent>
  );
}

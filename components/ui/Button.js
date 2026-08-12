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
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    outline: 'btn btn-outline',
    outlineWhite: 'btn btn-outline btn-primary',
    accent: 'btn btn-accent',
    ghost: 'btn btn-ghost',
    success: 'btn btn-success',
    error: 'btn btn-error',
    warning: 'btn btn-warning',
  };

  const sizes = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
    xl: 'btn-xl',
  };

  const combinedClasses = `${baseStyles} ${variants[variant] || ''} ${sizes[size] || ''} ${className} ${disabled || loading ? 'btn-disabled opacity-50 cursor-not-allowed' : ''}`;

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

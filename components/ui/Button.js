'use client';

import { motion } from 'framer-motion';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
  type = 'button',
  disabled = false,
  icon: Icon,
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[#164020] text-white hover:bg-[#0d2b16] focus:ring-[#164020] shadow-lg hover:shadow-xl border-2 border-transparent',
    secondary: 'bg-[#401E01] text-white hover:bg-[#2a1400] focus:ring-[#401E01] shadow-lg hover:shadow-xl border-2 border-transparent',
    outline: 'border-2 border-[#164020] text-[#164020] bg-transparent hover:bg-[#164020] hover:text-white focus:ring-[#164020]',
    outlineWhite: 'border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#164020] focus:ring-white',
    accent: 'bg-[#BF7534] text-white hover:bg-[#9e6028] focus:ring-[#BF7534] shadow-lg hover:shadow-xl border-2 border-transparent',
    ghost: 'text-[#401E01] bg-transparent hover:bg-[#164020]/10 focus:ring-[#164020]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  const MotionComponent = href ? motion.a : motion.button;

  return (
    <MotionComponent
      href={href}
      type={href ? undefined : type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' || size === 'xl' ? 24 : 20} />}
      {children}
    </MotionComponent>
  );
}

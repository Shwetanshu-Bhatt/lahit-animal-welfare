'use client';

export default function Container({
  children,
  className = '',
  size = 'lg',
}) {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-[1280px]',
    xl: 'max-w-[1440px]',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-5 sm:px-8 lg:px-10 ${sizes[size]} ${className}`}>
      {children}
    </div>
  );
}

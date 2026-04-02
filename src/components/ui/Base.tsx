import React from 'react';
import { cn } from '@/src/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

export const Card = ({ children, className, title, icon, subtitle }: CardProps) => (
  <div className={cn("milled-card p-6 flex flex-col justify-between", className)}>
    {(title || icon) && (
      <div className="flex justify-between items-start mb-4">
        <div>
          {title && <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">{title}</span>}
          {subtitle && <p className="text-zinc-400 text-[10px] mt-1 uppercase">{subtitle}</p>}
        </div>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
    )}
    {children}
  </div>
);

export const Button = ({ 
  children, 
  className, 
  variant = 'primary',
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'error' }) => {
  const variants = {
    primary: "bg-primary text-on-primary shadow-lg shadow-primary/10 hover:brightness-110",
    secondary: "bg-secondary text-white shadow-lg shadow-secondary/10",
    outline: "border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5",
    ghost: "text-zinc-500 hover:text-white hover:bg-white/5",
    error: "bg-error/10 text-error border border-error/20 hover:bg-error/20"
  };

  return (
    <button 
      className={cn(
        "px-6 py-3 rounded-md font-bold uppercase tracking-tight active:scale-95 transition-all flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

import React from 'react';

interface CountdownDisplayProps {
  value: number;
  label: string;
  variant?: 'primary' | 'secondary';
}

export const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ value, label, variant = 'primary' }) => {
  const formattedValue = value.toString().padStart(2, '0');
  
  const baseClasses = "flex flex-col items-center justify-center p-4 md:p-6 rounded-3xl backdrop-blur-sm transition-all duration-300 group";
  const variantClasses = variant === 'primary' 
    ? "bg-white/40 border border-white/60 shadow-sm hover:bg-white/60 hover:shadow-md hover:scale-105" 
    : "bg-slate-800/40 border border-slate-600/30 text-white";

  const textClasses = variant === 'primary' ? "text-slate-800 group-hover:text-indigo-600" : "text-white";
  const labelClasses = variant === 'primary' ? "text-slate-500 group-hover:text-indigo-400" : "text-slate-300";

  return (
    <div className={`${baseClasses} ${variantClasses}`}>
      <div className="relative">
        <span className={`text-5xl md:text-7xl font-black tracking-tighter font-sans ${textClasses} transition-colors`}>
          {formattedValue}
        </span>
        {/* Decorative blur behind number */}
        {variant === 'primary' && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-indigo-400/20 rounded-full blur-xl -z-10 group-hover:bg-indigo-500/30 transition-colors"></div>
        )}
      </div>
      <span className={`text-xs md:text-sm font-bold uppercase tracking-widest mt-2 ${labelClasses} transition-colors`}>
        {label}
      </span>
    </div>
  );
};
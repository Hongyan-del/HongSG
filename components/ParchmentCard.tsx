
import React, { useMemo } from 'react';

interface ParchmentCardProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  variant?: 'wealth' | 'career' | 'love' | 'bazi' | 'cycle' | 'consult' | 'default';
}

const ParchmentCard: React.FC<ParchmentCardProps> = ({ title, children, onClose, variant = 'default' }) => {
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 10}s`,
      size: `${2 + Math.random() * 4}px`,
    }));
  }, []);

  const renderBackground = () => {
    switch (variant) {
      case 'wealth':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
            <div className="absolute inset-0 bg-yellow-400/10 animate-pulse"></div>
            {particles.map(p => (
              <div 
                key={p.id}
                className="particle text-yellow-600"
                style={{
                  left: p.left,
                  width: p.size,
                  height: p.size,
                  animationDelay: p.delay,
                  '--duration': p.duration
                } as any}
              />
            ))}
          </div>
        );
      case 'love':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <div className="absolute -inset-[50%] bg-pink-300/20 animate-smoke rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-pink-900/10 rounded-full animate-ping"></div>
          </div>
        );
      case 'career':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <div className="absolute -inset-[30%] bg-slate-400/20 animate-smoke"></div>
            <div className="absolute inset-0 border-[40px] border-slate-900/5 pointer-events-none"></div>
          </div>
        );
      case 'consult':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
            <div className="absolute inset-0 bg-teal-900/10 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[80%] h-[80%] border-2 border-teal-800/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute w-[60%] h-[60%] border border-teal-800/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            </div>
          </div>
        );
      case 'bazi':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 flex items-center justify-center">
            <svg className="w-[150%] h-[150%] text-yellow-900 animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
               <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
               <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke="currentColor" strokeWidth="0.2" />
            </svg>
          </div>
        );
      case 'cycle':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
             <div className="absolute inset-0 bg-gradient-to-t from-stone-400/20 to-transparent animate-pulse"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl parchment shadow-2xl rounded-sm overflow-hidden chinese-border">
        {/* Animated Background Layer */}
        {renderBackground()}

        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yellow-800 pointer-events-none z-10"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-800 pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-800 pointer-events-none z-10"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yellow-800 pointer-events-none z-10"></div>

        <div className="relative p-8 md:p-12 overflow-y-auto max-h-[80vh] z-20">
          <h2 className="text-3xl font-black text-yellow-900 mb-6 text-center border-b-2 border-yellow-800 pb-2">
            {title}
          </h2>
          <div className="text-gray-900 leading-relaxed text-lg space-y-4">
            {children}
          </div>
          
          <div className="mt-10 text-center">
            <button 
              onClick={onClose}
              className="px-8 py-2 bg-yellow-900 text-yellow-100 hover:bg-yellow-800 transition-colors rounded-sm font-bold tracking-widest shadow-lg"
            >
              明白天機
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParchmentCard;

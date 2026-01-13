
import React from 'react';

export const HOURS = [
  '子時 (23:00-01:00)', '丑時 (01:00-03:00)', '寅時 (03:00-05:00)', 
  '卯時 (05:00-07:00)', '辰時 (07:00-09:00)', '巳時 (09:00-11:00)', 
  '午時 (11:00-13:00)', '未時 (13:00-15:00)', '申時 (15:00-17:00)', 
  '酉時 (17:00-19:00)', '戌時 (19:00-21:00)', '亥時 (21:00-23:00)', 
  '不詳'
];

export const YinYangIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 100 100" fill="currentColor">
    <path d="M50,10A40,40 0 1,1 50,90A40,40 0 1,1 50,10 M50,10A20,20 0 0,0 50,50A20,20 0 0,1 50,90A40,40 0 0,1 50,10" fill="white" />
    <path d="M50,10A40,40 0 0,1 50,90A20,20 0 0,1 50,50A20,20 0 0,0 50,10" fill="black" />
    <circle cx="50" cy="30" r="5" fill="black" />
    <circle cx="50" cy="70" r="5" fill="white" />
  </svg>
);

export const CloudPattern = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 40" fill="currentColor">
    <path d="M20,30 Q30,10 40,30 T60,30 T80,30" stroke="currentColor" fill="none" strokeWidth="2" />
  </svg>
);

export const KirinIcon = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 200 200" className="w-full h-full fill-none stroke-yellow-600/60" strokeWidth="1">
      {/* Abstract Kirin Symbol */}
      <path d="M100,40 Q130,10 160,40 T100,100 T40,160 T100,40" strokeDasharray="5 5" className="animate-[spin_20s_linear_infinite]" />
      <path d="M100,60 Q120,40 140,60 T100,110 T60,160 T100,60" className="animate-[pulse_4s_ease-in-out infinite]" />
      <circle cx="100" cy="100" r="10" fill="currentColor" className="text-yellow-500 opacity-50 animate-ping" />
      <path d="M50,100 L150,100 M100,50 L100,150" strokeWidth="0.5" stroke="currentColor" />
    </svg>
    <div className="absolute inset-0 bg-gradient-radial from-yellow-500/10 to-transparent animate-pulse" />
  </div>
);

export const TotemDragon = () => (
  <svg viewBox="0 0 100 100" className="w-32 h-32 opacity-10 absolute -right-4 -bottom-4 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700 pointer-events-none fill-yellow-600">
    <path d="M10,90 Q50,10 90,90 T50,50 T10,90" />
    <circle cx="50" cy="30" r="5" />
    <path d="M30,70 L70,70" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const TotemPhoenix = () => (
  <svg viewBox="0 0 100 100" className="w-32 h-32 opacity-10 absolute -right-4 -bottom-4 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700 pointer-events-none fill-pink-600">
    <path d="M50,10 Q10,50 50,90 Q90,50 50,10" />
    <path d="M30,30 L70,70 M70,30 L30,70" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const TotemTiger = () => (
  <svg viewBox="0 0 100 100" className="w-32 h-32 opacity-10 absolute -right-4 -bottom-4 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700 pointer-events-none fill-stone-400">
    <rect x="20" y="20" width="60" height="60" rx="10" stroke="currentColor" fill="none" />
    <path d="M30,30 L70,70 M30,70 L70,30" />
  </svg>
);

export const TotemTortoise = () => (
  <svg viewBox="0 0 100 100" className="w-32 h-32 opacity-10 absolute -right-4 -bottom-4 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700 pointer-events-none fill-teal-600">
    <path d="M20,50 A30,30 0 1,1 80,50 A30,30 0 1,1 20,50" stroke="currentColor" fill="none" />
    <path d="M20,50 L80,50 M50,20 L50,80" stroke="currentColor" strokeWidth="0.5" />
  </svg>
);

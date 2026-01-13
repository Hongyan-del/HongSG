
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

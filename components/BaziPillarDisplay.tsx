
import React from 'react';
import { BaziData } from '../types';

const BaziPillarDisplay: React.FC<{ data: BaziData }> = ({ data }) => {
  const pillars = [
    { label: '時柱', val: data.hour },
    { label: '日柱', val: data.day },
    { label: '月柱', val: data.month },
    { label: '年柱', val: data.year },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 text-center mb-8">
      {pillars.map((p, i) => (
        <div key={i} className="flex flex-col items-center group">
          <span className="text-xs font-black text-yellow-800 mb-3 tracking-widest opacity-60 group-hover:opacity-100 transition-opacity uppercase">{p.label}</span>
          <div className="relative w-full group">
            {/* Decorative Corner Borders */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-yellow-600/40"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-yellow-600/40"></div>
            
            <div className="bg-gradient-to-b from-stone-900 to-stone-950 p-6 rounded-sm border border-yellow-900/30 w-full shadow-2xl transition-transform duration-500 group-hover:-translate-y-1">
              <div className="text-4xl font-black text-yellow-600 mb-2 drop-shadow-md">{p.val.heavenlyStem}</div>
              <div className="text-4xl font-black text-yellow-600 drop-shadow-md">{p.val.earthlyBranch}</div>
              <div className="mt-4 pt-3 border-t border-yellow-900/20">
                <span className="text-[10px] font-bold text-yellow-800 tracking-[0.3em] uppercase">{p.val.element}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BaziPillarDisplay;

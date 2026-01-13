
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
    <div className="grid grid-cols-4 gap-4 text-center mb-8">
      {pillars.map((p, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="text-sm text-yellow-800 mb-1 opacity-70">{p.label}</span>
          <div className="bg-yellow-950/20 p-3 rounded-lg border border-yellow-800/30 w-full">
            <div className="text-3xl font-bold text-yellow-900 mb-1">{p.val.heavenlyStem}</div>
            <div className="text-3xl font-bold text-yellow-900">{p.val.earthlyBranch}</div>
            <div className="text-xs mt-2 text-yellow-700">{p.val.element}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BaziPillarDisplay;

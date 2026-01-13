
import React, { useState } from 'react';
import { BaziData, BaziPillar } from '../types';
import { STEMS_DATA, TEN_GODS_DETAILED_DATA, CHANGSHENG_DESCRIPTIONS, SHEN_SHA_DESCRIPTIONS } from '../constants';
import ParchmentCard from './ParchmentCard';

interface PillarWithInsight extends BaziPillar {
  label: string;
}

const BaziPillarDisplay: React.FC<{ data: BaziData }> = ({ data }) => {
  const [selectedTG, setSelectedTG] = useState<{ name: string, label: string } | null>(null);
  const [selectedShenSha, setSelectedShenSha] = useState<{ name: string, type: 'changsheng' | 'shensha' } | null>(null);

  const pillars = [
    { label: '時柱', val: data.hour },
    { label: '日柱', val: data.day },
    { label: '月柱', val: data.month },
    { label: '年柱', val: data.year },
  ];

  const getElemColor = (el: string) => {
    switch (el) {
      case '金': return 'text-slate-300';
      case '木': return 'text-emerald-500';
      case '水': return 'text-blue-500';
      case '火': return 'text-rose-500';
      case '土': return 'text-amber-700';
      default: return 'text-stone-500';
    }
  };

  const handleTGClick = (tg: string, label: string) => {
    if (tg === "日主") return;
    setSelectedTG({ name: tg, label });
  };

  const dmElement = STEMS_DATA[data.dayMaster as keyof typeof STEMS_DATA].element;
  const tgData = selectedTG ? TEN_GODS_DETAILED_DATA[selectedTG.name] : null;

  return (
    <>
      <div className="grid grid-cols-4 gap-4 text-center">
        {pillars.map((p, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-[10px] font-black text-yellow-800 mb-2 tracking-widest opacity-60">{p.label}</span>
            <div className={`w-full bg-stone-950/80 p-4 rounded-sm border transition-all ${p.label === '日柱' ? 'border-yellow-600' : 'border-stone-800'}`}>
              <button 
                onClick={() => handleTGClick(p.val.tenGod, p.label)}
                className={`text-[10px] mb-1 h-4 transition-colors ${p.val.tenGod === '日主' ? 'text-yellow-700' : 'text-yellow-500 hover:text-yellow-300 cursor-help underline decoration-dotted'}`}
              >
                {p.val.tenGod}
              </button>
              <div className={`text-4xl font-black ${getElemColor(p.val.element)}`}>{p.val.heavenlyStem}</div>
              <div className={`text-4xl font-black text-stone-400`}>{p.val.earthlyBranch}</div>
              
              <div className="mt-3 flex flex-col gap-1 border-t border-stone-800 pt-2 min-h-[40px]">
                <button 
                  onClick={() => setSelectedShenSha({ name: p.val.changsheng, type: 'changsheng' })}
                  className="text-[10px] text-teal-700 font-bold hover:text-teal-400 cursor-help"
                >
                  {p.val.changsheng}
                </button>
                {p.val.perPillarShenSha && p.val.perPillarShenSha.map(ss => (
                  <button 
                    key={ss}
                    onClick={() => setSelectedShenSha({ name: ss, type: 'shensha' })}
                    className="text-[9px] text-yellow-600 font-bold hover:text-yellow-400 cursor-help leading-tight"
                  >
                    ✦ {ss}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTG && tgData && (
        <ParchmentCard 
          title={`${selectedTG.label}感應：${selectedTG.name}`}
          variant="bazi"
          onClose={() => setSelectedTG(null)}
        >
          <div className="space-y-4">
             <div className="bg-yellow-900/10 p-4 border-l-4 border-yellow-800">
               <span className="block text-xs text-yellow-900 font-bold uppercase mb-1">核心特質</span>
               <p className="text-gray-900 font-bold">{tgData.trait}</p>
             </div>
             <div>
               <span className="block text-xs text-yellow-900 font-bold uppercase mb-1">行為模式</span>
               <p className="text-gray-800 text-base leading-relaxed">{tgData.behavior}</p>
             </div>
             <div className="pt-4 border-t border-yellow-800/10">
               <span className="block text-xs text-yellow-900 font-bold uppercase mb-1">{data.dayMaster}命之五行化感應</span>
               <p className="text-gray-800 italic">{tgData.elementNuance[dmElement]}</p>
             </div>
          </div>
        </ParchmentCard>
      )}

      {selectedShenSha && (
        <ParchmentCard
          title={selectedShenSha.type === 'changsheng' ? `能量狀態：${selectedShenSha.name}` : `神煞感應：${selectedShenSha.name}`}
          variant="consult"
          onClose={() => setSelectedShenSha(null)}
        >
          <div className="space-y-4">
             <div className="bg-teal-900/5 p-4 border-l-4 border-teal-800">
                <p className="text-gray-900 text-lg leading-relaxed">
                  {selectedShenSha.type === 'changsheng' 
                    ? CHANGSHENG_DESCRIPTIONS[selectedShenSha.name] 
                    : SHEN_SHA_DESCRIPTIONS[selectedShenSha.name]
                  }
                </p>
             </div>
             <p className="text-stone-600 text-sm italic">
               ※ 這是您命盤中特定時空座標所激發的能量共振。
             </p>
          </div>
        </ParchmentCard>
      )}
    </>
  );
};

export default BaziPillarDisplay;

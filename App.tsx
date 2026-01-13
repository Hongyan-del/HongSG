
import React, { useState } from 'react';
import { AppState, BirthInfo, FateReport, ZWDSPalaceInsight } from './types';
import { HOURS, CloudPattern, KirinIcon, TotemDragon, TotemPhoenix, TotemTiger, TotemTortoise, PALACES_DATA, ZWDS_STARS_DATA } from './constants';
import { calculateBazi } from './services/baziEngine';
import ParchmentCard from './components/ParchmentCard';
import BaziPillarDisplay from './components/BaziPillarDisplay';
import EnergyRadar from './components/EnergyRadar';

const SealIcon = () => (
  <div className="w-12 h-12 border-2 border-red-900 rounded-sm flex items-center justify-center relative bg-red-900/10">
    <span className="text-red-900 font-black text-xl leading-none" style={{ writingMode: 'vertical-rl' }}>真理</span>
    <div className="absolute inset-0 border border-red-900/30 m-0.5"></div>
  </div>
);

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [info, setInfo] = useState<BirthInfo>({
    name: '', birthYear: 1995, birthMonth: 1, birthDay: 1, birthHour: HOURS[0]
  });
  const [report, setReport] = useState<FateReport | null>(null);
  const [activeView, setActiveView] = useState<string | null>(null);
  const [selectedZiweiPalace, setSelectedZiweiPalace] = useState<ZWDSPalaceInsight | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!info.name) return;
    try {
      const data = calculateBazi(info);
      setReport(data);
      setState(AppState.RESULT);
    } catch (error) {
      console.error("Calculation Error:", error);
      alert("計算過程中發生錯誤，請檢查輸入數據。");
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    const [y, m, d] = val.split('-').map(Number);
    setInfo(prev => ({ ...prev, birthYear: y, birthMonth: m, birthDay: d }));
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-serif selection:bg-yellow-900 selection:text-white pb-20">
      <header className="py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-center items-center">
          <KirinIcon className="w-96 h-96 blur-sm" />
        </div>
        <h1 className="text-5xl font-black tracking-[0.2em] text-yellow-600 mb-2 relative z-10 drop-shadow-lg">
          玄機天啟
        </h1>
        <p className="text-stone-500 italic tracking-[0.4em] text-sm relative z-10">客觀原型 · 生活啟示 · 心理覺察</p>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        {state === AppState.IDLE ? (
          <div className="bg-stone-900/40 border border-yellow-900/20 p-8 rounded-sm shadow-2xl backdrop-blur-md fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs text-yellow-800 uppercase tracking-widest font-bold">求問者姓名</label>
                  <input
                    type="text" required placeholder="例如：林語堂"
                    className="w-full bg-transparent border-b border-yellow-900/30 p-3 text-lg focus:outline-none focus:border-yellow-600 transition-all"
                    value={info.name} onChange={e => setInfo({ ...info, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-yellow-800 uppercase tracking-widest font-bold">出生年月日</label>
                  <input
                    type="date" required
                    className="w-full bg-transparent border-b border-yellow-900/30 p-3 text-lg focus:outline-none focus:border-yellow-600 transition-all"
                    value={`${info.birthYear}-${String(info.birthMonth).padStart(2, '0')}-${String(info.birthDay).padStart(2, '0')}`}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-yellow-800 uppercase tracking-widest font-bold">出生時辰</label>
                <select
                  className="w-full bg-stone-900/80 border border-yellow-900/20 p-3 rounded-sm focus:outline-none"
                  value={info.birthHour} onChange={e => setInfo({ ...info, birthHour: e.target.value })}
                >
                  {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-950 to-yellow-900 text-yellow-100 font-bold py-4 rounded-sm transition-all tracking-[0.5em] shadow-xl hover:brightness-110"
              >
                解構命運矩陣
              </button>
            </form>
          </div>
        ) : report && (
          <div className="space-y-10 fade-in">
            {/* 排盤大區塊 */}
            <section className="bg-stone-900/60 p-8 border border-yellow-900/30 rounded-sm shadow-2xl relative">
              <div className="flex justify-center mb-8"><CloudPattern className="w-24 text-yellow-900 opacity-50" /></div>
              <BaziPillarDisplay data={report.bazi} />
              
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-yellow-900/10 pt-8">
                <div className="flex flex-col items-center">
                  <EnergyRadar balance={report.bazi.elementsBalance} />
                  <p className="text-[10px] text-stone-600 mt-2 italic">※ 懸停於五行標籤可查看能量細項</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-yellow-600 font-bold mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-yellow-600"></span> 本命原型 (八字)
                    </h4>
                    <div className="mb-4 bg-yellow-950/20 border border-yellow-600/30 p-3 rounded-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{report.baziStructure.icon}</span>
                        <span className="text-lg font-black text-yellow-500 tracking-widest">{report.baziStructure.name}</span>
                      </div>
                      <p className="text-[11px] text-stone-400 italic">{report.baziStructure.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {report.characterTags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-yellow-900/30 border border-yellow-900/50 text-yellow-500 text-xs font-bold rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-stone-950/40 p-4 border border-yellow-900/10 rounded-sm">
                    <div className="text-[10px] text-yellow-700 uppercase tracking-widest mb-1">主格氣象</div>
                    <p className="text-sm text-stone-300 leading-relaxed italic line-clamp-3">{report.personality}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 紫微全星系藍圖 */}
            <section className="bg-stone-900/40 p-8 border border-yellow-900/20 rounded-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <KirinIcon className="w-48 h-48" />
               </div>
               <div className="flex justify-between items-end mb-8 border-b border-yellow-900/20 pb-4">
                  <h3 className="text-xl font-bold text-yellow-600 flex items-center gap-2 italic">
                    ☯ 紫微靈魂藍圖 (Soul Blueprint)
                  </h3>
                  <span className="text-[10px] text-stone-500 tracking-[0.2em]">全宮位深度感應 · 點擊卡片詳讀</span>
               </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {report.zwdsInsight.map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedZiweiPalace(item)}
                    className="bg-stone-950/40 p-4 border border-yellow-900/10 rounded-sm hover:border-yellow-600/50 transition-all group flex flex-col text-left relative overflow-hidden"
                  >
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[8px] text-yellow-600 font-bold uppercase tracking-widest">Detail →</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="px-2 py-0.5 bg-yellow-900/20 text-yellow-600 text-[10px] font-bold tracking-widest rounded-sm">{item.palace}</div>
                    </div>
                    
                    <div className="text-center py-2 border-y border-stone-900 mb-3 bg-stone-900/10">
                       <div className={`text-base md:text-lg font-black tracking-tight ${item.star.includes('化忌') ? 'text-stone-500' : item.star.includes('化祿') ? 'text-yellow-500' : 'text-stone-200'}`}>
                         {item.star}
                       </div>
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] text-stone-400 leading-relaxed italic line-clamp-2 md:line-clamp-3">
                        {item.trait.split('\n')[1] || item.trait}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-900/50 flex justify-between items-center">
                      <span className="text-[9px] text-stone-600 font-bold">{item.function.split('、')[0]}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-900 group-hover:bg-yellow-600 transition-colors"></div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* 跨系統合成：生活策略與修煉 */}
            <section className="bg-stone-900/40 p-8 border border-teal-900/20 rounded-sm">
              <h3 className="text-xl font-bold text-teal-600 mb-8 flex items-center gap-2 italic underline decoration-teal-900/30 underline-offset-8">
                ☯ 跨系統合成：生活策略與修煉
              </h3>
              
              <div className="relative mb-12 animate-wisdom">
                <div className="bg-stone-950/60 p-10 border border-yellow-900/20 relative overflow-hidden group">
                  <div className="absolute top-4 right-4 opacity-40">
                    <SealIcon />
                  </div>
                  <div className="max-w-2xl">
                    <div className="mb-4">
                       <span className="text-yellow-900 text-6xl font-serif absolute -left-2 top-4 opacity-30">「</span>
                       <p className="text-2xl text-stone-100 leading-relaxed font-bold tracking-wide shimmer-text relative z-10 pl-6">
                        {report.wisdomQuote.text}
                       </p>
                       <span className="text-yellow-900 text-6xl font-serif absolute -right-2 bottom-4 opacity-30">「</span>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-8">
                      <div className="h-[1px] w-12 bg-yellow-900/40"></div>
                      <div className="text-right">
                        <span className="text-yellow-600 font-black tracking-widest block">{report.wisdomQuote.author}</span>
                        <span className="text-stone-500 text-sm italic">{report.wisdomQuote.source}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: 'fortune', title: '格局應用 (Synthesis)', content: "深度分析命盤核心組合在當前時空下的動態應用策略。", color: 'text-yellow-500', totem: <TotemDragon /> },
                  { id: 'wealth', title: '資源掌控 (Wealth)', content: "揭示您的獲利頻率與金錢心理邊界。", color: 'text-amber-600', totem: <TotemTiger /> },
                  { id: 'career', title: '職場位能 (Career)', content: "分析工作行為模式與權威體系的交互引導。", color: 'text-indigo-400', totem: <TotemPhoenix /> },
                  { id: 'cycle', title: '生命指引 (Guidance)', content: "融合雙系統數據的終極平衡建議與修煉指南。", color: 'text-teal-500', totem: <TotemTortoise /> }
                ].map(card => (
                  <button
                    key={card.id}
                    onClick={() => setActiveView(card.id)}
                    className="p-8 bg-stone-900/50 border border-yellow-900/10 hover:border-yellow-600/50 transition-all text-left group relative overflow-hidden shadow-sm hover:shadow-yellow-900/10"
                  >
                    <h4 className={`text-lg font-bold mb-3 tracking-widest ${card.color}`}>{card.title}</h4>
                    <p className="text-stone-400 text-xs leading-relaxed">{card.content}</p>
                    {card.totem}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-yellow-900 font-bold">點擊詳讀</div>
                  </button>
                ))}
              </div>
            </section>

            <div className="text-center py-10">
              <button 
                onClick={() => setState(AppState.IDLE)}
                className="text-stone-600 hover:text-yellow-600 transition-all tracking-[0.4em] text-xs font-bold border-b border-transparent hover:border-yellow-900 pb-1"
              >
                ← 重新起盤 · 定心養氣
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 跨系統深度解析 Modal */}
      {activeView && report && (
        <ParchmentCard 
          title={
            activeView === 'fortune' ? '格局應用策略' :
            activeView === 'wealth' ? '心理覺察與資源掌控' : 
            activeView === 'career' ? '職場位能與競爭引導' : '生命修煉指引'
          } 
          variant={activeView as any} 
          onClose={() => setActiveView(null)}
        >
          <div className="p-2">
            <div className="text-gray-900 text-lg leading-loose font-medium whitespace-pre-line">
              {
                activeView === 'fortune' ? report.overallFortune :
                activeView === 'wealth' ? report.wealthLuck :
                activeView === 'career' ? report.careerLuck : report.healthAdvice
              }
            </div>
            <div className="mt-8 pt-6 border-t border-yellow-800/20 text-center text-yellow-900/50 text-sm italic">
              — 玄機天啟 · 智慧合成 —
            </div>
          </div>
        </ParchmentCard>
      )}

      {/* 紫微宮位詳細解析 Modal */}
      {selectedZiweiPalace && (
        <ParchmentCard 
          title={`${selectedZiweiPalace.palace}：${selectedZiweiPalace.star}`}
          variant="consult"
          onClose={() => setSelectedZiweiPalace(null)}
        >
          <div className="p-2">
            <div className="text-gray-900 text-lg leading-loose font-medium whitespace-pre-line">
              {selectedZiweiPalace.trait}
            </div>
            <div className="mt-8 pt-6 border-t border-yellow-800/20 text-center text-yellow-900/50 text-sm italic">
              — 靈魂藍圖 · 宮位深度啟示 —
            </div>
          </div>
        </ParchmentCard>
      )}
    </div>
  );
};

export default App;

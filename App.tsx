
import React, { useState, useEffect } from 'react';
import { AppState, BirthInfo, FateReport } from './types';
import { HOURS, YinYangIcon, CloudPattern, KirinIcon, TotemDragon, TotemPhoenix, TotemTiger, TotemTortoise } from './constants';
import { getFateInterpretation, askFollowUpQuestion } from './services/geminiService';
import ParchmentCard from './components/ParchmentCard';
import BaziPillarDisplay from './components/BaziPillarDisplay';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [info, setInfo] = useState<BirthInfo>({
    name: '',
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: '子時 (23:00-01:00)'
  });
  const [report, setReport] = useState<FateReport | null>(null);
  const [activeView, setActiveView] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [consultationResult, setConsultationResult] = useState<string | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setHasApiKey(false);
      console.error('未偵測到 API_KEY 環境變數。');
    }
  }, []);

  const dateValue = `${info.birthYear}-${String(info.birthMonth).padStart(2, '0')}-${String(info.birthDay).padStart(2, '0')}`;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    const [y, m, d] = val.split('-').map(Number);
    setInfo(prev => ({ ...prev, birthYear: y, birthMonth: m, birthDay: d }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!info.name) return;
    
    setState(AppState.LOADING);
    try {
      const data = await getFateInterpretation(info);
      setReport(data);
      setState(AppState.RESULT);
    } catch (error) {
      console.error(error);
      alert('天機難測，請稍後再試。');
      setState(AppState.IDLE);
    }
  };

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !report) return;

    setIsConsulting(true);
    try {
      const result = await askFollowUpQuestion(info, report, question);
      setConsultationResult(result);
      setActiveView('consultation');
    } catch (error) {
      console.error(error);
      alert('神靈正在休憩，請稍後再問。');
    } finally {
      setIsConsulting(false);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="bg-stone-800 p-8 rounded-lg border border-yellow-900/50 text-center max-w-md">
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">天機未連</h1>
          <p className="text-stone-300">系統偵測到未配置 API 金鑰。請在環境變數中設定 API_KEY。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-serif selection:bg-yellow-900 selection:text-white">
      {/* Header */}
      <header className="py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <KirinIcon className="w-96 h-96 mx-auto -mt-20 opacity-40 blur-sm" />
        </div>
        <h1 className="text-6xl font-black tracking-[0.3em] text-yellow-600 mb-4 relative z-10 drop-shadow-2xl">
          玄機神算
        </h1>
        <div className="flex justify-center items-center gap-4 relative z-10">
          <span className="w-12 h-px bg-yellow-900"></span>
          <p className="text-stone-500 italic tracking-[0.5em] text-sm">窺探天命 洞察玄機</p>
          <span className="w-12 h-px bg-yellow-900"></span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        {state === AppState.IDLE && (
          <div className="bg-stone-900/40 border border-yellow-900/20 p-10 rounded-sm shadow-2xl backdrop-blur-md relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-900/5 rounded-full blur-3xl group-hover:bg-yellow-900/10 transition-all duration-1000"></div>
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs text-yellow-800 uppercase tracking-widest font-bold">求問者姓名</label>
                  <input
                    type="text"
                    required
                    placeholder="輸入姓名"
                    className="w-full bg-transparent border-b-2 border-yellow-900/30 p-4 text-xl focus:outline-none focus:border-yellow-600 transition-all placeholder:text-stone-800"
                    value={info.name}
                    onChange={e => setInfo({ ...info, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-yellow-800 uppercase tracking-widest font-bold">國曆出生日期</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-transparent border-b-2 border-yellow-900/30 p-4 text-xl focus:outline-none focus:border-yellow-600 transition-all color-scheme-dark"
                    value={dateValue}
                    onChange={handleDateChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-yellow-800 uppercase tracking-widest font-bold">出生時辰</label>
                <select
                  className="w-full bg-stone-900/80 border-2 border-yellow-900/20 p-4 rounded-sm focus:outline-none focus:border-yellow-600 appearance-none cursor-pointer hover:bg-stone-800 transition-colors"
                  value={info.birthHour}
                  onChange={e => setInfo({ ...info, birthHour: e.target.value })}
                >
                  {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-950 via-yellow-900 to-yellow-950 hover:from-yellow-900 hover:to-yellow-800 text-yellow-100 font-black py-5 rounded-sm transition-all tracking-[1em] shadow-2xl transform active:scale-[0.98] border border-yellow-700/30"
              >
                啟動天機
              </button>
            </form>
          </div>
        )}

        {state === AppState.LOADING && (
          <div className="text-center py-24 space-y-12">
             <div className="relative inline-block">
               <KirinIcon className="w-48 h-48 animate-[pulse_2s_infinite]" />
               <div className="absolute inset-0 border-4 border-yellow-900/20 rounded-full animate-[spin_10s_linear_infinite] border-t-yellow-600"></div>
             </div>
             <div className="space-y-4">
                <p className="text-2xl text-yellow-600 tracking-[0.4em] font-bold">正與星辰共鳴</p>
                <p className="text-stone-500 italic animate-pulse">大師正在撥雲見日，請稍候...</p>
             </div>
          </div>
        )}

        {state === AppState.RESULT && report && (
          <div className="space-y-12 animate-fade-in">
            {/* Main Bazi Section */}
            <section className="bg-stone-900/60 p-10 border border-yellow-900/30 rounded-sm shadow-2xl relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent"></div>
              <div className="absolute bottom-4 right-4 text-[10px] text-stone-700 font-mono tracking-tighter opacity-50">
                LUNAR_SYNC_V1.0
              </div>
              
              <h3 className="text-3xl font-black text-yellow-600 mb-10 text-center flex items-center justify-center gap-6">
                <CloudPattern className="w-12 h-6 text-yellow-900" />
                先天命理四柱
                <CloudPattern className="w-12 h-6 text-yellow-900 flip-x" />
              </h3>
              
              <BaziPillarDisplay data={report.bazi} />
              
              <div className="mt-12 p-8 bg-stone-950/40 border-l-4 border-yellow-600 italic text-stone-300 leading-loose text-lg">
                <span className="text-yellow-600 font-bold block mb-2 not-italic text-sm tracking-widest">● 大師總結</span>
                {report.overallFortune}
              </div>
            </section>

            {/* Feature Cards with Totem Hovers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { id: 'wealth', title: '財帛福祿', content: report.wealthLuck, color: 'text-yellow-600', totem: <TotemDragon /> },
                { id: 'career', title: '官祿事業', content: report.careerLuck, color: 'text-indigo-400', totem: <TotemTiger /> },
                { id: 'love', title: '紅鸞情緣', content: report.loveLuck, color: 'text-pink-500', totem: <TotemPhoenix /> },
                { id: 'cycle', title: '當前大運', content: report.currentCycle, color: 'text-teal-500', totem: <TotemTortoise /> }
              ].map(card => (
                <button
                  key={card.id}
                  onClick={() => setActiveView(card.id)}
                  className="p-10 bg-stone-900/40 border border-yellow-900/10 hover:border-yellow-600/50 transition-all text-left group relative overflow-hidden shadow-lg hover:shadow-yellow-900/20"
                >
                  <div className="relative z-10">
                    <h4 className={`text-2xl font-black mb-4 tracking-widest ${card.color}`}>{card.title}</h4>
                    <p className="text-stone-400 line-clamp-3 text-sm leading-relaxed">{card.content}</p>
                    <div className="mt-6 flex items-center gap-2 text-[10px] text-yellow-800 font-bold tracking-[0.2em] group-hover:text-yellow-500 transition-colors uppercase">
                      <span>探索天機</span>
                      <span className="w-8 h-px bg-yellow-900 group-hover:bg-yellow-500 transition-all group-hover:w-12"></span>
                    </div>
                  </div>
                  {card.totem}
                </button>
              ))}
            </div>

            {/* Consultation Form */}
            <section className="mt-16 bg-stone-900/80 p-10 border border-yellow-900/20 shadow-inner relative">
              <h3 className="text-2xl font-black text-yellow-700 mb-6 flex items-center gap-4">
                <YinYangIcon />
                大師親自解惑
              </h3>
              <form onSubmit={handleConsult} className="relative">
                <input
                  type="text"
                  placeholder="請在此處恭敬提問..."
                  className="w-full bg-stone-950 border border-yellow-900/30 p-5 pr-32 text-stone-200 focus:outline-none focus:border-yellow-600 transition-all rounded-sm shadow-inner"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                />
                <button
                  disabled={isConsulting}
                  className="absolute right-2 top-2 bottom-2 px-8 bg-yellow-900 hover:bg-yellow-800 text-white font-black tracking-widest disabled:opacity-50 transition-all rounded-sm shadow-lg"
                >
                  {isConsulting ? '溝通中' : '啟問'}
                </button>
              </form>
            </section>
            
            <div className="text-center py-16">
              <button 
                onClick={() => setState(AppState.IDLE)}
                className="text-stone-700 hover:text-yellow-600 transition-all tracking-[0.4em] text-xs font-bold uppercase border-b border-transparent hover:border-yellow-600 pb-1"
              >
                ← 重新起盤
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Overlays */}
      {activeView && report && activeView !== 'consultation' && (
        <ParchmentCard 
          title={
            activeView === 'wealth' ? '財帛福祿' : 
            activeView === 'career' ? '官祿事業' : 
            activeView === 'love' ? '紅鸞情緣' : '當前大運'
          } 
          variant={activeView as any} 
          onClose={() => setActiveView(null)}
        >
          <div className="p-4 bg-stone-50/50 rounded-sm shadow-inner">
            <p className="text-gray-900 leading-loose">{
              activeView === 'wealth' ? report.wealthLuck :
              activeView === 'career' ? report.careerLuck :
              activeView === 'love' ? report.loveLuck : report.currentCycle
            }</p>
          </div>
          {activeView === 'wealth' && (
            <div className="mt-8 border-t-2 border-yellow-800/20 pt-6">
              <h5 className="font-black text-yellow-950 mb-4 tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-800 rounded-full"></span>
                趨吉避凶引路：
              </h5>
              <div className="p-6 bg-yellow-800/5 border-l-4 border-yellow-800 text-stone-800 italic text-lg shadow-sm">
                「{report.palaces.find(p => p.name.includes('財'))?.fortuneAdvice || '財源穩健，守成待時，忌急功近利。'}」
              </div>
            </div>
          )}
        </ParchmentCard>
      )}

      {activeView === 'consultation' && consultationResult && (
        <ParchmentCard title="大師親批" variant="consult" onClose={() => { setActiveView(null); setConsultationResult(null); }}>
          <div className="whitespace-pre-wrap leading-loose first-letter:text-4xl first-letter:font-black first-letter:text-yellow-900 first-letter:float-left first-letter:mr-3">
            {consultationResult}
          </div>
        </ParchmentCard>
      )}
    </div>
  );
};

export default App;

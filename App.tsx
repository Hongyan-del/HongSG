
import React, { useState, useCallback } from 'react';
import { AppState, BirthInfo, FateReport } from './types';
import { HOURS, YinYangIcon, CloudPattern } from './constants';
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

  // Helper to format state into YYYY-MM-DD for the date input
  const dateValue = `${info.birthYear}-${String(info.birthMonth).padStart(2, '0')}-${String(info.birthDay).padStart(2, '0')}`;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // YYYY-MM-DD
    if (!val) return;
    const [y, m, d] = val.split('-').map(Number);
    setInfo(prev => ({
      ...prev,
      birthYear: y,
      birthMonth: m,
      birthDay: d
    }));
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

  const renderInputForm = () => (
    <div className="max-w-xl mx-auto mt-20 p-8 chinese-border bg-stone-900/40 backdrop-blur-md shadow-2xl relative">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 float">
        <YinYangIcon />
      </div>
      
      <h1 className="text-4xl font-black text-center mb-10 text-yellow-600 tracking-[1em] mt-8">
        探源
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-yellow-700/80 mb-1">姓名</label>
          <input 
            type="text" 
            placeholder="請輸入大名"
            className="w-full bg-transparent border-b-2 border-yellow-800/50 focus:border-yellow-600 outline-none p-2 text-xl text-yellow-100 placeholder:text-yellow-900/50"
            value={info.name}
            onChange={e => setInfo({...info, name: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-yellow-700/80 mb-1">出生日期 (國曆)</label>
          <div className="relative">
            <input 
              type="date" 
              className="w-full bg-stone-900 border border-yellow-800/30 rounded p-3 text-yellow-100 focus:border-yellow-600 outline-none transition-colors [color-scheme:dark]"
              value={dateValue}
              onChange={handleDateChange}
              min="1900-01-01"
              max="2050-12-31"
              required
            />
          </div>
          <p className="mt-1 text-xs text-yellow-900/60">點擊選框以開啟萬年曆選取日期</p>
        </div>

        <div>
          <label className="block text-sm text-yellow-700/80 mb-1">出生時辰</label>
          <select 
            className="w-full bg-stone-900 border border-yellow-800/30 rounded p-3 text-yellow-100 appearance-none focus:border-yellow-600 outline-none transition-colors"
            value={info.birthHour}
            onChange={e => setInfo({...info, birthHour: e.target.value})}
          >
            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        <button 
          type="submit"
          className="w-full py-4 mt-8 bg-yellow-800 hover:bg-yellow-700 text-stone-900 font-black text-xl tracking-[0.5em] transition-all rounded shadow-lg"
        >
          開啟命盤
        </button>
      </form>
      
      <div className="mt-8 flex justify-center opacity-30">
        <CloudPattern className="w-24 h-8" />
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-yellow-800 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <YinYangIcon />
        </div>
      </div>
      <p className="text-2xl text-yellow-600 animate-pulse tracking-widest font-black">
        正在撥開命運的迷霧...
      </p>
      <div className="flex space-x-2 text-yellow-900/60 text-sm">
        <span>推演星盤</span>
        <span>•</span>
        <span>解析八字</span>
        <span>•</span>
        <span>預測天機</span>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!report) return null;
    
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-12 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-yellow-700 text-lg mb-2">天啟之音</h2>
          <h1 className="text-5xl font-black text-yellow-500 tracking-[0.5em] mb-4">
            {info.name} 的命格總覽
          </h1>
          <div className="h-1 w-32 bg-yellow-800 mx-auto"></div>
        </div>

        {/* Central Dashboard - Mysterious Interactive Menu */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative">
          
          <button 
            onClick={() => setActiveView('bazi')}
            className="group relative h-48 bg-stone-900 border border-yellow-800/40 rounded-lg flex flex-col items-center justify-center overflow-hidden hover:border-yellow-600 transition-all shadow-lg hover:shadow-yellow-900/20"
          >
            <div className="absolute inset-0 bg-yellow-900/5 group-hover:bg-yellow-900/10 transition-colors"></div>
            <span className="text-yellow-600 text-3xl mb-2">四柱</span>
            <span className="text-yellow-800 text-sm tracking-widest">八字格局</span>
          </button>

          <button 
             onClick={() => setActiveView('palaces')}
             className="group relative h-48 bg-stone-900 border border-yellow-800/40 rounded-lg flex flex-col items-center justify-center overflow-hidden hover:border-yellow-600 transition-all shadow-lg hover:shadow-yellow-900/20"
          >
            <div className="absolute inset-0 bg-yellow-900/5 group-hover:bg-yellow-900/10 transition-colors"></div>
            <span className="text-yellow-600 text-3xl mb-2">命宮</span>
            <span className="text-yellow-800 text-sm tracking-widest">紫微斗數</span>
          </button>

          <button 
             onClick={() => setActiveView('wealth')}
             className="group relative h-48 bg-stone-900 border border-yellow-800/40 rounded-lg flex flex-col items-center justify-center overflow-hidden hover:border-yellow-600 transition-all shadow-lg hover:shadow-yellow-900/20"
          >
            <div className="absolute inset-0 bg-yellow-900/5 group-hover:bg-yellow-900/10 transition-colors"></div>
            <span className="text-yellow-600 text-3xl mb-2">財帛</span>
            <span className="text-yellow-800 text-sm tracking-widest">財富機緣</span>
          </button>

          <button 
             onClick={() => setActiveView('career')}
             className="group relative h-48 bg-stone-900 border border-yellow-800/40 rounded-lg flex flex-col items-center justify-center overflow-hidden hover:border-yellow-600 transition-all shadow-lg hover:shadow-yellow-900/20"
          >
            <div className="absolute inset-0 bg-yellow-900/5 group-hover:bg-yellow-900/10 transition-colors"></div>
            <span className="text-yellow-600 text-3xl mb-2">官祿</span>
            <span className="text-yellow-800 text-sm tracking-widest">事業造化</span>
          </button>

          <button 
             onClick={() => setActiveView('love')}
             className="group relative h-48 bg-stone-900 border border-yellow-800/40 rounded-lg flex flex-col items-center justify-center overflow-hidden hover:border-yellow-600 transition-all shadow-lg hover:shadow-yellow-900/20"
          >
            <div className="absolute inset-0 bg-yellow-900/5 group-hover:bg-yellow-900/10 transition-colors"></div>
            <span className="text-yellow-600 text-3xl mb-2">夫妻</span>
            <span className="text-yellow-800 text-sm tracking-widest">情感歸宿</span>
          </button>

          <button 
             onClick={() => setActiveView('cycle')}
             className="group relative h-48 bg-stone-900 border border-yellow-800/40 rounded-lg flex flex-col items-center justify-center overflow-hidden hover:border-yellow-600 transition-all shadow-lg hover:shadow-yellow-900/20"
          >
            <div className="absolute inset-0 bg-yellow-900/5 group-hover:bg-yellow-900/10 transition-colors"></div>
            <span className="text-yellow-600 text-3xl mb-2">大運</span>
            <span className="text-yellow-800 text-sm tracking-widest">流年趨勢</span>
          </button>
        </div>

        <div className="mt-20 p-8 border border-yellow-900/30 rounded bg-stone-950/40 mb-12">
           <h3 className="text-yellow-600 font-bold mb-4 flex items-center">
             <span className="mr-2">◈</span> 命理總評
           </h3>
           <p className="text-gray-400 leading-relaxed italic">
             「{report.overallFortune}」
           </p>
        </div>

        {/* New Consultation / Question Section */}
        <div className="mt-12 p-8 chinese-border bg-stone-900/60 relative overflow-hidden group">
          <div className="absolute inset-0 bg-yellow-900/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <h3 className="text-2xl font-black text-yellow-600 mb-4 tracking-widest flex items-center justify-center">
            <span className="mr-4">✨</span> 天啟解惑 <span className="ml-4">✨</span>
          </h3>
          <p className="text-center text-yellow-800/60 text-sm mb-6">
            心中尚有未明之處？針對具體問題提問，由大師以白話文為您指點迷津。
          </p>
          <form onSubmit={handleConsult} className="flex flex-col md:flex-row gap-4">
            <input 
              type="text"
              placeholder="例如：今年適合轉職嗎？我的正緣何時會出現？"
              className="flex-1 bg-stone-950 border border-yellow-800/30 rounded p-4 text-yellow-100 focus:border-yellow-600 outline-none placeholder:text-stone-700"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              disabled={isConsulting}
            />
            <button 
              type="submit"
              className={`px-8 py-4 bg-yellow-900 text-yellow-100 font-bold rounded shadow-lg hover:bg-yellow-800 transition-all flex items-center justify-center gap-2 ${isConsulting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isConsulting}
            >
              {isConsulting ? (
                <div className="w-5 h-5 border-2 border-yellow-100 border-t-transparent rounded-full animate-spin"></div>
              ) : '求籤'}
            </button>
          </form>
        </div>

        <div className="mt-20 text-center">
          <button 
            onClick={() => { setState(AppState.IDLE); setReport(null); setQuestion(''); }}
            className="text-yellow-900 hover:text-yellow-700 transition-colors border-b border-yellow-900/30 pb-1"
          >
            重新推演另一個人生
          </button>
        </div>

        {/* Modal Logic */}
        {activeView === 'bazi' && (
          <ParchmentCard title="八字四柱格局" onClose={() => setActiveView(null)} variant="bazi">
            <BaziPillarDisplay data={report.bazi} />
            <div className="space-y-4">
              <p><strong>日主：</strong> <span className="text-red-900 font-bold">{report.bazi.dayMaster}</span></p>
              <p><strong>格局解析：</strong></p>
              <p className="text-base">此命盤四柱排列獨特，陰陽平衡度適中。日主在五行中具備強烈的生命力，天干地支交織出不凡的性格特質。</p>
            </div>
          </ParchmentCard>
        )}

        {activeView === 'palaces' && (
          <ParchmentCard title="紫微十二宮要義" onClose={() => setActiveView(null)} variant="default">
            <div className="space-y-8">
              {report.palaces.map((palace, i) => (
                <div key={i} className="border-b border-yellow-800/20 pb-6 last:border-0">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-2xl font-black text-yellow-950 tracking-widest">{palace.name}</h4>
                    <span className="text-xs bg-yellow-800/10 px-3 py-1 rounded-full text-yellow-900 border border-yellow-800/20 font-bold">
                      主星：{palace.keyStars.join('、')}
                    </span>
                  </div>
                  <p className="text-sm text-yellow-900/70 mb-3 italic">「{palace.description}」</p>
                  <p className="text-gray-900 mb-4 leading-relaxed">{palace.prediction}</p>
                  <div className="bg-yellow-900/5 p-4 rounded-sm border border-yellow-800/10">
                    <h5 className="text-sm font-bold text-yellow-900 mb-2">◆ 趨吉避凶</h5>
                    <p className="text-sm text-stone-800">{palace.fortuneAdvice}</p>
                  </div>
                </div>
              ))}
            </div>
          </ParchmentCard>
        )}

        {activeView === 'wealth' && (
          <ParchmentCard title="財運玄機" onClose={() => setActiveView(null)} variant="wealth">
            <div className="text-center mb-6 relative z-10"><div className="text-5xl mb-4 text-yellow-700">💰</div></div>
            <p className="relative z-10">{report.wealthLuck}</p>
          </ParchmentCard>
        )}

        {activeView === 'career' && (
          <ParchmentCard title="事業造化" onClose={() => setActiveView(null)} variant="career">
            <div className="text-center mb-6 relative z-10"><div className="text-5xl mb-4 text-yellow-700">🏯</div></div>
            <p className="relative z-10">{report.careerLuck}</p>
          </ParchmentCard>
        )}

        {activeView === 'love' && (
          <ParchmentCard title="情感歸宿" onClose={() => setActiveView(null)} variant="love">
             <div className="text-center mb-6 relative z-10"><div className="text-5xl mb-4 text-pink-900">🏮</div></div>
            <p className="relative z-10">{report.loveLuck}</p>
          </ParchmentCard>
        )}

        {activeView === 'cycle' && (
          <ParchmentCard title="大運流年" onClose={() => setActiveView(null)} variant="cycle">
             <div className="bg-yellow-900/5 p-4 rounded mb-6 italic border-l-4 border-yellow-800 relative z-10">
               目前大運：{report.currentCycle}
             </div>
             <p className="relative z-10">{report.healthAdvice}</p>
          </ParchmentCard>
        )}

        {activeView === 'consultation' && consultationResult && (
          <ParchmentCard title="天啟釋疑" onClose={() => setActiveView(null)} variant="consult">
            <div className="mb-6 italic text-yellow-900/60 border-b border-yellow-900/10 pb-4">
              提問：{question}
            </div>
            <div className="prose prose-stone leading-relaxed text-gray-900 text-lg">
              {consultationResult.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </ParchmentCard>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 border border-yellow-800 rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 border border-yellow-800 rounded-full"></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-yellow-900/20"></div>
        <div className="absolute left-1/2 top-0 h-full w-px bg-yellow-900/20"></div>
      </div>

      <main className="relative z-10">
        {state === AppState.IDLE && renderInputForm()}
        {state === AppState.LOADING && renderLoading()}
        {state === AppState.RESULT && renderResults()}
      </main>

      <footer className="fixed bottom-4 left-0 w-full text-center text-xs text-yellow-900/40 pointer-events-none">
        © 玄機天啟 - 命理大師智慧結晶
      </footer>
    </div>
  );
};

export default App;

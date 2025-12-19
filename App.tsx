
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HistoryTable from './components/HistoryTable';
import ChatBot from './components/ChatBot';
import { WinGoDuration, PredictionData } from './types';
import { getCurrentPeriodId, getHistory, generatePrediction } from './services/predictionEngine';
import { getAISignal } from './services/geminiService';

const DURATION_SECONDS: Record<WinGoDuration, number> = {
  '30s': 30,
  '1min': 60,
  '3min': 180,
  '5min': 300
};

const App: React.FC = () => {
  const [selectedDuration, setSelectedDuration] = useState<WinGoDuration>('1min');
  const [currentPeriod, setCurrentPeriod] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [history, setHistory] = useState<PredictionData[]>([]);
  const [nextPrediction, setNextPrediction] = useState<PredictionData | null>(null);
  const [aiSignal, setAiSignal] = useState<string>("Analyzing trends...");
  const [isHacking, setIsHacking] = useState(false);

  const updateGameState = useCallback(() => {
    const duration = DURATION_SECONDS[selectedDuration];
    const period = getCurrentPeriodId(duration);
    setCurrentPeriod(period);
    
    // History sync
    const pastData = getHistory(15, duration);
    setHistory(pastData);

    // AI Signal update (simulated fetch)
    const fetchSignal = async () => {
      const signal = await getAISignal(pastData);
      setAiSignal(signal);
    };
    fetchSignal();

    // Logic: Next period prediction
    const nextId = (parseInt(period.slice(-5)) + 1).toString();
    const fullNextId = `${period.slice(0, -5)}${nextId}`;
    setNextPrediction(generatePrediction(fullNextId));
  }, [selectedDuration]);

  useEffect(() => {
    updateGameState();
    const interval = setInterval(() => {
      const duration = DURATION_SECONDS[selectedDuration];
      const now = new Date().getTime();
      const secondsPassed = Math.floor(now / 1000) % duration;
      const remaining = duration - secondsPassed;
      
      setTimeLeft(remaining);

      // Trigger update on new period
      if (remaining === duration) {
        updateGameState();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedDuration, updateGameState]);

  const handleStartHack = () => {
    setIsHacking(true);
    setTimeout(() => setIsHacking(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col max-w-md mx-auto relative overflow-hidden">
      <Header />
      
      <main className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar pb-24">
        {/* Duration Selector */}
        <div className="grid grid-cols-4 gap-2">
          {(['30s', '1min', '3min', '5min'] as WinGoDuration[]).map(dur => (
            <button
              key={dur}
              onClick={() => setSelectedDuration(dur)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border ${
                selectedDuration === dur 
                ? 'bg-gradient-to-tr from-yellow-500 to-yellow-400 border-yellow-300 text-black shadow-lg shadow-yellow-500/20' 
                : 'bg-[#1e1e1e] border-[#333] text-gray-400'
              }`}
            >
              <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] font-bold uppercase">{dur}</span>
            </button>
          ))}
        </div>

        {/* Current Period Info */}
        <div className="bg-[#1e1e1e] rounded-2xl p-5 border border-[#333] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-3xl -mr-16 -mt-16"></div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Current Period</p>
              <p className="text-xl font-mono font-bold tracking-tight text-yellow-500">{currentPeriod}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Time Left</p>
              <p className="text-2xl font-black font-mono text-white tabular-nums">{formatTime(timeLeft)}</p>
            </div>
          </div>
          
          <div className="h-1 bg-[#0f0f0f] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / DURATION_SECONDS[selectedDuration]) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Hack Winning Prediction Panel */}
        <div className="bg-[#1e1e1e] rounded-2xl p-6 border border-[#333] shadow-2xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none"></div>
           
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
             Live Hacking Signal
           </h3>

           <div className="flex items-center justify-between mb-8">
             <div className="space-y-1">
               <p className="text-[10px] text-gray-400 uppercase font-medium">Predicted Number</p>
               <div className="text-5xl font-black text-white italic tracking-tighter">
                 {isHacking ? '?' : nextPrediction?.number}
               </div>
             </div>
             
             <div className="flex gap-4">
               <div className="text-center space-y-1">
                 <p className="text-[10px] text-gray-400 uppercase font-medium">Size</p>
                 <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                   nextPrediction?.size === 'Big' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'
                 }`}>
                   {isHacking ? '...' : nextPrediction?.size}
                 </span>
               </div>
               <div className="text-center space-y-1">
                 <p className="text-[10px] text-gray-400 uppercase font-medium">Color</p>
                 <div className={`w-8 h-8 rounded-full mx-auto shadow-inner border-2 border-white/10 ${
                   nextPrediction?.color === 'Green' ? 'bg-green-500' : 
                   nextPrediction?.color === 'Red' ? 'bg-red-500' : 
                   nextPrediction?.color === 'Violet' ? 'bg-purple-500' :
                   nextPrediction?.color.includes('Green') ? 'bg-gradient-to-br from-green-500 to-purple-500' :
                   'bg-gradient-to-br from-red-500 to-purple-500'
                 }`}></div>
               </div>
             </div>
           </div>

           <button 
             onClick={handleStartHack}
             disabled={isHacking}
             className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-black py-4 rounded-xl shadow-xl active:scale-95 transition-all relative overflow-hidden group"
           >
             {isHacking ? (
               <div className="flex items-center justify-center gap-2">
                 <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                 ANALYZING DATA...
               </div>
             ) : (
               "START HACKING DATA"
             )}
             <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
           </button>
           
           <div className="mt-4 p-3 bg-[#0f0f0f] rounded-lg border border-[#222]">
             <p className="text-[10px] text-yellow-500 font-bold uppercase mb-1 flex items-center gap-2">
               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
               </svg>
               AI Signal Prompt:
             </p>
             <p className="text-[11px] text-gray-300 italic">
               "{aiSignal}"
             </p>
           </div>
        </div>

        {/* History Table */}
        <HistoryTable history={history} />
        
        {/* Disclaimer / Footer info */}
        <div className="text-center pb-8">
           <p className="text-[9px] text-gray-600 uppercase tracking-widest leading-loose">
             Connected to DMwin Cloud Node v2025.12.19<br/>
             All signals processed via 2880 Number Cycle Panel<br/>
             © 2025 Tashan Win Security Systems
           </p>
        </div>
      </main>

      {/* Floating AI Chat Bot */}
      <ChatBot history={history} />

      {/* Bottom Nav Simulation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1e1e1e] border-t border-[#333] px-6 py-3 flex justify-between items-center max-w-md mx-auto z-40">
        <button className="text-yellow-500 flex flex-col items-center gap-1">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-[9px] font-bold">HOME</span>
        </button>
        <button className="text-gray-500 flex flex-col items-center gap-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-[9px] font-bold">ACTIVITY</span>
        </button>
        <button className="text-gray-500 flex flex-col items-center gap-1">
           <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center -mt-8 shadow-xl border-4 border-[#0f0f0f]">
             <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
             </svg>
           </div>
          <span className="text-[9px] font-bold mt-1 uppercase">WinGo</span>
        </button>
        <button className="text-gray-500 flex flex-col items-center gap-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="text-[9px] font-bold">WALLET</span>
        </button>
        <button className="text-gray-500 flex flex-col items-center gap-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[9px] font-bold">ME</span>
        </button>
      </div>
    </div>
  );
};

export default App;

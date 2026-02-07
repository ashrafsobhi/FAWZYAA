
import React, { useState, useEffect } from 'react';
import { UserStats, UserLevel } from './types';
import { INITIAL_STATS } from './constants';
import Navigation from './components/Navigation';
import VoiceChatView from './views/VoiceChatView';
import StatsView from './views/StatsView';
import ProfileView from './views/ProfileView';
import OnboardingView from './views/OnboardingView';

const App: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('englearn_stats');
    if (saved) return JSON.parse(saved);
    return INITIAL_STATS;
  });
  
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'stats' | 'profile'>('home');
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('englearn_onboarded'));

  useEffect(() => {
    localStorage.setItem('englearn_stats', JSON.stringify(stats));
  }, [stats]);

  if (showOnboarding) {
    return <OnboardingView onComplete={(data) => {
      setStats(prev => ({ ...prev, ...data }));
      localStorage.setItem('englearn_onboarded', 'true');
      setShowOnboarding(false);
    }} />;
  }

  return (
    <div className="app-container">
      <main className="flex-1 overflow-hidden relative flex flex-col h-full">
        <div className="content-width">
          {activeTab === 'home' && (
            <div className="flex-1 overflow-y-auto scroll-hide p-6 space-y-10 safe-area-top pb-32 tab-content">
              {/* Modern Greeting */}
              <div className="flex justify-between items-center mt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl border border-gray-100 overflow-hidden ring-4 ring-white">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stats.name}`} alt="user" className="bg-orange-50 w-full h-full" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800 tracking-tight">هلا بيك، {stats.name || 'بطل'}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Level: {stats.level}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 bg-white px-6 py-3.5 rounded-3xl shadow-xl border border-gray-50 ring-4 ring-white">
                   <span className="text-base font-black text-gray-800">🔥 {stats.streak}</span>
                </div>
              </div>

              {/* Immersive Hero Card with Official Image */}
              <div className="relative bg-white rounded-[4rem] p-10 md:p-14 shadow-2xl border border-gray-50 flex flex-col items-center overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#C67353]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-[10px] border-white shadow-2xl mb-10 relative active:scale-95 transition-transform cursor-pointer group" onClick={() => setActiveTab('chat')}>
                   <img src="https://i.postimg.cc/V6vG9wfH/Gemini-Generated-Image-z2fd21z2fd21z2fd.png" 
                        alt="Fawzia Official Character" 
                        className="w-full h-full object-cover bg-[#F5F2ED] transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>

                <div className="text-center space-y-4 relative z-10">
                  <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight leading-tight">"دي بسيطة خالص!"</h2>
                  <p className="text-base md:text-lg text-gray-400 font-bold px-4 leading-relaxed max-w-sm">
                    جاهز تتكلم إنجليزي بثقة؟ فوزية مستنية تسمع صوتك يا وحش.. يلا نبدأ!
                  </p>
                </div>

                <button 
                  onClick={() => setActiveTab('chat')}
                  className="mt-12 terracotta-btn text-white w-full py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all relative z-10 border-4 border-white/20"
                >
                  كلم فوزية دلوقتي
                </button>
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-[#E2ECE1] p-10 rounded-[3.5rem] flex flex-col justify-between h-52 shadow-2xl shadow-[#E2ECE1]/30 hover:scale-105 transition-transform">
                  <div className="w-14 h-14 bg-white/70 rounded-3xl flex items-center justify-center text-2xl shadow-sm">🚀</div>
                  <div className="text-right">
                    <p className="text-xs font-black text-[#4A5D48]/60 uppercase tracking-widest mb-1">تطوري</p>
                    <p className="text-xl font-black text-[#4A5D48]">ماشي بطل</p>
                  </div>
                </div>
                <div className="bg-[#FFF5F2] p-10 rounded-[3.5rem] flex flex-col justify-between h-52 shadow-2xl shadow-[#FFF5F2]/30 hover:scale-105 transition-transform">
                   <div className="w-14 h-14 bg-white/70 rounded-3xl flex items-center justify-center text-2xl shadow-sm">💎</div>
                   <div className="text-right">
                    <p className="text-xs font-black text-[#C67353]/60 uppercase tracking-widest mb-1">نقاطي</p>
                    <p className="text-xl font-black text-[#C67353]">{stats.points}</p>
                  </div>
                </div>
              </div>

              {/* Daily Challenges */}
              <div className="space-y-6 pb-12">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.4em] px-4 flex items-center gap-4">
                  <span className="w-12 h-[3px] bg-gray-200 rounded-full"></span>
                  تحدي اليوم
                </h3>
                <div onClick={() => setActiveTab('chat')} className="bg-white border-2 border-gray-50 p-8 rounded-[3.5rem] flex flex-row-reverse items-center justify-between shadow-2xl shadow-gray-200/50 active:scale-[0.98] transition-all cursor-pointer group">
                   <div className="flex flex-row-reverse items-center gap-8">
                      <div className="w-20 h-20 bg-[#F5F2ED] rounded-[2.5rem] flex items-center justify-center text-4xl shadow-inner group-hover:rotate-12 transition-transform">🎙️</div>
                      <div className="text-right">
                        <h4 className="text-lg font-black text-gray-800">تحدي النطق</h4>
                        <p className="text-sm font-bold text-[#C67353] mt-1.5 italic">دي بسيطة خالص! • 5 دقايق</p>
                      </div>
                   </div>
                   <div className="w-14 h-14 rounded-full bg-[#C67353]/10 flex items-center justify-center text-[#C67353] group-hover:bg-[#C67353] group-hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex-1 tab-content h-full">
              <VoiceChatView 
                stats={stats} 
                onTurnComplete={() => {}} 
                onClose={() => setActiveTab('home')} 
              />
            </div>
          )}
          {activeTab === 'stats' && <div className="flex-1 overflow-y-auto scroll-hide pb-32 tab-content"><StatsView stats={stats} /></div>}
          {activeTab === 'profile' && <div className="flex-1 overflow-y-auto scroll-hide pb-32 tab-content"><ProfileView stats={stats} setStats={setStats} resetOnboarding={() => setShowOnboarding(true)} /></div>}
        </div>
      </main>

      {activeTab !== 'chat' && (
        <div className="fixed bottom-0 left-0 right-0 z-[150]">
          <div className="content-width">
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

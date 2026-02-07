
import React from 'react';

interface NavigationProps {
  activeTab: 'home' | 'chat' | 'stats' | 'profile';
  setActiveTab: (tab: 'home' | 'chat' | 'stats' | 'profile') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="flex justify-around items-center h-28 px-10 bg-white/95 backdrop-blur-2xl border-t border-gray-100 shadow-2xl safe-area-bottom">
      <NavItem 
        label="الرئيسية" 
        active={activeTab === 'home'} 
        onClick={() => setActiveTab('home')}
        icon={<path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />}
      />
      <div className="relative -top-10">
        <button 
          onClick={() => setActiveTab('chat')}
          className={`w-20 h-20 rounded-[2rem] flex items-center justify-center terracotta-btn text-white shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 ${activeTab === 'chat' ? 'ring-[10px] ring-[#C67353]/15' : 'ring-8 ring-white'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>
      <NavItem 
        label="تطوري" 
        active={activeTab === 'stats'} 
        onClick={() => setActiveTab('stats')}
        icon={<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
      />
      <NavItem 
        label="حسابي" 
        active={activeTab === 'profile'} 
        onClick={() => setActiveTab('profile')}
        icon={<path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
      />
    </nav>
  );
};

const NavItem = ({ label, active, onClick, icon }: { label: string, active: boolean, onClick: () => void, icon: React.ReactNode }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-2 transition-all duration-500 ${active ? 'text-[#C67353] translate-y-[-4px]' : 'text-gray-400'}`}>
    <div className={`p-3 rounded-2xl transition-all ${active ? 'bg-[#C67353]/10 shadow-inner' : ''}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 3 : 2}>
        {icon}
      </svg>
    </div>
    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${active ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
  </button>
);

export default Navigation;

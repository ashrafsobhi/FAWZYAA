
import React from 'react';
import { UserStats, UserLevel } from '../types';

interface ProfileViewProps {
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  resetOnboarding: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ stats, setStats, resetOnboarding }) => {
  const levels = [
    { label: "مبتدئ (Beginner)", value: UserLevel.BEGINNER },
    { label: "متوسط (Intermediate)", value: UserLevel.INTERMEDIATE },
    { label: "متقدم (Advanced)", value: UserLevel.ADVANCED }
  ];

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700 text-right" dir="rtl">
      <div className="flex flex-col items-center py-12 space-y-8">
        <div className="relative">
          <div className="w-36 h-36 bg-[#F5F2ED] rounded-[4rem] flex items-center justify-center text-[#8BA888] border-4 border-white soft-shadow relative z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5 0 5.5-2 5.5-2a2 2 0 0 0-2-2c-2.4 0-2.4-2-2.4-2s.4-1.6.4-3.6c0-2.2-1.8-4-4-4s-4 1.8-4 4c0 2 .4 3.6.4 3.6s0 2-2.4 2a2 2 0 0 0-2 2s0 2 5.5 2Z"/><path d="M18 9a4 4 0 0 1 0 8"/></svg>
          </div>
          <div className="absolute -inset-4 bg-[#8BA888]/10 rounded-[4.5rem] -z-10 animate-pulse"></div>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-[#4A5D48] tracking-tight">صديق فوزية</h2>
          <p className="text-[#8BA888] text-[10px] font-black bg-[#E2ECE1] px-5 py-2 rounded-full inline-block uppercase tracking-widest">
            مستوى {stats.level === UserLevel.BEGINNER ? 'مبتدئ' : stats.level === UserLevel.INTERMEDIATE ? 'متوسط' : 'متقدم'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] soft-shadow border border-[#E8E2D9] overflow-hidden">
        <div className="p-10 border-b border-[#F5F2ED]">
          <h3 className="font-black text-[#8C7355] text-lg mb-8 tracking-tight">تعديل مستوى الرحلة</h3>
          <div className="grid grid-cols-1 gap-4">
            {levels.map(level => (
              <button
                key={level.value}
                onClick={() => setStats(prev => ({ ...prev, level: level.value }))}
                className={`px-8 py-5 rounded-[2rem] text-right font-bold transition-all duration-500 flex items-center justify-between ${
                  stats.level === level.value 
                  ? 'bg-[#4A5D48] text-[#FDFCFB] shadow-2xl scale-[1.02]' 
                  : 'bg-[#F5F2ED] text-[#A39A8E] hover:bg-[#E8E2D9] border border-transparent'
                }`}
              >
                <span>{level.label}</span>
                {stats.level === level.value && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-10 space-y-6">
          <button 
            onClick={resetOnboarding}
            className="w-full flex items-center justify-between p-6 bg-[#FDFCFB] rounded-[2.5rem] hover:bg-[#F5F2ED] transition-all border border-[#E8E2D9] group"
          >
            <div className="flex items-center gap-5">
              <span className="text-[#8C7355] group-hover:rotate-180 transition-transform duration-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
              </span>
              <span className="font-bold text-[#8C7355]">إعادة تقييم فوزية لي</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#A39A8E]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          <button className="w-full flex items-center justify-between p-6 bg-[#FEF2F2] rounded-[2.5rem] hover:bg-red-50 transition-all border border-transparent group">
            <div className="flex items-center gap-5">
              <span className="text-red-600 group-hover:-translate-x-2 transition-transform duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </span>
              <span className="font-bold text-red-600">تسجيل الخروج</span>
            </div>
          </button>
        </div>
      </div>

      <div className="text-center pb-12">
        <p className="text-[10px] uppercase font-black text-[#E8E2D9] tracking-[0.4em]">إنج-ليرن v1.0.0 (بيتا)</p>
        <p className="text-xs text-[#A39A8E] font-bold mt-3">"اتعلم على مهلك، فوزية مش مستعجلة"</p>
      </div>
    </div>
  );
};

export default ProfileView;

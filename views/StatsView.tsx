
import React from 'react';
import { UserStats } from '../types';

const StatsView: React.FC<{ stats: UserStats }> = ({ stats }) => {
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-700 overflow-y-auto pb-10">
      <div className="flex justify-between items-center">
        <div className="w-10 h-10 bg-[#F5F2ED] rounded-full flex items-center justify-center border border-gray-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
        <h2 className="text-sm font-bold text-gray-800">تطوري</h2>
        <div className="w-10 h-10 bg-[#F5F2ED] rounded-full flex items-center justify-center border border-gray-100"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
      </div>

      <div className="text-right">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">عاش يا {stats.name || 'بطل'}!</h1>
        <p className="text-sm text-gray-400 font-medium">كل مكالمة بتخليك أوثق في نفسك.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#E2ECE1]/30 p-6 rounded-[2.5rem] flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">🔥</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Day Streak</span>
          </div>
          <span className="text-3xl font-black text-[#4A5D48]">{stats.streak}</span>
        </div>
        <div className="bg-[#FFF5F2] p-6 rounded-[2.5rem] flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">📖</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">New Words</span>
          </div>
          <span className="text-3xl font-black text-[#C67353]">{stats.totalWordsLearned}</span>
        </div>
      </div>

      {/* الرسوم البيانية */}
      <div className="bg-white p-6 rounded-[2.5rem] custom-shadow border border-gray-50">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-bold text-[#8BA888]">+12% this week</span>
          <h3 className="text-sm font-black text-gray-800">وضوح النطق</h3>
        </div>
        <div className="bar-chart-container">
          <div className="bar-item" style={{ height: '40%' }}></div>
          <div className="bar-item" style={{ height: '30%' }}></div>
          <div className="bar-item" style={{ height: '60%' }}></div>
          <div className="bar-item" style={{ height: '50%' }}></div>
          <div className="bar-item active" style={{ height: '80%' }}></div>
        </div>
        <div className="flex justify-between px-2 mt-3 text-[10px] font-bold text-gray-300 uppercase">
          <span>M</span><span>T</span><span>W</span><span>T</span><span className="text-[#8BA888] border-b-2 border-[#8BA888]">F</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] custom-shadow border border-gray-50">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-bold text-[#C67353]">Leveling up!</span>
          <h3 className="text-sm font-black text-gray-800">تعقيد الجمل</h3>
        </div>
        <div className="bar-chart-container">
          <div className="bar-item sage-bg opacity-40" style={{ height: '30%', backgroundColor: '#C67353' }}></div>
          <div className="bar-item sage-bg opacity-40" style={{ height: '45%', backgroundColor: '#C67353' }}></div>
          <div className="bar-item sage-bg opacity-40" style={{ height: '55%', backgroundColor: '#C67353' }}></div>
          <div className="bar-item sage-bg opacity-40" style={{ height: '40%', backgroundColor: '#C67353' }}></div>
          <div className="bar-item active sage-bg" style={{ height: '70%', backgroundColor: '#C67353' }}></div>
        </div>
        <div className="flex justify-between px-2 mt-3 text-[10px] font-bold text-gray-300 uppercase">
          <span>M</span><span>T</span><span>W</span><span>T</span><span className="text-[#C67353] border-b-2 border-[#C67353]">F</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] custom-shadow border border-gray-50 text-right">
        <div className="flex items-center gap-2 mb-2 flex-row-reverse">
          <div className="w-8 h-8 sage-bg rounded-lg flex items-center justify-center text-white text-xs">🤖</div>
          <h3 className="text-sm font-black text-gray-800">كلمة من فوزية</h3>
        </div>
        <p className="text-xs text-gray-400 font-medium leading-relaxed">
          فوزية لاحظت إنك استخدمت 5 كلمات جديدة النهاردة! إنت بتتحسن وبقيت بتعبر عن نفسك أحلى.
        </p>
        <button className="mt-4 text-[10px] font-bold text-[#C67353] flex items-center gap-1 flex-row-reverse">
          عرض القاموس الشخصي <span>←</span>
        </button>
      </div>

      <button className="w-full py-5 terracotta-btn text-white rounded-[2rem] font-bold text-sm shadow-xl flex items-center justify-center gap-2">
         كمل دردشة مع فوزية <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" /></svg>
      </button>
    </div>
  );
};

export default StatsView;

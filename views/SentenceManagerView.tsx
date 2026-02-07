
import React from 'react';
import { UserStats } from '../types';

const SentenceManagerView: React.FC<{ stats: UserStats }> = ({ stats }) => {
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500 overflow-y-auto pb-10">
      <div className="flex justify-between items-center mb-4">
        <button className="p-2 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
        <h2 className="text-lg font-black text-gray-800">القاموس الشخصي</h2>
        <button className="p-2 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg></button>
      </div>

      <div className="relative">
        <input 
          type="text" 
          placeholder="ابحث في قاموسك..." 
          className="w-full py-4 px-12 bg-[#F5F2ED] rounded-2xl text-right text-sm font-medium border-none focus:ring-1 focus:ring-[#C67353] outline-none"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-bold text-[#C67353] flex items-center gap-1 cursor-pointer">ترتيب حسب: الأحدث <span>▾</span></span>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stats.customSentences.length || 48} SAVED PHRASES</span>
      </div>

      <div className="space-y-4">
        {stats.customSentences.length > 0 ? stats.customSentences.map(s => (
          <DictionaryCard key={s.id} title={s.text} desc={`"${s.translation}"`} />
        )) : (
          <>
            <DictionaryCard title="Nuance" desc='"فوزية قالت نكتة فيها nuance خفيفة مخدتش بالي منها."' active />
            <DictionaryCard title="On the tip of my tongue" desc='"الكلمة كانت على طرف لساني طول الدردشة."' active />
            <DictionaryCard title="Eloquent" desc='"فوزية بتتكلم لغة إنجليزية فصيحة جداً."' />
            <DictionaryCard title="Subtle" desc='"كان في تغيير subtle في نبرة الكلام."' />
            <DictionaryCard title="Vibrant" desc='"طريقة فوزية في الشرح حيوية ومفعمة بالحياة."' />
          </>
        )}
      </div>

      <button className="fixed bottom-24 right-6 w-14 h-14 terracotta-btn text-white rounded-full shadow-2xl flex items-center justify-center text-2xl z-[130]">
        +
      </button>
    </div>
  );
};

// Fix: Explicitly typing DictionaryCard as a React functional component (React.FC) 
// to ensure the internal 'key' prop is recognized correctly by the TypeScript compiler during map iterations.
const DictionaryCard: React.FC<{ title: string; desc: string; active?: boolean }> = ({ title, desc, active }) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-gray-50 custom-shadow flex flex-row-reverse items-center justify-between text-right gap-4 group hover:border-[#C67353]/30 transition-all">
    <div className="flex-1">
      <h3 className="text-lg font-black text-gray-800 mb-1">{title}</h3>
      <p className="text-xs text-gray-400 italic font-medium leading-relaxed">{desc}</p>
    </div>
    <button className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${active ? 'bg-[#C67353] text-white' : 'bg-[#FFF5F2] text-[#C67353]'}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
    </button>
  </div>
);

export default SentenceManagerView;

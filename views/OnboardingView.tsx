
import React, { useState } from 'react';
import { UserLevel } from '../types';

interface OnboardingData {
  name: string;
  gender: 'male' | 'female';
  level: UserLevel;
}

interface OnboardingViewProps {
  onComplete: (data: OnboardingData) => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    gender: 'male',
    level: UserLevel.BEGINNER
  });

  const steps = [
    {
      id: 'welcome',
      title: "أهلاً بيك في عالم فوزية!",
      desc: "أنا فوزية، مش مدرسة، أنا صاحبتك اللي هتخليكي تتكلمي إنجليزي زي البرنس، ومن غير أي خوف من الغلط.",
      icon: (
        <div className="w-16 h-16 bg-[#FFF5F2] rounded-2xl flex items-center justify-center text-[#C67353]">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C10.26 14.33 11.72 13 13 10c0 3 1.5 5 5 6"/>
            <path d="M11 20c-1.5 0-3-.5-4-1.5"/>
          </svg>
        </div>
      ),
      button: "يلا نفتح السكة!"
    },
    {
      id: 'name',
      title: "اسمك إيه يا بطل؟",
      desc: "عشان فوزية تناديك باسمك وتدلعك وهي بتعلمك.",
      icon: (
        <div className="w-16 h-16 bg-[#E2ECE1] rounded-2xl flex items-center justify-center text-[#4A5D48]">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      ),
      type: 'input'
    },
    {
      id: 'gender',
      title: "إنت مين فيهم؟",
      desc: "عشان نعرف نظبط الكلام على مقاسك.",
      icon: (
        <div className="w-16 h-16 bg-[#F5F2ED] rounded-2xl flex items-center justify-center text-[#8C7355]">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>
      ),
      type: 'gender'
    },
    {
      id: 'level',
      title: "إنت فين دلوقتي في الطريق؟",
      desc: "قوليلي مستواكِ عشان أعرف أركز معاكِ صح..",
      type: 'level'
    }
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (currentStep.id === 'name' && !formData.name.trim()) return;
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  return (
    <div className="app-container bg-[#FDFBF7] flex flex-col justify-between items-center p-8 text-center min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#C67353]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8BA888]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-sm">
        <div className="mb-10 bounce-soft">
          {currentStep.icon || (
            <div className="w-16 h-16 bg-[#F5F2ED] rounded-2xl flex items-center justify-center text-[#4A5D48]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
          )}
        </div>
        
        <h2 className="text-2xl font-black text-[#2D2D2D] mb-4 leading-tight">
          {currentStep.title}
        </h2>
        
        <p className="text-sm text-gray-400 font-medium mb-12 leading-relaxed">
          {currentStep.desc}
        </p>

        {currentStep.id === 'welcome' && (
          <button
            onClick={handleNext}
            className="w-full py-5 terracotta-btn text-white rounded-full font-bold text-lg transition-all"
          >
            {currentStep.button}
          </button>
        )}

        {currentStep.type === 'input' && (
          <div className="w-full space-y-8">
            <div className="relative">
               <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="اكتب اسمك هنا..."
                dir="rtl"
                className="w-full py-5 px-8 bg-white border border-[#E8E2D9] focus:border-[#C67353] rounded-full font-bold text-lg text-center outline-none transition-all custom-shadow"
              />
            </div>
            <button
              onClick={handleNext}
              disabled={!formData.name.trim()}
              className="w-full py-5 terracotta-btn text-white rounded-full font-bold text-lg transition-all disabled:opacity-50 disabled:grayscale"
            >
              استمرار
            </button>
          </div>
        )}

        {currentStep.type === 'gender' && (
          <div className="w-full grid grid-cols-2 gap-4">
            <button
              onClick={() => { setFormData({...formData, gender: 'male'}); setStep(step + 1); }}
              className={`p-6 bg-white border-2 rounded-[2rem] flex flex-col items-center gap-4 transition-all ${formData.gender === 'male' ? 'border-[#C67353] bg-[#FFF5F2]' : 'border-gray-50 custom-shadow'}`}
            >
              <div className="w-12 h-12 bg-[#F5F2ED] rounded-xl flex items-center justify-center text-[#4A5D48]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="8"/><path d="M12 18v4"/><path d="M9 22h6"/></svg>
              </div>
              <span className="font-bold text-gray-700">ولد برنس</span>
            </button>
            <button
              onClick={() => { setFormData({...formData, gender: 'female'}); setStep(step + 1); }}
              className={`p-6 bg-white border-2 rounded-[2rem] flex flex-col items-center gap-4 transition-all ${formData.gender === 'female' ? 'border-[#C67353] bg-[#FFF5F2]' : 'border-gray-50 custom-shadow'}`}
            >
              <div className="w-12 h-12 bg-[#FFF5F2] rounded-xl flex items-center justify-center text-[#C67353]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="7"/><path d="M12 16v6"/><path d="M8 19h8"/></svg>
              </div>
              <span className="font-bold text-gray-700">بنت جدعة</span>
            </button>
          </div>
        )}

        {currentStep.type === 'level' && (
          <div className="w-full space-y-4">
            {[
              { label: "لسة بقول يا هادي", sub: "مبتدئ", value: UserLevel.BEGINNER },
              { label: "بمشي حالي بس بقطّع", sub: "متوسط", value: UserLevel.INTERMEDIATE },
              { label: "برنس وعاوز أقفّل", sub: "متقدم", value: UserLevel.ADVANCED }
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => onComplete({...formData, level: opt.value})}
                className="w-full p-5 bg-white border border-gray-100 custom-shadow hover:border-[#C67353] text-right rounded-3xl transition-all group flex items-center justify-between"
              >
                <div className="w-6 h-6 rounded-full border-2 border-gray-100 group-hover:border-[#C67353] flex items-center justify-center">
                   <div className="w-2.5 h-2.5 bg-[#C67353] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800 text-sm">{opt.label}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{opt.sub}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Progress Indicators */}
      <div className="mt-8 flex gap-2 pb-6">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-[#C67353]' : 'w-1.5 bg-[#E8E2D9]'}`} 
          />
        ))}
      </div>
    </div>
  );
};

export default OnboardingView;

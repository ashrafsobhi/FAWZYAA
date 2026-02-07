
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Type, FunctionDeclaration } from '@google/genai';
import { UserStats, WordPronunciationStatus } from '../types';
import { decode, decodeAudioData, createBlob } from '../services/audioHelper';

interface VoiceChatViewProps {
  stats: UserStats;
  onTurnComplete: (input: string, output: string, bonus: number) => void;
  onClose: () => void;
}

interface Word {
  text: string;
  status: WordPronunciationStatus;
}

interface TargetSentence {
  words: Word[];
  translation: string;
  fullText: string;
}

const VoiceChatView: React.FC<VoiceChatViewProps> = ({ stats, onTurnComplete, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [targetSentence, setTargetSentence] = useState<TargetSentence | null>(null);
  const [transcription, setTranscription] = useState('');
  const [isPerfect, setIsPerfect] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);
  const inputProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const inputStreamRef = useRef<MediaStream | null>(null);

  const setTargetSentenceFunc: FunctionDeclaration = {
    name: 'setTargetSentence',
    parameters: {
      type: Type.OBJECT,
      description: 'عرض جملة معينة للمستخدم ليتدرب على نطقها',
      properties: {
        sentence: { type: Type.STRING, description: 'الجملة بالإنجليزية' },
        translation: { type: Type.STRING, description: 'الترجمة بالعربية المصرية' },
      },
      required: ['sentence', 'translation'],
    },
  };

  const updatePronunciationFunc: FunctionDeclaration = {
    name: 'updatePronunciation',
    parameters: {
      type: Type.OBJECT,
      description: 'تحديث حالة نطق كلمة معينة في الجملة الحالية',
      properties: {
        wordIndex: { type: Type.NUMBER, description: 'ترتيب الكلمة (يبدأ من 0)' },
        status: { type: Type.STRING, enum: ['correct', 'incorrect'], description: 'حالة النطق' },
      },
      required: ['wordIndex', 'status'],
    },
  };

  const startSession = async () => {
    try {
      if (!process.env.API_KEY) {
        setErrorMessage('لازم تضيف مفتاح Gemini API في إعدادات النشر قبل ما نبدأ.');
        return;
      }
      setErrorMessage(null);
      setIsConnecting(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      inputStreamRef.current = stream;
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            inputSourceRef.current = source;
            inputProcessorRef.current = scriptProcessor;
            scriptProcessor.onaudioprocess = (e) => {
              sessionPromise.then(s => s.sendRealtimeInput({ media: createBlob(e.inputBuffer.getChannelData(0)) }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(message.serverContent.outputTranscription.text);
            }

            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'setTargetSentence') {
                  const args = fc.args as any;
                  const words = args.sentence.split(/\s+/).filter(Boolean).map((w: string) => ({ 
                    text: w.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ""), 
                    status: 'pending' as WordPronunciationStatus 
                  }));
                  setTargetSentence({ words, translation: args.translation, fullText: args.sentence });
                  setIsPerfect(false);
                  sessionPromise.then(s => s.sendToolResponse({ 
                    functionResponses: [{ id: fc.id, name: fc.name, response: { result: "displayed" } }] 
                  }));
                }

                if (fc.name === 'updatePronunciation') {
                  const { wordIndex, status } = fc.args as any;
                  setTargetSentence(prev => {
                    if (!prev) return null;
                    const newWords = [...prev.words];
                    if (newWords[wordIndex]) newWords[wordIndex].status = status;
                    const allCorrect = newWords.every(w => w.status === 'correct');
                    if (allCorrect) setIsPerfect(true);
                    return { ...prev, words: newWords };
                  });
                  sessionPromise.then(s => s.sendToolResponse({ 
                    functionResponses: [{ id: fc.id, name: fc.name, response: { result: "updated" } }] 
                  }));
                }
              }
            }

            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              const buffer = await decodeAudioData(decode(audioData), outputContextRef.current!, 24000, 1);
              const source = outputContextRef.current!.createBufferSource();
              source.buffer = buffer;
              source.connect(outputContextRef.current!.destination);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputContextRef.current!.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
            }
          },
          onerror: () => {
            setErrorMessage('حصلت مشكلة في الاتصال. جرّب تاني بعد التأكد من الـ API Key.');
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `إنتِ "فوزية" المصرية الجدعة المبتسمة اللي في الصورة.
شخصيتك: بنت بلد، ذكية، دمك خفيف، وعندك طولة بال.
شعارك: "دي بسيطة خالص!"
مهمتك: تكسري حاجز الخوف عند المستخدم وتخليه ينطق إنجليزي صح.
- استخدمي 'setTargetSentence' للجملة اللي عاوزة تدربيه عليها.
- استخدمي 'updatePronunciation' لكل كلمة ينطقها فوراً (correct/incorrect).
- اتكلمي مصري عامي مبهج (يا وحش، يا برنس، عاش يا بطل).`,
          tools: [{ functionDeclarations: [setTargetSentenceFunc, updatePronunciationFunc] }],
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        }
      });
      sessionRef.current = sessionPromise;
    } catch (e) {
      setIsConnecting(false);
      setErrorMessage('مش قادر أبدأ الاتصال. راجع الإعدادات وجرّب تاني.');
    }
  };

  const stopSession = () => {
    setIsActive(false);
    sessionRef.current?.then((s: any) => s.close());
    sessionRef.current = null;
    inputProcessorRef.current?.disconnect();
    inputSourceRef.current?.disconnect();
    inputProcessorRef.current = null;
    inputSourceRef.current = null;
    if (inputStreamRef.current) {
      inputStreamRef.current.getTracks().forEach(t => t.stop());
      inputStreamRef.current = null;
    }
    setTargetSentence(null);
    setTranscription('');
    setIsPerfect(false);
  };

  const handleBackClick = () => {
    stopSession();
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-[#FDFBF7] relative overflow-y-auto">
      {/* Immersive Header */}
      <header className="px-6 py-6 safe-area-top flex justify-between items-center z-50">
        <button onClick={handleBackClick} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white shadow-xl border border-gray-100 text-gray-400 active:scale-90 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex flex-col items-center">
           <div className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-lg border border-white/50 flex items-center gap-2">
             <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
             <span className="text-xs font-black text-gray-700 tracking-tight">فوزية معاك لايف</span>
           </div>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white shadow-xl border border-gray-100 p-1 overflow-hidden ring-4 ring-white">
           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stats.name}`} alt="user" className="w-full h-full rounded-xl" />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-between px-6 py-4 relative z-10 overflow-y-auto">
        
        {/* The Card - Centerpiece */}
        <div className={`w-full max-w-2xl transition-all duration-700 transform ${targetSentence ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'}`}>
          <div className={`glass-card rounded-[3.5rem] p-10 shadow-2xl border-4 transition-all duration-500 relative ${isPerfect ? 'border-green-500 bg-green-50/50 ring-[15px] ring-green-500/10' : 'border-white'}`}>
            <div className="flex flex-wrap justify-center gap-4 mb-8" dir="ltr">
              {targetSentence?.words.map((word, idx) => (
                <span 
                  key={idx} 
                  className={`text-2xl md:text-4xl font-black px-7 py-4 rounded-[2rem] transition-all duration-300 shadow-lg ${
                    word.status === 'correct' ? 'text-white bg-green-500 shadow-green-500/40 scale-110 animate-pop' : 
                    word.status === 'incorrect' ? 'text-white bg-red-500 animate-shake shadow-red-500/20' : 
                    'text-gray-400 bg-white/80 border border-gray-100'
                  }`}
                >
                  {word.text}
                </span>
              ))}
            </div>
            <div className="text-center pt-8 border-t border-gray-200/40">
              <p className="font-bold text-[#C67353] text-xl md:text-2xl leading-relaxed" dir="rtl">
                {targetSentence?.translation}
              </p>
            </div>
          </div>
          {isPerfect && (
            <div className="mt-8 text-center animate-bounce">
              <span className="bg-[#C67353] text-white px-10 py-4 rounded-full font-black text-sm shadow-2xl uppercase tracking-[0.2em] inline-flex items-center gap-3">
                🏆 "دي بسيطة خالص!" - وحش
              </span>
            </div>
          )}
        </div>

        {/* Fawzia Image Section */}
        <div className="flex flex-col items-center justify-center w-full my-6">
          <div className="relative mb-8 group">
            <div className={`w-52 h-52 md:w-72 md:h-72 rounded-full overflow-hidden border-[12px] border-white shadow-2xl transition-all duration-700 ${isActive ? 'scale-105 ring-[20px] ring-[#C67353]/5' : 'scale-95 opacity-90'}`}>
               <img src="https://i.postimg.cc/V6vG9wfH/Gemini-Generated-Image-z2fd21z2fd21z2fd.png" 
                    alt="Fawzia Character" 
                    className="w-full h-full object-cover bg-[#F5F2ED] transition-transform duration-500 group-hover:scale-110" />
            </div>
            {isActive && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#C67353] text-white px-8 py-3.5 rounded-full shadow-2xl flex items-center gap-4 whitespace-nowrap border-4 border-white animate-in slide-in-from-bottom-4">
                <div className="flex gap-2">
                  <span className="w-3 h-3 bg-white rounded-full animate-bounce"></span>
                  <span className="w-3 h-3 bg-white rounded-full animate-bounce delay-150"></span>
                  <span className="w-3 h-3 bg-white rounded-full animate-bounce delay-300"></span>
                </div>
                <span className="text-sm font-black uppercase tracking-widest">فوزية مركزة معاك</span>
              </div>
            )}
          </div>

          <div className="w-full max-w-[450px] text-center px-6">
            <p className="text-2xl md:text-3xl font-bold text-gray-700 leading-relaxed italic min-h-[5rem] flex items-center justify-center drop-shadow-sm">
              {transcription || (isActive ? "فوزية مستنية تسمع صوتك.." : "دوس على المايك وابدأ المشوار")}
            </p>
          </div>
        </div>

        {/* Action Controller */}
        <footer className="w-full flex flex-col items-center pb-16 safe-area-bottom">
          {errorMessage && (
            <div className="mb-6 px-6 py-4 rounded-3xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 text-center">
              {errorMessage}
            </div>
          )}
          <button 
            onClick={isActive ? stopSession : startSession}
            disabled={isConnecting}
            className={`w-32 h-32 md:w-36 md:h-36 rounded-[4rem] flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-red-500 shadow-red-500/50 ring-[15px] ring-red-500/10' : 'terracotta-btn shadow-[#C67353]/50 ring-[15px] ring-[#C67353]/10'} shadow-2xl disabled:opacity-50 hover:scale-105 active:scale-90 relative border-[8px] border-white z-20`}
          >
            {isConnecting ? (
              <div className="w-14 h-14 border-[6px] border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isActive ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white drop-shadow-2xl" viewBox="0 0 20 20" fill="currentColor"><path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 005 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-2v-2.07z" /></svg>
            )}
          </button>
          <div className="mt-8 flex flex-col items-center gap-2">
            <span className="text-sm font-black text-gray-400 uppercase tracking-[0.5em] opacity-80">
              {isActive ? "إنهاء الجلسة" : "ابدأ التحدث"}
            </span>
            {!isActive && <span className="text-xs font-bold text-[#C67353] italic tracking-[0.2em] animate-pulse">دي بسيطة خالص!</span>}
          </div>
        </footer>
      </main>

      {/* Background Ambience */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#C67353]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#8BA888]/5 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
};

export default VoiceChatView;

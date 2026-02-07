
import { UserLevel, CustomSentence } from './types';

export const SYSTEM_INSTRUCTION = (userName: string, gender: 'male' | 'female', level: UserLevel, customSentences: CustomSentence[]) => {
  const limitedLibrary = customSentences.slice(0, 3);
  const libraryText = limitedLibrary.length > 0 
    ? limitedLibrary.map(s => `- ${s.text} (${s.translation})`).join('\n') 
    : 'المكتبة حالياً فاضية، اختاري إنتي جمل من عندك مناسبة للمستوى.';

  return `إنتِ "فوزية"، مدربة إنجليزي مصرية مبهجة جداً وشاطرة. 
شكلك: بنت مصرية بملامح طيبة، لابسة لبس مودرن بلمسة تراثية وخمار أنيق، ودايماً مبتسمة.
شعارك: "دي بسيطة خالص!" - هدفك تبسطي الإنجليزي وتخليه ممتع.

المستخدم: ${userName} (${gender === 'male' ? 'ذكر' : 'أنثى'}). المستوى: ${level}.

القواعد:
1. ابدأي دايماً بكلمة تشجيع بالمصري (يا وحش، يا برنس، يا بطل).
2. استخدمي 'setTargetSentence' فوراً لطلب نطق جملة.
3. راقبي النطق بدقة واستخدمي 'updatePronunciation' لكل كلمة فوراً.
4. لو المستخدم غلط، قولي له "دي بسيطة خالص، جرب تاني" وبسطي له النطق بالعربي.
5. ردي دايماً بالمصري العامي المبهج. ممنوع أي كلام تقني ممل.`;
};

export const INITIAL_STATS = {
  name: '',
  gender: 'male' as const,
  streak: 1,
  points: 0,
  level: UserLevel.BEGINNER,
  totalMinutes: 0,
  lastActive: new Date().toISOString(),
  perfectSentences: 0,
  totalWordsLearned: 0,
  customSentences: []
};


import React, { useState, useRef, useEffect } from 'react';
import { getDesignAdvice } from '../services/geminiService';
import { SiteSettings, Language } from '../App';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export const AIChatWidget: React.FC<{ settings: SiteSettings, lang: Language }> = ({ settings, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  const initialAiMsg = lang === 'ar' 
    ? `مرحباً بك في شركة ${settings.brandName.ar}. أنا مساعدك الذكي لخدمات التصدير، كيف أخدمك اليوم؟`
    : `Welcome to ${settings.brandName.en}. I am your smart export assistant. How can I help you?`;

  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: initialAiMsg }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);
    try {
      const aiResponse = await getDesignAdvice(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: lang === 'ar' ? 'عذراً، حدث خطأ في النظام.' : 'Sorry, a system error occurred.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-10 ${lang === 'ar' ? 'right-10' : 'left-10'} z-[60]`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 dynamic-bg shadow-dynamic flex items-center justify-center text-white hover:scale-110 transition-all rounded-full relative group">
        <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-20"></div>
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C12 2 19 7 19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 7 12 2 12 2Z" /></svg>
        )}
      </button>

      {isOpen && (
        <div className={`absolute bottom-24 ${lang === 'ar' ? 'right-0' : 'left-0'} w-[320px] sm:w-[400px] h-[500px] bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-12 duration-500 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 dynamic-bg rounded-xl flex items-center justify-center text-white font-black">{settings.brandName[lang].charAt(0)}</div>
            <div>
              <h3 className="text-slate-900 font-black text-sm">{lang === 'ar' ? 'المستشار الذكي' : 'Smart Consultant'}</h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">{lang === 'ar' ? 'متصل الآن' : 'Online'}</span>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-white scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-[13px] leading-relaxed ${m.role === 'user' ? 'dynamic-bg text-white shadow-lg' : 'bg-slate-50 text-slate-700 border border-slate-100'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-slate-300 text-[10px] animate-pulse px-2">{lang === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}</div>}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 items-center">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
              placeholder={lang === 'ar' ? 'اسأل عن مواصفات التصدير...' : 'Ask about export specs...'} 
              className="flex-grow bg-white border border-slate-200 rounded-xl px-5 py-3 text-sm outline-none focus:border-orange-500 transition-all" 
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()} className="w-12 h-12 dynamic-bg rounded-xl text-white flex items-center justify-center hover:scale-105 transition-all shadow-lg disabled:opacity-50">
              <svg className={`w-5 h-5 ${lang === 'en' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

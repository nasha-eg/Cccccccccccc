
import React, { useState } from 'react';

export const OrderTracker: React.FC<{ lang: 'ar' | 'en' }> = ({ lang }) => {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<null | 'shipping' | 'clearing' | 'ready'>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    // Simple simulation
    const states: ('shipping' | 'clearing' | 'ready')[] = ['shipping', 'clearing', 'ready'];
    setStatus(states[Math.floor(Math.random() * states.length)]);
  };

  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
         <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="BG" />
      </div>
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <span className="text-orange-500 font-black text-xs uppercase tracking-[0.4em] mb-4 block">Logistics Dashboard</span>
        <h2 className="text-4xl md:text-6xl font-black mb-12 tracking-tighter">
          {lang === 'ar' ? 'تتبع شحنتك' : 'Track Your Shipment'}
        </h2>
        
        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4 mb-16 max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder={lang === 'ar' ? 'أدخل رقم الحاوية أو الفاتورة...' : 'Enter Container or Invoice ID...'}
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-grow bg-white/10 border border-white/20 px-8 py-5 rounded-2xl text-white outline-none focus:border-orange-500 transition-all text-lg"
          />
          <button type="submit" className="dynamic-bg text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
            {lang === 'ar' ? 'تتبع الآن' : 'Track Now'}
          </button>
        </form>

        {status && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { id: 'ready', label: { ar: 'تجهيز الشحنة', en: 'Processing' }, icon: '📦' },
                  { id: 'shipping', label: { ar: 'في عرض البحر', en: 'On Transit' }, icon: '🚢' },
                  { id: 'clearing', label: { ar: 'التخليص الجمركي', en: 'Customs' }, icon: '🏗️' }
                ].map((step, idx) => (
                  <div key={idx} className={`p-8 rounded-[2rem] border transition-all ${status === step.id ? 'bg-orange-500 border-orange-500 text-black shadow-2xl scale-110 z-10' : 'bg-white/5 border-white/10 opacity-40'}`}>
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <div className="font-black text-xs uppercase tracking-widest">{step.label[lang]}</div>
                  </div>
                ))}
             </div>
             <p className="mt-12 text-slate-400 italic text-sm">
                {lang === 'ar' ? '* البيانات تخضع للتحديث اللحظي من مكاتبنا في الموانئ.' : '* Data is subject to real-time updates from our port offices.'}
             </p>
          </div>
        )}
      </div>
    </section>
  );
};


import React from 'react';
import { SiteSettings, Language } from '../App';

interface HeroProps {
  settings: SiteSettings;
  lang: Language;
}

export const Hero: React.FC<HeroProps> = ({ settings, lang }) => {
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(lang === 'ar' ? 'استفسار عن أسعار تصدير الفحم' : 'Inquiry about charcoal export prices')}`;

  return (
    <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-white m-0 p-0">
      {/* Background System */}
      <div className="absolute inset-0 z-0">
        <img 
          src={`${settings.heroBg}&auto=format&fit=crop&q=80&w=1920`} 
          alt="Hero" 
          className="w-full h-full object-cover opacity-[0.25]" 
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white"></div>
        {/* Glow Effects to hide white parts */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70rem] h-[70rem] bg-orange-500/5 blur-[250px] rounded-full"></div>
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 text-center max-w-7xl px-6 w-full pt-10 reveal">
        <div className="mb-10 flex flex-col items-center">
           <div className="flex items-center gap-4 mb-8 px-6 py-2.5 bg-white/40 backdrop-blur-3xl rounded-full border border-slate-200 shadow-xl">
             <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></span>
             <span className="text-slate-900 text-[10px] md:text-[11px] font-black tracking-[0.4em] uppercase">
               {lang === 'ar' ? 'الريادة العالمية في إنتاج الفحم' : 'Global Leader in Charcoal Production'}
             </span>
           </div>
        </div>

        <h1 className="text-6xl sm:text-8xl md:text-[9rem] lg:text-[10rem] font-black text-slate-900 mb-8 leading-[0.8] tracking-tighter uppercase drop-shadow-sm">
          {lang === 'ar' ? 'فحم' : ''} <span className="dynamic-text">{settings.brandName[lang]}</span><br />
          <div className="mt-10 flex items-center justify-center gap-6">
             <div className="hidden lg:block w-24 h-[1.5px] bg-slate-100"></div>
             <span className="text-xl sm:text-2xl md:text-3xl font-light text-slate-400 tracking-tight italic">
               {settings.tagline[lang]}
             </span>
             <div className="hidden lg:block w-24 h-[1.5px] bg-slate-100"></div>
          </div>
        </h1>

        <p className="max-w-3xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-14 italic px-4">
          {lang === 'ar' 
            ? "نضع معايير الجودة التي يتبعها الآخرون. فحم نباتي نخب أول بمواصفات كربون عالمية وشحن دولي موثوق."
            : "We set the quality standards others follow. Grade A vegetable charcoal with international carbon specs."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full sm:w-auto px-16 py-6 dynamic-bg text-white font-black uppercase text-[12px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-orange-500/30 rounded-3xl text-center flex items-center justify-center gap-4"
          >
            {lang === 'ar' ? 'اطلب تسعيرة التصدير' : 'Get Export Quote'}
          </a>
          <a 
            href="#منتجاتنا" 
            className="w-full sm:w-auto px-16 py-6 border-2 border-slate-100 bg-white/60 backdrop-blur-xl text-slate-900 font-black uppercase text-[12px] tracking-widest hover:bg-slate-50 transition-all text-center rounded-3xl"
          >
            {lang === 'ar' ? 'استعراض المنتجات' : 'View Products'}
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-20">
         <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-900">Scroll</span>
         <div className="w-[1px] h-12 bg-gradient-to-b from-orange-500 to-transparent"></div>
      </div>
    </section>
  );
};

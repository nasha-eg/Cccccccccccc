
import React, { useState, useEffect } from 'react';
import { SiteSettings, Language, Product, usePreview } from '../App';

const ProductCard: React.FC<{ product: Product, settings: SiteSettings, lang: Language }> = ({ product, settings, lang }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const preview = usePreview();

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % product.images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="reveal group bg-white border border-slate-100 rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_50px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 h-auto lg:min-h-[650px]">
      {/* Product Image Slider Area */}
      <div className="w-full lg:w-1/2 h-[450px] lg:h-auto relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0 flex transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ transform: `translateX(${lang === 'ar' ? currentIdx * 100 : -currentIdx * 100}%)` }}>
          {product.images.map((img, i) => (
            <div key={i} className="min-w-full h-full relative">
              <img 
                src={img || 'https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=40'} 
                alt={`${product.title[lang]} - ${i}`} 
                className="w-full h-full object-cover cursor-zoom-in" 
                onClick={() => preview?.open(product.images, i)}
              />
            </div>
          ))}
        </div>
        
        {/* Slider Controls */}
        {product.images.length > 1 && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20 px-5 py-2.5 bg-black/40 backdrop-blur-3xl rounded-full border border-white/10">
              {product.images.map((_, i) => (
                <button 
                  key={i} 
                  onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }} 
                  className={`h-1.5 rounded-full transition-all duration-700 ${i === currentIdx ? 'bg-orange-500 w-12' : 'bg-white/30 w-3 hover:bg-white'}`}
                />
              ))}
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-8 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
              <button onClick={handlePrev} className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 text-white flex items-center justify-center hover:bg-orange-500 transition-all shadow-2xl pointer-events-auto active:scale-90">
                 <svg className={`w-7 h-7 ${lang === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={handleNext} className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 text-white flex items-center justify-center hover:bg-orange-500 transition-all shadow-2xl pointer-events-auto active:scale-90">
                 <svg className={`w-7 h-7 ${lang === 'ar' ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
            </div>
          </>
        )}

        <div className="absolute top-12 right-12 z-20">
           <div className="w-24 h-24 bg-white/20 backdrop-blur-3xl border border-white/30 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-float">
             {product.icon}
           </div>
        </div>
      </div>

      {/* Product Information Area */}
      <div className="w-full lg:w-1/2 p-12 lg:p-24 flex flex-col justify-between bg-white relative">
        <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
           <div className="flex items-center gap-5 mb-10">
             <div className="w-16 h-1 dynamic-bg rounded-full"></div>
             <span className="text-orange-500 font-black text-[12px] uppercase tracking-[0.6em]">{lang === 'ar' ? 'نخب التصدير الأول' : 'Premium Export Grade'}</span>
           </div>
           <h3 className="text-6xl lg:text-[6rem] font-black text-slate-900 mb-10 leading-[0.85] tracking-tighter group-hover:text-orange-500 transition-colors">
             {product.title[lang]}
           </h3>
           <p className="text-slate-500 text-2xl leading-relaxed mb-16 italic border-r-8 border-orange-50 pr-12 font-light max-w-2xl">
             {product.desc[lang]}
           </p>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-20">
             {product.specs[lang].map((spec, sIdx) => (
               <div key={sIdx} className="flex items-center gap-8 group/spec p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:bg-orange-50 hover:border-orange-100 transition-all">
                 <div className="w-4 h-4 rounded-full dynamic-bg shadow-lg shadow-orange-500/20 group-hover/spec:scale-125 transition-transform"></div>
                 <span className="text-[12px] font-black text-slate-700 uppercase tracking-[0.2em]">{spec}</span>
               </div>
             ))}
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <a 
            href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(product.msg[lang])}`} 
            className="flex-grow py-8 dynamic-bg text-white rounded-[2.5rem] text-center font-black text-[13px] uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-orange-500/20"
          >
            {lang === 'ar' ? 'طلب كوتة التصدير' : 'Request Export Quote'}
          </a>
        </div>
      </div>
    </div>
  );
};

export const Features: React.FC<{ settings: SiteSettings, lang: Language, products: Product[] }> = ({ settings, lang, products }) => {
  if (!products || products.length === 0) return null;
  return (
    <section id="منتجاتنا" className="py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-40 reveal">
          <span className="text-orange-500 font-black tracking-[0.8em] text-[11px] uppercase mb-12 block">{lang === 'ar' ? 'معرض المنتجات الفاخرة' : 'Premium Product Gallery'}</span>
          <h2 className="text-7xl md:text-[12rem] font-black text-slate-900 mb-16 tracking-tighter leading-[0.7]">
            {lang === 'ar' ? 'سلسلة' : 'Elite'} <br/><span className="italic font-light text-slate-200">{lang === 'ar' ? 'الفخامة' : 'Charcoal'}</span>
          </h2>
          <div className="w-40 h-2.5 dynamic-bg mx-auto rounded-full shadow-2xl shadow-orange-500/10"></div>
        </header>
        
        <div className="space-y-48">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} settings={settings} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
};

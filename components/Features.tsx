
import React, { useState } from 'react';
import { SiteSettings, Language, Product } from '../App';

interface FeaturesProps {
  settings: SiteSettings;
  lang: Language;
  products: Product[];
}

const ProductImageSlider: React.FC<{ images: string[], title: string }> = ({ images, title }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
        No Image
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group/slider">
      <img 
        src={`${images[currentIdx]}&auto=format&fit=crop&q=60&w=600`} 
        alt={title} 
        className="w-full h-full object-cover transition-all duration-700" 
        loading="lazy"
        decoding="async"
      />
      
      {images.length > 1 && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          
          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button 
                key={i} 
                onClick={(e) => { e.preventDefault(); setCurrentIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIdx ? 'bg-orange-500 w-4' : 'bg-white/60 hover:bg-white'}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={(e) => { e.preventDefault(); setCurrentIdx(prev => (prev === 0 ? images.length - 1 : prev - 1)); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-black/40"
          >
            ←
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); setCurrentIdx(prev => (prev === images.length - 1 ? 0 : prev + 1)); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-all hover:bg-black/40"
          >
            →
          </button>
        </>
      )}
    </div>
  );
};

export const Features: React.FC<FeaturesProps> = ({ settings, lang, products }) => {
  if (!products || products.length === 0) return null;

  return (
    <section id="منتجاتنا" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-24 max-w-4xl mx-auto reveal">
          <span className="text-orange-500 font-black tracking-[0.5em] text-[11px] uppercase mb-6 block">
            {lang === 'ar' ? 'فهرس النخبة' : 'Elite Index'}
          </span>
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
            {lang === 'ar' ? 'منتجاتنا' : 'Our'} <span className="italic font-light text-slate-300">{lang === 'ar' ? 'الرائدة' : 'Products'}</span>
          </h2>
          <p className="text-slate-500 text-xl font-light leading-relaxed max-w-2xl mx-auto italic">
            {lang === 'ar' 
              ? `أجود أنواع الفحم النباتي المستخرج من مزارع الدلتا، مصنف حسب كثافة الكربون وطول فترة الاشتعال.`
              : `The finest vegetable charcoal from Delta farms, categorized by carbon density and burn duration.`}
          </p>
        </header>
        
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          {products.map((type) => (
            <article key={type.id} className="reveal group relative bg-[#fdfdfd] rounded-[3.5rem] overflow-hidden border border-slate-100 transition-all duration-700 hover:shadow-premium flex flex-col md:flex-row h-full">
              <div className="w-full md:w-2/5 relative overflow-hidden shrink-0">
                <ProductImageSlider images={type.images} title={type.title[lang]} />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/10 via-transparent to-transparent"></div>
              </div>

              <div className="p-12 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-4xl" role="img" aria-label="Icon">{type.icon}</span>
                    <span className="text-[10px] font-black text-orange-500/40 uppercase tracking-[0.3em]">Premium Grade</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-6 group-hover:text-orange-500 transition-colors">{type.title[lang]}</h3>
                  <p className="text-slate-500 font-light text-sm mb-10 leading-relaxed italic opacity-80">
                    {type.desc[lang]}
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6 border-t border-slate-50 pt-8 mb-8">
                    {type.specs[lang].map((spec, idx) => (
                      <div key={idx} className="flex flex-col gap-1">
                        <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">{spec.split(':')[0]}</span>
                        <span className="text-sm font-bold text-slate-700">{spec.split(':')[1]}</span>
                      </div>
                    ))}
                  </div>
                  <a href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(type.msg[lang])}`} className="block w-full py-5 bg-slate-900 text-white rounded-2xl text-center font-black text-[10px] uppercase hover:bg-orange-500 transition-all shadow-lg">
                    {lang === 'ar' ? 'طلب عرض سعر بالجملة' : 'Request Wholesale Quote'}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

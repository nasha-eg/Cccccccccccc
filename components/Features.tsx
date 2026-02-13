
import React from 'react';
import { SiteSettings, Language, Product } from '../App';

interface FeaturesProps {
  settings: SiteSettings;
  lang: Language;
  products: Product[];
}

export const Features: React.FC<FeaturesProps> = ({ settings, lang, products }) => {
  if (!products || products.length === 0) return null;

  return (
    <section id="منتجاتنا" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 max-w-4xl mx-auto reveal">
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
        </div>
        
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          {products.map((type) => (
            <div key={type.id} className="reveal group relative bg-[#fdfdfd] rounded-[3.5rem] overflow-hidden border border-slate-100 transition-all duration-700 hover:shadow-premium flex flex-col md:flex-row h-full">
              <div className="w-full md:w-2/5 relative overflow-hidden shrink-0">
                <img 
                  src={`${type.img}&auto=format&fit=crop&q=50&w=600`} 
                  alt={type.title[lang]} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent"></div>
              </div>

              <div className="p-12 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-4xl">{type.icon}</span>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


import React, { useState } from 'react';
import { SiteSettings, Language, Product, usePreview } from '../App';

const ProductImageSlider: React.FC<{ images: string[], title: string }> = ({ images, title }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const openPreview = usePreview();

  if (!images || images.length === 0) {
    return <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">No Image</div>;
  }

  return (
    <div className="relative w-full h-full group/slider cursor-zoom-in" onClick={() => openPreview(images[currentIdx])}>
      <img src={images[currentIdx]} alt={title} className="w-full h-full object-cover transition-all duration-700" loading="lazy" />
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentIdx(i); }} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIdx ? 'bg-orange-500 w-4' : 'bg-white/60'}`} />
          ))}
        </div>
      )}
    </div>
  );
};

// Fix: Defining FeaturesProps to resolve the "Cannot find name 'FeaturesProps'" error
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
        <header className="text-center mb-24 max-w-4xl mx-auto reveal">
          <span className="text-orange-500 font-black tracking-[0.5em] text-[11px] uppercase mb-6 block">{lang === 'ar' ? 'فهرس النخبة' : 'Elite Index'}</span>
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-none">{lang === 'ar' ? 'منتجاتنا' : 'Our'} <span className="italic font-light text-slate-300">{lang === 'ar' ? 'الرائدة' : 'Products'}</span></h2>
        </header>
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          {products.map((type) => (
            <article key={type.id} className="reveal group relative bg-[#fdfdfd] rounded-[3.5rem] overflow-hidden border border-slate-100 transition-all duration-700 hover:shadow-premium flex flex-col md:flex-row h-full">
              <div className="w-full md:w-2/5 relative overflow-hidden shrink-0"><ProductImageSlider images={type.images} title={type.title[lang]} /></div>
              <div className="p-12 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 mb-6 group-hover:text-orange-500 transition-colors">{type.title[lang]}</h3>
                  <p className="text-slate-500 font-light text-sm mb-10 leading-relaxed italic opacity-80">{type.desc[lang]}</p>
                </div>
                <div className="space-y-6">
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

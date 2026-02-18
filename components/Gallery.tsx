
import React from 'react';
import { Language, SiteSettings, GalleryItem, usePreview } from '../App';

interface GalleryProps {
  lang: Language;
  settings: SiteSettings;
  galleryItems: GalleryItem[];
}

export const Gallery: React.FC<GalleryProps> = ({ lang, settings, galleryItems }) => {
  const preview = usePreview();
  if (!galleryItems || galleryItems.length === 0) return null;

  const handleOpenPreview = (index: number) => {
    const images = galleryItems.map(g => g.img);
    const titles = galleryItems.map(g => `${g.title[lang]} - ${g.category[lang]}`);
    preview?.open(images, index, titles);
  };

  return (
    <section id="المصنع" className="py-32 bg-slate-50 text-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex flex-col lg:flex-row justify-between items-end mb-24 gap-12 reveal ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="max-w-3xl">
            <span className="text-orange-600 font-black tracking-[0.4em] text-xs uppercase mb-4 block">{lang === 'ar' ? 'الواقع من قلب العاصمة' : 'Reality from the Factory'}</span>
            <h2 className="text-5xl md:text-8xl font-black leading-none mb-8 tracking-tighter">{lang === 'ar' ? 'الصور' : 'Real'} <span className="text-slate-300 italic">{lang === 'ar' ? 'الواقعية' : 'Photos'}</span></h2>
            <div className="w-24 h-1 dynamic-bg"></div>
          </div>
          <div className="pb-4">
             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">Premium Export Production Line</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" style={{ perspective: '1000px' }}>
          {galleryItems.map((item, idx) => (
            <div 
              key={item.id} 
              onClick={() => handleOpenPreview(idx)} 
              className="reveal group relative overflow-hidden aspect-[4/5] bg-slate-200 rounded-[3rem] shadow-2xl transition-all duration-700 hover:shadow-orange-600/30 cursor-zoom-in group transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Main Image with Zoom & Smooth Transition */}
              <img 
                src={item.img} 
                alt={item.title[lang]} 
                className="w-full h-full object-cover transition-all duration-[2000ms] group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                loading="lazy" 
              />

              {/* Advanced Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-all duration-700"></div>
              
              {/* Content Holder with 3D Float */}
              <div className="absolute inset-0 p-12 flex flex-col justify-end text-white transition-all duration-700" style={{ transform: 'translateZ(50px)' }}>
                <div className="overflow-hidden mb-2">
                  <span className="block text-[10px] font-black tracking-widest uppercase text-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 delay-100">
                    {item.category[lang]}
                  </span>
                </div>
                <h3 className="text-3xl font-black leading-tight mb-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                  {item.title[lang]}
                </h3>
                
                <div className="w-12 h-1 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-right delay-300"></div>
              </div>

              {/* Corner Zoom Icon */}
              <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:translate-y-0" style={{ transform: 'translateZ(30px)' }}>
                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center reveal">
           <p className="text-slate-400 font-light italic">
             {lang === 'ar' 
                ? "* جميع الصور حقيقية من مواقع العمل الخاصة بمنتجات العاصمة." 
                : "* All images are authentic from Al-Asimh production sites."}
           </p>
        </div>
      </div>
    </section>
  );
};

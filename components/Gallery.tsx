
import React from 'react';
import { Language, SiteSettings, GalleryItem, usePreview } from '../App';

// Fix: Defining GalleryProps to resolve the "Cannot find name 'GalleryProps'" error
interface GalleryProps {
  lang: Language;
  settings: SiteSettings;
  galleryItems: GalleryItem[];
}

export const Gallery: React.FC<GalleryProps> = ({ lang, settings, galleryItems }) => {
  const openPreview = usePreview();
  if (!galleryItems || galleryItems.length === 0) return null;

  return (
    <section id="المصنع" className="py-32 bg-white text-black relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex flex-col lg:flex-row justify-between items-end mb-24 gap-12 reveal ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <div>
            <span className="text-orange-600 font-black tracking-[0.4em] text-xs uppercase mb-4 block">{lang === 'ar' ? 'الواقع من قلب العاصمة' : 'Reality from the Factory'}</span>
            <h2 className="text-5xl md:text-8xl font-black leading-none mb-8 tracking-tighter">{lang === 'ar' ? 'الصور' : 'Real'} <span className="text-slate-300 italic">{lang === 'ar' ? 'الواقعية' : 'Photos'}</span></h2>
          </div>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          {galleryItems.map((item) => (
            <div key={item.id} onClick={() => openPreview(item.img)} className="reveal group relative overflow-hidden aspect-[4/5] bg-slate-900 rounded-[3rem] shadow-2xl transition-all duration-700 hover:shadow-orange-600/10 cursor-zoom-in">
              <img src={item.img} alt={item.title[lang]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-12 text-white">
                <span className="text-xs font-black mb-3 tracking-widest uppercase text-orange-500">{item.category[lang]}</span>
                <h3 className="text-3xl font-black leading-tight mb-4">{item.title[lang]}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


import React from 'react';
import { Language, SiteSettings, GalleryItem } from '../App';

interface GalleryProps {
  lang: Language;
  settings: SiteSettings;
  galleryItems: GalleryItem[];
}

export const Gallery: React.FC<GalleryProps> = ({ lang, settings, galleryItems }) => {
  const whatsappMsg = lang === 'ar' ? 'أريد رؤية المزيد من صور الفرز والإنتاج الحالي' : 'I want to see more photos of current sorting and production';

  if (!galleryItems || galleryItems.length === 0) return null;

  return (
    <section id="المصنع" className="py-32 bg-white text-black relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-600/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex flex-col lg:flex-row justify-between items-end mb-24 gap-12 reveal ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <div>
            <span className="text-orange-600 font-black tracking-[0.4em] text-xs uppercase mb-4 block">
              {lang === 'ar' ? 'الواقع من قلب العاصمة' : 'Reality from the Heart of the Factory'}
            </span>
            <h2 className="text-5xl md:text-8xl font-black leading-none mb-8 tracking-tighter">
              {lang === 'ar' ? 'الصور' : 'Real'} <span className="text-slate-300 italic">{lang === 'ar' ? 'الواقعية' : 'Photos'}</span>
            </h2>
            <p className="text-slate-500 max-w-xl text-lg font-light leading-relaxed italic">
              {lang === 'ar' 
                ? '"نحن لا نخفي شيئاً، نعتز بكل قطعة فحم تخرج من أفراننا وبكل شحنة تغادر موانئنا."' 
                : '"We hide nothing, we take pride in every piece of charcoal leaving our ovens and every shipment leaving our ports."'}
            </p>
          </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          {galleryItems.map((item) => (
            <div key={item.id} className="reveal group relative overflow-hidden aspect-[4/5] bg-slate-900 rounded-[3rem] shadow-2xl transition-all duration-700 hover:shadow-orange-600/10">
              <img 
                src={`${item.img}&auto=format&fit=crop&q=40&w=600`} 
                alt={item.title[lang]} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-12 text-white">
                <span className="text-xs font-black mb-3 tracking-widest uppercase text-orange-500 bg-orange-500/10 w-fit px-3 py-1 rounded-lg">{item.category[lang]}</span>
                <h3 className="text-3xl font-black leading-tight mb-4">{item.title[lang]}</h3>
                <div className="w-12 h-[2px] bg-orange-600 transition-all duration-700 group-hover:w-full"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center reveal">
           <a href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center bg-black text-white px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-orange-600 hover:text-black transition-all group shadow-2xl ${lang === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <span>{lang === 'ar' ? 'طلب صور حية من المصنع الآن' : 'Request Live Photos Now'}</span>
              <svg className={`w-5 h-5 transition-transform ${lang === 'ar' ? 'group-hover:translate-x-[-4px]' : 'rotate-180 group-hover:translate-x-[4px]'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
           </a>
        </div>
      </div>
    </section>
  );
};

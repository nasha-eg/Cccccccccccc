
import React from 'react';
import { Language, Testimonial } from '../App';

interface TestimonialsProps {
  lang: Language;
  testimonials: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ lang, testimonials }) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <div className={`max-w-7xl mx-auto px-6 relative z-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
        <div className="text-center mb-24">
          <span className="ember-text font-bold tracking-[0.5em] uppercase text-xs mb-4 block">
            {lang === 'ar' ? 'ثقة شركائنا' : 'Partners Trust'}
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter">
            {lang === 'ar' ? 'قالوا عن' : 'What they say about'} <span className="text-slate-300 italic font-light tracking-normal">{lang === 'ar' ? 'العاصمة' : 'Us'}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((t) => (
            <div key={t.id} className="group relative pt-12">
              <div className={`absolute top-0 ${lang === 'ar' ? 'right-0' : 'left-0'} text-[10rem] leading-none text-slate-100 font-serif select-none group-hover:text-orange-100 transition-colors pointer-events-none`}>“</div>
              <div className="relative bg-slate-50 p-10 border-t-2 border-transparent group-hover:border-orange-500 transition-all duration-500 h-full rounded-b-xl shadow-sm flex flex-col justify-between">
                <p className="text-slate-600 text-lg leading-relaxed italic mb-10 font-light">
                  {t.content[lang]}
                </p>
                <div className={`flex items-center pt-8 border-t border-slate-200 gap-5`}>
                  <img src={t.avatar} alt={t.name[lang]} className="w-14 h-14 rounded-full border-2 border-white group-hover:border-orange-500 transition-all object-cover shadow-sm" />
                  <div>
                    <h4 className="text-slate-900 font-black text-sm">{t.name[lang]}</h4>
                    <p className="ember-text text-[10px] font-bold uppercase tracking-widest">{t.role[lang]}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

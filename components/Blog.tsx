
import React from 'react';
import { SiteSettings, Language, usePreview } from '../App';

export interface Article {
  id: number;
  title: { ar: string, en: string };
  excerpt: { ar: string, en: string };
  date: { ar: string, en: string };
  img: string;
  category: { ar: string, en: string };
}

export const Blog: React.FC<{ articles: Article[], settings: SiteSettings, lang: Language }> = ({ articles, settings, lang }) => {
  const preview = usePreview();
  if (!articles || articles.length === 0) return null;

  return (
    <section id="المقالات" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="reveal mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
          <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
            <span className="text-orange-500 font-black text-[11px] uppercase tracking-[0.5em] mb-4 block">{lang === 'ar' ? 'المركز المعرفي' : 'Knowledge Center'}</span>
            <h2 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter">{lang === 'ar' ? 'ثقافة' : 'Technical'} <br/><span className="text-slate-200 italic font-light">{lang === 'ar' ? 'الصناعة' : 'Analysis'}</span></h2>
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {articles.map((article) => (
            <article key={article.id} className="reveal group cursor-pointer" onClick={() => preview?.open([article.img], 0)}>
              <div className="relative aspect-[16/9] overflow-hidden rounded-[3rem] shadow-2xl mb-10 bg-slate-100 border border-slate-50">
                <img src={article.img} alt={article.title[lang]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" loading="lazy" />
                <div className="absolute top-8 left-8"><span className="px-5 py-2 dynamic-bg text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg">{article.category[lang]}</span></div>
              </div>
              <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 group-hover:text-orange-500 transition-colors leading-tight">{article.title[lang]}</h3>
                <p className="text-slate-500 text-lg font-light leading-relaxed mb-10 italic">"{article.excerpt[lang]}"</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

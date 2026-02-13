
import React from 'react';
import { SiteSettings, Language } from '../App';

export interface Article {
  id: number;
  title: { ar: string, en: string };
  excerpt: { ar: string, en: string };
  date: { ar: string, en: string };
  img: string;
  category: { ar: string, en: string };
  readTime?: string;
}

export const initialArticles: Article[] = [
  {
    id: 1,
    title: { ar: "أسرار الفرز اليدوي وتأثيره على جودة التصدير", en: "Manual Sorting Secrets and Its Impact on Export Quality" },
    excerpt: { ar: "لماذا نصر في العاصمة على الفرز اليدوي لكل قطعة فحم؟ وكيف يضمن ذلك خلو شحنتك من الأتربة تماماً.", en: "Why we insist on manual sorting for every piece? And how it ensures your shipment is dust-free." },
    date: { ar: "25 مايو 2025", en: "May 25, 2025" },
    img: "https://images.unsplash.com/photo-1599708153386-62e228308412?auto=format&fit=crop&q=80",
    category: { ar: "الجودة الفنية", en: "Technical Quality" },
    readTime: "8 min"
  },
  {
    id: 2,
    title: { ar: "لوجستيات التصدير البحري: حماية الشحنة من الرطوبة", en: "Sea Export Logistics: Protecting Shipments from Moisture" },
    excerpt: { ar: "الدليل الكامل لأنظمة التغليف الرباعي (Quad-Pack) التي نستخدمها لضمان وصول الفحم بحالته المثالية.", en: "The complete guide to Quad-Pack systems we use to ensure charcoal arrives in perfect condition." },
    date: { ar: "20 مايو 2025", en: "May 20, 2025" },
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80",
    category: { ar: "اللوجستيات", en: "Logistics" },
    readTime: "6 min"
  }
];

export const Blog: React.FC<{ articles?: Article[], settings: SiteSettings, lang: Language }> = ({ articles = initialArticles, settings, lang }) => {
  return (
    <section id="المقالات" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="reveal mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
          <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
             <span className="text-orange-500 font-black text-[11px] uppercase tracking-[0.5em] mb-4 block">
              {lang === 'ar' ? 'المركز المعرفي' : 'Knowledge Center'}
            </span>
            <h2 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter">
              {lang === 'ar' ? 'ثقافة' : 'Technical'} <br/>
              <span className="text-slate-200 italic font-light">{lang === 'ar' ? 'الصناعة' : 'Analysis'}</span>
            </h2>
          </div>
          <p className="max-w-sm text-slate-400 font-medium italic text-lg leading-relaxed">
            {lang === 'ar' 
              ? "نشارككم خبراتنا في علوم الفحم واللوجستيات العالمية لضمان تجارة رابحة ومستدامة لعملائنا." 
              : "Sharing our expertise in charcoal science and global logistics to ensure profitable trade for our clients."}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {articles.map((article) => (
            <article key={article.id} className="reveal group cursor-pointer">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[3rem] shadow-2xl mb-10 bg-slate-100 border border-slate-50">
                <img 
                  src={article.img} 
                  alt={article.title[lang]} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                <div className="absolute top-8 left-8">
                   <span className="px-5 py-2 dynamic-bg text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/20">
                     {article.category[lang]}
                   </span>
                </div>
              </div>

              <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                <div className="flex items-center gap-4 mb-6">
                   <span className="text-slate-300 font-black text-[11px] uppercase tracking-widest">{article.date[lang]}</span>
                   <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                   <span className="text-slate-300 font-black text-[10px] uppercase tracking-widest">{article.readTime}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 group-hover:text-orange-500 transition-colors leading-tight">
                  {article.title[lang]}
                </h3>
                <p className="text-slate-500 text-lg font-light leading-relaxed mb-10 italic">
                  "{article.excerpt[lang]}"
                </p>
                <div className="flex items-center gap-4 group/link">
                   <div className="w-12 h-[2px] bg-orange-500 group-hover/link:w-20 transition-all duration-500"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 group-hover/link:text-orange-500">
                     {lang === 'ar' ? 'قراءة التقرير الكامل' : 'Read Full Insights'}
                   </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

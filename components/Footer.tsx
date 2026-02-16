
import React from 'react';
import { SiteSettings, Language } from '../App';

export const Footer: React.FC<{ settings: SiteSettings, lang: Language }> = ({ settings, lang }) => {
  return (
    <footer id="contact" className="bg-white text-slate-900 pt-32 pb-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 dynamic-bg rounded-2xl flex items-center justify-center font-black text-white shadow-lg">
                {settings.brandName[lang].charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-slate-900">{settings.brandName[lang]}</span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-500">Export Enterprise</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed font-light text-sm italic">
              {lang === 'ar' 
                ? `شركة ${settings.brandName.ar} هي المصدر الرائد للفحم النباتي عالي الجودة في منطقة الدلتا، نلتزم بمعايير الجودة العالمية في كل شحنة.` 
                : `${settings.brandName.en} is the premier charcoal exporter from the Delta region, committed to global quality standards.`}
            </p>
          </div>

          <div className="space-y-10">
            <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">{lang === 'ar' ? 'المقر الرئيسي' : 'Headquarters'}</h4>
            <ul className="space-y-4 text-slate-500 text-sm font-medium">
              <li className="flex items-start gap-3">
                <span className="text-orange-500">📍</span>
                {settings.address[lang]}
              </li>
              <li className="flex items-center gap-3">
                <span className="text-orange-500">📞</span>
                {settings.phone}
              </li>
              <li className="flex items-center gap-3">
                <span className="text-orange-500">✉️</span>
                {settings.email}
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 flex flex-col items-center lg:items-end justify-center">
            <div className="bg-slate-50 p-10 rounded-[3.5rem] border border-slate-100 w-full text-center shadow-sm hover:shadow-xl transition-all duration-500">
               <h3 className="text-2xl font-black mb-6 text-slate-900">{lang === 'ar' ? 'هل أنت مستعد لبدء التصدير؟' : 'Ready to start exporting?'}</h3>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={`https://wa.me/${settings.whatsapp}`} className="px-12 py-5 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">WhatsApp Order</a>
                  <a href={`tel:${settings.phone}`} className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">Direct Call</a>
               </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          <div>© {new Date().getFullYear()} {settings.brandName.en} Enterprise. All Rights Reserved.</div>
          <div className="flex items-center gap-6">
             <span>Egyptian Premium Quality</span>
             {/* الرابط مخفي تماماً 1x1 بيكسل في الزاوية */}
             <a 
               href="#admin" 
               className="w-1 h-1 opacity-0 overflow-hidden absolute pointer-events-auto cursor-default"
               title="System Access"
             >
               .
             </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

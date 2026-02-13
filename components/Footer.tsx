
import React from 'react';
import { SiteSettings, Language } from '../App';

export const Footer: React.FC<{ settings: SiteSettings, lang: Language }> = ({ settings, lang }) => {
  return (
    <footer id="contact" className="bg-slate-50 text-slate-900 pt-32 pb-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 dynamic-bg rounded-xl flex items-center justify-center font-black text-white shadow-dynamic">
                {settings.brandName[lang].charAt(0)}
              </div>
              <span className="text-3xl font-black tracking-tighter text-slate-900">{settings.brandName[lang]}</span>
            </div>
            <p className="text-slate-500 leading-relaxed font-light text-sm italic">
              {lang === 'ar' 
                ? `شركة ${settings.brandName.ar} هي المصدر الرائد للفحم النباتي عالي الجودة في مصر، نعتمد على أفضل مزارع الموالح لإنتاج فحم بمواصفات عالمية.` 
                : `${settings.brandName.en} is the leading exporter of high-quality vegetable charcoal in Egypt, utilizing premium citrus farms.`}
            </p>
          </div>

          <div className="space-y-10">
            <h4 className="ember-text font-black text-xs uppercase tracking-widest">{lang === 'ar' ? 'بيانات التواصل' : 'Contact Details'}</h4>
            <ul className="space-y-4 text-slate-600 text-sm font-bold">
              <li>{settings.address[lang]}</li>
              <li><a href={`tel:${settings.phone}`} className="hover:text-orange-500 transition-colors">{settings.phone}</a></li>
              <li className="text-xs opacity-60 font-mono tracking-tight">{settings.email}</li>
            </ul>
          </div>

          <div className="lg:col-span-2 flex flex-col items-center lg:items-end justify-center">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 w-full text-center shadow-premium">
               <h3 className="text-xl font-black mb-6 text-slate-900">{lang === 'ar' ? 'جاهز للتصدير؟' : 'Ready to Export?'}</h3>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href={`https://wa.me/${settings.whatsapp}`} className="px-10 py-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">WhatsApp</a>
                  <a href={`tel:${settings.phone}`} className="px-10 py-4 dynamic-bg text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-dynamic hover:scale-105 transition-all">Call Now</a>
               </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
          <div>© {new Date().getFullYear()} {settings.brandName.en} Charcoal. Premium Egyptian Quality.</div>
          <div className="flex items-center gap-4">
             <span className="opacity-50">Global Quality Standards (FOB/CIF)</span>
             <a href="#/admins" className="hover:text-slate-900 transition-colors opacity-0 hover:opacity-100">DASHBOARD</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

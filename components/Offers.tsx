
import React from 'react';
import { SiteSettings, Language } from '../App';

export interface Offer {
  id: number;
  title: { ar: string, en: string };
  discount: { ar: string, en: string };
  description: { ar: string, en: string };
  expiry: { ar: string, en: string };
  type: { ar: string, en: string };
  isActive: boolean;
}

export const Offers: React.FC<{ offers?: Offer[], settings: SiteSettings, lang: Language }> = ({ offers = [], settings, lang }) => {
  const activeOffers = offers.filter(o => o.isActive);
  if (activeOffers.length === 0) return null;

  return (
    <section id="العروض" className={`py-24 bg-white relative overflow-hidden ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="ember-text font-black text-xs uppercase tracking-[0.4em] mb-4 block">
            {lang === 'ar' ? 'فرص حصرية' : 'Exclusive Opportunities'}
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase">
            {lang === 'ar' ? 'أحدث' : 'Latest'} <span className="italic text-slate-300">{lang === 'ar' ? 'العروض' : 'Offers'}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeOffers.map((offer) => (
            <div key={offer.id} className="group relative bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 overflow-hidden hover:border-orange-500 transition-all duration-500 shadow-sm">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase">{offer.type[lang]}</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">{offer.title[lang]}</h3>
                  <p className="text-slate-500 text-sm font-light leading-relaxed max-w-sm italic">"{offer.description[lang]}"</p>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-white border border-slate-100 p-6 rounded-3xl min-w-[140px] group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-500 shadow-sm">
                  <span className="text-3xl font-black text-orange-500 group-hover:text-white transition-colors">{offer.discount[lang]}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white/60 mt-1">OFFER</span>
                </div>
              </div>

              <div className={`mt-8 pt-8 border-t border-slate-100 flex ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                <a 
                  href={`https://wa.me/${settings.whatsapp}?text=Inquiry about ${offer.title[lang]}`}
                  className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 hover:text-orange-500 transition-colors"
                >
                  <span>{lang === 'ar' ? 'استفد من العرض' : 'Claim Offer'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

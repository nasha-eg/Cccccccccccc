
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

export const initialOffers: Offer[] = [
  {
    id: 1,
    title: { ar: "عرض شحنات الخليج", en: "Gulf Shipments Offer" },
    discount: { ar: "خصم 15%", en: "15% Off" },
    description: { ar: "خصم خاص على طلبيات فحم البرتقال التي تتعدى 50 طن لشهر مايو.", en: "Special discount on Orange Charcoal orders exceeding 50 tons for May." },
    expiry: { ar: "ينتهي خلال 3 أيام", en: "Ends in 3 days" },
    type: { ar: "فحم برتقال", en: "Orange Charcoal" },
    isActive: true
  },
  {
    id: 2,
    title: { ar: "باقة المطاعم الكبرى", en: "Grand Restaurant Package" },
    discount: { ar: "شحن مجاني", en: "Free Shipping" },
    description: { ar: "توصيل مجاني للميناء لأول 3 حاويات فحم مشاوي نخب أول.", en: "Free port delivery for the first 3 containers of premium BBQ charcoal." },
    expiry: { ar: "عرض محدود", en: "Limited Offer" },
    type: { ar: "فحم مشاوي", en: "BBQ Charcoal" },
    isActive: true
  }
];

export const Offers: React.FC<{ offers?: Offer[], settings: SiteSettings, lang: Language }> = ({ offers = initialOffers, settings, lang }) => {
  const activeOffers = offers.filter(o => o.isActive);

  if (activeOffers.length === 0) return null;

  return (
    <section id="العروض" className={`py-24 bg-white relative overflow-hidden ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500/10 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="ember-text font-black text-xs uppercase tracking-[0.4em] mb-4 block animate-bounce">
            {lang === 'ar' ? 'فرص لا تعوض' : 'Unmissable Opportunities'}
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
            {lang === 'ar' ? 'عروض' : ''} <span className="italic text-slate-300">{settings.brandName[lang]} {lang === 'en' ? 'Exclusive Offers' : 'الحصرية'}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeOffers.map((offer) => (
            <div key={offer.id} className="group relative bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 overflow-hidden hover:border-orange-500 transition-all duration-500 shadow-sm">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-4">
                  <div className={`flex items-center gap-3`}>
                    <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase">{offer.type[lang]}</span>
                    <span className="text-orange-500 text-xs font-bold">{offer.expiry[lang]}</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">{offer.title[lang]}</h3>
                  <p className="text-slate-500 text-sm font-light leading-relaxed max-w-sm italic">"{offer.description[lang]}"</p>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-white border border-slate-100 p-6 rounded-3xl min-w-[140px] group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-500 shadow-sm">
                  <span className="text-3xl font-black text-orange-500 group-hover:text-white transition-colors">{offer.discount[lang]}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white/60 mt-1">
                    {lang === 'ar' ? 'وفر الآن' : 'Save Now'}
                  </span>
                </div>
              </div>

              <div className={`mt-8 pt-8 border-t border-slate-100 flex ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                <a 
                  href={`https://wa.me/${settings.whatsapp}?text=Inquiry about ${offer.title[lang]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 hover:text-orange-500 transition-colors"
                >
                  <span>{lang === 'ar' ? 'اغتنم العرض عبر واتساب' : 'Claim Offer on WhatsApp'}</span>
                  <svg className={`w-5 h-5 ${lang === 'en' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth={2}/></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

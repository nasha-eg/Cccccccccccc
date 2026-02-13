
import React, { useState } from 'react';
import { SiteSettings, Language } from '../App';

interface HeaderProps {
  isScrolled: boolean;
  settings: SiteSettings;
  lang: Language;
  toggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isScrolled, settings, lang, toggleLang }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = lang === 'ar' 
    ? [
        { name: 'الرئيسية', link: '#' },
        { name: 'المنتجات', link: '#منتجاتنا' },
        { name: 'المصنع', link: '#المصنع' },
        { name: 'العروض', link: '#العروض' }
      ]
    : [
        { name: 'Home', link: '#' },
        { name: 'Products', link: '#منتجاتنا' },
        { name: 'Factory', link: '#المصنع' },
        { name: 'Offers', link: '#العروض' }
      ];

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-lg border-b border-slate-100 py-3 shadow-md' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 md:w-11 md:h-11 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform overflow-hidden border border-slate-100 p-2">
             <img src={settings.logoUrl} className="w-full h-full object-contain" alt="Logo" />
          </div>
          <div className="flex flex-col">
            <span className={`text-xl md:text-2xl font-black leading-none tracking-tighter text-slate-900`}>{settings.brandName[lang]}</span>
            <span className="text-[8px] md:text-[9px] dynamic-text font-black uppercase tracking-[0.3em] mt-0.5">Premium Export</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10 font-bold">
          {navItems.map((item) => (
            <a key={item.name} href={item.link} className={`text-[10px] font-black uppercase tracking-widest relative group transition-colors text-slate-600 hover:text-orange-500`}>
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] dynamic-bg transition-all group-hover:w-full rounded-full"></span>
            </a>
          ))}
          
          <div className="h-4 w-px bg-slate-200"></div>
          
          <button 
            onClick={toggleLang}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 hover:bg-slate-900 hover:text-white transition-all"
          >
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>
          
          <a href={`https://wa.me/${settings.whatsapp}`} className="dynamic-bg text-white px-8 py-3 text-[10px] font-black rounded-xl shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all uppercase tracking-widest">
            {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </a>
        </div>

        <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-900 border border-slate-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2.5} d="M4 8h16M4 16h16" /></svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-[200] flex flex-col p-10 animate-in fade-in duration-300">
          <button onClick={() => setMobileMenuOpen(false)} className="self-end text-slate-300 hover:text-slate-900 text-5xl mb-12">&times;</button>
          <div className="flex flex-col gap-8">
            {navItems.map(item => (
              <a key={item.name} href={item.link} onClick={() => setMobileMenuOpen(false)} className="text-4xl font-black text-slate-900 hover:text-orange-500 transition-all uppercase tracking-tighter">{item.name}</a>
            ))}
            <div className="h-px bg-slate-100 my-4"></div>
            <button onClick={() => { toggleLang(); setMobileMenuOpen(false); }} className="text-xl font-bold text-slate-400 text-right">
               {lang === 'ar' ? 'English Language' : 'اللغة العربية'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

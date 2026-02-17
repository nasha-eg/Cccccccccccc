
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Offers, Offer } from './components/Offers';
import { Gallery } from './components/Gallery';
import { Blog, Article } from './components/Blog';
import { Testimonials } from './components/Testimonials';
import { AIChatWidget } from './components/AIChatWidget';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { ComparisonSlider } from './components/ComparisonSlider';
import { Stats } from './components/Stats';
import { Certificates } from './components/Certificates';
import { OrderTracker } from './components/OrderTracker';
import * as DATA from './data';

export type Language = 'ar' | 'en';

export interface SiteSettings {
  logoUrl: string;
  favicon: string;
  heroBg: string;
  videoUrlHero: string;
  videoUrlFooter: string;
  brandName: { ar: string, en: string };
  tagline: { ar: string, en: string };
  logoText: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: { ar: string, en: string };
  seoTitle: string;
  seoDescription: string;
  primaryColor: string;
  accentColor: string;
  comparisonBeforeImg: string;
  comparisonAfterImg: string;
}

export interface Product { id: string; title: { ar: string, en: string }; desc: { ar: string, en: string }; specs: { ar: string[], en: string[] }; icon: string; images: string[]; msg: { ar: string, en: string }; }
export interface GalleryItem { id: string; title: { ar: string, en: string }; category: { ar: string, en: string }; img: string; }
export interface Testimonial { id: string; name: { ar: string, en: string }; role: { ar: string, en: string }; content: { ar: string, en: string }; avatar: string; }
export interface StatItem { id: string; value: string; label: { ar: string, en: string }; icon: string; }
export interface CertificateItem { id: string; name: string; img: string; }

const PreviewContext = createContext<(url: string) => void>(() => {});
export const usePreview = () => useContext(PreviewContext);

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdminView, setIsAdminView] = useState(() => window.location.hash === '#admin');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Unified Central State
  const [settings, setSettings] = useState<SiteSettings>(DATA.INITIAL_SETTINGS);
  const [products, setProducts] = useState<Product[]>(DATA.INITIAL_PRODUCTS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DATA.INITIAL_GALLERY);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DATA.INITIAL_TESTIMONIALS);
  const [offers, setOffers] = useState<Offer[]>(DATA.INITIAL_OFFERS);
  const [articles, setArticles] = useState<Article[]>(DATA.INITIAL_ARTICLES);
  const [stats, setStats] = useState<StatItem[]>(DATA.INITIAL_STATS);
  const [certs, setCerts] = useState<CertificateItem[]>(DATA.INITIAL_CERTS);

  useEffect(() => {
    const handleHash = () => setIsAdminView(window.location.hash === '#admin');
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (isAdminView) {
    return (
      <AdminDashboard 
        onLogout={() => { window.location.hash = ''; }} 
        settings={settings} setSettings={setSettings}
        products={products} setProducts={setProducts} 
        galleryItems={galleryItems} setGalleryItems={setGalleryItems}
        testimonials={testimonials} setTestimonials={setTestimonials} 
        offers={offers} setOffers={setOffers} 
        articles={articles} setArticles={setArticles} 
        stats={stats} setStats={setStats} 
        certs={certs} setCerts={setCerts}
      />
    );
  }

  return (
    <PreviewContext.Provider value={setPreviewUrl}>
      <div className={`min-h-screen flex flex-col bg-white overflow-x-hidden ${lang === 'en' ? 'font-sans' : 'font-cairo'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <Header isScrolled={isScrolled} settings={settings} lang={lang} toggleLang={() => setLang(prev => prev === 'ar' ? 'en' : 'ar')} />
        
        <main>
          <Hero settings={settings} lang={lang} />
          <Stats lang={lang} stats={stats} />
          
          <section id="quality" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="reveal order-2 lg:order-1">
                 <ComparisonSlider beforeImage={settings.comparisonBeforeImg} afterImage={settings.comparisonAfterImg} beforeLabel={lang === 'ar' ? 'فحم تقليدي' : 'Market Grade'} afterLabel={lang === 'ar' ? 'نخب العاصمة' : 'Al-Asimh Grade'} />
              </div>
              <div className="reveal order-1 lg:order-2 space-y-8">
                 <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
                   {lang === 'ar' ? 'الجودة التي' : 'The Quality'} <br/><span className="dynamic-text">{lang === 'ar' ? 'تبحث عنها' : 'You Seek'}</span>
                 </h2>
                 <p className="text-slate-500 text-lg leading-relaxed border-l-4 border-orange-500 pl-6 italic">
                   {lang === 'ar' 
                    ? "نحن نضمن لك ثبات المواصفات في كل حاوية، رطوبة أقل، كربون أعلى، واشتعال أطول."
                    : "We guarantee consistent specs in every container: lower moisture, higher carbon, and longer burn time."}
                 </p>
                 <Certificates lang={lang} certs={certs} mini />
              </div>
            </div>
          </section>

          <Features settings={settings} lang={lang} products={products} />
          <OrderTracker lang={lang} />
          <Offers offers={offers} settings={settings} lang={lang} />
          <Gallery lang={lang} settings={settings} galleryItems={galleryItems} />
          <Blog articles={articles} settings={settings} lang={lang} />
          <Testimonials lang={lang} testimonials={testimonials} />
          <Certificates lang={lang} certs={certs} />
        </main>

        <AIChatWidget settings={settings} lang={lang} />
        <Footer settings={settings} lang={lang} />

        {previewUrl && (
          <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setPreviewUrl(null)}>
            <img src={previewUrl} className="max-w-full max-h-full rounded-xl shadow-2xl animate-in zoom-in duration-300" alt="Preview" />
          </div>
        )}
      </div>
    </PreviewContext.Provider>
  );
};

export default App;

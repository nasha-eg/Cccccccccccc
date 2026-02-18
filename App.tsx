
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
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
import { dbService } from './services/dbService';
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

interface PreviewContextType {
  open: (images: string[], index: number, titles?: string[]) => void;
}
const PreviewContext = createContext<PreviewContextType | null>(null);
export const usePreview = () => useContext(PreviewContext);

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdminView, setIsAdminView] = useState(() => window.location.hash === '#admin');
  const [previewData, setPreviewData] = useState<{ images: string[], index: number, titles?: string[] } | null>(null);

  // States
  const [settings, setSettings] = useState<SiteSettings>(DATA.INITIAL_SETTINGS);
  const [products, setProducts] = useState<Product[]>(DATA.INITIAL_PRODUCTS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DATA.INITIAL_GALLERY);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DATA.INITIAL_TESTIMONIALS);
  const [offers, setOffers] = useState<Offer[]>(DATA.INITIAL_OFFERS);
  const [articles, setArticles] = useState<Article[]>(DATA.INITIAL_ARTICLES);
  const [stats, setStats] = useState<StatItem[]>(DATA.INITIAL_STATS);
  const [certs, setCerts] = useState<CertificateItem[]>(DATA.INITIAL_CERTS);

  // Sync from DB
  useEffect(() => {
    const load = async () => {
      const data = await dbService.getAllData();
      if (data) {
        if (data.settings) setSettings(data.settings);
        if (data.products) setProducts(data.products);
        if (data.gallery) setGalleryItems(data.gallery);
        if (data.testimonials) setTestimonials(data.testimonials);
        if (data.offers) setOffers(data.offers);
        if (data.blog) setArticles(data.blog);
        if (data.stats) setStats(data.stats);
        if (data.certs) setCerts(data.certs);
      }
    };
    load();
  }, []);

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!previewData) return;
    setPreviewData(prev => prev ? ({ ...prev, index: (prev.index + 1) % prev.images.length }) : null);
  }, [previewData]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!previewData) return;
    setPreviewData(prev => prev ? ({ ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length }) : null);
  }, [previewData]);

  useEffect(() => {
    const handleHash = () => setIsAdminView(window.location.hash === '#admin');
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!previewData) return;
      if (e.key === 'Escape') setPreviewData(null);
      if (e.key === 'ArrowRight') lang === 'ar' ? prevImage() : nextImage();
      if (e.key === 'ArrowLeft') lang === 'ar' ? nextImage() : prevImage();
    };
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [previewData, lang, nextImage, prevImage]);

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
    <PreviewContext.Provider value={{ open: (images, index, titles) => setPreviewData({ images, index, titles }) }}>
      <div className={`min-h-screen flex flex-col bg-white overflow-x-hidden ${lang === 'en' ? 'font-sans' : 'font-cairo'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <Header isScrolled={isScrolled} settings={settings} lang={lang} toggleLang={() => setLang(prev => prev === 'ar' ? 'en' : 'ar')} />
        <main className="flex-grow">
          <Hero settings={settings} lang={lang} />
          <Stats lang={lang} stats={stats} />
          <section id="quality" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="reveal order-2 lg:order-1"><ComparisonSlider beforeImage={settings.comparisonBeforeImg} afterImage={settings.comparisonAfterImg} /></div>
              <div className="reveal order-1 lg:order-2 space-y-8">
                <h2 className="text-4xl md:text-7xl font-black text-slate-900 leading-tight tracking-tighter uppercase">{lang === 'ar' ? 'جودة تسبق' : 'Quality Beyond'} <br/><span className="dynamic-text italic font-light">{lang === 'ar' ? 'كل التوقعات' : 'All Expectations'}</span></h2>
                <div className="w-20 h-1 dynamic-bg mb-4"></div>
                <p className="text-slate-500 text-lg md:text-xl font-light leading-relaxed border-r-4 border-orange-500 pr-8 italic">{lang === 'ar' ? "في العاصمة، نعتمد على أدق معايير الفرز اليدوي لضمان خلو المنتج من الشوائب والكسر قبل التعبئة." : "At Al-Asimh, we rely on the finest manual sorting standards to ensure the product is free of impurities before packing."}</p>
                <div className="pt-4"><Certificates lang={lang} certs={certs} mini /></div>
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
        {previewData && (
          <div className="fixed inset-0 z-[2000] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 cursor-zoom-out select-none" onClick={() => setPreviewData(null)}>
            <button className="absolute top-10 right-10 text-white/50 hover:text-white text-4xl font-light transition-all z-[2100]">&times;</button>
            <div className="relative max-w-6xl w-full flex flex-col items-center gap-10">
              <img src={previewData.images[previewData.index]} className="max-w-full max-h-[75vh] rounded-3xl shadow-[0_0_100px_rgba(249,115,22,0.3)] animate-in zoom-in duration-500" alt="Full Preview" />
              {previewData.titles && <div className="px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white font-black text-xs uppercase tracking-[0.3em]">{previewData.titles[previewData.index]}</div>}
            </div>
          </div>
        )}
      </div>
    </PreviewContext.Provider>
  );
};

export default App;

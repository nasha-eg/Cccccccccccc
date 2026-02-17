
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Offers, initialOffers, Offer } from './components/Offers';
import { Gallery } from './components/Gallery';
import { Blog, initialArticles, Article } from './components/Blog';
import { Testimonials } from './components/Testimonials';
import { AIChatWidget } from './components/AIChatWidget';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { ComparisonSlider } from './components/ComparisonSlider';
import { OrderTracker } from './components/OrderTracker';
import { Stats } from './components/Stats';
import { Certificates } from './components/Certificates';
import { dbService } from './services/dbService';

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

export interface Product { 
  id: string; 
  title: { ar: string, en: string }; 
  desc: { ar: string, en: string }; 
  specs: { ar: string[], en: string[] }; 
  icon: string; 
  images: string[]; 
  msg: { ar: string, en: string }; 
}

export interface GalleryItem { id: string; title: { ar: string, en: string }; category: { ar: string, en: string }; img: string; }
export interface Testimonial { id: string; name: { ar: string, en: string }; role: { ar: string, en: string }; content: { ar: string, en: string }; avatar: string; }
export interface StatItem { id: string; value: string; label: { ar: string, en: string }; icon: string; }
export interface CertificateItem { id: string; name: string; img: string; }

const PreviewContext = createContext<(url: string) => void>(() => {});
export const usePreview = () => useContext(PreviewContext);

const initialSettings: SiteSettings = {
  logoUrl: "https://cdn-icons-png.flaticon.com/512/7580/7580628.png",
  favicon: "https://cdn-icons-png.flaticon.com/512/7580/7580628.png",
  heroBg: "https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=90",
  videoUrlHero: "", 
  videoUrlFooter: "",
  brandName: { ar: "العاصمة", en: "Al-Asimh" },
  tagline: { ar: "نخب التصدير الأول للفحم المصري", en: "Egypt's Premier Export Grade Charcoal" },
  logoText: "Premium Charcoal",
  whatsapp: "201000187892",
  phone: "01000187892",
  email: "sales@alasimh.net",
  address: { ar: "محافظة دمياط المنطقة الصناعية دمياط الجديدة", en: "New Damietta Industrial Zone, Damietta" },
  seoTitle: "شركة العاصمة للفحم | إنتاج وتصدير فحم نباتي نخب أول",
  seoDescription: "شركة العاصمة للفحم: المصدر الأول للفحم المصري عالي الجودة بمواصفات عالمية.",
  primaryColor: "#f59e0b",
  accentColor: "#fbbf24",
  comparisonBeforeImg: "https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=40",
  comparisonAfterImg: "https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=90",
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdminView, setIsAdminView] = useState(() => window.location.hash.includes('admin'));
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [products, setProducts] = useState<Product[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [certs, setCerts] = useState<CertificateItem[]>([]);

  useEffect(() => {
    const loadEverything = async () => {
      const data = await dbService.getAllData();
      if (data) {
        if (data.site_settings) setSettings(data.site_settings);
        if (data.site_products) setProducts(data.site_products);
        if (data.site_gallery) setGalleryItems(data.site_gallery);
        if (data.site_testimonials) setTestimonials(data.site_testimonials);
        if (data.site_offers) setOffers(data.site_offers);
        if (data.site_articles) setArticles(data.site_articles);
        if (data.site_stats) setStats(data.site_stats);
        if (data.site_certs) setCerts(data.site_certs);
      }
    };
    loadEverything();

    const handleHash = () => setIsAdminView(window.location.hash.includes('admin'));
    window.addEventListener('hashchange', handleHash);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const openPreview = (url: string) => setPreviewUrl(url);

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
    <PreviewContext.Provider value={openPreview}>
      <div className={`min-h-screen flex flex-col bg-white overflow-x-hidden ${lang === 'en' ? 'font-sans' : 'font-cairo'}`}>
        <Header isScrolled={isScrolled} settings={settings} lang={lang} toggleLang={() => setLang(prev => prev === 'ar' ? 'en' : 'ar')} />
        <main className="w-full">
          <Hero settings={settings} lang={lang} />
          <Stats lang={lang} stats={stats} />
          
          <section id="quality" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="reveal order-2 lg:order-1">
                 <ComparisonSlider 
                   beforeImage={settings.comparisonBeforeImg} 
                   afterImage={settings.comparisonAfterImg} 
                   beforeLabel={lang === 'ar' ? 'فحم السوق التقليدي' : 'Market Grade'} 
                   afterLabel={lang === 'ar' ? 'معيار نخب العاصمة' : 'Al-Asimh Grade'} 
                 />
              </div>
              <div className={`reveal order-1 lg:order-2 space-y-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                 <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter">
                   {lang === 'ar' ? 'الجودة التي' : 'The Quality'} <br/>
                   <span className="dynamic-text">{lang === 'ar' ? 'تستحقها شحناتك' : 'Your Cargo Deserves'}</span>
                 </h2>
                 <p className="text-slate-500 text-xl font-light leading-relaxed border-l-4 border-orange-500 pl-8">
                   {lang === 'ar' ? 'نحن نتحكم في كل مرحلة، من الغابات المستدامة إلى ميناء التصدير.' : 'We control every stage, from sustainable forests to the export port.'}
                 </p>
                 <div className="flex gap-4"><Certificates lang={lang} certs={certs} mini /></div>
              </div>
            </div>
          </section>

          <OrderTracker lang={lang} />
          <Features settings={settings} lang={lang} products={products} />
          <Certificates lang={lang} certs={certs} />
          <Offers offers={offers} settings={settings} lang={lang} />
          <Gallery lang={lang} settings={settings} galleryItems={galleryItems} />
          <Blog articles={articles} settings={settings} lang={lang} />
          <Testimonials lang={lang} testimonials={testimonials} />
        </main>
        <AIChatWidget settings={settings} lang={lang} />
        <Footer settings={settings} lang={lang} />

        {/* Lightbox / Preview Overlay */}
        {previewUrl && (
          <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 cursor-zoom-out" onClick={() => setPreviewUrl(null)}>
            <div className="relative max-w-5xl w-full max-h-[90vh] animate-in zoom-in duration-300">
               <button className="absolute -top-14 right-0 text-white text-5xl hover:text-orange-500">&times;</button>
               <img src={previewUrl} className="w-full h-full object-contain rounded-2xl shadow-2xl" alt="Preview" />
            </div>
          </div>
        )}
      </div>
    </PreviewContext.Provider>
  );
};
export default App;


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
import { dbService, DBConfig } from './services/dbService';

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

const DEFAULT_SETTINGS: SiteSettings = {
  logoUrl: "https://cdn-icons-png.flaticon.com/512/7580/7580628.png",
  favicon: "https://cdn-icons-png.flaticon.com/512/7580/7580628.png",
  heroBg: "https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=85",
  videoUrlHero: "", 
  videoUrlFooter: "",
  brandName: { ar: "العاصمة", en: "Al-Asimh" },
  tagline: { ar: "نخب التصدير الأول للفحم المصري", en: "Egypt's Premier Export Grade Charcoal" },
  logoText: "Premium Charcoal",
  whatsapp: "201000187892",
  phone: "01000187892",
  email: "sales@alasimh.net",
  address: { ar: "دمياط - المنطقة الصناعية", en: "Damietta - Industrial Zone" },
  seoTitle: "شركة العاصمة للفحم",
  seoDescription: "تصدير الفحم النباتي",
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
  const [isConfigured, setIsConfigured] = useState(!!dbService.getConfig());
  const [isLoading, setIsLoading] = useState(true);

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [certs, setCerts] = useState<CertificateItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isConfigured) {
        setIsLoading(false);
        return;
      }
      const data = await dbService.getAllData();
      if (data) {
        setSettings(data.site_settings || DEFAULT_SETTINGS);
        setProducts(data.site_products || []);
        setGalleryItems(data.site_gallery || []);
        setTestimonials(data.site_testimonials || []);
        setOffers(data.site_offers || []);
        setArticles(data.site_articles || []);
        setStats(data.site_stats || []);
        setCerts(data.site_certs || []);
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
      setIsLoading(false);
    };
    fetchData();

    const handleHash = () => setIsAdminView(window.location.hash.includes('admin'));
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isConfigured]);

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8 font-cairo" dir="rtl">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 p-10 rounded-[3rem] shadow-2xl text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 dynamic-bg rounded-3xl flex items-center justify-center text-black font-black text-3xl mx-auto mb-8 shadow-xl">A</div>
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">تثبيت نظام العاصمة</h2>
          <p className="text-slate-500 text-xs mb-8 leading-relaxed">أدخل بيانات استضافتك لربط الموقع بقاعدة البيانات MySQL. سيتم إنشاء الجداول تلقائياً.</p>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const conf: DBConfig = {
              host: fd.get('host') as string,
              dbName: fd.get('db') as string,
              user: fd.get('user') as string,
              pass: fd.get('pass') as string,
              mode: 'mysql',
              apiUrl: window.location.origin + '/api.php'
            };
            dbService.setConfig(conf);
            setIsConfigured(true);
          }}>
            <div className="space-y-1 text-right">
              <label className="text-[10px] text-slate-500 font-black pr-2">HOST</label>
              <input name="host" placeholder="localhost" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 transition-all font-sans" required />
            </div>
            <div className="space-y-1 text-right">
              <label className="text-[10px] text-slate-500 font-black pr-2">DATABASE NAME</label>
              <input name="db" placeholder="db_name" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 transition-all font-sans" required />
            </div>
            <div className="space-y-1 text-right">
              <label className="text-[10px] text-slate-500 font-black pr-2">USERNAME</label>
              <input name="user" placeholder="root" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 transition-all font-sans" required />
            </div>
            <div className="space-y-1 text-right">
              <label className="text-[10px] text-slate-500 font-black pr-2">PASSWORD</label>
              <input name="pass" type="password" placeholder="••••••••" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 transition-all font-sans" />
            </div>
            <button type="submit" className="w-full py-5 dynamic-bg text-black font-black rounded-xl hover:scale-[1.02] transition-all uppercase tracking-widest mt-6">اتصال وتثبيت النظام</button>
          </form>
        </div>
      </div>
    );
  }

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing with MySQL Cloud...</div>
      </div>
    );
  }

  if (isAdminView) {
    return (
      <AdminDashboard 
        onLogout={() => { window.location.hash = ''; }} settings={settings} setSettings={setSettings as any}
        products={products} setProducts={setProducts} galleryItems={galleryItems} setGalleryItems={setGalleryItems}
        testimonials={testimonials} setTestimonials={setTestimonials} offers={offers} setOffers={setOffers} 
        articles={articles} setArticles={setArticles} stats={stats} setStats={setStats} certs={certs} setCerts={setCerts}
      />
    );
  }

  return (
    <PreviewContext.Provider value={setPreviewUrl}>
      <div className={`min-h-screen flex flex-col bg-white overflow-x-hidden ${lang === 'en' ? 'font-sans' : 'font-cairo'}`}>
        <Header isScrolled={isScrolled} settings={settings} lang={lang} toggleLang={() => setLang(prev => prev === 'ar' ? 'en' : 'ar')} />
        <main>
          <Hero settings={settings} lang={lang} />
          <Stats lang={lang} stats={stats} />
          <section id="quality" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="reveal order-2 lg:order-1">
                 <ComparisonSlider beforeImage={settings.comparisonBeforeImg} afterImage={settings.comparisonAfterImg} beforeLabel={lang === 'ar' ? 'فحم السوق التقليدي' : 'Market Grade'} afterLabel={lang === 'ar' ? 'معيار نخب العاصمة' : 'Al-Asimh Grade'} />
              </div>
              <div className={`reveal order-1 lg:order-2 space-y-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                 <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter">
                   {lang === 'ar' ? 'الجودة التي' : 'The Quality'} <br/><span className="dynamic-text">{lang === 'ar' ? 'تستحقها شحناتك' : 'Your Cargo Deserves'}</span>
                 </h2>
                 <p className="text-slate-500 text-xl font-light leading-relaxed border-l-4 border-orange-500 pl-8 italic">
                   {lang === 'ar' ? 'نظام سحابي يضمن جودة البيانات والمواصفات الفنية لكل شحنة تخرج من مصانعنا.' : 'Cloud-based system ensuring data integrity and tech specs for every cargo leaving our factory.'}
                 </p>
                 <div className="flex gap-4"><Certificates lang={lang} certs={certs} mini /></div>
              </div>
            </div>
          </section>
          <Features settings={settings} lang={lang} products={products} />
          <Certificates lang={lang} certs={certs} />
          <Offers offers={offers} settings={settings} lang={lang} />
          <Gallery lang={lang} settings={settings} galleryItems={galleryItems} />
          <Blog articles={articles} settings={settings} lang={lang} />
          <Testimonials lang={lang} testimonials={testimonials} />
        </main>
        <AIChatWidget settings={settings} lang={lang} />
        <Footer settings={settings} lang={lang} />
        {previewUrl && (<div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 cursor-zoom-out" onClick={() => setPreviewUrl(null)}><div className="relative max-w-5xl w-full max-h-[90vh] animate-in zoom-in duration-300"><img src={previewUrl} className="w-full h-full object-contain rounded-2xl shadow-2xl" alt="Preview" /></div></div>)}
      </div>
    </PreviewContext.Provider>
  );
};
export default App;

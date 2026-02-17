
import React, { useState, useEffect } from 'react';
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

const initialSettings: SiteSettings = {
  logoUrl: "https://cdn-icons-png.flaticon.com/512/7580/7580628.png",
  favicon: "https://cdn-icons-png.flaticon.com/512/7580/7580628.png",
  heroBg: "https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=90",
  videoUrlHero: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 
  videoUrlFooter: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
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

export const initialStats: StatItem[] = [
  { id: "1", value: '25+', label: { ar: 'دولة تصدير', en: 'Export Countries' }, icon: '🌍' },
  { id: "2", value: '15k', label: { ar: 'طن سنوياً', en: 'Tons Per Year' }, icon: '🚢' },
  { id: "3", value: '12', label: { ar: 'سنة خبرة', en: 'Years Exp' }, icon: '🏆' },
  { id: "4", value: '100%', label: { ar: 'فحم طبيعي', en: 'Natural Product' }, icon: '🌿' }
];

export const initialCerts: CertificateItem[] = [
  { id: "1", name: 'ISO 9001', img: 'https://cdn-icons-png.flaticon.com/512/8146/8146761.png' },
  { id: "2", name: 'Phytosanitary', img: 'https://cdn-icons-png.flaticon.com/512/3514/3514336.png' },
  { id: "3", name: 'SGS Verified', img: 'https://cdn-icons-png.flaticon.com/512/3144/3144456.png' }
];

export const initialTestimonials: Testimonial[] = [
  { 
    id: "1", 
    name: { ar: "أحمد منصور", en: "Ahmed Mansour" }, 
    role: { ar: "مستورد - السعودية", en: "Importer - KSA" }, 
    content: { ar: "التزام كامل بالمواصفات والشفافية في فرز الفحم، شحنة ممتازة وخالية من الأتربة.", en: "Full commitment to specs and transparency in sorting. Excellent dust-free shipment." }, 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200"
  },
  { 
    id: "2", 
    name: { ar: "جون سميث", en: "John Smith" }, 
    role: { ar: "وكيل توزيع - بريطانيا", en: "Distribution Agent - UK" }, 
    content: { ar: "أفضل جودة فحم برتقال تعاملت معها في مصر، احترافية عالية في اللوجستيات.", en: "Best orange charcoal quality I've dealt with in Egypt. Highly professional logistics." }, 
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200"
  }
];

export const initialProducts: Product[] = [
  { 
    id: "1", 
    title: { ar: "فحم البرتقال الفاخر", en: "Premium Orange Charcoal" }, 
    desc: { ar: "يستخرج من أشجار البرتقال المعمرة، يتميز بطول الاشتعال وعدم وجود رائحة أو أدخنة.", en: "Derived from aged orange trees, features long burn time with zero smell or smoke." }, 
    specs: { ar: ["الكربون: 85%+", "الرماد: 1.5%"], en: ["Carbon: 85%+", "Ash: 1.5%"] }, 
    icon: "🍊", 
    images: ["https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=80"], 
    msg: { ar: "استفسار عن فحم البرتقال", en: "Inquiry about Orange Charcoal" } 
  }
];

export const initialGallery: GalleryItem[] = [
  { id: "1", title: { ar: "فرز يدوي دقيق", en: "Precision Sorting" }, category: { ar: "المصنع", en: "Factory" }, img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80" }
];

const getEmbedUrl = (url: string) => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdminView, setIsAdminView] = useState(() => window.location.hash.includes('admin'));
  
  // States
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGallery);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [stats, setStats] = useState<StatItem[]>(initialStats);
  const [certs, setCerts] = useState<CertificateItem[]>(initialCerts);

  useEffect(() => {
    const fetchData = async () => {
      // سحب البيانات من السيرفر (MySQL) أولاً
      const dbData = await dbService.getAllData();
      if (dbData) {
        if (dbData.site_settings) setSettings(dbData.site_settings);
        if (dbData.site_products) setProducts(dbData.site_products);
        if (dbData.site_gallery) setGalleryItems(dbData.site_gallery);
        if (dbData.site_testimonials) setTestimonials(dbData.site_testimonials);
        if (dbData.site_offers) setOffers(dbData.site_offers);
        if (dbData.site_articles) setArticles(dbData.site_articles);
        if (dbData.site_stats) setStats(dbData.site_stats);
        if (dbData.site_certs) setCerts(dbData.site_certs);
      }
    };
    fetchData();

    const handleHashChange = () => setIsAdminView(window.location.hash.includes('admin'));
    window.addEventListener('hashchange', handleHashChange);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

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
    <div className={`min-h-screen flex flex-col bg-white overflow-x-hidden ${lang === 'en' ? 'font-sans' : 'font-cairo'}`}>
      <Header isScrolled={isScrolled} settings={settings} lang={lang} toggleLang={() => setLang(prev => prev === 'ar' ? 'en' : 'ar')} />
      <main className="flex-grow w-full m-0 p-0">
        <Hero settings={settings} lang={lang} />
        <Stats lang={lang} stats={stats} />
        
        <section id="quality" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="reveal order-2 lg:order-1 w-full">
               <ComparisonSlider 
                 beforeImage={settings.comparisonBeforeImg} 
                 afterImage={settings.comparisonAfterImg} 
                 beforeLabel={lang === 'ar' ? 'فحم السوق التقليدي' : 'Traditional Market Grade'} 
                 afterLabel={lang === 'ar' ? 'معيار نخب العاصمة' : 'Capital Premium Grade'} 
               />
            </div>
            <div className={`reveal order-1 lg:order-2 space-y-12 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
               <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-none tracking-tighter uppercase">
                 {lang === 'ar' ? 'الجودة التي لا' : 'The Quality'} <br/>
                 <span className="dynamic-text">{lang === 'ar' ? 'تقبل المساومة' : 'Without Compromise'}</span>
               </h2>
               <p className="text-slate-500 text-xl font-light leading-relaxed italic border-l-4 border-orange-500 pl-8">
                 {lang === 'ar' ? 'كل قطعة فحم تمر عبر نظام فرز يدوي ثلاثي المراحل لضمان نقاء الكربون.' : 'Every piece passes through 3-stage manual sorting.'}
               </p>
               <div className="flex flex-wrap gap-4">
                  <Certificates lang={lang} certs={certs} mini />
               </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#fafafa] border-y border-slate-100">
           <div className="max-w-6xl mx-auto px-6 text-center">
              <div className="reveal aspect-video w-full border-[12px] border-white shadow-premium overflow-hidden rounded-[3.5rem] bg-slate-200">
                 <iframe className="w-full h-full" src={getEmbedUrl(settings.videoUrlHero)} title="Video" frameBorder="0" allowFullScreen></iframe>
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
    </div>
  );
};
export default App;

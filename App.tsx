
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
}

export interface Product { id: string; title: { ar: string, en: string }; desc: { ar: string, en: string }; specs: { ar: string[], en: string[] }; icon: string; img: string; msg: { ar: string, en: string }; }
export interface GalleryItem { id: string; title: { ar: string, en: string }; category: { ar: string, en: string }; img: string; }
export interface Testimonial { id: string; name: { ar: string, en: string }; role: { ar: string, en: string }; content: { ar: string, en: string }; avatar: string; }
export interface StatItem { id: string; value: string; label: { ar: string, en: string }; icon: string; }
export interface CertificateItem { id: string; name: string; img: string; }

// وظيفة مساعدة لتحويل روابط اليوتيوب لروابط Embed
const getEmbedUrl = (url: string) => {
  if (!url) return "";
  if (url.includes('embed/')) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
};

const initialSettings: SiteSettings = {
  logoUrl: "https://cdn-icons-png.flaticon.com/512/7580/7580628.png",
  favicon: "https://cdn-icons-png.flaticon.com/512/7580/7580628.png",
  heroBg: "https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=90",
  videoUrlHero: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
  videoUrlFooter: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  brandName: { ar: "العاصمة", en: "Al-Asimh" },
  tagline: { ar: "نخب التصدير الأول للفحم المصري", en: "Egypt's Premier Export Grade Charcoal" },
  logoText: "Premium Charcoal",
  whatsapp: "201211111111",
  phone: "00201211111111",
  email: "sales@alasimh.net",
  address: { ar: "المنطقة الصناعية، الجيزة، مصر", en: "Industrial Zone, Giza, Egypt" },
  seoTitle: "شركة العاصمة للفحم | إنتاج وتصدير فحم نباتي نخب أول",
  seoDescription: "شركة العاصمة للفحم: المصدر الأول للفحم المصري عالي الجودة بمواصفات عالمية. فحم برتقال، ليمون، ومشاوي.",
  primaryColor: "#f59e0b",
  accentColor: "#fbbf24"
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

export const initialProducts: Product[] = [
  { id: "1", title: { ar: "فحم البرتقال الفاخر", en: "Premium Orange Charcoal" }, desc: { ar: "يستخرج من أشجار البرتقال المعمرة، يتميز بطول الاشتعال وعدم وجود رائحة أو أدخنة.", en: "Derived from aged orange trees, features long burn time with zero smell or smoke." }, specs: { ar: ["الكربون: 85%+", "الرماد: 1.5%", "الرطوبة: <3%", "زمن الاشتعال: 5 ساعات"], en: ["Carbon: 85%+", "Ash: 1.5%", "Moisture: <3%", "Duration: 5h"] }, icon: "🍊", img: "https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=80", msg: { ar: "استفسار عن فحم البرتقال", en: "Inquiry about Orange Charcoal" } },
  { id: "2", title: { ar: "فحم الليمون الصافي", en: "Pure Lemon Charcoal" }, desc: { ar: "مثالي للمطاعم الراقية، يعطي نكهة خفيفة ورماداً أبيض كالثلج.", en: "Ideal for upscale restaurants, provides a light flavor and snow-white ash." }, specs: { ar: ["الكربون: 82%", "الرماد: 2%", "حرارة عالية جداً", "صديق للبيئة"], en: ["Carbon: 82%", "Ash: 2%", "High Heat", "Eco-friendly"] }, icon: "🍋", img: "https://images.unsplash.com/photo-1599708153386-62e228308412?auto=format&fit=crop&q=80", msg: { ar: "استفسار عن فحم الليمون", en: "Inquiry about Lemon Charcoal" } },
  { id: "3", title: { ar: "خليط المشاوي (A1)", en: "BBQ Mix (A1 Grade)" }, desc: { ar: "مزيج من فحم الجوافة والجزورين، مصمم خصيصاً للمطابخ التي تتطلب حرارة مستمرة وقوية.", en: "A blend of Guava and Casuarina, designed for kitchens requiring consistent high heat." }, specs: { ar: ["سريع الاشتعال", "حرارة ثابتة", "أحجام متوسطة", "موفر للمال"], en: ["Fast Ignite", "Stable Heat", "Medium Sizes", "Cost Effective"] }, icon: "🥩", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80", msg: { ar: "استفسار عن خليط المشاوي", en: "Inquiry about BBQ Mix" } }
];

export const initialGallery: GalleryItem[] = [
  { id: "1", title: { ar: "فرز يدوي دقيق", en: "Precision Sorting" }, category: { ar: "المصنع", en: "Factory" }, img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80" },
  { id: "2", title: { ar: "تجهيز حاويات التصدير", en: "Export Containers" }, category: { ar: "الشحن", en: "Shipping" }, img: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80" },
  { id: "3", title: { ar: "فحص جودة الكربون", en: "Carbon Quality Check" }, category: { ar: "المختبر", en: "Lab" }, img: "https://images.unsplash.com/photo-1532187875605-2fe35851142b?auto=format&fit=crop&q=80" }
];

export const initialTestimonials: Testimonial[] = [
  { id: "1", name: { ar: "أحمد منصور", en: "Ahmed Mansour" }, role: { ar: "مستورد - السعودية", en: "Importer - KSA" }, content: { ar: "فحم عالي الجودة والتزام تام بمواعيد الشحن. لم نجد أي كسر في الحاويات.", en: "High quality charcoal and full commitment to schedules. No breakages found in containers." }, avatar: "https://i.pravatar.cc/150?u=1" },
  { id: "2", name: { ar: "جون سميث", en: "John Smith" }, role: { ar: "وكيل - دبي", en: "Agent - Dubai" }, content: { ar: "المعايير التي تقدمها العاصمة تضاهي المنتجات الأوروبية. الفرز اليدوي لديهم مذهل.", en: "Al-Asimh standards match European products. Their manual sorting is amazing." }, avatar: "https://i.pravatar.cc/150?u=2" }
];

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  
  const loadData = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [settings, setSettings] = useState<SiteSettings>(() => loadData('site_settings', initialSettings));
  const [products, setProducts] = useState<Product[]>(() => loadData('site_products', initialProducts));
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => loadData('site_gallery', initialGallery));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => loadData('site_testimonials', initialTestimonials));
  const [offers, setOffers] = useState<Offer[]>(() => loadData('site_offers', initialOffers));
  const [articles, setArticles] = useState<Article[]>(() => loadData('site_articles', initialArticles));
  const [stats, setStats] = useState<StatItem[]>(() => loadData('site_stats', initialStats));
  const [certs, setCerts] = useState<CertificateItem[]>(() => loadData('site_certs', initialCerts));

  const toggleLang = () => setLang(prev => prev === 'ar' ? 'en' : 'ar');

  useEffect(() => {
    localStorage.setItem('site_settings', JSON.stringify(settings));
    localStorage.setItem('site_products', JSON.stringify(products));
    localStorage.setItem('site_gallery', JSON.stringify(galleryItems));
    localStorage.setItem('site_testimonials', JSON.stringify(testimonials));
    localStorage.setItem('site_offers', JSON.stringify(offers));
    localStorage.setItem('site_articles', JSON.stringify(articles));
    localStorage.setItem('site_stats', JSON.stringify(stats));
    localStorage.setItem('site_certs', JSON.stringify(certs));

    document.title = settings.seoTitle;
    document.documentElement.style.setProperty('--primary', settings.primaryColor);
    document.documentElement.style.setProperty('--accent', settings.accentColor);
  }, [settings, products, galleryItems, testimonials, offers, articles, stats, certs]);

  useEffect(() => {
    const checkHash = () => setIsAdminView(window.location.hash === '#/admins');
    window.addEventListener('hashchange', checkHash);
    checkHash();
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', checkHash);
    };
  }, [lang]);

  if (isAdminView) {
    return (
      <AdminDashboard 
        onLogout={() => { window.location.hash = ''; setIsAdminView(false); }} 
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
      <Header isScrolled={isScrolled} settings={settings} lang={lang} toggleLang={toggleLang} />
      <main className="flex-grow w-full m-0 p-0">
        <Hero settings={settings} lang={lang} />
        <Stats lang={lang} stats={stats} />
        
        <section id="quality" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="reveal order-2 lg:order-1 w-full">
               <ComparisonSlider 
                 beforeImage="https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=40" 
                 afterImage="https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=90" 
                 beforeLabel={lang === 'ar' ? 'فحم السوق التقليدي' : 'Market Grade'} 
                 afterLabel={lang === 'ar' ? 'معيار نخب العاصمة' : 'Capital Grade'} 
               />
            </div>
            <div className={`reveal order-1 lg:order-2 space-y-12 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
               <div className="inline-flex items-center gap-4 px-5 py-2 bg-orange-500/10 text-orange-600 rounded-full text-[11px] font-black uppercase tracking-[0.3em] border border-orange-500/20 shadow-sm">
                 <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                 The Quality Standard
               </div>
               <h2 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.8] tracking-tighter">
                 {lang === 'ar' ? 'الجودة التي' : 'Unmatched'} <br/>
                 <span className="dynamic-text">{lang === 'ar' ? 'نتعهد بها دائماً' : 'Consistency'}</span>
               </h2>
               <p className="text-slate-500 text-xl font-light leading-relaxed italic border-l-4 border-orange-500 pl-8">
                 {lang === 'ar' 
                   ? 'نحن لا نكتفي ببيع الفحم، بل نقدم تجربة احترافية تبدأ من الفرز اليدوي الدقيق لكل قطعة وتنتهي بشحن آمن يضمن وصول منتجنا بحالته الأصلية.' 
                   : 'We don\'t just sell charcoal; we provide a professional experience that starts from precision sorting and ends with secure global shipping.'}
               </p>
               <div className="flex flex-wrap gap-4">
                  <Certificates lang={lang} certs={certs} mini />
               </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#fafafa] border-y border-slate-100 relative">
           <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
           <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
              <div className="reveal aspect-video w-full border-[12px] border-white shadow-premium overflow-hidden rounded-[3.5rem] bg-slate-200">
                 <iframe 
                   className="w-full h-full" 
                   src={getEmbedUrl(settings.videoUrlHero)} 
                   title="Factory Tour" 
                   frameBorder="0" 
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowFullScreen
                 ></iframe>
              </div>
              <p className="mt-8 text-slate-400 font-black text-[9px] uppercase tracking-[0.5em]">{lang === 'ar' ? 'جولة حية داخل مصانع العاصمة' : 'Live Tour Inside Capital Factories'}</p>
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

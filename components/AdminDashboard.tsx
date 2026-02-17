
import React, { useState } from 'react';
import { Offer } from './Offers';
import { Article } from './Blog';
import { SiteSettings, Product, GalleryItem, Testimonial, StatItem, CertificateItem } from '../App';

interface AdminDashboardProps {
  onLogout: () => void;
  settings: SiteSettings; 
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  products: Product[]; 
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  galleryItems: GalleryItem[]; 
  setGalleryItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  testimonials: Testimonial[]; 
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  offers: Offer[]; 
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  articles: Article[]; 
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  stats: StatItem[];
  setStats: React.Dispatch<React.SetStateAction<StatItem[]>>;
  certs: CertificateItem[];
  setCerts: React.Dispatch<React.SetStateAction<CertificateItem[]>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('settings');
  const [showCode, setShowCode] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1997') setIsLoggedIn(true);
    else alert('خطأ في كلمة المرور');
  };

  const updateField = (setter: Function, field: string, value: any) => {
    setter((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateItem = (setter: Function, index: number, field: string, value: any, lang?: 'ar'|'en') => {
    setter((prev: any[]) => {
      const copy = [...prev];
      if (lang) {
        copy[index] = { ...copy[index], [field]: { ...copy[index][field], [lang]: value } };
      } else {
        copy[index] = { ...copy[index], [field]: value };
      }
      return copy;
    });
  };

  const deleteItem = (setter: Function, id: string | number) => {
    if (window.confirm('هل أنت متأكد؟')) {
      setter((prev: any[]) => prev.filter(item => item.id !== id));
    }
  };

  const generateCode = () => {
    const data = {
      settings: props.settings,
      products: props.products,
      gallery: props.galleryItems,
      testimonials: props.testimonials,
      stats: props.stats,
      certs: props.certs,
      articles: props.articles,
      offers: props.offers
    };

    return `import { SiteSettings, Product, GalleryItem, Testimonial, StatItem, CertificateItem } from './App';
import { Article } from './components/Blog';
import { Offer } from './components/Offers';

export const INITIAL_SETTINGS: SiteSettings = ${JSON.stringify(data.settings, null, 2)};
export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(data.products, null, 2)};
export const INITIAL_GALLERY: GalleryItem[] = ${JSON.stringify(data.gallery, null, 2)};
export const INITIAL_TESTIMONIALS: Testimonial[] = ${JSON.stringify(data.testimonials, null, 2)};
export const INITIAL_STATS: StatItem[] = ${JSON.stringify(data.stats, null, 2)};
export const INITIAL_CERTS: CertificateItem[] = ${JSON.stringify(data.certs, null, 2)};
export const INITIAL_ARTICLES: Article[] = ${JSON.stringify(data.articles, null, 2)};
export const INITIAL_OFFERS: Offer[] = ${JSON.stringify(data.offers, null, 2)};`;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-cairo" dir="rtl">
        <div className="w-full max-w-sm bg-zinc-900 border border-white/5 p-10 rounded-3xl text-center shadow-2xl">
          <h2 className="text-white text-2xl font-black mb-8 uppercase tracking-tighter">لوحة التحكم</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-center text-2xl outline-none focus:border-orange-500 transition-all" 
              placeholder="••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit" className="w-full py-4 bg-orange-500 text-black font-black rounded-xl hover:bg-orange-400 transition-all">دخول النظام</button>
          </form>
        </div>
      </div>
    );
  }

  const menu = [
    { id: 'settings', label: 'الإعدادات العامة', icon: '⚙️' },
    { id: 'products', label: 'المنتجات', icon: '📦' },
    { id: 'gallery', label: 'المعرض', icon: '🖼️' },
    { id: 'stats', label: 'الأرقام', icon: '📊' },
    { id: 'blog', label: 'المدونة', icon: '📝' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row font-cairo" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-zinc-950 border-l border-white/5 flex flex-col p-6 gap-2">
        <div className="mb-10 p-4 border-b border-white/5">
           <div className="font-black text-orange-500">AL-ASIMH ADMIN</div>
           <div className="text-[10px] text-zinc-500 uppercase tracking-widest">v4.0.1 Stable</div>
        </div>
        {menu.map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-orange-500 text-black' : 'text-zinc-500 hover:bg-white/5'}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
        <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
           <button onClick={() => setShowCode(true)} className="w-full py-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all">تصدير الكود</button>
           <button onClick={props.onLogout} className="w-full py-2 text-zinc-600 text-[10px] uppercase font-black hover:text-red-500 transition-colors">تسجيل الخروج</button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-grow p-8 lg:p-12 overflow-y-auto max-h-screen custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-12">
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-black">إعدادات الهوية</h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">اسم الشركة بالعربي</label>
                  <input className="w-full bg-zinc-900/50 border border-white/5 p-4 rounded-xl outline-none focus:border-orange-500" value={props.settings.brandName.ar} onChange={e => props.setSettings({...props.settings, brandName: {...props.settings.brandName, ar: e.target.value}})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Brand Name (English)</label>
                  <input className="w-full bg-zinc-900/50 border border-white/5 p-4 rounded-xl outline-none focus:border-orange-500 font-sans" dir="ltr" value={props.settings.brandName.en} onChange={e => props.setSettings({...props.settings, brandName: {...props.settings.brandName, en: e.target.value}})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">رابط الشعار</label>
                  <input className="w-full bg-zinc-900/50 border border-white/5 p-4 rounded-xl outline-none focus:border-orange-500 font-sans" dir="ltr" value={props.settings.logoUrl} onChange={e => props.setSettings({...props.settings, logoUrl: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">رقم الواتساب</label>
                  <input className="w-full bg-zinc-900/50 border border-white/5 p-4 rounded-xl outline-none focus:border-orange-500 font-sans" dir="ltr" value={props.settings.whatsapp} onChange={e => props.setSettings({...props.settings, whatsapp: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-black">إدارة المنتجات</h2>
                  <button onClick={() => props.setProducts([{ id: Date.now().toString(), title: { ar: 'منتج جديد', en: 'New Product' }, desc: { ar: 'وصف..', en: 'Desc..' }, specs: { ar: [], en: [] }, icon: '🔥', images: [], msg: { ar: 'طلب', en: 'Order' } }, ...props.products])} className="px-6 py-2 bg-orange-500 text-black font-bold rounded-lg text-sm">+ منتج جديد</button>
               </div>
               <div className="space-y-6">
                 {props.products.map((p, i) => (
                   <div key={p.id} className="bg-zinc-900/40 border border-white/5 p-8 rounded-2xl relative group">
                      <button onClick={() => deleteItem(props.setProducts, p.id)} className="absolute top-4 left-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">حذف</button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="bg-black/50 border border-white/10 p-3 rounded-lg text-white" value={p.title.ar} onChange={e => updateItem(props.setProducts, i, 'title', e.target.value, 'ar')} />
                        <input className="bg-black/50 border border-white/10 p-3 rounded-lg text-white font-sans" dir="ltr" value={p.title.en} onChange={e => updateItem(props.setProducts, i, 'title', e.target.value, 'en')} />
                        <textarea className="bg-black/50 border border-white/10 p-3 rounded-lg text-white h-24 col-span-2" value={p.desc.ar} onChange={e => updateItem(props.setProducts, i, 'desc', e.target.value, 'ar')} />
                        <input className="bg-black/50 border border-white/10 p-3 rounded-lg text-white col-span-2 text-xs" dir="ltr" placeholder="Image URL" value={p.images[0]} onChange={e => updateItem(props.setProducts, i, 'images', [e.target.value])} />
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'gallery' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-3xl font-black">معرض الصور</h2>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 {props.galleryItems.map((g, i) => (
                   <div key={g.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                      <img src={g.img} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-center gap-2">
                        <input className="bg-zinc-800 p-2 text-[10px] rounded" value={g.img} onChange={e => updateItem(props.setGalleryItems, i, 'img', e.target.value)} />
                        <button onClick={() => deleteItem(props.setGalleryItems, g.id)} className="text-red-500 text-[10px] font-bold">حذف الصورة</button>
                      </div>
                   </div>
                 ))}
                 <button onClick={() => props.setGalleryItems([{ id: Date.now().toString(), title: { ar: 'لقطة', en: 'Shot' }, category: { ar: 'عام', en: 'General' }, img: '' }, ...props.galleryItems])} className="aspect-square border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center text-zinc-600 hover:border-orange-500/50 hover:text-orange-500 transition-all">+</button>
               </div>
             </div>
          )}
        </div>
      </main>

      {/* Export Modal */}
      {showCode && (
        <div className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-emerald-500 font-black uppercase tracking-tighter">تصدير البيانات المحدثة</h3>
                 <button onClick={() => setShowCode(false)} className="text-zinc-500 hover:text-white text-3xl">&times;</button>
              </div>
              <p className="text-zinc-500 text-xs mb-4 italic">انسخ هذا الكود واستبدله بالكامل في ملف <code className="text-white bg-white/5 px-2 rounded">data.ts</code> لحفظ التعديلات.</p>
              <textarea readOnly className="flex-grow bg-black/50 text-emerald-400 p-6 rounded-2xl font-mono text-[11px] border border-white/5 outline-none custom-scrollbar mb-6" value={generateCode()} />
              <button onClick={() => { navigator.clipboard.writeText(generateCode()); alert('✅ تم نسخ الكود! قم بلصقه في ملف data.ts الآن.'); }} className="w-full py-4 bg-emerald-500 text-black font-black rounded-xl uppercase tracking-widest text-xs hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-emerald-500/10">نسخ الكود المصدري</button>
           </div>
        </div>
      )}
    </div>
  );
};

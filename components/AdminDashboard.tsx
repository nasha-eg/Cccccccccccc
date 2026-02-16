
import React, { useState, useEffect } from 'react';
import { Offer } from './Offers';
import { Article } from './Blog';
import { SiteSettings, Product, GalleryItem, Testimonial, StatItem, CertificateItem, Language } from '../App';
import { dbService } from '../services/dbService';

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

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, settings, setSettings, products, setProducts, galleryItems, setGalleryItems, 
  testimonials, setTestimonials, offers, setOffers, articles, setArticles, stats, setStats, certs, setCerts
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dbStatus, setDbStatus] = useState<'connected' | 'syncing' | 'error'>('connected');

  const syncToDB = async (tableName: string, data: any) => {
    setDbStatus('syncing');
    const result = await dbService.updateTable(tableName, data);
    if (result.success) {
      setTimeout(() => setDbStatus('connected'), 500);
    } else {
      setDbStatus('error');
    }
  };

  useEffect(() => { if(isLoggedIn) syncToDB('site_settings', settings); }, [settings]);
  useEffect(() => { if(isLoggedIn) syncToDB('site_products', products); }, [products]);
  useEffect(() => { if(isLoggedIn) syncToDB('site_gallery', galleryItems); }, [galleryItems]);
  useEffect(() => { if(isLoggedIn) syncToDB('site_testimonials', testimonials); }, [testimonials]);
  useEffect(() => { if(isLoggedIn) syncToDB('site_offers', offers); }, [offers]);
  useEffect(() => { if(isLoggedIn) syncToDB('site_articles', articles); }, [articles]);
  useEffect(() => { if(isLoggedIn) syncToDB('site_stats', stats); }, [stats]);
  useEffect(() => { if(isLoggedIn) syncToDB('site_certs', certs); }, [certs]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1997') setIsLoggedIn(true);
    else alert("الرمز غير صحيح");
  };

  const updateArray = (setList: Function, index: number, field: string, value: any, lang?: 'ar'|'en') => {
    setList((prev: any[]) => {
      const newList = [...prev];
      if (lang) {
        newList[index][field] = { ...newList[index][field], [lang]: value };
      } else {
        newList[index][field] = value;
      }
      return newList;
    });
  };

  const deleteItem = (setList: Function, id: string | number) => {
    if (window.confirm('حذف نهائي؟')) {
      setList((prev: any[]) => prev.filter((item: any) => item.id !== id));
    }
  };

  const ImageInput = ({ label, value, onChange }: any) => (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <div className="flex gap-4 items-center">
        <input className="flex-grow bg-black/50 border border-white/5 p-3 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-sans" placeholder="رابط الصورة المباشر..." value={value} onChange={e => onChange(e.target.value)} />
        {value && <img src={value} className="w-12 h-12 rounded-lg object-cover border border-white/20" alt="Preview" />}
      </div>
    </div>
  );

  const BilingualInput = ({ label, valueAr, valueEn, onChangeAr, onChangeEn, textarea = false }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-orange-500 uppercase">AR {label}</label>
        {textarea ? (
          <textarea className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-sm text-white" value={valueAr} onChange={e => onChangeAr(e.target.value)} rows={3} />
        ) : (
          <input className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-sm text-white" value={valueAr} onChange={e => onChangeAr(e.target.value)} />
        )}
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-blue-500 uppercase">EN {label}</label>
        {textarea ? (
          <textarea className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-sm text-white font-sans" dir="ltr" value={valueEn} onChange={e => onChangeEn(e.target.value)} rows={3} />
        ) : (
          <input className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-sm text-white font-sans" dir="ltr" value={valueEn} onChange={e => onChangeEn(e.target.value)} />
        )}
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-cairo" dir="rtl">
        <div className="w-full max-w-sm bg-[#080808] border border-orange-500/20 p-10 rounded-[2.5rem] shadow-2xl text-center">
          <div className="w-16 h-16 dynamic-bg rounded-2xl flex items-center justify-center text-black font-black text-2xl mx-auto mb-8 shadow-lg">A</div>
          <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tighter">بوابة الإدارة</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="كلمة المرور" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-center text-2xl outline-none focus:border-orange-500" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
            <button type="submit" className="w-full py-4 dynamic-bg text-black font-black rounded-xl hover:brightness-110 active:scale-95 transition-all uppercase text-xs tracking-widest">فتح النظام</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col lg:flex-row font-cairo" dir="rtl">
      <aside className="w-full lg:w-64 bg-black border-l border-white/5 flex flex-col h-screen sticky top-0 z-50 overflow-y-auto">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
           <div className="w-8 h-8 dynamic-bg rounded-lg flex items-center justify-center text-black font-black">A</div>
           <span className="font-black text-sm uppercase tracking-tighter">AL-ASIMH CMS</span>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-right px-5 py-3.5 rounded-xl flex items-center gap-4 transition-all ${activeTab === item.id ? 'bg-orange-500 text-black font-black' : 'text-slate-500 hover:bg-white/5'}`}>
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-black uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/5">
           <button onClick={onLogout} className="w-full py-3 text-rose-500 text-[10px] font-black uppercase border border-rose-500/10 rounded-lg hover:bg-rose-500 hover:text-white transition-all">خروج</button>
        </div>
      </aside>

      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-black uppercase tracking-tighter">{activeTab} Section</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${dbStatus === 'syncing' ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500 shadow-lg'}`}></div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{dbStatus === 'syncing' ? 'UPDATING...' : 'LIVE CONNECTION'}</span>
            </div>
          </header>

          <div className="space-y-10">
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { l: 'المنتجات', v: products.length, i: '📦', c: 'text-orange-500' },
                  { l: 'المعرض', v: galleryItems.length, i: '🖼️', c: 'text-emerald-500' },
                  { l: 'المقالات', v: articles.length, i: '📝', c: 'text-blue-500' }
                ].map((s, i) => (
                  <div key={i} className="bg-black p-8 rounded-[2rem] border border-white/5 text-center shadow-xl">
                    <span className="text-2xl mb-2 block">{s.i}</span>
                    <span className="text-[10px] text-slate-500 font-black uppercase block mb-1">{s.l}</span>
                    <span className={`text-5xl font-black ${s.c}`}>{s.v}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-8">
                <button onClick={() => setGalleryItems([{ id: Date.now().toString(), title: { ar: 'عنوان جديد', en: 'New Title' }, category: { ar: 'المصنع', en: 'Factory' }, img: 'https://images.unsplash.com/photo-1542366810-449e7769527d' }, ...galleryItems])} className="w-full py-8 border-2 border-dashed border-white/10 rounded-[2rem] text-slate-600 font-black hover:border-emerald-500 hover:text-emerald-500 transition-all text-xs">+ إضافة صورة للمعرض</button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {galleryItems.map((g, i) => (
                    <div key={g.id} className="bg-[#080808] p-6 rounded-[2rem] border border-white/5 relative group">
                      <button onClick={() => deleteItem(setGalleryItems, g.id)} className="absolute top-4 left-4 text-rose-500 text-[9px] font-black uppercase bg-rose-500/10 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all">حذف</button>
                      <ImageInput label="رابط الصورة المباشر" value={g.img} onChange={(v:any) => updateArray(setGalleryItems, i, 'img', v)} />
                      <div className="mt-4 space-y-4">
                        <BilingualInput label="عنوان الصورة" valueAr={g.title.ar} valueEn={g.title.en} onChangeAr={(v:any) => updateArray(setGalleryItems, i, 'title', v, 'ar')} onChangeEn={(v:any) => updateArray(setGalleryItems, i, 'title', v, 'en')} />
                        <BilingualInput label="التصنيف" valueAr={g.category.ar} valueEn={g.category.en} onChangeAr={(v:any) => updateArray(setGalleryItems, i, 'category', v, 'ar')} onChangeEn={(v:any) => updateArray(setGalleryItems, i, 'category', v, 'en')} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'blog' && (
              <div className="space-y-8">
                <button onClick={() => setArticles([{ id: Date.now(), title: { ar: 'عنوان المقال', en: 'Article Title' }, excerpt: { ar: 'ملخص المقال', en: 'Excerpt' }, date: { ar: 'اليوم', en: 'Today' }, img: 'https://images.unsplash.com/photo-1599708153386-62e228308412', category: { ar: 'جودة', en: 'Quality' }, readTime: '5 min' }, ...articles])} className="w-full py-8 border-2 border-dashed border-white/10 rounded-[2rem] text-slate-600 font-black hover:border-blue-500 hover:text-blue-500 transition-all text-xs">+ إضافة مقال جديد</button>
                {articles.map((art, i) => (
                  <div key={art.id} className="bg-[#080808] p-8 rounded-[2.5rem] border border-white/5 relative group space-y-6">
                    <button onClick={() => deleteItem(setArticles, art.id)} className="absolute top-6 left-6 text-rose-500 text-[9px] font-black uppercase bg-rose-500/10 px-4 py-1.5 rounded-lg">حذف المقال</button>
                    <ImageInput label="صورة الغلاف (URL)" value={art.img} onChange={(v:any) => updateArray(setArticles, i, 'img', v)} />
                    <BilingualInput label="عنوان المقال" valueAr={art.title.ar} valueEn={art.title.en} onChangeAr={(v:any) => updateArray(setArticles, i, 'title', v, 'ar')} onChangeEn={(v:any) => updateArray(setArticles, i, 'title', v, 'en')} />
                    <BilingualInput label="ملخص المقال" valueAr={art.excerpt.ar} valueEn={art.excerpt.en} onChangeAr={(v:any) => updateArray(setArticles, i, 'excerpt', v, 'ar')} onChangeEn={(v:any) => updateArray(setArticles, i, 'excerpt', v, 'en')} textarea />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-black p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-6">إعدادات الهوية البصرية</h3>
                <ImageInput label="شعار الشركة (Logo URL)" value={settings.logoUrl} onChange={(v:any) => setSettings({...settings, logoUrl: v})} />
                <ImageInput label="خلفية الموقع (Hero BG)" value={settings.heroBg} onChange={(v:any) => setSettings({...settings, heroBg: v})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageInput label="صورة المقارنة (قبل)" value={settings.comparisonBeforeImg} onChange={(v:any) => setSettings({...settings, comparisonBeforeImg: v})} />
                  <ImageInput label="صورة المقارنة (بعد)" value={settings.comparisonAfterImg} onChange={(v:any) => setSettings({...settings, comparisonAfterImg: v})} />
                </div>
                <BilingualInput label="اسم العلامة" valueAr={settings.brandName.ar} valueEn={settings.brandName.en} onChangeAr={(v:any) => setSettings({...settings, brandName: {...settings.brandName, ar: v}})} onChangeEn={(v:any) => setSettings({...settings, brandName: {...settings.brandName, en: v}})} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const navItems = [
  { id: 'dashboard', label: 'الرئيسية', icon: '🏠' },
  { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
  { id: 'products', label: 'المنتجات', icon: '📦' },
  { id: 'gallery', label: 'المعرض', icon: '🖼️' },
  { id: 'blog', label: 'المدونة', icon: '📝' },
  { id: 'offers', label: 'العروض', icon: '🏷️' },
  { id: 'testimonials', label: 'الآراء', icon: '💬' },
  { id: 'stats', label: 'الأرقام', icon: '📊' },
  { id: 'certs', label: 'الشهادات', icon: '📜' }
];

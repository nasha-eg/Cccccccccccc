
import React, { useState, useEffect } from 'react';
import { Offer } from './Offers';
import { Article } from './Blog';
import { SiteSettings, Product, GalleryItem, Testimonial, StatItem, CertificateItem, Language } from '../App';
import { dbService, DBConfig } from '../services/dbService';

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
  const [dbConfig, setDbConfig] = useState<DBConfig>(dbService.getConfig());

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
    else alert("رمز الأمان غير صحيح");
  };

  const handleDbConfigSave = () => {
    dbService.setConfig(dbConfig);
    alert("تم حفظ إعدادات السيرفر بنجاح. سيتم الربط الآن.");
    window.location.reload();
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
    <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 space-y-3">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
      <div className="flex gap-4 items-center">
        <input className="flex-grow bg-black border border-white/10 p-4 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-sans" placeholder="رابط الصورة المباشر (URL)" value={value} onChange={e => onChange(e.target.value)} />
        {value && <img src={value} className="w-14 h-14 rounded-xl object-cover border border-orange-500/50 shadow-lg" alt="Preview" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=Error')} />}
      </div>
    </div>
  );

  const BilingualInput = ({ label, valueAr, valueEn, onChangeAr, onChangeEn, textarea = false }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
      <div className="space-y-3">
        <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest">العربية - {label}</label>
        {textarea ? (
          <textarea className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm text-white focus:border-orange-500 outline-none transition-all leading-relaxed" value={valueAr} onChange={e => onChangeAr(e.target.value)} rows={4} />
        ) : (
          <input className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm text-white focus:border-orange-500 outline-none transition-all" value={valueAr} onChange={e => onChangeAr(e.target.value)} />
        )}
      </div>
      <div className="space-y-3">
        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">ENGLISH - {label}</label>
        {textarea ? (
          <textarea className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm text-white font-sans focus:border-orange-500 outline-none transition-all leading-relaxed" dir="ltr" value={valueEn} onChange={e => onChangeEn(e.target.value)} rows={4} />
        ) : (
          <input className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm text-white font-sans focus:border-orange-500 outline-none transition-all" dir="ltr" value={valueEn} onChange={e => onChangeEn(e.target.value)} />
        )}
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-cairo" dir="rtl">
        <div className="w-full max-w-sm bg-[#050505] border border-white/5 p-12 rounded-[3.5rem] shadow-2xl text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="w-20 h-20 dynamic-bg rounded-3xl flex items-center justify-center text-black font-black text-3xl mx-auto mb-10 shadow-xl shadow-orange-500/20">A</div>
          <h2 className="text-2xl font-black text-white mb-8 tracking-tighter">بوابة النظام الآمنة</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" placeholder="الرقم السري" className="w-full bg-black border border-white/10 p-6 rounded-2xl text-white text-center text-4xl outline-none focus:border-orange-500 transition-all placeholder:text-white/5" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
            <button type="submit" className="w-full py-6 dynamic-bg text-black font-black rounded-2xl hover:brightness-110 active:scale-95 transition-all uppercase text-xs tracking-widest shadow-lg">فتح لوحة التحكم</button>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: '🏠' },
    { id: 'settings', label: 'الهوية', icon: '⚙️' },
    { id: 'products', label: 'المنتجات', icon: '📦' },
    { id: 'gallery', label: 'المعرض', icon: '🖼️' },
    { id: 'blog', label: 'المدونة', icon: '📝' },
    { id: 'offers', label: 'العروض', icon: '🏷️' },
    { id: 'stats', label: 'الأرقام', icon: '📊' },
    { id: 'mysql', label: 'إعدادات MySQL', icon: '☁️' }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col lg:flex-row font-cairo" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-black border-l border-white/5 flex flex-col h-screen sticky top-0 z-50 overflow-y-auto">
        <div className="p-10 border-b border-white/5 flex items-center gap-4">
           <div className="w-10 h-10 dynamic-bg rounded-xl flex items-center justify-center text-black font-black text-xl shadow-lg">A</div>
           <div className="flex flex-col">
              <span className="font-black text-sm uppercase tracking-tighter">AL-ASIMH CMS</span>
              <span className="text-[9px] font-bold text-orange-500/50 uppercase">Enterprise v3.0</span>
           </div>
        </div>
        <nav className="flex-grow p-6 space-y-2">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-right px-6 py-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${activeTab === item.id ? 'bg-orange-500 text-black font-black shadow-xl shadow-orange-500/10' : 'text-slate-500 hover:bg-white/5'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-black uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5">
           <button onClick={onLogout} className="w-full py-4 text-rose-500 text-[10px] font-black uppercase border border-rose-500/10 rounded-xl hover:bg-rose-500 hover:text-white transition-all">تسجيل الخروج</button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-grow p-8 lg:p-16 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-8">
             <div>
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{activeTab} Interface</h1>
                <div className="flex items-center gap-3 mt-5">
                   <div className={`w-2 h-2 rounded-full ${dbStatus === 'syncing' ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500 shadow-lg shadow-emerald-500/50'}`}></div>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                     {dbStatus === 'syncing' ? 'DATABASE SYNCHRONIZING...' : dbConfig.mode === 'mysql' ? 'CONNECTED TO CLOUD DATABASE' : 'LOCAL MODE ENABLED'}
                   </span>
                </div>
             </div>
          </header>

          <div className="space-y-16">
             
             {activeTab === 'mysql' && (
                <div className="bg-[#050505] p-12 rounded-[4rem] border border-white/5 space-y-10 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl"></div>
                   <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-8">
                      <div className="text-5xl">☁️</div>
                      <div>
                        <h3 className="text-2xl font-black mb-2">إعدادات قاعدة البيانات السحابية</h3>
                        <p className="text-slate-500 text-sm">اربط الموقع بسيرفر MySQL الخارجي لضمان عدم ضياع البيانات عند تغيير المتصفح.</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-3">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">وضع الحفظ (Storage Mode)</label>
                         <div className="flex gap-4">
                            <button onClick={() => setDbConfig({...dbConfig, mode: 'local'})} className={`flex-grow py-5 rounded-2xl font-black text-xs uppercase transition-all ${dbConfig.mode === 'local' ? 'bg-orange-500 text-black shadow-lg' : 'bg-white/5 text-slate-500 border border-white/5'}`}>محلي (Local Storage)</button>
                            <button onClick={() => setDbConfig({...dbConfig, mode: 'mysql'})} className={`flex-grow py-5 rounded-2xl font-black text-xs uppercase transition-all ${dbConfig.mode === 'mysql' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/5 text-slate-500 border border-white/5'}`}>سحابي (External MySQL)</button>
                         </div>
                      </div>

                      {dbConfig.mode === 'mysql' && (
                        <>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">رابط الـ API الخاص بالسيرفر (API Endpoint URL)</label>
                            <input className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 font-sans" placeholder="https://your-domain.com/api" value={dbConfig.apiUrl} onChange={e => setDbConfig({...dbConfig, apiUrl: e.target.value})} />
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">مفتاح الأمان (API Authorization Key)</label>
                            <input type="password" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 font-sans" placeholder="Secret Token" value={dbConfig.apiKey} onChange={e => setDbConfig({...dbConfig, apiKey: e.target.value})} />
                          </div>
                        </>
                      )}

                      <button onClick={handleDbConfigSave} className="w-full py-6 bg-white text-black font-black rounded-[2rem] hover:bg-emerald-500 hover:text-white transition-all uppercase tracking-widest text-xs mt-6">حفظ وتفعيل الإعدادات</button>
                   </div>
                </div>
             )}

             {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {[
                     { l: 'المنتجات المسجلة', v: products.length, i: '📦', c: 'text-orange-500' },
                     { l: 'صور المعرض', v: galleryItems.length, i: '🖼️', c: 'text-emerald-500' },
                     { l: 'المقالات الفنية', v: articles.length, i: '📝', c: 'text-blue-500' }
                   ].map((s, i) => (
                      <div key={i} className="bg-black p-12 rounded-[3.5rem] border border-white/5 text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                        <span className="text-4xl mb-4 block">{s.i}</span>
                        <span className="text-[10px] text-slate-500 font-black uppercase block mb-2 tracking-widest">{s.l}</span>
                        <span className={`text-7xl font-black ${s.c}`}>{s.v}</span>
                      </div>
                   ))}
                </div>
             )}

             {activeTab === 'gallery' && (
                <div className="space-y-12">
                   <button onClick={() => setGalleryItems([{ id: Date.now().toString(), title: { ar: 'صورة جديدة', en: 'New Image' }, category: { ar: 'المصنع', en: 'Factory' }, img: 'https://images.unsplash.com/photo-1542366810-449e7769527d' }, ...galleryItems])} className="w-full py-12 border-2 border-dashed border-white/10 rounded-[3rem] text-slate-600 font-black hover:border-orange-500 hover:text-orange-500 transition-all text-xs uppercase tracking-widest">+ إضافة صورة جديدة للمعرض</button>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {galleryItems.map((g, i) => (
                         <div key={g.id} className="bg-[#080808] p-10 rounded-[3.5rem] border border-white/5 relative group space-y-6">
                            <button onClick={() => deleteItem(setGalleryItems, g.id)} className="absolute top-8 left-8 text-rose-500 text-[10px] font-black uppercase px-4 py-1.5 bg-rose-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all">حذف</button>
                            <ImageInput label="رابط الصورة المباشر" value={g.img} onChange={(v:any) => updateArray(setGalleryItems, i, 'img', v)} />
                            <BilingualInput label="عنوان الصورة" valueAr={g.title.ar} valueEn={g.title.en} onChangeAr={(v:any) => updateArray(setGalleryItems, i, 'title', v, 'ar')} onChangeEn={(v:any) => updateArray(setGalleryItems, i, 'title', v, 'en')} />
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {activeTab === 'blog' && (
                <div className="space-y-12">
                   <button onClick={() => setArticles([{ id: Date.now(), title: { ar: 'مقال فني جديد', en: 'New Technical Article' }, excerpt: { ar: 'ملخص المقال هنا...', en: 'Excerpt here...' }, date: { ar: 'اليوم', en: 'Today' }, img: 'https://images.unsplash.com/photo-1599708153386-62e228308412', category: { ar: 'الجودة', en: 'Quality' }, readTime: '5 min' }, ...articles])} className="w-full py-12 border-2 border-dashed border-white/10 rounded-[3rem] text-slate-600 font-black hover:border-blue-500 hover:text-blue-500 transition-all text-xs uppercase tracking-widest">+ كتابة مقال جديد</button>
                   {articles.map((art, i) => (
                      <div key={art.id} className="bg-[#080808] p-10 rounded-[3.5rem] border border-white/5 relative space-y-8">
                         <button onClick={() => deleteItem(setArticles, art.id)} className="absolute top-8 left-8 text-rose-500 text-[10px] font-black uppercase px-4 py-1.5 bg-rose-500/10 rounded-xl">حذف المقال</button>
                         <ImageInput label="صورة غلاف المقال" value={art.img} onChange={(v:any) => updateArray(setArticles, i, 'img', v)} />
                         <BilingualInput label="عنوان المقال" valueAr={art.title.ar} valueEn={art.title.en} onChangeAr={(v:any) => updateArray(setArticles, i, 'title', v, 'ar')} onChangeEn={(v:any) => updateArray(setArticles, i, 'title', v, 'en')} />
                         <BilingualInput label="الملخص" valueAr={art.excerpt.ar} valueEn={art.excerpt.en} onChangeAr={(v:any) => updateArray(setArticles, i, 'excerpt', v, 'ar')} onChangeEn={(v:any) => updateArray(setArticles, i, 'excerpt', v, 'en')} textarea />
                      </div>
                   ))}
                </div>
             )}

             {activeTab === 'settings' && (
                <div className="bg-black p-12 rounded-[4rem] border border-white/5 space-y-10 shadow-2xl relative">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none"></div>
                   <h3 className="text-xl font-black uppercase tracking-widest text-orange-500 border-b border-white/5 pb-6 mb-8">إعدادات الهوية والبراند</h3>
                   <ImageInput label="شعار الشركة (Logo URL)" value={settings.logoUrl} onChange={(v:any) => setSettings({...settings, logoUrl: v})} />
                   <ImageInput label="خلفية الموقع الرئيسية (Hero BG)" value={settings.heroBg} onChange={(v:any) => setSettings({...settings, heroBg: v})} />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <ImageInput label="صورة المقارنة - قبل" value={settings.comparisonBeforeImg} onChange={(v:any) => setSettings({...settings, comparisonBeforeImg: v})} />
                      <ImageInput label="صورة المقارنة - بعد" value={settings.comparisonAfterImg} onChange={(v:any) => setSettings({...settings, comparisonAfterImg: v})} />
                   </div>
                   <BilingualInput label="اسم العلامة التجارية" valueAr={settings.brandName.ar} valueEn={settings.brandName.en} onChangeAr={(v:any) => setSettings({...settings, brandName: {...settings.brandName, ar: v}})} onChangeEn={(v:any) => setSettings({...settings, brandName: {...settings.brandName, en: v}})} />
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">واتساب</label>
                        <input className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500 font-sans" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الهاتف</label>
                        <input className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500 font-sans" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">الإيميل</label>
                        <input className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500 font-sans" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} />
                      </div>
                   </div>
                </div>
             )}

          </div>
        </div>
      </main>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Offer } from './Offers';
import { Article } from './Blog';
import { SiteSettings, Product, GalleryItem, Testimonial, StatItem, CertificateItem } from '../App';
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1997') setIsLoggedIn(true);
    else alert('كلمة المرور غير صحيحة');
  };

  const sync = async (table: string, data: any) => {
    if (!isLoggedIn) return;
    setDbStatus('syncing');
    const res = await dbService.updateTable(table, data);
    setDbStatus(res.success ? 'connected' : 'error');
  };

  useEffect(() => { if(isLoggedIn) sync('site_settings', settings); }, [settings]);
  useEffect(() => { if(isLoggedIn) sync('site_products', products); }, [products]);
  useEffect(() => { if(isLoggedIn) sync('site_gallery', galleryItems); }, [galleryItems]);
  useEffect(() => { if(isLoggedIn) sync('site_testimonials', testimonials); }, [testimonials]);
  useEffect(() => { if(isLoggedIn) sync('site_offers', offers); }, [offers]);
  useEffect(() => { if(isLoggedIn) sync('site_articles', articles); }, [articles]);
  useEffect(() => { if(isLoggedIn) sync('site_stats', stats); }, [stats]);
  useEffect(() => { if(isLoggedIn) sync('site_certs', certs); }, [certs]);

  const updateArrayItem = (setList: Function, index: number, field: string, value: any, lang?: 'ar'|'en') => {
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

  const moveItem = (setList: Function, index: number, direction: 'up' | 'down') => {
    setList((prev: any[]) => {
      const newList = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newList.length) return prev;
      [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
      return newList;
    });
  };

  const deleteItem = (setList: Function, id: string | number) => {
    if (window.confirm('سيتم حذف هذا العنصر نهائياً من قاعدة بيانات السيرفر. هل أنت متأكد؟')) {
      setList((prev: any[]) => prev.filter(item => item.id !== id));
    }
  };

  const BilingualInput = ({ label, valAr, valEn, setAr, setEn, textarea = false }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
      <div className="space-y-2 text-right">
        <label className="text-[9px] font-black text-orange-500 uppercase tracking-widest">AR - {label}</label>
        {textarea ? 
          <textarea className="w-full bg-black border border-white/10 p-3 rounded-xl text-white outline-none focus:border-orange-500 h-24 text-sm" value={valAr} onChange={e => setAr(e.target.value)} /> :
          <input className="w-full bg-black border border-white/10 p-3 rounded-xl text-white outline-none focus:border-orange-500 text-sm" value={valAr} onChange={e => setAr(e.target.value)} />
        }
      </div>
      <div className="space-y-2 text-left">
        <label className="text-[9px] font-black text-blue-500 uppercase tracking-widest">EN - {label}</label>
        {textarea ? 
          <textarea className="w-full bg-black border border-white/10 p-3 rounded-xl text-white outline-none focus:border-orange-500 h-24 text-sm font-sans" dir="ltr" value={valEn} onChange={e => setEn(e.target.value)} /> :
          <input className="w-full bg-black border border-white/10 p-3 rounded-xl text-white outline-none focus:border-orange-500 text-sm font-sans" dir="ltr" value={valEn} onChange={e => setEn(e.target.value)} />
        }
      </div>
    </div>
  );

  const ImageInput = ({ label, value, onChange }: any) => (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-4 items-center">
      <div className="flex-grow w-full space-y-1 text-right">
        <label className="text-[9px] font-black text-slate-500 uppercase">{label}</label>
        <input className="w-full bg-black border border-white/10 p-3 rounded-xl text-white text-[10px] font-sans outline-none focus:border-orange-500" placeholder="https://..." value={value} onChange={e => onChange(e.target.value)} />
      </div>
      <div className="w-16 h-16 bg-slate-900 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
        {value ? <img src={value} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl opacity-20">🖼️</div>}
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6" dir="rtl">
        <div className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 p-12 rounded-[3rem] text-center shadow-2xl">
          <div className="w-16 h-16 dynamic-bg rounded-2xl flex items-center justify-center text-black font-black text-2xl mx-auto mb-10 shadow-lg shadow-orange-500/20">A</div>
          <h2 className="text-xl font-black text-white mb-8 tracking-tighter uppercase">Admin Core Access</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" placeholder="كلمة المرور" className="w-full bg-black border border-white/10 p-5 rounded-xl text-white text-center text-4xl outline-none focus:border-orange-500 transition-all font-sans" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
            <button type="submit" className="w-full py-5 dynamic-bg text-black font-black rounded-xl hover:scale-105 transition-all uppercase text-[10px] tracking-widest">تحقق ودخول</button>
          </form>
        </div>
      </div>
    );
  }

  const menu = [
    { id: 'dashboard', label: 'الرئيسية', icon: '🏠' },
    { id: 'mysql', label: 'قاعدة البيانات', icon: '☁️' },
    { id: 'settings', label: 'هوية الموقع', icon: '⚙️' },
    { id: 'products', label: 'المنتجات', icon: '📦' },
    { id: 'gallery', label: 'المعرض', icon: '🖼️' },
    { id: 'blog', label: 'المدونة', icon: '📝' },
    { id: 'offers', label: 'العروض', icon: '🏷️' },
    { id: 'stats', label: 'الأرقام', icon: '📊' },
    { id: 'testimonials', label: 'الآراء', icon: '💬' },
    { id: 'certs', label: 'الشهادات', icon: '📜' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row font-cairo" dir="rtl">
      <aside className="w-full lg:w-72 bg-black border-l border-white/5 flex flex-col h-screen sticky top-0 z-50 overflow-y-auto">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 dynamic-bg rounded-lg flex items-center justify-center text-black font-black">A</div>
          <span className="font-black text-xs tracking-tighter uppercase">AL-ASIMH CLOUD</span>
        </div>
        <nav className="flex-grow p-4 space-y-1">
          {menu.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-right px-6 py-4 rounded-xl flex items-center gap-4 transition-all ${activeTab === item.id ? 'bg-orange-500 text-black font-black shadow-lg shadow-orange-500/10' : 'text-slate-500 hover:bg-white/5'}`}>
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="m-6 p-4 border border-rose-500/20 text-rose-500 rounded-xl text-[9px] font-black uppercase hover:bg-rose-500 hover:text-white transition-all">تأمين الخروج</button>
      </aside>

      <main className="flex-grow p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto pb-32">
          <header className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 pb-8">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">{activeTab} Console</h1>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${dbStatus === 'syncing' ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{dbStatus === 'syncing' ? 'DATABASE SYNCING...' : 'CLOUD SYNC ACTIVE'}</span>
              </div>
            </div>
          </header>

          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center">
                  <div className="text-4xl mb-4">📦</div>
                  <div className="text-3xl font-black">{products.length}</div>
                  <div className="text-[10px] text-slate-500 font-black uppercase">منتجات نشطة</div>
                </div>
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center">
                  <div className="text-4xl mb-4">📝</div>
                  <div className="text-3xl font-black">{articles.length}</div>
                  <div className="text-[10px] text-slate-500 font-black uppercase">مقالات منشورة</div>
                </div>
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center">
                  <div className="text-4xl mb-4">🏷️</div>
                  <div className="text-3xl font-black">{offers.filter(o => o.isActive).length}</div>
                  <div className="text-[10px] text-slate-500 font-black uppercase">عروض مفعلة</div>
                </div>
                <div className="col-span-full bg-orange-500/10 p-8 rounded-[2rem] border border-orange-500/20">
                   <h3 className="text-orange-500 font-black mb-2 uppercase text-sm">نظام السيرفر</h3>
                   <p className="text-slate-400 text-xs leading-relaxed">الموقع مرتبط حالياً بقاعدة بيانات MySQL السحابية. أي تغيير يتم هنا يظهر فوراً لزوار الموقع في جميع أنحاء العالم.</p>
                </div>
              </div>
            )}

            {activeTab === 'mysql' && (
              <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1"><label className="text-[10px] text-slate-500 font-black">HOST</label><input className="w-full bg-black border border-white/10 p-3 rounded-xl font-sans text-sm" value={dbConfig.host} onChange={e => setDbConfig({...dbConfig, host: e.target.value})} /></div>
                  <div className="space-y-1"><label className="text-[10px] text-slate-500 font-black">DB NAME</label><input className="w-full bg-black border border-white/10 p-3 rounded-xl font-sans text-sm" value={dbConfig.dbName} onChange={e => setDbConfig({...dbConfig, dbName: e.target.value})} /></div>
                  <div className="space-y-1"><label className="text-[10px] text-slate-500 font-black">USERNAME</label><input className="w-full bg-black border border-white/10 p-3 rounded-xl font-sans text-sm" value={dbConfig.user} onChange={e => setDbConfig({...dbConfig, user: e.target.value})} /></div>
                  <div className="space-y-1"><label className="text-[10px] text-slate-500 font-black">PASSWORD</label><input type="password" className="w-full bg-black border border-white/10 p-3 rounded-xl font-sans text-sm" value={dbConfig.pass} onChange={e => setDbConfig({...dbConfig, pass: e.target.value})} /></div>
                </div>
                <button onClick={() => { dbService.setConfig({...dbConfig, mode: 'mysql'}); window.location.reload(); }} className="w-full py-5 dynamic-bg text-black font-black rounded-2xl shadow-xl uppercase tracking-widest text-xs">حفظ وإعادة تشغيل النظام</button>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                <ImageInput label="شعار الشركة" value={settings.logoUrl} onChange={(v:any) => setSettings({...settings, logoUrl: v})} />
                <ImageInput label="خلفية الواجهة" value={settings.heroBg} onChange={(v:any) => setSettings({...settings, heroBg: v})} />
                <BilingualInput label="اسم العلامة التجارية" valAr={settings.brandName.ar} valEn={settings.brandName.en} setAr={(v:any) => setSettings({...settings, brandName: {...settings.brandName, ar: v}})} setEn={(v:any) => setSettings({...settings, brandName: {...settings.brandName, en: v}})} />
                <BilingualInput label="شعار (Slogan)" valAr={settings.tagline.ar} valEn={settings.tagline.en} setAr={(v:any) => setSettings({...settings, tagline: {...settings.tagline, ar: v}})} setEn={(v:any) => setSettings({...settings, tagline: {...settings.tagline, en: v}})} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1 text-right"><label className="text-[9px] text-slate-500 font-black">WhatsApp</label><input className="w-full bg-black border border-white/10 p-3 rounded-xl text-sm" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} /></div>
                  <div className="space-y-1 text-right"><label className="text-[9px] text-slate-500 font-black">Phone</label><input className="w-full bg-black border border-white/10 p-3 rounded-xl text-sm" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} /></div>
                  <div className="space-y-1 text-right"><label className="text-[9px] text-slate-500 font-black">Email</label><input className="w-full bg-black border border-white/10 p-3 rounded-xl text-sm" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} /></div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-8">
                <button onClick={() => setProducts([{ id: Date.now().toString(), title: { ar: 'صنف جديد', en: 'New Item' }, desc: { ar: 'وصف المنتج...', en: 'Description...' }, specs: { ar: ['عالي الجودة'], en: ['High Quality'] }, icon: '🔥', images: [], msg: { ar: 'طلب تسعير', en: 'Quote request' } }, ...products])} className="w-full py-8 border-2 border-dashed border-white/10 rounded-[2rem] text-slate-500 font-black hover:border-orange-500 hover:text-orange-500 transition-all">+ إضافة منتج جديد للقائمة</button>
                {products.map((p, i) => (
                  <div key={p.id} className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 space-y-6 relative group border-t-2 border-t-orange-500/20">
                    <div className="absolute top-6 left-6 flex gap-2">
                       <button onClick={() => moveItem(setProducts, i, 'up')} className="bg-white/5 p-2 rounded-lg hover:bg-orange-500 hover:text-black transition-all">↑</button>
                       <button onClick={() => moveItem(setProducts, i, 'down')} className="bg-white/5 p-2 rounded-lg hover:bg-orange-500 hover:text-black transition-all">↓</button>
                       <button onClick={() => deleteItem(setProducts, p.id)} className="bg-rose-500/10 text-rose-500 p-2 rounded-lg text-[9px] font-black hover:bg-rose-500 hover:text-white">حذف</button>
                    </div>
                    <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                      <input className="w-12 h-12 bg-black border border-white/10 rounded-xl text-center text-xl" value={p.icon} onChange={e => updateArrayItem(setProducts, i, 'icon', e.target.value)} />
                      <h4 className="font-black text-orange-500 uppercase">Product Details #{i+1}</h4>
                    </div>
                    <BilingualInput label="اسم الصنف" valAr={p.title.ar} valEn={p.title.en} setAr={(v:any) => updateArrayItem(setProducts, i, 'title', v, 'ar')} setEn={(v:any) => updateArrayItem(setProducts, i, 'title', v, 'en')} />
                    <BilingualInput label="الوصف التقني" valAr={p.desc.ar} valEn={p.desc.en} setAr={(v:any) => updateArrayItem(setProducts, i, 'desc', v, 'ar')} setEn={(v:any) => updateArrayItem(setProducts, i, 'desc', v, 'en')} textarea />
                    <ImageInput label="صورة العرض الرئيسية" value={p.images[0] || ''} onChange={(v:any) => updateArrayItem(setProducts, i, 'images', [v])} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button onClick={() => setGalleryItems([{ id: Date.now().toString(), title: { ar: 'صورة جديدة', en: 'New' }, category: { ar: 'المصنع', en: 'Factory' }, img: '' }, ...galleryItems])} className="col-span-full py-10 border-2 border-dashed border-white/10 rounded-3xl text-slate-500 font-black">+ إضافة صورة للمصنع / المعرض</button>
                {galleryItems.map((g, i) => (
                  <div key={g.id} className="bg-[#0a0a0a] p-6 rounded-[2rem] border border-white/5 space-y-4 relative group">
                    <div className="absolute top-4 left-4 flex gap-2">
                       <button onClick={() => moveItem(setGalleryItems, i, 'up')} className="bg-black p-2 rounded-lg text-xs opacity-40 hover:opacity-100 transition-opacity">↑</button>
                       <button onClick={() => deleteItem(setGalleryItems, g.id)} className="bg-rose-500 text-white p-2 rounded-lg text-[8px] font-black">حذف</button>
                    </div>
                    <ImageInput label="صورة المعرض" value={g.img} onChange={(v:any) => updateArrayItem(setGalleryItems, i, 'img', v)} />
                    <BilingualInput label="العنوان" valAr={g.title.ar} valEn={g.title.en} setAr={(v:any) => updateArrayItem(setGalleryItems, i, 'title', v, 'ar')} setEn={(v:any) => updateArrayItem(setGalleryItems, i, 'title', v, 'en')} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'blog' && (
              <div className="space-y-8">
                <button onClick={() => setArticles([{ id: Date.now(), title: { ar: 'عنوان المقال', en: 'Blog Title' }, excerpt: { ar: 'ملخص...', en: 'Excerpt...' }, date: { ar: '2025', en: '2025' }, img: '', category: { ar: 'تقني', en: 'Tech' } }, ...articles])} className="w-full py-8 border-2 border-dashed border-white/10 rounded-2xl text-slate-500 font-black">+ نشر مقال فني جديد</button>
                {articles.map((a, i) => (
                  <div key={a.id} className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 space-y-4 relative">
                    <button onClick={() => deleteItem(setArticles, a.id)} className="absolute top-6 left-6 text-rose-500 font-black text-[9px]">حذف المقال</button>
                    <ImageInput label="صورة المقال" value={a.img} onChange={(v:any) => updateArrayItem(setArticles, i, 'img', v)} />
                    <BilingualInput label="العنوان" valAr={a.title.ar} valEn={a.title.en} setAr={(v:any) => updateArrayItem(setArticles, i, 'title', v, 'ar')} setEn={(v:any) => updateArrayItem(setArticles, i, 'title', v, 'en')} />
                    <BilingualInput label="المحتوى" valAr={a.excerpt.ar} valEn={a.excerpt.en} setAr={(v:any) => updateArrayItem(setArticles, i, 'excerpt', v, 'ar')} setEn={(v:any) => updateArrayItem(setArticles, i, 'excerpt', v, 'en')} textarea />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((s, i) => (
                  <div key={s.id} className="bg-black p-8 rounded-[2rem] border border-white/10 space-y-4">
                    <div className="flex gap-4">
                      <div className="w-1/4"><label className="text-[9px] text-slate-500 font-black">EMOJI</label><input className="w-full bg-black border border-white/10 p-3 rounded-xl text-center text-xl" value={s.icon} onChange={e => updateArrayItem(setStats, i, 'icon', e.target.value)} /></div>
                      <div className="w-3/4"><label className="text-[9px] text-slate-500 font-black">VALUE</label><input className="w-full bg-black border border-white/10 p-3 rounded-xl text-lg font-bold font-sans" value={s.value} onChange={e => updateArrayItem(setStats, i, 'value', e.target.value)} /></div>
                    </div>
                    <BilingualInput label="Label" valAr={s.label.ar} valEn={s.label.en} setAr={(v:any) => updateArrayItem(setStats, i, 'label', v, 'ar')} setEn={(v:any) => updateArrayItem(setStats, i, 'label', v, 'en')} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'offers' && (
              <div className="space-y-8">
                <button onClick={() => setOffers([{ id: Date.now(), title: { ar: 'اسم العرض', en: 'Offer Name' }, discount: { ar: '10%', en: '10%' }, description: { ar: 'تفاصيل العرض...', en: 'Details...' }, expiry: { ar: 'ينتهي قريباً', en: 'Ending soon' }, type: { ar: 'تصدير', en: 'Export' }, isActive: true }, ...offers])} className="w-full py-8 border-2 border-dashed border-white/10 rounded-2xl text-slate-500 font-black">+ إضافة عرض ترويجي</button>
                {offers.map((o, i) => (
                  <div key={o.id} className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 space-y-4 relative">
                    <div className="absolute top-6 left-6 flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-[9px] font-black uppercase text-slate-500">حالة العرض:</span>
                        <input type="checkbox" checked={o.isActive} onChange={e => updateArrayItem(setOffers, i, 'isActive', e.target.checked)} className="w-4 h-4 accent-orange-500" />
                      </label>
                      <button onClick={() => deleteItem(setOffers, o.id)} className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded text-[8px] font-black">إزالة</button>
                    </div>
                    <BilingualInput label="عنوان العرض" valAr={o.title.ar} valEn={o.title.en} setAr={(v:any) => updateArrayItem(setOffers, i, 'title', v, 'ar')} setEn={(v:any) => updateArrayItem(setOffers, i, 'title', v, 'en')} />
                    <BilingualInput label="الخصم / الميزة" valAr={o.discount.ar} valEn={o.discount.en} setAr={(v:any) => updateArrayItem(setOffers, i, 'discount', v, 'ar')} setEn={(v:any) => updateArrayItem(setOffers, i, 'discount', v, 'en')} />
                    <BilingualInput label="التفاصيل" valAr={o.description.ar} valEn={o.description.en} setAr={(v:any) => updateArrayItem(setOffers, i, 'description', v, 'ar')} setEn={(v:any) => updateArrayItem(setOffers, i, 'description', v, 'en')} textarea />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'certs' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button onClick={() => setCerts([{ id: Date.now().toString(), name: 'Certificate Name', img: '' }, ...certs])} className="col-span-full py-10 border-2 border-dashed border-white/10 rounded-[2rem] text-slate-600 font-black uppercase tracking-widest text-[10px]">+ إضافة شهادة جودة دولية</button>
                {certs.map((c, i) => (
                  <div key={c.id} className="bg-[#0a0a0a] p-6 rounded-[2rem] border border-white/5 space-y-4 relative">
                    <button onClick={() => deleteItem(setCerts, c.id)} className="absolute top-4 left-4 text-rose-500 text-[8px] font-black">حذف</button>
                    <ImageInput label="شعار الشهادة" value={c.img} onChange={(v:any) => updateArrayItem(setCerts, i, 'img', v)} />
                    <input className="w-full bg-black border border-white/10 p-3 rounded-xl text-center font-bold text-xs" value={c.name} onChange={e => updateArrayItem(setCerts, i, 'name', e.target.value)} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div className="space-y-8">
                <button onClick={() => setTestimonials([{ id: Date.now().toString(), name: { ar: 'اسم العميل', en: 'Name' }, role: { ar: 'مستورد', en: 'Importer' }, content: { ar: 'رأيه...', en: 'Feedback...' }, avatar: '' }, ...testimonials])} className="w-full py-8 border-2 border-dashed border-white/10 rounded-2xl text-slate-500 font-black">+ إضافة رأي عميل جديد</button>
                {testimonials.map((t, i) => (
                  <div key={t.id} className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 space-y-4 relative">
                    <button onClick={() => deleteItem(setTestimonials, t.id)} className="absolute top-6 left-6 text-rose-500 font-black text-[9px]">حذف التقييم</button>
                    <ImageInput label="صورة العميل" value={t.avatar} onChange={(v:any) => updateArrayItem(setTestimonials, i, 'avatar', v)} />
                    <BilingualInput label="الاسم" valAr={t.name.ar} valEn={t.name.en} setAr={(v:any) => updateArrayItem(setTestimonials, i, 'name', v, 'ar')} setEn={(v:any) => updateArrayItem(setTestimonials, i, 'name', v, 'en')} />
                    <BilingualInput label="الوظيفة / الدولة" valAr={t.role.ar} valEn={t.role.en} setAr={(v:any) => updateArrayItem(setTestimonials, i, 'role', v, 'ar')} setEn={(v:any) => updateArrayItem(setTestimonials, i, 'role', v, 'en')} />
                    <BilingualInput label="الرسالة" valAr={t.content.ar} valEn={t.content.en} setAr={(v:any) => updateArrayItem(setTestimonials, i, 'content', v, 'ar')} setEn={(v:any) => updateArrayItem(setTestimonials, i, 'content', v, 'en')} textarea />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};


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

  // المزامنة اللحظية
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

  const deleteItem = (setList: Function, id: string | number) => {
    if (window.confirm('هل أنت متأكد من الحذف النهائي؟')) {
      setList((prev: any[]) => prev.filter(item => item.id !== id));
    }
  };

  const BilingualInput = ({ label, valAr, valEn, setAr, setEn, textarea = false }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-8 rounded-[2rem] border border-white/5">
      <div className="space-y-2 text-right">
        <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest">AR - {label}</label>
        {textarea ? 
          <textarea className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 h-28" value={valAr} onChange={e => setAr(e.target.value)} /> :
          <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" value={valAr} onChange={e => setAr(e.target.value)} />
        }
      </div>
      <div className="space-y-2 text-left">
        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">EN - {label}</label>
        {textarea ? 
          <textarea className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 h-28 font-sans" dir="ltr" value={valEn} onChange={e => setEn(e.target.value)} /> :
          <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 font-sans" dir="ltr" value={valEn} onChange={e => setEn(e.target.value)} />
        }
      </div>
    </div>
  );

  const ImageInput = ({ label, value, onChange }: any) => (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-6 items-center">
      <div className="flex-grow w-full space-y-2 text-right">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
        <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-xs font-sans outline-none focus:border-orange-500" placeholder="Direct Image URL (https://...)" value={value} onChange={e => onChange(e.target.value)} />
      </div>
      <div className="w-24 h-24 bg-slate-900 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
        {value ? <img src={value} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🖼️</div>}
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6" dir="rtl">
        <div className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 p-12 rounded-[3rem] text-center shadow-2xl">
          <div className="w-16 h-16 dynamic-bg rounded-2xl flex items-center justify-center text-black font-black text-2xl mx-auto mb-10">A</div>
          <h2 className="text-xl font-black text-white mb-8 tracking-tighter uppercase">Admin Core Access</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" placeholder="كلمة المرور" className="w-full bg-black border border-white/10 p-5 rounded-xl text-white text-center text-4xl outline-none focus:border-orange-500 transition-all font-sans" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
            <button type="submit" className="w-full py-5 dynamic-bg text-black font-black rounded-xl hover:scale-105 transition-all uppercase text-[10px] tracking-widest">فتح النظام</button>
          </form>
        </div>
      </div>
    );
  }

  const menu = [
    { id: 'dashboard', label: 'الرئيسية', icon: '🏠' },
    { id: 'mysql', label: 'ربط MySQL', icon: '☁️' },
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
          <span className="font-black text-sm tracking-tighter uppercase">AL-ASIMH CLOUD</span>
        </div>
        <nav className="flex-grow p-4 space-y-1">
          {menu.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-right px-6 py-4 rounded-xl flex items-center gap-4 transition-all ${activeTab === item.id ? 'bg-orange-500 text-black font-black shadow-lg shadow-orange-500/10' : 'text-slate-500 hover:bg-white/5'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-black uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="m-6 p-4 border border-rose-500/20 text-rose-500 rounded-xl text-[10px] font-black uppercase hover:bg-rose-500 hover:text-white transition-all">خروج آمن</button>
      </aside>

      <main className="flex-grow p-8 lg:p-16 overflow-y-auto">
        <div className="max-w-5xl mx-auto pb-32">
          <header className="mb-16 flex justify-between items-center border-b border-white/5 pb-10">
            <div>
              <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">{activeTab} Interface</h1>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${dbStatus === 'syncing' ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{dbStatus === 'syncing' ? 'DATABASE SYNCING...' : 'CLOUD CONNECTED'}</span>
              </div>
            </div>
          </header>

          <div className="space-y-12">
            {activeTab === 'mysql' && (
              <div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-white/10 space-y-8">
                <h3 className="text-2xl font-black border-b border-white/5 pb-6">إعدادات قاعدة البيانات MySQL</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-500">Host (السيرفر)</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl font-sans" value={dbConfig.host} onChange={e => setDbConfig({...dbConfig, host: e.target.value})} /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-500">DB Name (قاعدة البيانات)</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl font-sans" value={dbConfig.dbName} onChange={e => setDbConfig({...dbConfig, dbName: e.target.value})} /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-500">User (المستخدم)</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl font-sans" value={dbConfig.user} onChange={e => setDbConfig({...dbConfig, user: e.target.value})} /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-500">Pass (كلمة السر)</label><input type="password" className="w-full bg-black border border-white/10 p-4 rounded-xl font-sans" value={dbConfig.pass} onChange={e => setDbConfig({...dbConfig, pass: e.target.value})} /></div>
                </div>
                <button onClick={() => { dbService.setConfig({...dbConfig, mode: 'mysql'}); window.location.reload(); }} className="w-full py-6 dynamic-bg text-black font-black rounded-2xl shadow-xl">حفظ وربط قاعدة البيانات</button>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-10">
                <ImageInput label="رابط شعار الشركة" value={settings.logoUrl} onChange={(v:any) => setSettings({...settings, logoUrl: v})} />
                <ImageInput label="خلفية الموقع الرئيسية" value={settings.heroBg} onChange={(v:any) => setSettings({...settings, heroBg: v})} />
                <BilingualInput label="اسم الشركة" valAr={settings.brandName.ar} valEn={settings.brandName.en} setAr={(v:any) => setSettings({...settings, brandName: {...settings.brandName, ar: v}})} setEn={(v:any) => setSettings({...settings, brandName: {...settings.brandName, en: v}})} />
                <BilingualInput label="شعار (Slogan)" valAr={settings.tagline.ar} valEn={settings.tagline.en} setAr={(v:any) => setSettings({...settings, tagline: {...settings.tagline, ar: v}})} setEn={(v:any) => setSettings({...settings, tagline: {...settings.tagline, en: v}})} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase">WhatsApp</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} /></div>
                  <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase">Phone</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} /></div>
                  <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase">Email</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} /></div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-10">
                <button onClick={() => setProducts([{ id: Date.now().toString(), title: { ar: 'صنف جديد', en: 'New Grade' }, desc: { ar: 'وصف المنتج...', en: 'Description...' }, specs: { ar: [], en: [] }, icon: '🔥', images: [], msg: { ar: 'استفسار', en: 'Inquiry' } }, ...products])} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black">+ إضافة صنف جديد</button>
                {products.map((p, i) => (
                  <div key={p.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-6 relative group">
                    <button onClick={() => deleteItem(setProducts, p.id)} className="absolute top-8 left-8 text-rose-500 text-[10px] font-black px-4 py-2 bg-rose-500/10 rounded-xl">حذف</button>
                    <BilingualInput label="اسم المنتج" valAr={p.title.ar} valEn={p.title.en} setAr={(v:any) => updateArrayItem(setProducts, i, 'title', v, 'ar')} setEn={(v:any) => updateArrayItem(setProducts, i, 'title', v, 'en')} />
                    <BilingualInput label="وصف المنتج" valAr={p.desc.ar} valEn={p.desc.en} setAr={(v:any) => updateArrayItem(setProducts, i, 'desc', v, 'ar')} setEn={(v:any) => updateArrayItem(setProducts, i, 'desc', v, 'en')} textarea />
                    <ImageInput label="رابط صورة المنتج" value={p.images[0] || ''} onChange={(v:any) => updateArrayItem(setProducts, i, 'images', [v])} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'blog' && (
              <div className="space-y-10">
                <button onClick={() => setArticles([{ id: Date.now(), title: { ar: 'عنوان المقال', en: 'Blog Title' }, excerpt: { ar: 'ملخص المقال...', en: 'Excerpt...' }, date: { ar: '2025', en: '2025' }, img: '', category: { ar: 'جودة', en: 'Quality' } }, ...articles])} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black">+ نشر مقال جديد</button>
                {articles.map((a, i) => (
                  <div key={a.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-6 relative">
                    <button onClick={() => deleteItem(setArticles, a.id)} className="absolute top-8 left-8 text-rose-500 text-[10px] font-black px-4 py-2 bg-rose-500/10 rounded-xl">حذف</button>
                    <ImageInput label="رابط صورة المقال" value={a.img} onChange={(v:any) => updateArrayItem(setArticles, i, 'img', v)} />
                    <BilingualInput label="عنوان المقال" valAr={a.title.ar} valEn={a.title.en} setAr={(v:any) => updateArrayItem(setArticles, i, 'title', v, 'ar')} setEn={(v:any) => updateArrayItem(setArticles, i, 'title', v, 'en')} />
                    <BilingualInput label="محتوى المقال" valAr={a.excerpt.ar} valEn={a.excerpt.en} setAr={(v:any) => updateArrayItem(setArticles, i, 'excerpt', v, 'ar')} setEn={(v:any) => updateArrayItem(setArticles, i, 'excerpt', v, 'en')} textarea />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button onClick={() => setGalleryItems([{ id: Date.now().toString(), title: { ar: 'صورة جديدة', en: 'New Photo' }, category: { ar: 'المصنع', en: 'Factory' }, img: '' }, ...galleryItems])} className="col-span-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black">+ إضافة صورة للمعرض</button>
                {galleryItems.map((g, i) => (
                  <div key={g.id} className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 space-y-4 relative group">
                    <button onClick={() => deleteItem(setGalleryItems, g.id)} className="absolute top-6 left-6 text-rose-500 text-[9px] font-black">حذف</button>
                    <ImageInput label="رابط الصورة" value={g.img} onChange={(v:any) => updateArrayItem(setGalleryItems, i, 'img', v)} />
                    <BilingualInput label="العنوان" valAr={g.title.ar} valEn={g.title.en} setAr={(v:any) => updateArrayItem(setGalleryItems, i, 'title', v, 'ar')} setEn={(v:any) => updateArrayItem(setGalleryItems, i, 'title', v, 'en')} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'offers' && (
              <div className="space-y-10">
                <button onClick={() => setOffers([{ id: Date.now(), title: { ar: 'عنوان العرض', en: 'Offer Title' }, discount: { ar: '10%', en: '10%' }, description: { ar: 'وصف العرض...', en: 'Description...' }, expiry: { ar: 'ينتهي قريباً', en: 'Ending soon' }, type: { ar: 'تصدير', en: 'Export' }, isActive: true }, ...offers])} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black">+ إضافة عرض جديد</button>
                {offers.map((o, i) => (
                  <div key={o.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-6 relative">
                    <button onClick={() => deleteItem(setOffers, o.id)} className="absolute top-8 left-8 text-rose-500 text-[10px] font-black px-4 py-2 bg-rose-500/10 rounded-xl">حذف</button>
                    <BilingualInput label="عنوان العرض" valAr={o.title.ar} valEn={o.title.en} setAr={(v:any) => updateArrayItem(setOffers, i, 'title', v, 'ar')} setEn={(v:any) => updateArrayItem(setOffers, i, 'title', v, 'en')} />
                    <BilingualInput label="الخصم / الميزة" valAr={o.discount.ar} valEn={o.discount.en} setAr={(v:any) => updateArrayItem(setOffers, i, 'discount', v, 'ar')} setEn={(v:any) => updateArrayItem(setOffers, i, 'discount', v, 'en')} />
                    <BilingualInput label="التفاصيل" valAr={o.description.ar} valEn={o.description.en} setAr={(v:any) => updateArrayItem(setOffers, i, 'description', v, 'ar')} setEn={(v:any) => updateArrayItem(setOffers, i, 'description', v, 'en')} textarea />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {stats.map((s, i) => (
                  <div key={s.id} className="bg-black p-10 rounded-[3rem] border border-white/10 space-y-6">
                    <div className="flex gap-4">
                      <div className="w-1/3 space-y-1"><label className="text-[9px] text-slate-500 font-black uppercase">Emoji</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl text-2xl text-center" value={s.icon} onChange={e => updateArrayItem(setStats, i, 'icon', e.target.value)} /></div>
                      <div className="w-2/3 space-y-1"><label className="text-[9px] text-slate-500 font-black uppercase">Value</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl text-xl font-bold font-sans" value={s.value} onChange={e => updateArrayItem(setStats, i, 'value', e.target.value)} /></div>
                    </div>
                    <BilingualInput label="Label" valAr={s.label.ar} valEn={s.label.en} setAr={(v:any) => updateArrayItem(setStats, i, 'label', v, 'ar')} setEn={(v:any) => updateArrayItem(setStats, i, 'label', v, 'en')} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'certs' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <button onClick={() => setCerts([{ id: Date.now().toString(), name: 'ISO 9001', img: '' }, ...certs])} className="col-span-full py-10 border-2 border-dashed border-white/10 rounded-3xl text-slate-500">+ إضافة شهادة جودة</button>
                {certs.map((c, i) => (
                  <div key={c.id} className="bg-black p-6 rounded-[2rem] border border-white/5 space-y-4 relative group">
                    <button onClick={() => deleteItem(setCerts, c.id)} className="absolute top-4 left-4 text-rose-500 text-[8px] font-black">حذف</button>
                    <ImageInput label="أيقونة الشهادة" value={c.img} onChange={(v:any) => updateArrayItem(setCerts, i, 'img', v)} />
                    <input className="w-full bg-[#111] p-4 rounded-xl text-xs text-center font-bold" value={c.name} onChange={e => updateArrayItem(setCerts, i, 'name', e.target.value)} />
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

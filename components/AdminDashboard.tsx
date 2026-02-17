
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

  // المزامنة اللحظية عند تغيير أي قيمة
  useEffect(() => { sync('site_settings', settings); }, [settings]);
  useEffect(() => { sync('site_products', products); }, [products]);
  useEffect(() => { sync('site_gallery', galleryItems); }, [galleryItems]);
  useEffect(() => { sync('site_testimonials', testimonials); }, [testimonials]);
  useEffect(() => { sync('site_offers', offers); }, [offers]);
  useEffect(() => { sync('site_articles', articles); }, [articles]);
  useEffect(() => { sync('site_stats', stats); }, [stats]);
  useEffect(() => { sync('site_certs', certs); }, [certs]);

  const updateItem = (setList: Function, index: number, field: string, value: any, lang?: 'ar'|'en') => {
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

  const addItem = (setList: Function, template: any) => {
    setList((prev: any[]) => [template, ...prev]);
  };

  const deleteItem = (setList: Function, id: string | number) => {
    if (window.confirm('هل أنت متأكد من الحذف؟ سيتم حذف البيانات من قاعدة البيانات نهائياً.')) {
      setList((prev: any[]) => prev.filter(item => item.id !== id));
    }
  };

  const BilingualInput = ({ label, valAr, valEn, setAr, setEn, textarea = false }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-8 rounded-[2rem] border border-white/5">
      <div className="space-y-3 text-right">
        <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest">AR - {label}</label>
        {textarea ? 
          <textarea className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500 h-28" value={valAr} onChange={e => setAr(e.target.value)} /> :
          <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" value={valAr} onChange={e => setAr(e.target.value)} />
        }
      </div>
      <div className="space-y-3 text-left">
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
        <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-xs font-sans outline-none focus:border-orange-500" placeholder="رابط الصورة المباشر (https://...)" value={value} onChange={e => onChange(e.target.value)} />
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
            <input type="password" placeholder="كلمة المرور" className="w-full bg-black border border-white/10 p-5 rounded-xl text-white text-center text-4xl outline-none focus:border-orange-500 transition-all" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
            <button type="submit" className="w-full py-5 dynamic-bg text-black font-black rounded-xl hover:scale-105 transition-all uppercase text-[10px] tracking-widest">دخول النظام</button>
          </form>
        </div>
      </div>
    );
  }

  const menu = [
    { id: 'dashboard', label: 'الرئيسية', icon: '🏠' },
    { id: 'mysql', label: 'ربط MySQL', icon: '☁️' },
    { id: 'settings', label: 'إعدادات الموقع', icon: '⚙️' },
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
      <aside className="w-full lg:w-72 bg-black border-l border-white/5 flex flex-col h-screen sticky top-0 z-50">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 dynamic-bg rounded-lg flex items-center justify-center text-black font-black">A</div>
          <span className="font-black text-sm tracking-tighter uppercase">AL-ASIMH CMS</span>
        </div>
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {menu.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-right px-6 py-4 rounded-xl flex items-center gap-4 transition-all ${activeTab === item.id ? 'bg-orange-500 text-black font-black' : 'text-slate-500 hover:bg-white/5'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-black uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="m-6 p-4 border border-rose-500/20 text-rose-500 rounded-xl text-[10px] font-black uppercase hover:bg-rose-500 hover:text-white transition-all">تسجيل الخروج</button>
      </aside>

      <main className="flex-grow p-8 lg:p-16 overflow-y-auto bg-grid-pattern">
        <div className="max-w-5xl mx-auto pb-32 text-right">
          <header className="mb-16 flex justify-between items-center">
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
              <div className="bg-black p-12 rounded-[3rem] border border-white/10 space-y-8">
                <h3 className="text-2xl font-black border-b border-white/5 pb-6">توصيل قاعدة بيانات MySQL السحابية</h3>
                <p className="text-slate-400 text-sm">سيتم إنشاء الجداول اللازمة تلقائياً في قاعدة بياناتك فور نجاح الاتصال.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase">Server Host</label><input className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-white font-sans" value={dbConfig.host} onChange={e => setDbConfig({...dbConfig, host: e.target.value})} /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase">DB Name</label><input className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-white font-sans" value={dbConfig.dbName} onChange={e => setDbConfig({...dbConfig, dbName: e.target.value})} /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase">Username</label><input className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-white font-sans" value={dbConfig.user} onChange={e => setDbConfig({...dbConfig, user: e.target.value})} /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase">Password</label><input type="password" className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-white font-sans" value={dbConfig.pass} onChange={e => setDbConfig({...dbConfig, pass: e.target.value})} /></div>
                </div>
                <button onClick={() => { dbService.setConfig({...dbConfig, mode: 'mysql'}); window.location.reload(); }} className="w-full py-6 dynamic-bg text-black font-black rounded-2xl shadow-xl uppercase tracking-widest text-xs">حفظ وتفعيل المزامنة العالمية</button>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-10">
                <ImageInput label="شعار الشركة (URL)" value={settings.logoUrl} onChange={(v:any) => setSettings({...settings, logoUrl: v})} />
                <ImageInput label="خلفية الواجهة (Hero BG)" value={settings.heroBg} onChange={(v:any) => setSettings({...settings, heroBg: v})} />
                <BilingualInput label="اسم العلامة التجارية" valAr={settings.brandName.ar} valEn={settings.brandName.en} setAr={(v:any) => setSettings({...settings, brandName: {...settings.brandName, ar: v}})} setEn={(v:any) => setSettings({...settings, brandName: {...settings.brandName, en: v}})} />
                <BilingualInput label="سلوجان الموقع" valAr={settings.tagline.ar} valEn={settings.tagline.en} setAr={(v:any) => setSettings({...settings, tagline: {...settings.tagline, ar: v}})} setEn={(v:any) => setSettings({...settings, tagline: {...settings.tagline, en: v}})} />
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-10">
                <button onClick={() => addItem(setProducts, { id: Date.now().toString(), title: { ar: 'صنف جديد', en: 'New Grade' }, desc: { ar: 'وصف فني...', en: 'Description...' }, specs: { ar: [], en: [] }, icon: '🔥', images: [], msg: { ar: 'استفسار', en: 'Inquiry' } })} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black hover:border-orange-500 transition-all uppercase text-[10px] tracking-widest">+ إضافة منتج تصدير جديد</button>
                {products.map((p, i) => (
                  <div key={p.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-6 relative group">
                    <button onClick={() => deleteItem(setProducts, p.id)} className="absolute top-8 left-8 text-rose-500 text-[10px] font-black uppercase bg-rose-500/10 px-4 py-2 rounded-xl">حذف الصنف</button>
                    <BilingualInput label="اسم الصنف" valAr={p.title.ar} valEn={p.title.en} setAr={(v:any) => updateItem(setProducts, i, 'title', v, 'ar')} setEn={(v:any) => updateItem(setProducts, i, 'title', v, 'en')} />
                    <BilingualInput label="الوصف الفني" valAr={p.desc.ar} valEn={p.desc.en} setAr={(v:any) => updateItem(setProducts, i, 'desc', v, 'ar')} setEn={(v:any) => updateItem(setProducts, i, 'desc', v, 'en')} textarea />
                    <ImageInput label="صورة المنتج الرئيسية" value={p.images[0] || ''} onChange={(v:any) => updateItem(setProducts, i, 'images', [v])} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'offers' && (
              <div className="space-y-10">
                <button onClick={() => addItem(setOffers, { id: Date.now(), title: { ar: 'عرض حصري', en: 'Exclusive Offer' }, discount: { ar: 'خصم 10%', en: '10% Off' }, description: { ar: 'تفاصيل العرض...', en: 'Offer details...' }, expiry: { ar: 'محدود', en: 'Limited' }, type: { ar: 'تصدير', en: 'Export' }, isActive: true })} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black hover:border-orange-500 transition-all uppercase text-[10px] tracking-widest">+ إضافة عرض ترويجي</button>
                {offers.map((o, i) => (
                  <div key={o.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-6 relative">
                    <button onClick={() => deleteItem(setOffers, o.id)} className="absolute top-8 left-8 text-rose-500 text-[10px] font-black uppercase bg-rose-500/10 px-4 py-2 rounded-xl">إزالة العرض</button>
                    <BilingualInput label="عنوان العرض" valAr={o.title.ar} valEn={o.title.en} setAr={(v:any) => updateItem(setOffers, i, 'title', v, 'ar')} setEn={(v:any) => updateItem(setOffers, i, 'title', v, 'en')} />
                    <BilingualInput label="نسبة الخصم" valAr={o.discount.ar} valEn={o.discount.en} setAr={(v:any) => updateItem(setOffers, i, 'discount', v, 'ar')} setEn={(v:any) => updateItem(setOffers, i, 'discount', v, 'en')} />
                    <BilingualInput label="تفاصيل العرض" valAr={o.description.ar} valEn={o.description.en} setAr={(v:any) => updateItem(setOffers, i, 'description', v, 'ar')} setEn={(v:any) => updateItem(setOffers, i, 'description', v, 'en')} textarea />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'blog' && (
              <div className="space-y-10">
                <button onClick={() => addItem(setArticles, { id: Date.now(), title: { ar: 'مقال فني', en: 'Technical Article' }, excerpt: { ar: 'ملخص المقال...', en: 'Excerpt...' }, date: { ar: 'اليوم', en: 'Today' }, img: '', category: { ar: 'تحليل', en: 'Analysis' } })} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black hover:border-emerald-500 transition-all uppercase text-[10px] tracking-widest">+ نشر مقال جديد</button>
                {articles.map((a, i) => (
                  <div key={a.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-6 relative">
                    <button onClick={() => deleteItem(setArticles, a.id)} className="absolute top-8 left-8 text-rose-500 text-[10px] font-black">حذف المقال</button>
                    <ImageInput label="صورة المقال" value={a.img} onChange={(v:any) => updateItem(setArticles, i, 'img', v)} />
                    <BilingualInput label="عنوان المقال" valAr={a.title.ar} valEn={a.title.en} setAr={(v:any) => updateItem(setArticles, i, 'title', v, 'ar')} setEn={(v:any) => updateItem(setArticles, i, 'title', v, 'en')} />
                    <BilingualInput label="المحتوى / الملخص" valAr={a.excerpt.ar} valEn={a.excerpt.en} setAr={(v:any) => updateItem(setArticles, i, 'excerpt', v, 'ar')} setEn={(v:any) => updateItem(setArticles, i, 'excerpt', v, 'en')} textarea />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button onClick={() => addItem(setGalleryItems, { id: Date.now().toString(), title: { ar: 'صورة جديدة', en: 'New Photo' }, category: { ar: 'المصنع', en: 'Factory' }, img: '' })} className="col-span-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black hover:border-blue-500 transition-all uppercase text-[10px] tracking-widest">+ إضافة صورة للمعرض</button>
                {galleryItems.map((g, i) => (
                  <div key={g.id} className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 space-y-4 relative group">
                    <button onClick={() => deleteItem(setGalleryItems, g.id)} className="absolute top-6 left-6 text-rose-500 text-[9px] font-black uppercase">حذف</button>
                    <ImageInput label="رابط الصورة" value={g.img} onChange={(v:any) => updateItem(setGalleryItems, i, 'img', v)} />
                    <BilingualInput label="العنوان" valAr={g.title.ar} valEn={g.title.en} setAr={(v:any) => updateItem(setGalleryItems, i, 'title', v, 'ar')} setEn={(v:any) => updateItem(setGalleryItems, i, 'title', v, 'en')} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {stats.map((s, i) => (
                  <div key={s.id} className="bg-black p-10 rounded-[3rem] border border-white/10 space-y-6">
                    <div className="flex gap-4">
                      <div className="w-1/3 space-y-1"><label className="text-[9px] text-slate-500 font-black">EMOJI</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl text-2xl text-center" value={s.icon} onChange={e => updateItem(setStats, i, 'icon', e.target.value)} /></div>
                      <div className="w-2/3 space-y-1"><label className="text-[9px] text-slate-500 font-black">VALUE</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl text-xl font-bold" value={s.value} onChange={e => updateItem(setStats, i, 'value', e.target.value)} /></div>
                    </div>
                    <BilingualInput label="التسمية" valAr={s.label.ar} valEn={s.label.en} setAr={(v:any) => updateItem(setStats, i, 'label', v, 'ar')} setEn={(v:any) => updateItem(setStats, i, 'label', v, 'en')} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'certs' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <button onClick={() => addItem(setCerts, { id: Date.now().toString(), name: 'Certificate Name', img: '' })} className="col-span-full py-10 border-2 border-dashed border-white/10 rounded-3xl text-slate-600 font-black uppercase text-[10px] tracking-widest">+ إضافة شهادة جودة دولية</button>
                {certs.map((c, i) => (
                  <div key={c.id} className="bg-black p-6 rounded-[2rem] border border-white/5 space-y-4 relative group">
                    <button onClick={() => deleteItem(setCerts, c.id)} className="absolute top-4 left-4 text-rose-500 text-[8px] font-black uppercase">إزالة</button>
                    <ImageInput label="شعار الشهادة" value={c.img} onChange={(v:any) => updateItem(setCerts, i, 'img', v)} />
                    <input className="w-full bg-[#111] p-4 rounded-xl text-xs text-center font-black border border-white/5" placeholder="اسم الشهادة (مثال: ISO 9001)" value={c.name} onChange={e => updateItem(setCerts, i, 'name', e.target.value)} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div className="space-y-10">
                <button onClick={() => addItem(setTestimonials, { id: Date.now().toString(), name: { ar: 'عميل جديد', en: 'New Client' }, role: { ar: 'مستورد', en: 'Importer' }, content: { ar: 'رأيه...', en: 'Feedback...' }, avatar: '' })} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black hover:border-orange-500 transition-all uppercase text-[10px] tracking-widest">+ إضافة رأي عميل دولي</button>
                {testimonials.map((t, i) => (
                  <div key={t.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-6 relative group">
                    <button onClick={() => deleteItem(setTestimonials, t.id)} className="absolute top-8 left-8 text-rose-500 text-[10px] font-black uppercase">حذف التقييم</button>
                    <ImageInput label="صورة العميل" value={t.avatar} onChange={(v:any) => updateItem(setTestimonials, i, 'avatar', v)} />
                    <BilingualInput label="اسم العميل" valAr={t.name.ar} valEn={t.name.en} setAr={(v:any) => updateItem(setTestimonials, i, 'name', v, 'ar')} setEn={(v:any) => updateItem(setTestimonials, i, 'name', v, 'en')} />
                    <BilingualInput label="الدور / الدولة" valAr={t.role.ar} valEn={t.role.en} setAr={(v:any) => updateItem(setTestimonials, i, 'role', v, 'ar')} setEn={(v:any) => updateItem(setTestimonials, i, 'role', v, 'en')} />
                    <BilingualInput label="رسالة التقييم" valAr={t.content.ar} valEn={t.content.en} setAr={(v:any) => updateItem(setTestimonials, i, 'content', v, 'ar')} setEn={(v:any) => updateItem(setTestimonials, i, 'content', v, 'en')} textarea />
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

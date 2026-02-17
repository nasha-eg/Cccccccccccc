
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
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'error'>('idle');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1997') setIsLoggedIn(true);
    else alert('كلمة المرور غير صحيحة');
  };

  const sync = async (table: string, data: any) => {
    if (!isLoggedIn) return;
    setSyncState('syncing');
    const res = await dbService.updateTable(table, data);
    setSyncState(res.success ? 'idle' : 'error');
  };

  // المزامنة التلقائية
  useEffect(() => { if(isLoggedIn) sync('site_settings', settings); }, [settings]);
  useEffect(() => { if(isLoggedIn) sync('site_products', products); }, [products]);
  useEffect(() => { if(isLoggedIn) sync('site_gallery', galleryItems); }, [galleryItems]);
  useEffect(() => { if(isLoggedIn) sync('site_testimonials', testimonials); }, [testimonials]);
  useEffect(() => { if(isLoggedIn) sync('site_offers', offers); }, [offers]);
  useEffect(() => { if(isLoggedIn) sync('site_articles', articles); }, [articles]);
  useEffect(() => { if(isLoggedIn) sync('site_stats', stats); }, [stats]);
  useEffect(() => { if(isLoggedIn) sync('site_certs', certs); }, [certs]);

  const updateItem = (setter: Function, index: number, field: string, value: any, lang?: 'ar'|'en') => {
    setter((prev: any[]) => {
      const copy = [...prev];
      if (lang) copy[index][field] = { ...copy[index][field], [lang]: value };
      else copy[index][field] = value;
      return copy;
    });
  };

  const manageSpec = (productIndex: number, specIndex: number, lang: 'ar' | 'en', action: 'update' | 'remove' | 'add', value?: string) => {
    setProducts(prev => {
      const copy = [...prev];
      const product = copy[productIndex];
      if (action === 'add') product.specs[lang].push(value || '');
      else if (action === 'remove') product.specs[lang].splice(specIndex, 1);
      else if (action === 'update') product.specs[lang][specIndex] = value || '';
      return copy;
    });
  };

  const deleteItem = (setter: Function, id: string | number) => {
    if (window.confirm('سيتم حذف هذا العنصر نهائياً من قاعدة بيانات السيرفر. هل أنت متأكد؟')) {
      setter((prev: any[]) => prev.filter(item => item.id !== id));
    }
  };

  const BilingualInput = ({ label, valAr, valEn, setAr, setEn, textarea = false }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-6 rounded-3xl border border-white/5">
      <div className="space-y-2 text-right">
        <label className="text-[10px] font-black text-orange-500 uppercase">AR - {label}</label>
        {textarea ? <textarea className="w-full bg-black border border-white/10 p-4 rounded-xl text-white h-24 text-sm outline-none focus:border-orange-500" value={valAr} onChange={e => setAr(e.target.value)} /> :
        <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-sm outline-none focus:border-orange-500" value={valAr} onChange={e => setAr(e.target.value)} />}
      </div>
      <div className="space-y-2 text-left">
        <label className="text-[10px] font-black text-blue-500 uppercase">EN - {label}</label>
        {textarea ? <textarea className="w-full bg-black border border-white/10 p-4 rounded-xl text-white h-24 text-sm font-sans outline-none focus:border-orange-500" dir="ltr" value={valEn} onChange={e => setEn(e.target.value)} /> :
        <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-sm font-sans outline-none focus:border-orange-500" dir="ltr" value={valEn} onChange={e => setEn(e.target.value)} />}
      </div>
    </div>
  );

  const ImageInput = ({ label, value, onChange }: any) => (
    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-4">
      <div className="flex-grow space-y-1 text-right">
        <label className="text-[10px] text-slate-500 font-black uppercase">{label}</label>
        <input className="w-full bg-black border border-white/10 p-3 rounded-xl text-[11px] font-sans outline-none focus:border-orange-500" placeholder="https://..." value={value} onChange={e => onChange(e.target.value)} />
      </div>
      <div className="w-14 h-14 bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
        {value && <img src={value} className="w-full h-full object-cover" />}
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6" dir="rtl">
        <div className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 p-12 rounded-[3rem] text-center shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 dynamic-bg rounded-2xl flex items-center justify-center text-black font-black text-2xl mx-auto mb-10 shadow-xl shadow-orange-500/20">A</div>
          <h2 className="text-xl font-black text-white mb-8 tracking-tighter uppercase">Admin Core Access</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" placeholder="كلمة المرور" className="w-full bg-black border border-white/10 p-5 rounded-xl text-white text-center text-4xl outline-none focus:border-orange-500 font-sans tracking-[0.5em]" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
            <button type="submit" className="w-full py-5 dynamic-bg text-black font-black rounded-xl hover:scale-105 transition-all text-xs tracking-widest uppercase">فتح النظام السحابي</button>
          </form>
        </div>
      </div>
    );
  }

  const menu = [
    { id: 'dashboard', label: 'الرئيسية', icon: '🏠' },
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
      <aside className="w-full lg:w-72 bg-black border-l border-white/5 flex flex-col h-screen sticky top-0 overflow-y-auto z-50">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 dynamic-bg rounded-lg flex items-center justify-center text-black font-black">A</div>
          <span className="font-black text-xs tracking-tighter uppercase">CLOUD ADMIN PANEL</span>
        </div>
        <nav className="flex-grow p-4 space-y-1">
          {menu.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-right px-6 py-4 rounded-xl flex items-center gap-4 transition-all ${activeTab === item.id ? 'bg-orange-500 text-black font-black shadow-lg shadow-orange-500/10' : 'text-slate-500 hover:bg-white/5'}`}>
              <span className="text-lg">{item.icon}</span>
              <span className="text-[11px] font-black uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="m-6 p-4 border border-rose-500/20 text-rose-500 rounded-xl text-[9px] font-black uppercase hover:bg-rose-500 hover:text-white transition-all">إعادة ضبط الاتصال</button>
      </aside>

      <main className="flex-grow p-8 lg:p-16 overflow-y-auto">
        <div className="max-w-5xl mx-auto pb-32">
          <header className="mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-10 gap-6">
            <div>
               <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">{activeTab} Management</h1>
               <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${syncState === 'syncing' ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{syncState === 'syncing' ? 'SYNCING TO MYSQL...' : 'CLOUD CONNECTION ACTIVE'}</span>
               </div>
            </div>
            <button onClick={onLogout} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">خروج آمن</button>
          </header>

          <div className="space-y-12">
            {activeTab === 'dashboard' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-orange-500/10 p-12 rounded-[3rem] border border-orange-500/20 text-right col-span-full">
                    <h2 className="text-4xl font-black text-orange-500 mb-6 tracking-tighter uppercase">Cloud Native CMS v5.0</h2>
                    <p className="text-slate-400 leading-relaxed text-sm mb-8">تم ربط هذا النظام بنجاح مع قاعدة بيانات MySQL السحابية. أي تعديلات تتم الآن ستظهر فوراً لكافة الزوار حول العالم. لا يتم تخزين أي محتوى داخل هذا المتصفح لضمان أقصى درجات الموثوقية.</p>
                    <div className="flex gap-4">
                      <div className="bg-black/40 px-6 py-3 rounded-2xl border border-white/5"><span className="text-orange-500 font-black">{products.length}</span> <span className="text-[10px] text-slate-500 font-bold uppercase ml-2">منتجات</span></div>
                      <div className="bg-black/40 px-6 py-3 rounded-2xl border border-white/5"><span className="text-orange-500 font-black">{articles.length}</span> <span className="text-[10px] text-slate-500 font-bold uppercase ml-2">مقالات</span></div>
                    </div>
                  </div>
               </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-10">
                <ImageInput label="شعار الشركة" value={settings.logoUrl} onChange={(v:any) => setSettings({...settings, logoUrl: v})} />
                <ImageInput label="خلفية الواجهة" value={settings.heroBg} onChange={(v:any) => setSettings({...settings, heroBg: v})} />
                <BilingualInput label="اسم العلامة التجارية" valAr={settings.brandName.ar} valEn={settings.brandName.en} setAr={(v:any) => setSettings({...settings, brandName: {...settings.brandName, ar: v}})} setEn={(v:any) => setSettings({...settings, brandName: {...settings.brandName, en: v}})} />
                <BilingualInput label="شعار نصي (Tagline)" valAr={settings.tagline.ar} valEn={settings.tagline.en} setAr={(v:any) => setSettings({...settings, tagline: {...settings.tagline, ar: v}})} setEn={(v:any) => setSettings({...settings, tagline: {...settings.tagline, en: v}})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-right"><label className="text-[10px] text-slate-500 font-black">WHATSAPP NUMBER</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} /></div>
                  <div className="space-y-2 text-right"><label className="text-[10px] text-slate-500 font-black">OFFICE PHONE</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} /></div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-10">
                <button onClick={() => setProducts([{ id: Date.now().toString(), title: { ar: 'صنف جديد', en: 'New Grade' }, desc: { ar: 'وصف فني مفصل..', en: 'Technical description..' }, specs: { ar: [], en: [] }, icon: '🔥', images: [], msg: { ar: 'استفسار عن سعر شحنة', en: 'Cargo quote request' } }, ...products])} className="w-full py-12 border-2 border-dashed border-white/10 rounded-[3rem] text-slate-500 font-black hover:border-orange-500 hover:text-orange-500 transition-all">+ إضافة صنف تصدير نخب أول</button>
                {products.map((p, i) => (
                  <div key={p.id} className="bg-[#0a0a0a] p-10 rounded-[3.5rem] border border-white/5 space-y-8 relative group border-t-2 border-t-orange-500/20 shadow-2xl">
                    <button onClick={() => deleteItem(setProducts, p.id)} className="absolute top-10 left-10 text-rose-500 bg-rose-500/10 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-rose-500 hover:text-white transition-all">حذف المنتج</button>
                    <div className="flex items-center gap-6 pb-6 border-b border-white/5">
                      <input className="w-16 h-16 bg-black border border-white/10 rounded-2xl text-center text-2xl outline-none focus:border-orange-500" value={p.icon} onChange={e => updateItem(setProducts, i, 'icon', e.target.value)} />
                      <h4 className="font-black text-xl text-orange-500 uppercase tracking-tighter">Export Item Configuration #{i+1}</h4>
                    </div>
                    <BilingualInput label="اسم الصنف" valAr={p.title.ar} valEn={p.title.en} setAr={(v:any) => updateItem(setProducts, i, 'title', v, 'ar')} setEn={(v:any) => updateItem(setProducts, i, 'title', v, 'en')} />
                    <BilingualInput label="الوصف التسويقي" valAr={p.desc.ar} valEn={p.desc.en} setAr={(v:any) => updateItem(setProducts, i, 'desc', v, 'ar')} setEn={(v:any) => updateItem(setProducts, i, 'desc', v, 'en')} textarea />
                    <ImageInput label="صورة المنتج الرئيسية" value={p.images[0] || ''} onChange={(v:any) => updateItem(setProducts, i, 'images', [v])} />
                    
                    {/* محرر المواصفات الفنية */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black/40 p-8 rounded-[2.5rem] border border-white/5">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-orange-500 uppercase block mb-2">المواصفات الفنية (AR)</label>
                          {p.specs.ar.map((s, si) => (
                             <div key={si} className="flex gap-2">
                                <input className="flex-grow bg-black border border-white/10 p-3 rounded-xl text-xs" value={s} onChange={e => manageSpec(i, si, 'ar', 'update', e.target.value)} />
                                <button onClick={() => manageSpec(i, si, 'ar', 'remove')} className="text-rose-500 p-2">&times;</button>
                             </div>
                          ))}
                          <button onClick={() => manageSpec(i, 0, 'ar', 'add', 'مواصفة جديدة')} className="w-full py-2 border border-dashed border-white/20 rounded-xl text-[10px] opacity-50">+ إضافة</button>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-blue-500 uppercase block mb-2">Technical Specs (EN)</label>
                          {p.specs.en.map((s, si) => (
                             <div key={si} className="flex gap-2">
                                <input className="flex-grow bg-black border border-white/10 p-3 rounded-xl text-xs font-sans" dir="ltr" value={s} onChange={e => manageSpec(i, si, 'en', 'update', e.target.value)} />
                                <button onClick={() => manageSpec(i, si, 'en', 'remove')} className="text-rose-500 p-2">&times;</button>
                             </div>
                          ))}
                          <button onClick={() => manageSpec(i, 0, 'en', 'add', 'New Spec')} className="w-full py-2 border border-dashed border-white/20 rounded-xl text-[10px] opacity-50">+ Add</button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* باقي الأقسام تعمل بنفس المنطق السحابي المحسن */}
            {activeTab === 'blog' && (
              <div className="space-y-10">
                <button onClick={() => setArticles([{ id: Date.now(), title: { ar: 'عنوان المقال', en: 'New Article' }, excerpt: { ar: 'محتوى المقال..', en: 'Content..' }, date: { ar: '2025', en: '2025' }, img: '', category: { ar: 'تقني', en: 'Technical' } }, ...articles])} className="w-full py-10 border-2 border-dashed border-white/10 rounded-2xl text-slate-500 font-black">+ نشر مقال فني جديد</button>
                {articles.map((a, i) => (
                   <div key={a.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-6 relative shadow-xl">
                      <button onClick={() => deleteItem(setArticles, a.id)} className="absolute top-8 left-8 text-rose-500 text-[9px] font-black px-4 py-2 bg-rose-500/10 rounded-xl">حذف</button>
                      <ImageInput label="صورة المقال" value={a.img} onChange={(v:any) => updateItem(setArticles, i, 'img', v)} />
                      <BilingualInput label="العنوان" valAr={a.title.ar} valEn={a.title.en} setAr={(v:any) => updateItem(setArticles, i, 'title', v, 'ar')} setEn={(v:any) => updateItem(setArticles, i, 'title', v, 'en')} />
                      <BilingualInput label="المحتوى القصير" valAr={a.excerpt.ar} valEn={a.excerpt.en} setAr={(v:any) => updateItem(setArticles, i, 'excerpt', v, 'ar')} setEn={(v:any) => updateItem(setArticles, i, 'excerpt', v, 'en')} textarea />
                   </div>
                ))}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <button onClick={() => setGalleryItems([{ id: Date.now().toString(), title: { ar: 'صورة جديدة', en: 'New Photo' }, category: { ar: 'المصنع', en: 'Factory' }, img: '' }, ...galleryItems])} className="col-span-full py-12 border-2 border-dashed border-white/10 rounded-[3rem] text-slate-500 font-black">+ إضافة صور للواقع الميداني</button>
                 {galleryItems.map((g, i) => (
                    <div key={g.id} className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 space-y-4 relative group">
                       <button onClick={() => deleteItem(setGalleryItems, g.id)} className="absolute top-6 left-6 text-rose-500 text-[8px] font-black opacity-40 group-hover:opacity-100">حذف</button>
                       <ImageInput label="رابط الصورة" value={g.img} onChange={(v:any) => updateItem(setGalleryItems, i, 'img', v)} />
                       <BilingualInput label="العنوان" valAr={g.title.ar} valEn={g.title.en} setAr={(v:any) => updateItem(setGalleryItems, i, 'title', v, 'ar')} setEn={(v:any) => updateItem(setGalleryItems, i, 'title', v, 'en')} />
                    </div>
                 ))}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((s, i) => (
                  <div key={s.id} className="bg-black/40 p-10 rounded-[3rem] border border-white/5 space-y-6">
                    <div className="flex gap-6 items-end">
                      <div className="w-20"><label className="text-[9px] text-slate-500 font-black block mb-2">ICON</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl text-center text-3xl" value={s.icon} onChange={e => updateItem(setStats, i, 'icon', e.target.value)} /></div>
                      <div className="flex-grow"><label className="text-[9px] text-slate-500 font-black block mb-2">NUMERICAL VALUE</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl text-xl font-bold font-sans" value={s.value} onChange={e => updateItem(setStats, i, 'value', e.target.value)} /></div>
                    </div>
                    <BilingualInput label="التصنيف" valAr={s.label.ar} valEn={s.label.en} setAr={(v:any) => updateItem(setStats, i, 'label', v, 'ar')} setEn={(v:any) => updateItem(setStats, i, 'label', v, 'en')} />
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

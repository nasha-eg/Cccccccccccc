
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

  // دالة المزامنة الموحدة - ترسل البيانات فور التعديل
  const performSync = async (table: string, data: any) => {
    setDbStatus('syncing');
    const res = await dbService.updateTable(table, data);
    setDbStatus(res.success ? 'connected' : 'error');
  };

  // مراقبة كافة الحالات للمزامنة اللحظية
  useEffect(() => { if(isLoggedIn) performSync('site_settings', settings); }, [settings]);
  useEffect(() => { if(isLoggedIn) performSync('site_products', products); }, [products]);
  useEffect(() => { if(isLoggedIn) performSync('site_gallery', galleryItems); }, [galleryItems]);
  useEffect(() => { if(isLoggedIn) performSync('site_testimonials', testimonials); }, [testimonials]);
  useEffect(() => { if(isLoggedIn) performSync('site_offers', offers); }, [offers]);
  useEffect(() => { if(isLoggedIn) performSync('site_articles', articles); }, [articles]);
  useEffect(() => { if(isLoggedIn) performSync('site_stats', stats); }, [stats]);
  useEffect(() => { if(isLoggedIn) performSync('site_certs', certs); }, [certs]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1997') setIsLoggedIn(true);
    else alert("رمز الدخول غير صحيح");
  };

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
    if (window.confirm('هل أنت متأكد من الحذف النهائي؟ لا يمكن التراجع عن هذه الخطوة.')) {
      setList((prev: any[]) => prev.filter((item: any) => item.id !== id));
    }
  };

  const ImageInput = ({ label, value, onChange }: any) => (
    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
      <div className="flex gap-4 items-center">
        <input className="flex-grow bg-black border border-white/10 p-4 rounded-xl text-xs text-white outline-none focus:border-orange-500 font-sans" placeholder="رابط الصورة المباشر (URL)" value={value} onChange={e => onChange(e.target.value)} />
        <div className="w-16 h-16 bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shrink-0">
          {value ? <img src={value} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🖼️</div>}
        </div>
      </div>
    </div>
  );

  const BilingualInput = ({ label, valueAr, valueEn, onChangeAr, onChangeEn, textarea = false }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
      <div className="space-y-3">
        <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest">AR - {label}</label>
        {textarea ? (
          <textarea className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm text-white focus:border-orange-500 outline-none h-32 leading-relaxed" value={valueAr} onChange={e => onChangeAr(e.target.value)} />
        ) : (
          <input className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm text-white focus:border-orange-500 outline-none" value={valueAr} onChange={e => onChangeAr(e.target.value)} />
        )}
      </div>
      <div className="space-y-3">
        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">EN - {label}</label>
        {textarea ? (
          <textarea className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm text-white font-sans focus:border-orange-500 outline-none h-32 leading-relaxed" dir="ltr" value={valueEn} onChange={e => onChangeEn(e.target.value)} />
        ) : (
          <input className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm text-white font-sans focus:border-orange-500 outline-none" dir="ltr" value={valueEn} onChange={e => onChangeEn(e.target.value)} />
        )}
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-cairo" dir="rtl">
        <div className="w-full max-w-sm bg-[#050505] border border-white/5 p-12 rounded-[3.5rem] shadow-2xl text-center">
          <div className="w-20 h-20 dynamic-bg rounded-3xl flex items-center justify-center text-black font-black text-3xl mx-auto mb-10 shadow-xl shadow-orange-500/20">A</div>
          <h2 className="text-2xl font-black text-white mb-8 tracking-tighter uppercase">Admin Core Access</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" placeholder="••••" className="w-full bg-black border border-white/10 p-6 rounded-2xl text-white text-center text-5xl outline-none focus:border-orange-500 transition-all font-sans" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
            <button type="submit" className="w-full py-6 dynamic-bg text-black font-black rounded-2xl hover:brightness-110 active:scale-95 transition-all uppercase text-xs tracking-widest">Unlock Management</button>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: '🏠' },
    { id: 'mysql', label: 'ربط السيرفر', icon: '☁️' },
    { id: 'settings', label: 'الهوية البصرية', icon: '⚙️' },
    { id: 'products', label: 'المنتجات', icon: '📦' },
    { id: 'gallery', label: 'المعرض', icon: '🖼️' },
    { id: 'blog', label: 'المدونة', icon: '📝' },
    { id: 'offers', label: 'العروض', icon: '🏷️' },
    { id: 'stats', label: 'الإحصائيات', icon: '📊' },
    { id: 'testimonials', label: 'الآراء', icon: '💬' },
    { id: 'certs', label: 'الشهادات', icon: '📜' }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col lg:flex-row font-cairo" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-black border-l border-white/5 flex flex-col h-screen sticky top-0 z-50 overflow-y-auto custom-scroll">
        <div className="p-10 border-b border-white/5 flex items-center gap-4">
           <div className="w-10 h-10 dynamic-bg rounded-xl flex items-center justify-center text-black font-black text-xl shadow-lg">A</div>
           <div className="flex flex-col">
              <span className="font-black text-sm uppercase tracking-tighter">AL-ASIMH CMS</span>
              <span className="text-[9px] font-bold text-orange-500/50 uppercase">Enterprise v3.5</span>
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

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-16 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
             <div>
                <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">{activeTab} Interface</h1>
                <div className="flex items-center gap-3 mt-5">
                   <div className={`w-2 h-2 rounded-full ${dbStatus === 'syncing' ? 'bg-orange-500 animate-pulse' : dbStatus === 'connected' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-rose-500 shadow-lg shadow-rose-500/50'}`}></div>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                     {dbStatus === 'syncing' ? 'DATABASE SYNCHRONIZING...' : dbConfig.mode === 'mysql' ? 'CONNECTED TO CLOUD CLUSTER' : 'LOCAL CACHE MODE'}
                   </span>
                </div>
             </div>
          </header>

          <div className="space-y-16 pb-32">
             
             {/* MySQL Config Tab */}
             {activeTab === 'mysql' && (
                <div className="bg-[#050505] p-12 rounded-[4rem] border border-white/5 space-y-10 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
                   <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-8">
                      <div className="text-6xl">☁️</div>
                      <div>
                        <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Database Node Settings</h3>
                        <p className="text-slate-500 text-sm">قم بربط الموقع بقاعدة بيانات MySQL لضمان مزامنة عالمية لكافة التعديلات.</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">API Endpoint (api.php link)</label>
                        <input className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 font-sans" placeholder="https://alasimh.net/api.php" value={dbConfig.apiUrl} onChange={e => setDbConfig({...dbConfig, apiUrl: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">MySQL Host</label>
                        <input className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 font-sans" placeholder="localhost" value={dbConfig.host} onChange={e => setDbConfig({...dbConfig, host: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">DB Name</label>
                        <input className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 font-sans" placeholder="u12345_charcoal_db" value={dbConfig.dbName} onChange={e => setDbConfig({...dbConfig, dbName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">User</label>
                        <input className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 font-sans" placeholder="u12345_admin" value={dbConfig.user} onChange={e => setDbConfig({...dbConfig, user: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                        <input type="password" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-500 font-sans" value={dbConfig.pass} onChange={e => setDbConfig({...dbConfig, pass: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Mode</label>
                        <select className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none" value={dbConfig.mode} onChange={e => setDbConfig({...dbConfig, mode: e.target.value as any})}>
                          <option value="local">LOCAL (Browser Only)</option>
                          <option value="mysql">GLOBAL (Live MySQL Sync)</option>
                        </select>
                      </div>
                   </div>
                   <button onClick={() => { dbService.setConfig(dbConfig); window.location.reload(); }} className="w-full py-6 bg-white text-black font-black rounded-[2.5rem] hover:bg-emerald-500 hover:text-white transition-all uppercase tracking-widest text-xs">Save Configuration & Synchronize All Data</button>
                </div>
             )}

             {/* Settings Tab */}
             {activeTab === 'settings' && (
                <div className="space-y-12">
                   <div className="bg-[#050505] p-12 rounded-[4rem] border border-white/5 space-y-10">
                      <h3 className="text-xl font-black text-orange-500 uppercase tracking-widest border-b border-white/5 pb-6">Brand Identity</h3>
                      <ImageInput label="Logo URL" value={settings.logoUrl} onChange={(v:any) => setSettings({...settings, logoUrl: v})} />
                      <ImageInput label="Hero Background" value={settings.heroBg} onChange={(v:any) => setSettings({...settings, heroBg: v})} />
                      <BilingualInput label="Brand Name" valueAr={settings.brandName.ar} valueEn={settings.brandName.en} onChangeAr={(v:any) => setSettings({...settings, brandName: {...settings.brandName, ar: v}})} onChangeEn={(v:any) => setSettings({...settings, brandName: {...settings.brandName, en: v}})} />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">WhatsApp Number</label>
                            <input className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none font-sans" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phone</label>
                            <input className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none font-sans" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sales Email</label>
                            <input className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none font-sans" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} />
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {/* Products Tab */}
             {activeTab === 'products' && (
                <div className="space-y-12">
                   <button onClick={() => setProducts([{ id: Date.now().toString(), title: { ar: 'صنف جديد', en: 'New Grade' }, desc: { ar: 'وصف فني للصنف الجديد...', en: 'Technical grade description...' }, specs: { ar: ['الكربون: 80%'], en: ['Carbon: 80%'] }, icon: '🔥', images: [], msg: { ar: 'استفسار عن الصنف الجديد', en: 'Inquiry about new grade' } }, ...products])} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[3rem] text-slate-600 font-black hover:border-orange-500 hover:text-orange-500 transition-all uppercase tracking-widest text-[10px]">+ Add New Product Category</button>
                   {products.map((p, i) => (
                      <div key={p.id} className="bg-[#080808] p-10 rounded-[3.5rem] border border-white/5 relative group space-y-8">
                         <button onClick={() => deleteItem(setProducts, p.id)} className="absolute top-8 left-8 text-rose-500 text-[10px] font-black uppercase px-5 py-2 bg-rose-500/10 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-xl">Delete Category</button>
                         <BilingualInput label="Product Title" valueAr={p.title.ar} valueEn={p.title.en} onChangeAr={(v:any) => updateArrayItem(setProducts, i, 'title', v, 'ar')} onChangeEn={(v:any) => updateArrayItem(setProducts, i, 'title', v, 'en')} />
                         <BilingualInput label="Description" valueAr={p.desc.ar} valueEn={p.desc.en} onChangeAr={(v:any) => updateArrayItem(setProducts, i, 'desc', v, 'ar')} onChangeEn={(v:any) => updateArrayItem(setProducts, i, 'desc', v, 'en')} textarea />
                         <ImageInput label="Primary Image URL" value={p.images[0] || ''} onChange={(v:any) => updateArrayItem(setProducts, i, 'images', [v])} />
                      </div>
                   ))}
                </div>
             )}

             {/* Gallery Tab */}
             {activeTab === 'gallery' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <button onClick={() => setGalleryItems([{ id: Date.now().toString(), title: { ar: 'صورة جديدة', en: 'New Gallery Photo' }, category: { ar: 'المصنع', en: 'Factory' }, img: '' }, ...galleryItems])} className="col-span-full py-12 border-2 border-dashed border-white/10 rounded-[3rem] text-slate-600 font-black hover:border-emerald-500 hover:text-emerald-500 transition-all uppercase tracking-widest text-[10px]">+ Upload Photo to Gallery</button>
                   {galleryItems.map((g, i) => (
                      <div key={g.id} className="bg-[#080808] p-8 rounded-[3rem] border border-white/5 space-y-6 relative group">
                         <button onClick={() => deleteItem(setGalleryItems, g.id)} className="absolute top-6 left-6 text-rose-500 text-[9px] font-black opacity-0 group-hover:opacity-100 transition-all">Delete Image</button>
                         <ImageInput label="Photo URL" value={g.img} onChange={(v:any) => updateArrayItem(setGalleryItems, i, 'img', v)} />
                         <BilingualInput label="Title" valueAr={g.title.ar} valueEn={g.title.en} onChangeAr={(v:any) => updateArrayItem(setGalleryItems, i, 'title', v, 'ar')} onChangeEn={(v:any) => updateArrayItem(setGalleryItems, i, 'title', v, 'en')} />
                      </div>
                   ))}
                </div>
             )}

             {/* Stats Tab */}
             {activeTab === 'stats' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {stats.map((s, i) => (
                      <div key={s.id} className="bg-[#050505] p-10 rounded-[3rem] border border-white/5 space-y-6 relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-2 h-full bg-orange-500/20"></div>
                         <div className="flex gap-6">
                            <div className="w-1/3 space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase">Icon</label>
                               <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-2xl text-center" value={s.icon} onChange={e => updateArrayItem(setStats, i, 'icon', e.target.value)} />
                            </div>
                            <div className="w-2/3 space-y-2">
                               <label className="text-[9px] font-black text-slate-500 uppercase">Numerical Value</label>
                               <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-xl font-bold font-sans" value={s.value} onChange={e => updateArrayItem(setStats, i, 'value', e.target.value)} />
                            </div>
                         </div>
                         <BilingualInput label="Label" valueAr={s.label.ar} valueEn={s.label.en} onChangeAr={(v:any) => updateArrayItem(setStats, i, 'label', v, 'ar')} onChangeEn={(v:any) => updateArrayItem(setStats, i, 'label', v, 'en')} />
                      </div>
                   ))}
                </div>
             )}

             {/* Certificates Tab */}
             {activeTab === 'certs' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <button onClick={() => setCerts([{ id: Date.now().toString(), name: 'New Cert', img: '' }, ...certs])} className="col-span-full py-10 border-2 border-dashed border-white/10 rounded-[2rem] text-slate-600 font-black hover:border-blue-500 transition-all uppercase tracking-widest text-[9px]">+ Add Quality Certification</button>
                   {certs.map((c, i) => (
                      <div key={c.id} className="bg-[#080808] p-8 rounded-[2.5rem] border border-white/5 space-y-6 relative group">
                         <button onClick={() => deleteItem(setCerts, c.id)} className="absolute top-6 left-6 text-rose-500 text-[8px] font-black">X</button>
                         <ImageInput label="Cert Icon URL" value={c.img} onChange={(v:any) => updateArrayItem(setCerts, i, 'img', v)} />
                         <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs text-center font-bold" value={c.name} onChange={e => updateArrayItem(setCerts, i, 'name', e.target.value)} />
                      </div>
                   ))}
                </div>
             )}

             {/* Testimonials Tab */}
             {activeTab === 'testimonials' && (
                <div className="space-y-12">
                   <button onClick={() => setTestimonials([{ id: Date.now().toString(), name: { ar: 'عميل دولي جديد', en: 'New International Client' }, role: { ar: 'وكيل تصدير', en: 'Export Agent' }, content: { ar: 'رأيه هنا...', en: 'Client feedback goes here...' }, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200' }, ...testimonials])} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[3rem] text-slate-600 font-black hover:border-orange-500 transition-all uppercase tracking-widest text-[10px]">+ Record New Client Testimonial</button>
                   {testimonials.map((t, i) => (
                      <div key={t.id} className="bg-[#080808] p-10 rounded-[3.5rem] border border-white/5 space-y-8 relative group">
                         <button onClick={() => deleteItem(setTestimonials, t.id)} className="absolute top-8 left-8 text-rose-500 text-[10px] font-black uppercase px-4 py-1.5 bg-rose-500/10 rounded-xl">Delete Feed</button>
                         <ImageInput label="Avatar URL" value={t.avatar} onChange={(v:any) => updateArrayItem(setTestimonials, i, 'avatar', v)} />
                         <BilingualInput label="Client Name" valueAr={t.name.ar} valueEn={t.name.en} onChangeAr={(v:any) => updateArrayItem(setTestimonials, i, 'name', v, 'ar')} onChangeEn={(v:any) => updateArrayItem(setTestimonials, i, 'name', v, 'en')} />
                         <BilingualInput label="Role/Country" valueAr={t.role.ar} valueEn={t.role.en} onChangeAr={(v:any) => updateArrayItem(setTestimonials, i, 'role', v, 'ar')} onChangeEn={(v:any) => updateArrayItem(setTestimonials, i, 'role', v, 'en')} />
                         <BilingualInput label="Message Content" valueAr={t.content.ar} valueEn={t.content.en} onChangeAr={(v:any) => updateArrayItem(setTestimonials, i, 'content', v, 'ar')} onChangeEn={(v:any) => updateArrayItem(setTestimonials, i, 'content', v, 'en')} textarea />
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

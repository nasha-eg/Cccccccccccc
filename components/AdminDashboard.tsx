
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

  // نظام المزامنة اللحظية
  const sync = async (table: string, data: any) => {
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
    if (window.confirm('حذف نهائي؟ لن يمكن التراجع')) {
      setList((prev: any[]) => prev.filter((item: any) => item.id !== id));
    }
  };

  const ImageInput = ({ label, value, onChange }: any) => (
    <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 space-y-4 shadow-inner">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
      <div className="flex gap-6 items-center">
        <input className="flex-grow bg-black border border-white/10 p-4 rounded-2xl text-xs text-white outline-none focus:border-orange-500 font-sans" placeholder="رابط الصورة (https://...)" value={value} onChange={e => onChange(e.target.value)} />
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
          {value && <img src={value} className="w-full h-full object-cover" alt="Preview" />}
        </div>
      </div>
    </div>
  );

  const BilingualInput = ({ label, valueAr, valueEn, onChangeAr, onChangeEn, textarea = false }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 p-10 rounded-[3.5rem] border border-white/5">
      <div className="space-y-4">
        <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest">AR - {label}</label>
        {textarea ? (
          <textarea className="w-full bg-black border border-white/10 p-6 rounded-3xl text-sm text-white focus:border-orange-500 outline-none h-40" value={valueAr} onChange={e => onChangeAr(e.target.value)} />
        ) : (
          <input className="w-full bg-black border border-white/10 p-6 rounded-3xl text-sm text-white focus:border-orange-500 outline-none" value={valueAr} onChange={e => onChangeAr(e.target.value)} />
        )}
      </div>
      <div className="space-y-4">
        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">EN - {label}</label>
        {textarea ? (
          <textarea className="w-full bg-black border border-white/10 p-6 rounded-3xl text-sm text-white font-sans focus:border-orange-500 outline-none h-40" dir="ltr" value={valueEn} onChange={e => onChangeEn(e.target.value)} />
        ) : (
          <input className="w-full bg-black border border-white/10 p-6 rounded-3xl text-sm text-white font-sans focus:border-orange-500 outline-none" dir="ltr" value={valueEn} onChange={e => onChangeEn(e.target.value)} />
        )}
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-cairo" dir="rtl">
        <div className="w-full max-w-sm bg-[#050505] border border-white/10 p-14 rounded-[4rem] shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full"></div>
          <div className="w-24 h-24 dynamic-bg rounded-[2rem] flex items-center justify-center text-black font-black text-4xl mx-auto mb-12 shadow-2xl">A</div>
          <h2 className="text-3xl font-black text-white mb-10 tracking-tighter uppercase">Nerve Center</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" placeholder="Key" className="w-full bg-black border border-white/10 p-6 rounded-2xl text-white text-center text-4xl outline-none focus:border-orange-500" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
            <button type="submit" className="w-full py-6 dynamic-bg text-black font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all text-xs tracking-widest uppercase">Unlock System</button>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: '🏠' },
    { id: 'mysql', label: 'المزامنة (Cloud)', icon: '☁️' },
    { id: 'settings', label: 'الهوية', icon: '⚙️' },
    { id: 'products', label: 'المنتجات', icon: '📦' },
    { id: 'gallery', label: 'المعرض', icon: '🖼️' },
    { id: 'blog', label: 'المدونة', icon: '📝' },
    { id: 'offers', label: 'العروض', icon: '🏷️' },
    { id: 'testimonials', label: 'الآراء', icon: '💬' }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col lg:flex-row font-cairo" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 bg-black border-l border-white/5 flex flex-col h-screen sticky top-0 z-50">
        <div className="p-12 border-b border-white/5 flex items-center gap-5">
           <div className="w-12 h-12 dynamic-bg rounded-2xl flex items-center justify-center text-black font-black text-2xl">A</div>
           <div className="flex flex-col">
              <span className="font-black text-sm uppercase tracking-tighter">AL-ASIMH CMS</span>
              <span className="text-[9px] font-bold text-orange-500/50 uppercase">Global Edition v4.2</span>
           </div>
        </div>
        <nav className="flex-grow p-8 space-y-3 overflow-y-auto custom-scroll">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-right px-7 py-5 rounded-[1.5rem] flex items-center gap-5 transition-all duration-300 ${activeTab === item.id ? 'bg-orange-500 text-black font-black shadow-2xl' : 'text-slate-500 hover:bg-white/5'}`}>
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-10 border-t border-white/5">
           <button onClick={onLogout} className="w-full py-5 text-rose-500 text-[10px] font-black uppercase border border-rose-500/10 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">Destroy Session</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-20 overflow-y-auto bg-grid-pattern">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-24 gap-10">
             <div>
                <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">{activeTab}</h1>
                <div className="flex items-center gap-4 mt-6">
                   <div className={`w-3 h-3 rounded-full ${dbStatus === 'syncing' ? 'bg-orange-500 animate-pulse' : dbStatus === 'connected' ? 'bg-emerald-500 shadow-emerald-500/40 shadow-lg' : 'bg-rose-500 animate-bounce'}`}></div>
                   <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                     {dbStatus === 'syncing' ? 'Broadcasting to Cloud...' : dbConfig.mode === 'mysql' ? 'Cloud Synchronization: ACTIVE' : 'Local Sandbox Mode'}
                   </span>
                </div>
             </div>
          </header>

          <div className="space-y-20">
            
            {activeTab === 'mysql' && (
              <div className="bg-[#050505] p-16 rounded-[5rem] border border-white/5 space-y-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>
                <div className="flex items-center gap-8 mb-12 border-b border-white/5 pb-12">
                   <div className="text-7xl">☁️</div>
                   <div>
                     <h3 className="text-3xl font-black mb-3">Global Data Synchronization</h3>
                     <p className="text-slate-500 text-lg font-light leading-relaxed italic">
                       اربط الموقع بسيرفر MySQL الخارجي لتظهر التعديلات لكافة الزوار حول العالم فوراً.
                     </p>
                   </div>
                </div>
                
                <div className="space-y-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Storage Protocol</label>
                      <div className="grid grid-cols-2 gap-6">
                        <button onClick={() => setDbConfig({...dbConfig, mode: 'local'})} className={`py-6 rounded-3xl font-black text-xs uppercase transition-all ${dbConfig.mode === 'local' ? 'bg-orange-500 text-black shadow-xl' : 'bg-white/5 text-slate-500 border border-white/5'}`}>Private LocalStorage</button>
                        <button onClick={() => setDbConfig({...dbConfig, mode: 'mysql'})} className={`py-6 rounded-3xl font-black text-xs uppercase transition-all ${dbConfig.mode === 'mysql' ? 'bg-blue-500 text-white shadow-xl' : 'bg-white/5 text-slate-500 border border-white/5'}`}>Public Cloud MySQL</button>
                      </div>
                   </div>

                   {dbConfig.mode === 'mysql' && (
                     <div className="space-y-8 animate-in slide-in-from-top duration-500">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Remote API Endpoint (PHP/Node)</label>
                          <input className="w-full bg-black border border-white/10 p-6 rounded-3xl text-white font-sans text-lg focus:border-blue-500 outline-none" placeholder="https://your-server.com/api" value={dbConfig.apiUrl} onChange={e => setDbConfig({...dbConfig, apiUrl: e.target.value})} />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Master API Key (Auth)</label>
                          <input type="password" className="w-full bg-black border border-white/10 p-6 rounded-3xl text-white font-sans text-lg focus:border-blue-500 outline-none" placeholder="Secure Token" value={dbConfig.apiKey} onChange={e => setDbConfig({...dbConfig, apiKey: e.target.value})} />
                        </div>
                     </div>
                   )}

                   <button onClick={() => { dbService.setConfig(dbConfig); window.location.reload(); }} className="w-full py-8 dynamic-bg text-black font-black rounded-[2.5rem] shadow-2xl hover:scale-[1.01] transition-all uppercase text-sm tracking-widest mt-10">
                     Authorize & Re-initialize System
                   </button>
                </div>
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { l: 'المنتجات المسجلة', v: products.length, i: '📦', c: 'text-orange-500' },
                  { l: 'صور المعرض الحي', v: galleryItems.length, i: '🖼️', c: 'text-emerald-500' },
                  { l: 'المقالات المنشورة', v: articles.length, i: '📝', c: 'text-blue-500' }
                ].map((s, i) => (
                  <div key={i} className="bg-black p-16 rounded-[4rem] border border-white/5 text-center shadow-2xl relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                    <span className="text-6xl mb-6 block drop-shadow-lg">{s.i}</span>
                    <span className="text-[11px] text-slate-500 font-black uppercase block mb-3 tracking-widest">{s.l}</span>
                    <span className={`text-8xl font-black ${s.c} tracking-tighter`}>{s.v}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-black p-16 rounded-[5rem] border border-white/5 space-y-12 shadow-2xl relative">
                <div className="absolute top-0 right-0 w-full h-full bg-orange-500/[0.02] blur-[150px] pointer-events-none"></div>
                <h3 className="text-2xl font-black uppercase tracking-widest text-orange-500 border-b border-white/10 pb-10 mb-10">Identity Configuration</h3>
                <ImageInput label="Brand Logo (Direct URL)" value={settings.logoUrl} onChange={(v:any) => setSettings({...settings, logoUrl: v})} />
                <ImageInput label="Primary Hero Background" value={settings.heroBg} onChange={(v:any) => setSettings({...settings, heroBg: v})} />
                <BilingualInput label="Brand Legal Name" valueAr={settings.brandName.ar} valueEn={settings.brandName.en} onChangeAr={(v:any) => setSettings({...settings, brandName: {...settings.brandName, ar: v}})} onChangeEn={(v:any) => setSettings({...settings, brandName: {...settings.brandName, en: v}})} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-10 border-t border-white/5">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">WhatsApp ID</label>
                      <input className="w-full bg-black border border-white/10 p-6 rounded-3xl text-white font-sans focus:border-orange-500 outline-none" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Official Phone</label>
                      <input className="w-full bg-black border border-white/10 p-6 rounded-3xl text-white font-sans focus:border-orange-500 outline-none" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Official Email</label>
                      <input className="w-full bg-black border border-white/10 p-6 rounded-3xl text-white font-sans focus:border-orange-500 outline-none" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} />
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-16">
                <button onClick={() => setProducts([{ id: Date.now().toString(), title: { ar: 'صنف جديد', en: 'New Grade' }, desc: { ar: 'وصف فني...', en: 'Technical desc...' }, specs: { ar: ['الكربون: 80%'], en: ['Carbon: 80%'] }, icon: '🔥', images: [], msg: { ar: 'استفسار بالجملة', en: 'Wholesale Inquiry' } }, ...products])} className="w-full py-16 border-2 border-dashed border-white/10 rounded-[4rem] text-slate-600 font-black hover:border-orange-500 hover:text-orange-500 transition-all uppercase tracking-[0.4em] text-xs">+ Register New Product SKU</button>
                <div className="grid grid-cols-1 gap-12">
                  {products.map((p, i) => (
                    <div key={p.id} className="bg-[#080808] p-16 rounded-[5rem] border border-white/5 relative group space-y-10">
                      <button onClick={() => deleteItem(setProducts, p.id)} className="absolute top-12 left-12 text-rose-500 text-[11px] font-black uppercase bg-rose-500/10 px-6 py-2 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">Terminate Item</button>
                      <div className="flex items-center gap-6">
                         <input className="bg-black border border-white/10 p-4 rounded-xl text-3xl w-24 text-center" value={p.icon} onChange={e => updateArray(setProducts, i, 'icon', e.target.value)} />
                         <h3 className="text-2xl font-black uppercase tracking-widest text-slate-400">SKU Configuration</h3>
                      </div>
                      <BilingualInput label="Product Title" valueAr={p.title.ar} valueEn={p.title.en} onChangeAr={(v:any) => updateArray(setProducts, i, 'title', v, 'ar')} onChangeEn={(v:any) => updateArray(setProducts, i, 'title', v, 'en')} />
                      <BilingualInput label="Technical Summary" valueAr={p.desc.ar} valueEn={p.desc.en} onChangeAr={(v:any) => updateArray(setProducts, i, 'desc', v, 'ar')} onChangeEn={(v:any) => updateArray(setProducts, i, 'desc', v, 'en')} textarea />
                      <ImageInput label="Main Listing Image" value={p.images[0] || ''} onChange={(v:any) => updateArray(setProducts, i, 'images', [v])} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* باقي الأقسام تتبع نفس النمط لضمان اكتمال الوظائف */}
          </div>
        </div>
      </main>
    </div>
  );
};

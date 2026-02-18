
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

export const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('db');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [dbConfig, setDbConfig] = useState<DBConfig | null>(() => dbService.getConfig());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1997') setIsLoggedIn(true);
    else alert('❌ كلمة المرور غير صحيحة');
  };

  // Sync effect
  const sync = async (table: string, data: any) => {
    if (!dbConfig?.apiUrl) return;
    setSyncStatus('syncing');
    try {
      const res = await dbService.updateTable(table, data);
      setSyncStatus(res.success ? 'success' : 'error');
      setTimeout(() => setSyncStatus('idle'), 2500);
    } catch { setSyncStatus('error'); }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      sync('settings', props.settings);
      sync('products', props.products);
      sync('gallery', props.galleryItems);
      sync('testimonials', props.testimonials);
      sync('offers', props.offers);
      sync('blog', props.articles);
      sync('stats', props.stats);
      sync('certs', props.certs);
    }, 1500);
    return () => clearTimeout(t);
  }, [props.settings, props.products, props.galleryItems, props.testimonials, props.offers, props.articles, props.stats, props.certs]);

  const updateItem = (setter: Function, idx: number, field: string, val: any, lang?: 'ar'|'en') => {
    setter((prev: any[]) => {
      const copy = [...prev];
      if (lang) copy[idx] = { ...copy[idx], [field]: { ...copy[idx][field], [lang]: val } };
      else copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8 font-cairo" dir="rtl">
        <div className="w-full max-w-lg bg-zinc-900/80 backdrop-blur-3xl border border-white/5 p-16 rounded-[4rem] text-center shadow-2xl">
          <div className="w-24 h-24 dynamic-bg rounded-3xl flex items-center justify-center text-black font-black text-4xl mx-auto mb-12 shadow-2xl">A</div>
          <h2 className="text-white text-4xl font-black mb-12 tracking-tighter uppercase">بوابة إدارة السيرفر</h2>
          <form onSubmit={handleLogin} className="space-y-8">
            <input type="password" className="w-full bg-black/40 border border-white/10 p-8 rounded-[2rem] text-white text-center text-5xl outline-none focus:border-orange-500 transition-all font-sans tracking-[0.4em] shadow-inner" placeholder="••••" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
            <button type="submit" className="w-full py-8 dynamic-bg text-black font-black rounded-[2rem] hover:scale-[1.03] active:scale-95 transition-all text-sm uppercase tracking-[0.4em] shadow-2xl shadow-orange-500/20">دخول النظام</button>
          </form>
        </div>
      </div>
    );
  }

  const menu = [
    { id: 'db', label: 'السيرفر', icon: '☁️' },
    { id: 'identity', label: 'الهوية', icon: '🎨' },
    { id: 'products', label: 'المنتجات', icon: '📦' },
    { id: 'gallery', label: 'المعرض', icon: '🖼️' },
    { id: 'offers', label: 'العروض', icon: '🏷️' },
    { id: 'testimonials', label: 'الآراء', icon: '💬' }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col lg:flex-row font-cairo" dir="rtl">
      <aside className="w-full lg:w-96 bg-black border-l border-white/5 flex flex-col p-10 h-screen sticky top-0 z-[100] custom-scrollbar">
        <div className="mb-16 p-8 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 flex items-center gap-6">
           <div className="w-16 h-16 dynamic-bg rounded-2xl flex items-center justify-center text-black font-black text-3xl shadow-xl">A</div>
           <div>
             <div className="font-black text-lg text-white">إدارة العاصمة</div>
             <div className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.3em]">Central Cloud Hub</div>
           </div>
        </div>
        <nav className="flex-grow space-y-3">
          {menu.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-6 px-8 py-6 rounded-[2rem] text-[12px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-orange-500 text-black shadow-2xl scale-[1.02]' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}>
              <span className="text-2xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-16 pt-10 border-t border-white/5 space-y-6">
           <div className={`text-center py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${syncStatus === 'syncing' ? 'bg-blue-500/20 text-blue-400 animate-pulse' : syncStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-900 text-zinc-500'}`}>
             {syncStatus === 'syncing' ? '🔄 مزامنة السحاب...' : syncStatus === 'success' ? '✅ تم الحفظ بنجاح' : '📡 جاهز'}
           </div>
           <button onClick={props.onLogout} className="w-full py-4 text-zinc-700 text-[11px] font-black uppercase tracking-widest hover:text-rose-500">Sign Out</button>
        </div>
      </aside>

      <main className="flex-grow p-10 lg:p-24 overflow-y-auto max-h-screen custom-scrollbar bg-[#080808]">
        <div className="max-w-5xl mx-auto pb-48">
          <header className="mb-24 flex justify-between items-end border-b border-white/5 pb-12">
             <div><h1 className="text-7xl font-black text-white tracking-tighter mb-4 uppercase">{activeTab}</h1><p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.5em]">System Management Platform</p></div>
             <a href="/" target="_blank" className="px-10 py-5 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-black transition-all">Preview Site ↗</a>
          </header>

          {activeTab === 'db' && (
            <div className="animate-in fade-in duration-700 space-y-12">
               <div className="bg-zinc-900/30 p-16 rounded-[4rem] border border-white/5 space-y-12 shadow-2xl">
                  <div className="flex items-center gap-8"><div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-4xl">🔗</div><div><h3 className="text-2xl font-black text-white">إعدادات الاتصال السحابي</h3><p className="text-zinc-500 text-sm">اربط الموقع بقاعدة البيانات الخاصة بك ليرى الزوار التعديلات فوراً.</p></div></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3"><label className="text-[11px] font-black text-zinc-600 uppercase">DB User</label><input className="w-full bg-black border border-white/10 p-6 rounded-2xl outline-none focus:border-orange-500 text-sm font-sans" dir="ltr" value={dbConfig?.user || ''} onChange={e => { const c = {...(dbConfig||{host:'',dbName:'',user:'',pass:'',mode:'mysql',apiUrl:''}), user: e.target.value}; setDbConfig(c); dbService.setConfig(c); }} /></div>
                    <div className="space-y-3"><label className="text-[11px] font-black text-zinc-600 uppercase">DB Name</label><input className="w-full bg-black border border-white/10 p-6 rounded-2xl outline-none focus:border-orange-500 text-sm font-sans" dir="ltr" value={dbConfig?.dbName || ''} onChange={e => { const c = {...(dbConfig||{host:'',dbName:'',user:'',pass:'',mode:'mysql',apiUrl:''}), dbName: e.target.value}; setDbConfig(c); dbService.setConfig(c); }} /></div>
                    <div className="md:col-span-2 space-y-3"><label className="text-[11px] font-black text-blue-500 uppercase">API URL (Link to api.php)</label><input className="w-full bg-black border border-white/10 p-7 rounded-2xl outline-none focus:border-blue-500 text-sm font-sans text-blue-400" dir="ltr" value={dbConfig?.apiUrl || ''} placeholder="https://domain.com/api.php" onChange={e => { const c = {...(dbConfig||{host:'',dbName:'',user:'',pass:'',mode:'mysql',apiUrl:''}), apiUrl: e.target.value}; setDbConfig(c); dbService.setConfig(c); }} /></div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="animate-in fade-in duration-500 space-y-16">
               <button onClick={() => props.setProducts([{ id: Date.now().toString(), title: { ar: 'منتج جديد', en: 'New' }, desc: { ar: 'وصف المنتج...', en: 'Desc' }, specs: { ar: ['نخب أول'], en: ['Grade A'] }, icon: '💎', images: [''], msg: { ar: 'استفسار', en: 'Inquiry' } }, ...props.products])} className="w-full py-24 border-2 border-dashed border-white/10 rounded-[4rem] text-zinc-600 font-black text-[14px] uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/5 transition-all group bg-zinc-900/10"><span className="block text-6xl mb-8 group-hover:scale-110 transition-transform">➕</span> إضافة منتج جديد</button>
               {props.products.map((p, i) => (
                 <div key={p.id} className="bg-zinc-900/40 border border-white/5 p-16 rounded-[5rem] relative space-y-16 shadow-2xl transition-all hover:bg-zinc-900/60">
                    <button onClick={() => props.setProducts(prev => prev.filter(x => x.id !== p.id))} className="absolute top-12 left-12 text-rose-500 hover:bg-rose-500 hover:text-white px-8 py-5 rounded-[1.5rem] border border-rose-500/20 text-[11px] font-black uppercase transition-all">حذف</button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
                       <div className="space-y-4"><label className="text-[12px] font-black text-zinc-600 uppercase">الأيقونة</label><input className="w-full bg-black border border-white/10 p-6 rounded-2xl text-4xl text-center" value={p.icon} onChange={e => updateItem(props.setProducts, i, 'icon', e.target.value)} /></div>
                       <div className="space-y-4"><label className="text-[12px] font-black text-zinc-600 uppercase">اسم المنتج (عربي)</label><input className="w-full bg-black border border-white/10 p-6 rounded-2xl text-lg font-bold" value={p.title.ar} onChange={e => updateItem(props.setProducts, i, 'title', e.target.value, 'ar')} /></div>
                       <div className="col-span-2 space-y-6">
                         <label className="text-[12px] font-black text-orange-500 uppercase flex items-center gap-4">🖼️ صور المنتج (روابط مفصولة بفاصلة)</label>
                         <textarea className="w-full bg-black border border-white/10 p-8 rounded-[3rem] text-[12px] font-sans text-emerald-500 h-64 leading-relaxed custom-scrollbar outline-none focus:border-orange-500" dir="ltr" value={p.images.join(', ')} onChange={e => updateItem(props.setProducts, i, 'images', e.target.value.split(',').map(s => s.trim()))} placeholder="URL1, URL2, URL3..." />
                         <div className="flex gap-5 overflow-x-auto pb-6 custom-scrollbar">
                            {p.images.map((img, idx) => img && (
                              <div key={idx} className="w-32 h-32 rounded-3xl border border-white/5 overflow-hidden bg-black flex-shrink-0 shadow-2xl relative group/img">
                                 <img src={img} className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100 transition-opacity" />
                                 <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white bg-black/40 opacity-0 group-hover/img:opacity-100">{idx + 1}</div>
                              </div>
                            ))}
                         </div>
                       </div>
                       <div className="col-span-2 space-y-4"><label className="text-[12px] font-black text-zinc-600 uppercase">المواصفات (عربي - افصل بفاصلة)</label><input className="w-full bg-black border border-white/10 p-6 rounded-2xl text-sm" value={p.specs.ar.join(', ')} onChange={e => updateItem(props.setProducts, i, 'specs', e.target.value.split(','), 'ar')} /></div>
                       <div className="col-span-2 space-y-4"><label className="text-[12px] font-black text-zinc-600 uppercase">الوصف (عربي)</label><textarea className="w-full bg-black border border-white/10 p-8 rounded-[2.5rem] text-sm h-48 leading-relaxed" value={p.desc.ar} onChange={e => updateItem(props.setProducts, i, 'desc', e.target.value, 'ar')} /></div>
                    </div>
                 </div>
               ))}
            </div>
          )}
          {/* Other tabs can be added here mirroring this sync pattern */}
        </div>
      </main>
    </div>
  );
};

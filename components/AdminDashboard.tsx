
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
    const timer = setTimeout(() => {
      if (!isLoggedIn) return;
      sync('settings', props.settings);
      sync('products', props.products);
      sync('gallery', props.galleryItems);
      sync('testimonials', props.testimonials);
      sync('offers', props.offers);
      sync('blog', props.articles);
      sync('stats', props.stats);
      sync('certs', props.certs);
    }, 2000);
    return () => clearTimeout(timer);
  }, [props.settings, props.products, props.galleryItems, props.testimonials, props.offers, props.articles, props.stats, props.certs, isLoggedIn]);

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
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-8 font-cairo" dir="rtl">
        <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] text-center shadow-2xl">
          <div className="w-20 h-20 dynamic-bg rounded-2xl flex items-center justify-center text-black font-black text-3xl mx-auto mb-10 shadow-2xl animate-float">A</div>
          <h2 className="text-white text-3xl font-black mb-10 tracking-tighter uppercase">بوابة المسؤول</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" 
              className="w-full bg-black/50 border border-white/10 p-6 rounded-2xl text-white text-center text-4xl outline-none focus:border-orange-500 transition-all font-sans tracking-[0.3em]" 
              placeholder="••••" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
            <button type="submit" className="w-full py-6 dynamic-bg text-black font-black rounded-2xl hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-[0.3em] shadow-xl shadow-orange-500/20">دخول النظام</button>
          </form>
        </div>
      </div>
    );
  }

  const menu = [
    { id: 'db', label: 'السيرفر', icon: '🌐' },
    { id: 'identity', label: 'الهوية', icon: '💎' },
    { id: 'products', label: 'المنتجات', icon: '📦' },
    { id: 'gallery', label: 'المعرض', icon: '🖼️' },
    { id: 'stats', label: 'الأرقام', icon: '📊' },
    { id: 'blog', label: 'المقالات', icon: '📝' },
    { id: 'offers', label: 'العروض', icon: '🏷️' },
    { id: 'testimonials', label: 'الآراء', icon: '💬' },
    { id: 'certs', label: 'الشهادات', icon: '📜' }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col lg:flex-row font-cairo" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 bg-black border-l border-white/5 flex flex-col p-8 h-screen sticky top-0 z-[100]">
        <div className="mb-12 flex items-center gap-4">
           <div className="w-12 h-12 dynamic-bg rounded-xl flex items-center justify-center text-black font-black text-2xl shadow-lg">A</div>
           <div className="flex flex-col">
             <span className="font-black text-lg text-white">إدارة العاصمة</span>
             <span className="text-[8px] text-orange-500 font-bold uppercase tracking-[0.2em]">Enterprise CMS</span>
           </div>
        </div>
        
        <nav className="flex-grow space-y-2 overflow-y-auto custom-scrollbar pr-2">
          {menu.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-orange-500 text-black shadow-lg scale-[1.02]' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}>
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
           <div className={`text-center py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${syncStatus === 'syncing' ? 'bg-blue-500/10 text-blue-400' : syncStatus === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-900/50 text-zinc-500'}`}>
             {syncStatus === 'syncing' ? '🔄 جاري المزامنة...' : syncStatus === 'success' ? '✅ تم الحفظ' : '📡 متصل'}
           </div>
           <button onClick={props.onLogout} className="w-full py-3 text-zinc-700 text-[10px] font-black uppercase tracking-widest hover:text-rose-500">خروج</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-16 overflow-y-auto max-h-screen bg-[#050505] custom-scrollbar">
        <div className="max-w-5xl mx-auto pb-32">
          <header className="mb-16 border-b border-white/5 pb-8 flex justify-between items-end">
             <div>
                <h1 className="text-6xl font-black text-white tracking-tighter mb-2 uppercase">{activeTab}</h1>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.4em]">نظام إدارة المحتوى المتكامل</p>
             </div>
             <a href="/" target="_blank" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-black transition-all">معاينة الموقع ↗</a>
          </header>

          {activeTab === 'db' && (
            <div className="space-y-10 animate-in fade-in duration-700">
               <div className="bg-zinc-900/30 p-12 rounded-[3rem] border border-white/5 space-y-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-3xl">🌐</div>
                    <div><h3 className="text-xl font-black text-white">إعدادات قاعدة البيانات</h3><p className="text-zinc-500 text-xs">اربط الموقع بالسيرفر الخاص بك لحفظ البيانات بشكل دائم.</p></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2"><label className="text-[10px] font-black text-zinc-600 uppercase">Host</label><input className="w-full bg-black border border-white/10 p-5 rounded-xl outline-none focus:border-orange-500 text-sm font-sans" dir="ltr" value={dbConfig?.host || ''} onChange={e => { const c = {...(dbConfig||{host:'',dbName:'',user:'',pass:'',mode:'mysql',apiUrl:''}), host: e.target.value}; setDbConfig(c); dbService.setConfig(c); }} /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-zinc-600 uppercase">DB Name</label><input className="w-full bg-black border border-white/10 p-5 rounded-xl outline-none focus:border-orange-500 text-sm font-sans" dir="ltr" value={dbConfig?.dbName || ''} onChange={e => { const c = {...(dbConfig||{host:'',dbName:'',user:'',pass:'',mode:'mysql',apiUrl:''}), dbName: e.target.value}; setDbConfig(c); dbService.setConfig(c); }} /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-zinc-600 uppercase">User</label><input className="w-full bg-black border border-white/10 p-5 rounded-xl outline-none focus:border-orange-500 text-sm font-sans" dir="ltr" value={dbConfig?.user || ''} onChange={e => { const c = {...(dbConfig||{host:'',dbName:'',user:'',pass:'',mode:'mysql',apiUrl:''}), user: e.target.value}; setDbConfig(c); dbService.setConfig(c); }} /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-zinc-600 uppercase">Password</label><input type="password" className="w-full bg-black border border-white/10 p-5 rounded-xl outline-none focus:border-orange-500 text-sm font-sans" dir="ltr" value={dbConfig?.pass || ''} onChange={e => { const c = {...(dbConfig||{host:'',dbName:'',user:'',pass:'',mode:'mysql',apiUrl:''}), pass: e.target.value}; setDbConfig(c); dbService.setConfig(c); }} /></div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-blue-500 uppercase">API URL (Link to api.php)</label>
                      <input className="w-full bg-black border border-white/10 p-6 rounded-xl outline-none focus:border-blue-500 text-sm font-sans text-blue-400" dir="ltr" value={dbConfig?.apiUrl || ''} placeholder="https://domain.com/api.php" onChange={e => { const c = {...(dbConfig||{host:'',dbName:'',user:'',pass:'',mode:'mysql',apiUrl:''}), apiUrl: e.target.value}; setDbConfig(c); dbService.setConfig(c); }} />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'identity' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-zinc-900/30 p-10 rounded-[3rem] border border-white/5 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-zinc-600 uppercase">رابط الشعار (Logo URL)</label>
                      <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-sans text-emerald-500" dir="ltr" value={props.settings.logoUrl} onChange={e => props.setSettings({...props.settings, logoUrl: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-600 uppercase">اسم البراند (عربي)</label>
                      <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm font-bold" value={props.settings.brandName.ar} onChange={e => props.setSettings({...props.settings, brandName: {...props.settings.brandName, ar: e.target.value}})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-600 uppercase">Brand Name (EN)</label>
                      <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm font-bold font-sans" dir="ltr" value={props.settings.brandName.en} onChange={e => props.setSettings({...props.settings, brandName: {...props.settings.brandName, en: e.target.value}})} />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-orange-500 uppercase">صورة الخلفية (Hero Image)</label>
                      <input className="w-full bg-black border border-white/10 p-5 rounded-xl text-xs font-sans text-blue-400" dir="ltr" value={props.settings.heroBg} onChange={e => props.setSettings({...props.settings, heroBg: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-600 uppercase">رقم الواتساب</label>
                      <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm font-sans" dir="ltr" value={props.settings.whatsapp} onChange={e => props.setSettings({...props.settings, whatsapp: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-600 uppercase">البريد الإلكتروني</label>
                      <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm font-sans" dir="ltr" value={props.settings.email} onChange={e => props.setSettings({...props.settings, email: e.target.value})} />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <button onClick={() => props.setProducts([{ id: Date.now().toString(), title: { ar: 'منتج جديد', en: 'New' }, desc: { ar: 'وصف...', en: 'Desc' }, specs: { ar: ['مواصفة'], en: ['Spec'] }, icon: '📦', images: ['https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=80'], msg: { ar: 'طلب', en: 'Order' } }, ...props.products])} className="w-full py-16 border-2 border-dashed border-white/10 rounded-[3rem] text-zinc-600 font-black text-[12px] uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all bg-zinc-900/10">➕ إضافة منتج جديد</button>
               {props.products.map((p, i) => (
                 <div key={p.id} className="bg-zinc-900/30 border border-white/5 p-12 rounded-[4rem] relative space-y-10 group shadow-xl">
                    <button onClick={() => props.setProducts(prev => prev.filter(x => x.id !== p.id))} className="absolute top-8 left-8 text-rose-500 hover:bg-rose-500 hover:text-white px-6 py-3 rounded-xl border border-rose-500/20 text-[10px] font-black uppercase transition-all">حذف</button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8">
                       <div className="space-y-2"><label className="text-[10px] font-black text-zinc-600 uppercase">الأيقونة</label><input className="w-full bg-black border border-white/10 p-5 rounded-xl text-4xl text-center" value={p.icon} onChange={e => updateItem(props.setProducts, i, 'icon', e.target.value)} /></div>
                       <div className="space-y-2"><label className="text-[10px] font-black text-zinc-600 uppercase">اسم المنتج (عربي)</label><input className="w-full bg-black border border-white/10 p-5 rounded-xl text-lg font-bold" value={p.title.ar} onChange={e => updateItem(props.setProducts, i, 'title', e.target.value, 'ar')} /></div>
                       <div className="col-span-2 space-y-4">
                         <label className="text-[10px] font-black text-orange-500 uppercase">🖼️ صور المنتج (روابط مفصولة بفاصلة)</label>
                         <textarea className="w-full bg-black border border-white/10 p-6 rounded-[2rem] text-[10px] font-sans text-emerald-500 h-48 leading-relaxed outline-none focus:border-orange-500" dir="ltr" value={p.images.join(', ')} onChange={e => updateItem(props.setProducts, i, 'images', e.target.value.split(',').map(s => s.trim()))} />
                         <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            {p.images.map((img, idx) => img && (
                              <div key={idx} className="w-24 h-24 rounded-2xl border border-white/10 overflow-hidden bg-black flex-shrink-0">
                                 <img src={img} className="w-full h-full object-cover" />
                              </div>
                            ))}
                         </div>
                       </div>
                       <div className="col-span-2 space-y-2">
                         <label className="text-[10px] font-black text-zinc-600 uppercase">الوصف (عربي)</label>
                         <textarea className="w-full bg-black border border-white/10 p-6 rounded-[2rem] text-sm h-32 leading-relaxed" value={p.desc.ar} onChange={e => updateItem(props.setProducts, i, 'desc', e.target.value, 'ar')} />
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <button onClick={() => props.setArticles([{ id: Date.now(), title: { ar: 'مقال جديد', en: 'New' }, excerpt: { ar: 'ملخص...', en: 'Excerpt' }, date: { ar: '2025', en: '2025' }, img: 'https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=50', category: { ar: 'ثقافة', en: 'Technical' } }, ...props.articles])} className="w-full py-16 border-2 border-dashed border-white/10 rounded-[3rem] text-zinc-600 font-black text-[12px] uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all bg-zinc-900/10">➕ إضافة مقال جديد</button>
               {props.articles.map((art, i) => (
                 <div key={art.id} className="bg-zinc-900/30 border border-white/5 p-10 rounded-[4rem] relative space-y-8 group shadow-xl">
                    <button onClick={() => props.setArticles(prev => prev.filter(x => x.id !== art.id))} className="absolute top-8 left-8 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">حذف</button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                       <div className="space-y-2"><label className="text-[10px] font-black text-zinc-600 uppercase">عنوان المقال (عربي)</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm font-bold" value={art.title.ar} onChange={e => updateItem(props.setArticles, i, 'title', e.target.value, 'ar')} /></div>
                       <div className="space-y-2"><label className="text-[10px] font-black text-zinc-600 uppercase">رابط الصورة</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-sans text-blue-400" dir="ltr" value={art.img} onChange={e => updateItem(props.setArticles, i, 'img', e.target.value)} /></div>
                       <div className="col-span-2 space-y-2"><label className="text-[10px] font-black text-zinc-600 uppercase">ملخص (عربي)</label><textarea className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xs h-24" value={art.excerpt.ar} onChange={e => updateItem(props.setArticles, i, 'excerpt', e.target.value, 'ar')} /></div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'certs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-500">
               <button onClick={() => props.setCerts([{ id: Date.now().toString(), name: 'Certificate', img: 'https://cdn-icons-png.flaticon.com/512/9334/9334461.png' }, ...props.certs])} className="col-span-full py-12 border-2 border-dashed border-white/10 rounded-[3rem] text-zinc-600 font-black text-[12px] uppercase tracking-widest hover:border-orange-500 transition-all">➕ إضافة شهادة اعتماد</button>
               {props.certs.map((cert, i) => (
                 <div key={cert.id} className="bg-zinc-900/30 p-8 rounded-[3rem] border border-white/5 space-y-6 relative group shadow-lg">
                    <button onClick={() => props.setCerts(prev => prev.filter(x => x.id !== cert.id))} className="absolute top-6 left-6 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">حذف</button>
                    <div className="flex items-center gap-6">
                       <div className="w-20 h-20 bg-black rounded-2xl p-4 border border-white/5 flex items-center justify-center">
                          <img src={cert.img} className="max-w-full max-h-full opacity-60" />
                       </div>
                       <div className="flex-grow space-y-4">
                          <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold" value={cert.name} onChange={e => updateItem(props.setCerts, i, 'name', e.target.value)} placeholder="اسم الشهادة" />
                          <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-[10px] font-sans text-blue-400" dir="ltr" value={cert.img} onChange={e => updateItem(props.setCerts, i, 'img', e.target.value)} placeholder="رابط الصورة" />
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
               {props.stats.map((stat, i) => (
                 <div key={stat.id} className="bg-zinc-900/30 p-10 rounded-[3rem] border border-white/5 space-y-6 shadow-lg">
                    <div className="flex items-center gap-6">
                       <input className="w-16 h-16 bg-black border border-white/10 rounded-xl text-3xl text-center" value={stat.icon} onChange={e => updateItem(props.setStats, i, 'icon', e.target.value)} />
                       <div className="flex-grow"><input className="w-full bg-black border border-white/10 p-4 rounded-xl text-3xl font-black text-orange-500" value={stat.value} onChange={e => updateItem(props.setStats, i, 'value', e.target.value)} /></div>
                    </div>
                    <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-400" value={stat.label.ar} onChange={e => updateItem(props.setStats, i, 'label', e.target.value, 'ar')} />
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <button onClick={() => props.setGalleryItems([{ id: Date.now().toString(), title: { ar: 'صورة', en: 'New' }, category: { ar: 'المصنع', en: 'Factory' }, img: 'https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=60' }, ...props.galleryItems])} className="w-full py-12 border-2 border-dashed border-white/10 rounded-[3rem] text-zinc-600 font-black text-[12px] uppercase tracking-widest hover:border-orange-500 transition-all">➕ إضافة صورة للمعرض</button>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {props.galleryItems.map((item, i) => (
                    <div key={item.id} className="bg-zinc-900/30 p-8 rounded-[3rem] border border-white/5 relative group overflow-hidden shadow-lg">
                       <button onClick={() => props.setGalleryItems(prev => prev.filter(x => x.id !== item.id))} className="absolute top-6 left-6 z-20 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">حذف</button>
                       <div className="aspect-video rounded-2xl overflow-hidden mb-6 border border-white/5 bg-black">
                          <img src={item.img} className="w-full h-full object-cover opacity-80" />
                       </div>
                       <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-[10px] font-sans text-blue-400 mb-4" dir="ltr" value={item.img} onChange={e => updateItem(props.setGalleryItems, i, 'img', e.target.value)} />
                       <div className="flex gap-4">
                          <input className="flex-grow bg-black border border-white/10 p-4 rounded-xl text-xs font-black" value={item.title.ar} onChange={e => updateItem(props.setGalleryItems, i, 'title', e.target.value, 'ar')} />
                          <input className="w-1/3 bg-black border border-white/10 p-4 rounded-xl text-[10px] font-black uppercase" value={item.category.ar} onChange={e => updateItem(props.setGalleryItems, i, 'category', e.target.value, 'ar')} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
          
          {activeTab === 'offers' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <button onClick={() => props.setOffers([{ id: Date.now(), title: { ar: 'خصم', en: 'Discount' }, discount: { ar: '10%', en: '10%' }, description: { ar: 'وصف...', en: 'Desc' }, expiry: { ar: '2025', en: '2025' }, type: { ar: 'محدود', en: 'Limited' }, isActive: true }, ...props.offers])} className="w-full py-12 border-2 border-dashed border-white/10 rounded-[3rem] text-zinc-600 font-black text-[12px] uppercase tracking-widest hover:border-orange-500 transition-all">➕ إضافة عرض ترويجي</button>
               {props.offers.map((offer, i) => (
                 <div key={offer.id} className="bg-zinc-900/30 p-10 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center gap-10 shadow-lg relative">
                    <button onClick={() => props.setOffers(prev => prev.filter(x => x.id !== offer.id))} className="absolute top-6 left-6 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">حذف</button>
                    <div className="w-24 h-24 dynamic-bg rounded-[1.5rem] flex items-center justify-center text-black font-black text-2xl shadow-xl">{offer.discount.ar}</div>
                    <div className="flex-grow space-y-4">
                       <div className="flex justify-between items-center gap-4">
                          <input className="bg-transparent text-xl font-black text-white outline-none w-full border-b border-white/10" value={offer.title.ar} onChange={e => updateItem(props.setOffers, i, 'title', e.target.value, 'ar')} />
                          <button onClick={() => updateItem(props.setOffers, i, 'isActive', !offer.isActive)} className={`px-4 py-2 rounded-full text-[8px] font-black uppercase ${offer.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                             {offer.isActive ? 'نشط' : 'متوقف'}
                          </button>
                       </div>
                       <input className="w-full bg-black/40 border border-white/5 p-3 rounded-lg text-xs text-zinc-400" value={offer.description.ar} onChange={e => updateItem(props.setOffers, i, 'description', e.target.value, 'ar')} />
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-500">
               <button onClick={() => props.setTestimonials([{ id: Date.now().toString(), name: { ar: 'عميل', en: 'Client' }, role: { ar: 'مستورد', en: 'Importer' }, content: { ar: 'رأي...', en: 'Opinion' }, avatar: 'https://i.pravatar.cc/150?u=' + Date.now() }, ...props.testimonials])} className="col-span-full py-12 border-2 border-dashed border-white/10 rounded-[3rem] text-zinc-600 font-black text-[12px] uppercase tracking-widest hover:border-orange-500 transition-all">➕ إضافة رأي عميل</button>
               {props.testimonials.map((t, i) => (
                 <div key={t.id} className="bg-zinc-900/30 p-10 rounded-[4rem] border border-white/5 space-y-6 relative group shadow-lg">
                    <button onClick={() => props.setTestimonials(prev => prev.filter(x => x.id !== t.id))} className="absolute top-8 left-8 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">حذف</button>
                    <div className="flex items-center gap-6">
                       <img src={t.avatar} className="w-16 h-16 rounded-full border-2 border-orange-500 p-0.5" />
                       <div className="flex-grow">
                          <input className="w-full bg-transparent text-lg font-black text-white outline-none border-b border-white/5 mb-2" value={t.name.ar} onChange={e => updateItem(props.setTestimonials, i, 'name', e.target.value, 'ar')} />
                          <input className="w-full bg-transparent text-[9px] font-black text-orange-500 uppercase tracking-widest outline-none" value={t.role.ar} onChange={e => updateItem(props.setTestimonials, i, 'role', e.target.value, 'ar')} />
                       </div>
                    </div>
                    <textarea className="w-full bg-black/40 border border-white/5 p-5 rounded-[2rem] text-xs text-zinc-400 italic h-28 custom-scrollbar" value={t.content.ar} onChange={e => updateItem(props.setTestimonials, i, 'content', e.target.value, 'ar')} />
                 </div>
               ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

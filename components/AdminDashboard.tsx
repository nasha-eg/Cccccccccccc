
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

  // Cloud Sync Function
  const sync = async (table: string, data: any) => {
    const config = dbService.getConfig();
    if (!config || !config.apiUrl) return;
    
    setSyncStatus('syncing');
    try {
      const res = await dbService.updateTable(table, data);
      if (res.success) {
        setSyncStatus('success');
      } else {
        setSyncStatus('error');
      }
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch {
      setSyncStatus('error');
    }
  };

  // Auto-sync effect with debounce
  useEffect(() => {
    if (!isLoggedIn) return;
    const timer = setTimeout(() => {
      sync('settings', props.settings);
      sync('products', props.products);
      sync('gallery', props.galleryItems);
      sync('testimonials', props.testimonials);
      sync('offers', props.offers);
      sync('blog', props.articles);
      sync('stats', props.stats);
      sync('certs', props.certs);
    }, 2500);
    return () => clearTimeout(timer);
  }, [props.settings, props.products, props.galleryItems, props.testimonials, props.offers, props.articles, props.stats, props.certs, isLoggedIn]);

  // Generic Update for objects with language support
  const updateNestedField = (setter: Function, idx: number, field: string, subField: 'ar' | 'en', value: any) => {
    setter((prev: any[]) => {
      const copy = [...prev];
      copy[idx] = { 
        ...copy[idx], 
        [field]: { ...copy[idx][field], [subField]: value } 
      };
      return copy;
    });
  };

  const updateSimpleField = (setter: Function, idx: number, field: string, value: any) => {
    setter((prev: any[]) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleIdentityChange = (field: keyof SiteSettings, val: any, lang?: 'ar' | 'en') => {
    props.setSettings(prev => {
      if (lang && typeof prev[field] === 'object') {
        return { ...prev, [field]: { ...(prev[field] as any), [lang]: val } };
      }
      return { ...prev, [field]: val };
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8 font-cairo" dir="rtl">
        <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-3xl border border-white/10 p-12 rounded-[3.5rem] text-center shadow-2xl">
          <div className="w-24 h-24 dynamic-bg rounded-3xl flex items-center justify-center text-black font-black text-4xl mx-auto mb-10 shadow-2xl animate-float">A</div>
          <h2 className="text-white text-3xl font-black mb-10 tracking-tighter uppercase">بوابة التحكم السحابي</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" 
              className="w-full bg-black/60 border border-white/10 p-6 rounded-2xl text-white text-center text-5xl outline-none focus:border-orange-500 transition-all font-sans tracking-[0.4em]" 
              placeholder="••••" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
            <button type="submit" className="w-full py-6 dynamic-bg text-black font-black rounded-2xl hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-[0.4em] shadow-xl shadow-orange-500/20">تأكيد الهوية</button>
          </form>
          <p className="mt-8 text-zinc-600 text-[9px] uppercase tracking-[0.3em] font-black">Al-Asimh Management System v4.2</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'db', label: 'إعداد السيرفر', icon: '☁️' },
    { id: 'identity', label: 'هوية الموقع', icon: '🎨' },
    { id: 'products', label: 'المنتجات', icon: '📦' },
    { id: 'gallery', label: 'المعرض', icon: '🖼️' },
    { id: 'stats', label: 'الأرقام', icon: '📈' },
    { id: 'blog', label: 'المقالات', icon: '📝' },
    { id: 'offers', label: 'العروض', icon: '🏷️' },
    { id: 'testimonials', label: 'الآراء', icon: '💬' },
    { id: 'certs', label: 'الشهادات', icon: '📜' }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col lg:flex-row font-cairo" dir="rtl">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-[350px] bg-black border-l border-white/5 flex flex-col p-8 h-screen sticky top-0 z-[100]">
        <div className="mb-12 flex items-center gap-5 p-4 bg-zinc-900/30 rounded-3xl border border-white/5">
           <div className="w-14 h-14 dynamic-bg rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-lg">A</div>
           <div className="flex flex-col">
             <span className="font-black text-lg text-white">إدارة العاصمة</span>
             <span className="text-[9px] text-orange-500 font-bold uppercase tracking-[0.2em]">Enterprise Core</span>
           </div>
        </div>
        
        <nav className="flex-grow space-y-2 overflow-y-auto custom-scrollbar pr-2">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-5 px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-orange-500 text-black shadow-2xl scale-[1.03]' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}>
              <span className="text-2xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-10 pt-8 border-t border-white/5 space-y-5">
           <div className={`text-center py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${syncStatus === 'syncing' ? 'bg-blue-500/10 text-blue-400 animate-pulse' : syncStatus === 'success' ? 'bg-emerald-500/10 text-emerald-400' : syncStatus === 'error' ? 'bg-rose-500/10 text-rose-400' : 'bg-zinc-900/50 text-zinc-500'}`}>
             {syncStatus === 'syncing' ? '🔄 جاري المزامنة...' : syncStatus === 'success' ? '✅ تم الحفظ بنجاح' : syncStatus === 'error' ? '❌ خطأ في السيرفر' : '📡 السيرفر جاهز'}
           </div>
           <button onClick={props.onLogout} className="w-full py-4 text-zinc-600 text-[10px] font-black uppercase tracking-widest hover:text-rose-500 transition-colors">خروج من النظام</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8 lg:p-20 overflow-y-auto max-h-screen bg-[#060606] custom-scrollbar">
        <div className="max-w-5xl mx-auto pb-48">
          <header className="mb-20 border-b border-white/5 pb-10 flex justify-between items-end">
             <div>
                <h1 className="text-7xl font-black text-white tracking-tighter mb-4 uppercase">{activeTab}</h1>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.5em]">نظام التحرير اللحظي للمحتوى</p>
             </div>
             <a href="/" target="_blank" className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-black hover:border-orange-500 transition-all shadow-xl">معاينة الموقع الرئيسي</a>
          </header>

          {/* TAB: DB CONNECTION */}
          {activeTab === 'db' && (
            <div className="space-y-12 animate-in fade-in duration-700">
               <div className="bg-zinc-900/20 p-12 rounded-[4rem] border border-white/5 space-y-12 shadow-2xl backdrop-blur-3xl">
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-4xl">🌐</div>
                    <div><h3 className="text-2xl font-black text-white">إعدادات الاتصال السحابي</h3><p className="text-zinc-500 text-sm mt-1">اربط لوحة التحكم بملف api.php على استضافتك لحفظ البيانات.</p></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3"><label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Host</label><input className="w-full bg-black border border-white/10 p-5 rounded-xl outline-none focus:border-orange-500 text-sm font-sans" dir="ltr" value={dbConfig?.host || ''} onChange={e => { const c = {...(dbConfig||{host:'',dbName:'',user:'',pass:'',mode:'mysql',apiUrl:''}), host: e.target.value}; setDbConfig(c); dbService.setConfig(c); }} /></div>
                    <div className="space-y-3"><label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">DB Name</label><input className="w-full bg-black border border-white/10 p-5 rounded-xl outline-none focus:border-orange-500 text-sm font-sans" dir="ltr" value={dbConfig?.dbName || ''} onChange={e => { const c = {...(dbConfig||{host:'',dbName:'',user:'',pass:'',mode:'mysql',apiUrl:''}), dbName: e.target.value}; setDbConfig(c); dbService.setConfig(c); }} /></div>
                    <div className="space-y-3"><label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">User</label><input className="w-full bg-black border border-white/10 p-5 rounded-xl outline-none focus:border-orange-500 text-sm font-sans" dir="ltr" value={dbConfig?.user || ''} onChange={e => { const c = {...(dbConfig||{host:'',dbName:'',user:'',pass:'',mode:'mysql',apiUrl:''}), user: e.target.value}; setDbConfig(c); dbService.setConfig(c); }} /></div>
                    <div className="space-y-3"><label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Password</label><input type="password" className="w-full bg-black border border-white/10 p-5 rounded-xl outline-none focus:border-orange-500 text-sm font-sans" dir="ltr" value={dbConfig?.pass || ''} onChange={e => { const c = {...(dbConfig||{host:'',dbName:'',user:'',pass:'',mode:'mysql',apiUrl:''}), pass: e.target.value}; setDbConfig(c); dbService.setConfig(c); }} /></div>
                    <div className="md:col-span-2 space-y-4 pt-6">
                      <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">API Endpoint (الرابط الكامل لملف api.php على الاستضافة)</label>
                      <input className="w-full bg-black border border-white/10 p-7 rounded-2xl outline-none focus:border-blue-500 text-sm font-sans text-blue-400 shadow-inner" dir="ltr" value={dbConfig?.apiUrl || ''} placeholder="https://yourdomain.com/api.php" onChange={e => { const c = {...(dbConfig||{host:'',dbName:'',user:'',pass:'',mode:'mysql',apiUrl:''}), apiUrl: e.target.value}; setDbConfig(c); dbService.setConfig(c); }} />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB: IDENTITY */}
          {activeTab === 'identity' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="bg-zinc-900/20 p-12 rounded-[4rem] border border-white/5 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase">رابط شعار الشركة (Logo Image URL)</label>
                      <input className="w-full bg-black border border-white/10 p-5 rounded-xl text-xs font-sans text-emerald-500 shadow-inner" dir="ltr" value={props.settings.logoUrl} onChange={e => handleIdentityChange('logoUrl', e.target.value)} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase">اسم البراند (AR)</label>
                      <input className="w-full bg-black border border-white/10 p-5 rounded-xl text-lg font-black" value={props.settings.brandName.ar} onChange={e => handleIdentityChange('brandName', e.target.value, 'ar')} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase">Brand Name (EN)</label>
                      <input className="w-full bg-black border border-white/10 p-5 rounded-xl text-lg font-black font-sans" dir="ltr" value={props.settings.brandName.en} onChange={e => handleIdentityChange('brandName', e.target.value, 'en')} />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-black text-orange-500 uppercase">التاغ لاين / شعار المرحلة (Tagline - AR)</label>
                      <input className="w-full bg-black border border-white/10 p-6 rounded-2xl text-sm font-bold shadow-inner" value={props.settings.tagline.ar} onChange={e => handleIdentityChange('tagline', e.target.value, 'ar')} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase">رقم الواتساب (بدون +)</label>
                      <input className="w-full bg-black border border-white/10 p-5 rounded-xl text-sm font-sans" dir="ltr" value={props.settings.whatsapp} onChange={e => handleIdentityChange('whatsapp', e.target.value)} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase">البريد الإلكتروني</label>
                      <input className="w-full bg-black border border-white/10 p-5 rounded-xl text-sm font-sans shadow-inner" dir="ltr" value={props.settings.email} onChange={e => handleIdentityChange('email', e.target.value)} />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-black text-zinc-600 uppercase">رابط خلفية الموقع الرئيسية (Hero Background)</label>
                      <input className="w-full bg-black border border-white/10 p-5 rounded-xl text-xs font-sans text-blue-400 shadow-inner" dir="ltr" value={props.settings.heroBg} onChange={e => handleIdentityChange('heroBg', e.target.value)} />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-16 animate-in fade-in duration-500">
               <button onClick={() => props.setProducts([{ id: Date.now().toString(), title: { ar: 'صنف جديد', en: 'New Item' }, desc: { ar: 'وصف جديد للفحم...', en: 'New charcoal description' }, specs: { ar: ['نخب أول'], en: ['Grade A'] }, icon: '🔥', images: [''], msg: { ar: 'استفسار', en: 'Inquiry' } }, ...props.products])} className="w-full py-20 border-2 border-dashed border-white/10 rounded-[3rem] text-zinc-500 font-black text-[12px] uppercase tracking-[0.5em] hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/5 transition-all shadow-xl">➕ إضافة صنف فحم جديد</button>
               {props.products.map((p, i) => (
                 <div key={p.id} className="bg-zinc-900/30 border border-white/5 p-12 rounded-[4.5rem] relative space-y-12 group shadow-2xl transition-all hover:bg-zinc-900/50">
                    <button onClick={() => props.setProducts(prev => prev.filter(x => x.id !== p.id))} className="absolute top-10 left-10 text-rose-500 border border-rose-500/20 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-xl">حذف</button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
                       <div className="space-y-3"><label className="text-[10px] font-black text-zinc-600 uppercase">الأيقونة (إيموجي)</label><input className="w-full bg-black border border-white/10 p-6 rounded-2xl text-5xl text-center shadow-inner" value={p.icon} onChange={e => updateSimpleField(props.setProducts, i, 'icon', e.target.value)} /></div>
                       <div className="space-y-3"><label className="text-[10px] font-black text-zinc-600 uppercase">اسم المنتج (عربي)</label><input className="w-full bg-black border border-white/10 p-6 rounded-2xl text-xl font-black" value={p.title.ar} onChange={e => updateNestedField(props.setProducts, i, 'title', 'ar', e.target.value)} /></div>
                       <div className="col-span-2 space-y-5">
                         <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-4">🖼️ صور المنتج (روابط مفصولة بفاصلة ,)</label>
                         <textarea className="w-full bg-black border border-white/10 p-8 rounded-[2.5rem] text-[10px] font-sans text-emerald-400 h-48 leading-relaxed outline-none focus:border-orange-500 shadow-inner custom-scrollbar" dir="ltr" value={p.images.join(', ')} onChange={e => updateSimpleField(props.setProducts, i, 'images', e.target.value.split(',').map(s => s.trim()))} />
                         <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar px-2">
                            {p.images.map((img, idx) => img && (
                              <div key={idx} className="w-28 h-28 rounded-3xl border border-white/10 overflow-hidden bg-black flex-shrink-0 shadow-2xl relative group/img">
                                 <img src={img} className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100 transition-opacity" />
                                 <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white bg-black/40 opacity-0 group-hover/img:opacity-100 uppercase">P-{idx+1}</div>
                              </div>
                            ))}
                         </div>
                       </div>
                       <div className="col-span-2 space-y-3">
                         <label className="text-[10px] font-black text-zinc-600 uppercase">الوصف التفصيلي (عربي)</label>
                         <textarea className="w-full bg-black border border-white/10 p-8 rounded-[2.5rem] text-sm h-40 leading-relaxed shadow-inner" value={p.desc.ar} onChange={e => updateNestedField(props.setProducts, i, 'desc', 'ar', e.target.value)} />
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {/* TAB: BLOG */}
          {activeTab === 'blog' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <button onClick={() => props.setArticles([{ id: Date.now(), title: { ar: 'مقال جديد', en: 'New Post' }, excerpt: { ar: 'محتوى المقال...', en: 'Post excerpt' }, date: { ar: '2025', en: '2025' }, img: '', category: { ar: 'تحليل', en: 'Analysis' } }, ...props.articles])} className="w-full py-12 border-2 border-dashed border-white/10 rounded-[3rem] text-zinc-600 font-black text-[11px] uppercase tracking-widest hover:border-orange-500 transition-all">➕ إضافة مقال للركن المعرفي</button>
               {props.articles.map((art, i) => (
                 <div key={art.id} className="bg-zinc-900/30 border border-white/5 p-10 rounded-[4rem] relative space-y-8 group shadow-xl">
                    <button onClick={() => props.setArticles(prev => prev.filter(x => x.id !== art.id))} className="absolute top-8 left-8 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">حذف</button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                       <div className="space-y-2"><label className="text-[10px] font-black text-zinc-600 uppercase">عنوان المقال (عربي)</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm font-bold" value={art.title.ar} onChange={e => updateNestedField(props.setArticles, i, 'title', 'ar', e.target.value)} /></div>
                       <div className="space-y-2"><label className="text-[10px] font-black text-zinc-600 uppercase">رابط الصورة</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-sans text-blue-400" dir="ltr" value={art.img} onChange={e => updateSimpleField(props.setArticles, i, 'img', e.target.value)} /></div>
                       <div className="col-span-2 space-y-2"><label className="text-[10px] font-black text-zinc-600 uppercase">ملخص (عربي)</label><textarea className="w-full bg-black border border-white/10 p-6 rounded-2xl text-xs h-32 leading-relaxed" value={art.excerpt.ar} onChange={e => updateNestedField(props.setArticles, i, 'excerpt', 'ar', e.target.value)} /></div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {/* TAB: STATS */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
               {props.stats.map((stat, i) => (
                 <div key={stat.id} className="bg-zinc-900/30 p-10 rounded-[3rem] border border-white/5 space-y-6 shadow-xl transition-all hover:bg-zinc-900/50">
                    <div className="flex items-center gap-6">
                       <input className="w-20 h-20 bg-black border border-white/10 rounded-2xl text-4xl text-center shadow-inner" value={stat.icon} onChange={e => updateSimpleField(props.setStats, i, 'icon', e.target.value)} />
                       <div className="flex-grow">
                          <label className="text-[9px] font-black text-zinc-600 uppercase block mb-1">القيمة</label>
                          <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-4xl font-black text-orange-500 shadow-inner" value={stat.value} onChange={e => updateSimpleField(props.setStats, i, 'value', e.target.value)} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-zinc-600 uppercase block">العنوان (عربي)</label>
                       <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold" value={stat.label.ar} onChange={e => updateNestedField(props.setStats, i, 'label', 'ar', e.target.value)} />
                    </div>
                 </div>
               ))}
            </div>
          )}

          {/* TAB: CERTS */}
          {activeTab === 'certs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
               <button onClick={() => props.setCerts([{ id: Date.now().toString(), name: 'شهادة جديدة', img: 'https://cdn-icons-png.flaticon.com/512/9334/9334461.png' }, ...props.certs])} className="col-span-full py-12 border-2 border-dashed border-white/10 rounded-[3rem] text-zinc-600 font-black text-[11px] uppercase tracking-widest hover:border-orange-500 transition-all bg-zinc-900/10">➕ إضافة شهادة اعتماد دولية</button>
               {props.certs.map((cert, i) => (
                 <div key={cert.id} className="bg-zinc-900/30 p-8 rounded-[3rem] border border-white/5 space-y-6 relative group shadow-2xl">
                    <button onClick={() => props.setCerts(prev => prev.filter(x => x.id !== cert.id))} className="absolute top-6 left-6 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">حذف</button>
                    <div className="flex items-center gap-6">
                       <div className="w-20 h-20 bg-black rounded-2xl p-4 border border-white/5 flex items-center justify-center shadow-inner">
                          <img src={cert.img} className="max-w-full max-h-full opacity-60" />
                       </div>
                       <div className="flex-grow space-y-4">
                          <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs font-bold" value={cert.name} onChange={e => updateSimpleField(props.setCerts, i, 'name', e.target.value)} placeholder="اسم الشهادة" />
                          <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-[10px] font-sans text-blue-400" dir="ltr" value={cert.img} onChange={e => updateSimpleField(props.setCerts, i, 'img', e.target.value)} placeholder="رابط لوجو الشهادة" />
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

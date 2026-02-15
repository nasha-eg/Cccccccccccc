
import React, { useState } from 'react';
import { Offer } from './Offers';
import { Article } from './Blog';
import { SiteSettings, Product, GalleryItem, Testimonial, StatItem, CertificateItem } from '../App';

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
  const [activeTab, setActiveTab] = useState('general');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1997') setIsLoggedIn(true);
    else alert("كلمة المرور 1997 هي الصحيحة.");
  };

  const updateSetting = (key: keyof SiteSettings, value: any) => setSettings(prev => ({ ...prev, [key]: value }));
  
  const updateNestedSetting = (key: 'brandName' | 'tagline' | 'address', lang: 'ar' | 'en', value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value }
    }));
  };

  const addItem = (setList: Function, template: any) => setList((prev: any[]) => [...prev, { ...template, id: Date.now().toString() }]);
  
  const deleteItem = (setList: Function, id: string | number) => {
    if(window.confirm('هل أنت متأكد من الحذف النهائي؟')) {
      setList((prev: any[]) => prev.filter((item: any) => item.id !== id));
    }
  };
  
  const handleArrayUpdate = (setList: Function, index: number, field: string, value: any, lang?: 'ar' | 'en') => {
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

  const generateSQL = () => {
    const data = { settings, products, galleryItems, testimonials, offers, articles, stats, certs };
    const sql = `-- Al-Asimh Master Installation Script\n` +
      `CREATE DATABASE IF NOT EXISTS ${settings.dbConfig?.dbName || 'alasimh_production'};\n` +
      `USE ${settings.dbConfig?.dbName || 'alasimh_production'};\n\n` +
      `CREATE TABLE IF NOT EXISTS site_meta (id INT PRIMARY KEY, key_name VARCHAR(255), value_json JSON);\n` +
      `INSERT INTO site_meta (id, key_name, value_json) VALUES (1, 'full_backup', '${JSON.stringify(data).replace(/'/g, "''")}') ON DUPLICATE KEY UPDATE value_json = VALUES(value_json);\n`;
    
    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database_install.sql';
    a.click();
    alert('تم توليد ملف تثبيت MySQL بنجاح! يمكنك الآن رفعه على الخادم.');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-cairo" dir="rtl">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <form onSubmit={handleLogin} className="w-full max-w-md bg-[#0a0a0a] border border-orange-500/20 p-12 text-center rounded-[3rem] shadow-2xl relative z-10 backdrop-blur-xl">
           <div className="w-24 h-24 dynamic-bg text-black flex items-center justify-center text-4xl font-black rounded-[2rem] mx-auto mb-10 shadow-2xl shadow-orange-500/20 rotate-3 transition-transform hover:rotate-0">A</div>
           <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">بوابة الإدارة المركزية</h2>
           <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] mb-12">Security Protocol Active</p>
           <input 
              type="password" 
              placeholder="••••" 
              className="w-full bg-black border border-white/5 p-6 rounded-2xl text-white mb-10 outline-none focus:border-orange-500 text-center text-4xl tracking-[0.5em] transition-all placeholder:tracking-normal placeholder:text-slate-800" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
           />
           <button type="submit" className="w-full py-6 dynamic-bg text-black font-black rounded-2xl shadow-2xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-xs">إدارة النظام</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row font-cairo" dir="rtl">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-80 bg-black border-l border-white/5 flex flex-col p-8 h-screen sticky top-0 overflow-y-auto z-50">
        <div className="mb-14 flex items-center gap-5">
          <div className="w-12 h-12 dynamic-bg text-black flex items-center justify-center text-2xl rounded-2xl font-black shadow-lg">A</div>
          <div>
            <span className="font-black text-xs block leading-none text-orange-500 uppercase tracking-tighter">Chief Administrator</span>
            <span className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1 block">Live CMS Sync v4.2</span>
          </div>
        </div>
        
        <nav className="flex-grow space-y-2">
          {[
            { id: 'general', label: 'الضبط العام', icon: '⚙️' },
            { id: 'design', label: 'الهوية البصرية', icon: '🎨' },
            { id: 'database', label: 'قاعدة البيانات', icon: '💾' },
            { id: 'products', label: 'إدارة المنتجات', icon: '📦' },
            { id: 'offers', label: 'العروض الترويجية', icon: '🏷️' },
            { id: 'blog', label: 'المقالات المعرفية', icon: '📝' },
            { id: 'gallery', label: 'معرض الصور', icon: '🖼️' },
            { id: 'testimonials', label: 'آراء العملاء', icon: '💬' },
            { id: 'stats', label: 'الأرقام والإحصائيات', icon: '📈' },
            { id: 'certs', label: 'شهادات الجودة', icon: '📜' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`w-full text-right px-6 py-4 rounded-2xl text-[10px] font-black uppercase flex items-center gap-4 transition-all duration-300 ${activeTab === tab.id ? 'bg-orange-500 text-black shadow-xl shadow-orange-500/20 translate-x-[-8px]' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
            >
              <span className="text-lg">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>
        
        <div className="mt-12 space-y-4">
           <button onClick={() => window.location.hash = ''} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all">معاينة الموقع</button>
           <button onClick={onLogout} className="w-full py-4 text-rose-500 text-[9px] font-black uppercase tracking-widest border border-rose-500/10 rounded-xl hover:bg-rose-500 hover:text-white transition-all">تسجيل خروج آمن</button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-grow p-8 lg:p-20 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-10">
             <div className="reveal">
               <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-3">{activeTab} Interface</h1>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Active Session: System Ready for Deployment</p>
               </div>
             </div>
             <div className="flex gap-4">
               <button onClick={() => alert('تمت المزامنة اللحظية بنجاح!')} className="bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all tracking-widest">مزامنة البيانات</button>
             </div>
          </header>

          {/* TAB: GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 reveal">
               <div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-white/5 space-y-8">
                  <h3 className="text-orange-500 font-black text-[11px] tracking-[0.4em] uppercase mb-4">بيانات التواصل والروابط</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">واتساب التصدير (رقم بدون أصفار أو +)</label>
                      <input type="text" value={settings.whatsapp} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500 font-mono" onChange={e => updateSetting('whatsapp', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">البريد الرسمي للمبيعات</label>
                      <input type="text" value={settings.email} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500 font-mono" onChange={e => updateSetting('email', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">هاتف الإدارة المباشر</label>
                      <input type="text" value={settings.phone} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500 font-mono" onChange={e => updateSetting('phone', e.target.value)} />
                    </div>
                  </div>
               </div>
               <div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-white/5 space-y-8">
                  <h3 className="text-orange-500 font-black text-[11px] tracking-[0.4em] uppercase mb-4">فيديو الصفحة الرئيسية</h3>
                  <div className="space-y-6">
                    <label className="text-[9px] text-slate-500 uppercase font-black block">رابط الفيديو (YouTube)</label>
                    <input type="text" value={settings.videoUrlHero} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500 text-xs" onChange={e => updateSetting('videoUrlHero', e.target.value)} />
                    <div className="aspect-video w-full rounded-3xl overflow-hidden bg-black border border-white/5 flex items-center justify-center">
                       <p className="text-[10px] text-slate-600 uppercase font-black">Video Processing Live</p>
                    </div>
                  </div>
               </div>
               <div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-white/5 space-y-8 lg:col-span-2">
                  <h3 className="text-orange-500 font-black text-[11px] tracking-[0.4em] uppercase mb-4">تحسين محركات البحث (SEO)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">عنوان الموقع (SEO Title)</label>
                      <input type="text" value={settings.seoTitle} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500 text-xs" onChange={e => updateSetting('seoTitle', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">وصف الموقع (Meta Description)</label>
                      <textarea value={settings.seoDescription} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500 text-xs h-32" onChange={e => updateSetting('seoDescription', e.target.value)} />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB: DESIGN / IDENTITY */}
          {activeTab === 'design' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 reveal">
               <div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-white/5 space-y-10">
                  <h3 className="text-orange-500 font-black text-[11px] tracking-[0.4em] uppercase mb-4">الألوان الثيم الرئيسي</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">اللون الأساسي</label>
                      <div className="flex items-center gap-4 bg-black border border-white/5 p-3 rounded-2xl">
                        <input type="color" value={settings.primaryColor} className="w-16 h-16 bg-transparent rounded-xl cursor-pointer" onChange={e => updateSetting('primaryColor', e.target.value)} />
                        <span className="text-xs font-mono text-slate-400">{settings.primaryColor}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">لون التمييز (Accent)</label>
                      <div className="flex items-center gap-4 bg-black border border-white/5 p-3 rounded-2xl">
                        <input type="color" value={settings.accentColor} className="w-16 h-16 bg-transparent rounded-xl cursor-pointer" onChange={e => updateSetting('accentColor', e.target.value)} />
                        <span className="text-xs font-mono text-slate-400">{settings.accentColor}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-white/5">
                     <label className="text-[9px] text-slate-500 uppercase font-black block mb-4">اسم العلامة التجارية (ثنائي اللغة)</label>
                     <div className="grid grid-cols-2 gap-4">
                        <input type="text" value={settings.brandName.ar} placeholder="العربية" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateNestedSetting('brandName', 'ar', e.target.value)} />
                        <input type="text" value={settings.brandName.en} placeholder="English" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateNestedSetting('brandName', 'en', e.target.value)} />
                     </div>
                  </div>
               </div>
               <div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-white/5 space-y-10">
                  <h3 className="text-orange-500 font-black text-[11px] tracking-[0.4em] uppercase mb-4">صور الهوية والشعار</h3>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">رابط الشعار (PNG - خلفية شفافة)</label>
                      <div className="flex gap-4">
                        <input type="text" value={settings.logoUrl} className="flex-grow bg-black border border-white/10 p-5 rounded-2xl text-white text-[10px]" onChange={e => updateSetting('logoUrl', e.target.value)} />
                        <div className="w-16 h-16 bg-white rounded-2xl p-2 shrink-0 border border-white/10">
                          <img src={settings.logoUrl} className="w-full h-full object-contain" alt="Preview" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">رابط خلفية الهيرو (Banner Image)</label>
                      <div className="space-y-4">
                        <input type="text" value={settings.heroBg} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white text-[10px]" onChange={e => updateSetting('heroBg', e.target.value)} />
                        <div className="w-full h-32 rounded-3xl overflow-hidden border border-white/10">
                          <img src={settings.heroBg} className="w-full h-full object-cover" alt="Preview" />
                        </div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB: DATABASE / MySQL Simulation */}
          {activeTab === 'database' && (
            <div className="bg-[#0a0a0a] p-16 rounded-[4rem] border border-white/5 space-y-12 reveal">
               <div className="flex items-center gap-10">
                  <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-5xl rounded-[2.5rem] shadow-3xl">💾</div>
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">MySQL Cloud Simulation</h3>
                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest font-bold">إدارة خوادم البيانات وتثبيت النظام</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { label: 'DB Host Server', key: 'host', placeholder: 'localhost' },
                    { label: 'Database Name', key: 'dbName', placeholder: 'alasimh_db' },
                    { label: 'DB Username', key: 'user', placeholder: 'root' },
                    { label: 'DB Password', key: 'pass', placeholder: '••••••••' }
                  ].map(field => (
                    <div key={field.key} className="space-y-3">
                       <label className="text-[9px] text-slate-500 uppercase font-black">{field.label}</label>
                       <input 
                         type={field.key === 'pass' ? 'password' : 'text'} 
                         placeholder={field.placeholder}
                         value={settings.dbConfig?.[field.key as keyof typeof settings.dbConfig] || ''} 
                         className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white text-xs outline-none focus:border-emerald-500 transition-all font-mono"
                         onChange={e => setSettings(prev => ({...prev, dbConfig: {...prev.dbConfig!, [field.key]: e.target.value}}))}
                       />
                    </div>
                  ))}
               </div>
               <div className="flex flex-wrap gap-6 pt-12 border-t border-white/5">
                  <button onClick={() => alert('تم فحص الاتصال بسيرفر: ' + (settings.dbConfig?.host || 'localhost'))} className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-xl">Test Link Connection</button>
                  <button onClick={generateSQL} className="px-10 py-5 dynamic-bg text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Download MySQL SQL Export</button>
                  <button onClick={() => { if(window.confirm('إعادة ضبط المصنع؟ سيتم حذف كافة البيانات وحفظ نسخة احتياطية محلية.')) { localStorage.clear(); window.location.reload(); } }} className="px-10 py-5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">System Reset</button>
               </div>
               <div className="p-10 bg-black/40 border border-white/5 rounded-[2.5rem] flex items-center justify-between shadow-inner">
                  <div className="flex items-center gap-5">
                     <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]"></div>
                     <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em]">Master Core: Database Synchronized</span>
                  </div>
                  <div className="text-slate-700 text-[8px] font-black uppercase tracking-widest">Global IP Node: 182.0.4.19</div>
               </div>
            </div>
          )}

          {/* TAB: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
             <div className="space-y-12 reveal">
                <button onClick={() => addItem(setProducts, { title: { ar: 'صنف فحم جديد', en: 'New Charcoal Grade' }, desc: { ar: 'وصف المنتج التفصيلي...', en: 'Detailed product description...' }, specs: { ar: ['الكربون: 85%', 'الرماد: 2%'], en: ['Carbon: 85%', 'Ash: 2%'] }, icon: '🔥', img: 'https://images.unsplash.com/photo-1542366810-449e7769527d', msg: { ar: 'استفسار عن الصنف الجديد', en: 'Inquiry about the new grade' } })} className="w-full py-16 border-4 border-dashed border-white/5 rounded-[4rem] text-slate-600 font-black hover:border-orange-500/40 hover:text-orange-500 transition-all group flex flex-col items-center justify-center gap-4">
                   <span className="text-5xl group-hover:scale-125 transition-transform">➕</span>
                   <span className="uppercase tracking-[0.5em] text-[11px]">Add New Export Product</span>
                </button>
                <div className="grid grid-cols-1 gap-12">
                   {products.map((p, pIdx) => (
                      <div key={p.id} className="bg-[#0a0a0a] p-12 rounded-[4rem] border border-white/5 space-y-10 group relative hover:border-orange-500/20 transition-all">
                         <div className="flex flex-col lg:flex-row gap-12">
                            <div className="w-full lg:w-1/3 space-y-4">
                               <div className="aspect-square w-full rounded-[3rem] overflow-hidden border-4 border-white/5 group-hover:border-orange-500/20 transition-all">
                                  <img src={p.img} className="w-full h-full object-cover" alt="Product" />
                               </div>
                               <input value={p.img} placeholder="Image URL" className="w-full bg-black border border-white/10 p-4 rounded-xl text-[9px] font-mono" onChange={e => handleArrayUpdate(setProducts, pIdx, 'img', e.target.value)} />
                               <div className="flex gap-4">
                                  <input value={p.icon} placeholder="Icon" className="w-16 h-16 bg-black border border-white/10 p-4 rounded-2xl text-2xl text-center" onChange={e => handleArrayUpdate(setProducts, pIdx, 'icon', e.target.value)} />
                                  <input value={p.title.ar} placeholder="العنوان العربي" className="flex-grow bg-black border border-white/10 p-4 rounded-2xl text-lg font-black" onChange={e => handleArrayUpdate(setProducts, pIdx, 'title', e.target.value, 'ar')} />
                               </div>
                            </div>
                            <div className="flex-grow space-y-8">
                               <div className="flex justify-between items-start">
                                  <div className="space-y-4 w-full">
                                     <label className="text-[9px] text-slate-500 uppercase font-black block">الوصف (عربي / English)</label>
                                     <textarea value={p.desc.ar} className="w-full bg-black border border-white/10 p-6 rounded-[2rem] text-sm h-32 focus:border-orange-500 outline-none" onChange={e => handleArrayUpdate(setProducts, pIdx, 'desc', e.target.value, 'ar')} />
                                     <textarea value={p.desc.en} className="w-full bg-black border border-white/10 p-6 rounded-[2rem] text-sm h-32 focus:border-orange-500 outline-none" dir="ltr" onChange={e => handleArrayUpdate(setProducts, pIdx, 'desc', e.target.value, 'en')} />
                                  </div>
                               </div>
                               <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                     <label className="text-[9px] text-slate-500 uppercase font-black block">المواصفات الفنية</label>
                                     <div className="space-y-2">
                                        {p.specs.ar.map((spec, sIdx) => (
                                           <div key={sIdx} className="flex gap-2">
                                              <input value={spec} className="w-full bg-black border border-white/5 p-3 rounded-xl text-[10px]" onChange={e => {
                                                 const newSpecs = [...p.specs.ar];
                                                 newSpecs[sIdx] = e.target.value;
                                                 handleArrayUpdate(setProducts, pIdx, 'specs', { ...p.specs, ar: newSpecs });
                                              }} />
                                           </div>
                                        ))}
                                     </div>
                                  </div>
                                  <div className="flex items-end justify-end">
                                     <button onClick={() => deleteItem(setProducts, p.id)} className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-8 py-4 rounded-2xl font-black text-[9px] uppercase hover:bg-rose-500 hover:text-white transition-all">حذف المنتج نهائياً</button>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* TAB: GALLERY MANAGEMENT */}
          {activeTab === 'gallery' && (
             <div className="space-y-12 reveal">
                <button onClick={() => addItem(setGalleryItems, { title: { ar: 'مشهد جديد', en: 'New Scene' }, category: { ar: 'إنتاج', en: 'Production' }, img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d' })} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-600 font-black hover:border-orange-500 transition-all">+ Add Gallery Photo</button>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                   {galleryItems.map((g, idx) => (
                      <div key={g.id} className="bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/5 group relative">
                         <img src={g.img} className="w-full aspect-square object-cover" alt="Gallery" />
                         <div className="absolute inset-0 bg-black/95 opacity-0 group-hover:opacity-100 transition-all duration-500 p-6 flex flex-col justify-between">
                            <div className="space-y-4">
                               <input value={g.title.ar} className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-[9px] text-white" onChange={e => handleArrayUpdate(setGalleryItems, idx, 'title', e.target.value, 'ar')} />
                               <input value={g.img} className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-[7px] font-mono text-slate-400" onChange={e => handleArrayUpdate(setGalleryItems, idx, 'img', e.target.value)} />
                            </div>
                            <button onClick={() => deleteItem(setGalleryItems, g.id)} className="w-full py-3 bg-rose-500 text-white rounded-xl text-[8px] font-black uppercase">Delete Image</button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* TAB: BLOG / ARTICLES */}
          {activeTab === 'blog' && (
             <div className="space-y-8 reveal">
                <button onClick={() => addItem(setArticles, { title: { ar: 'عنوان المقال', en: 'New' }, excerpt: { ar: 'ملخص المقال...', en: 'Summary...' }, date: { ar: 'أكتوبر 2025', en: 'Oct 2025' }, img: 'https://images.unsplash.com/photo-1599708153386-62e228308412', category: { ar: 'أبحاث', en: 'Analysis' }, readTime: '5 min' })} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-600 font-black hover:border-orange-500 transition-all">+ Create Knowledge Article</button>
                {articles.map((a, idx) => (
                   <div key={a.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 flex flex-col md:flex-row gap-10 group">
                      <div className="w-full md:w-1/4">
                         <img src={a.img} className="w-full aspect-video md:aspect-square object-cover rounded-[2rem] border border-white/5 shadow-2xl" alt="Blog" />
                         <input value={a.img} className="w-full bg-black border border-white/5 mt-4 p-2 rounded-lg text-[7px] font-mono" onChange={e => handleArrayUpdate(setArticles, idx, 'img', e.target.value)} />
                      </div>
                      <div className="flex-grow space-y-4">
                         <div className="flex justify-between items-center">
                            <input value={a.title.ar} className="bg-transparent text-xl font-black w-full focus:text-orange-500 outline-none" onChange={e => handleArrayUpdate(setArticles, idx, 'title', e.target.value, 'ar')} />
                            <button onClick={() => deleteItem(setArticles, a.id)} className="text-rose-500 text-[10px] font-black uppercase">Delete</button>
                         </div>
                         <textarea value={a.excerpt.ar} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs h-24 italic" onChange={e => handleArrayUpdate(setArticles, idx, 'excerpt', e.target.value, 'ar')} />
                         <div className="flex gap-4">
                            <input value={a.category.ar} placeholder="Category" className="bg-black border border-white/10 p-3 rounded-xl text-[9px] uppercase tracking-widest font-black text-orange-500" onChange={e => handleArrayUpdate(setArticles, idx, 'category', e.target.value, 'ar')} />
                            <input value={a.readTime} placeholder="Reading Time" className="bg-black border border-white/10 p-3 rounded-xl text-[9px]" onChange={e => handleArrayUpdate(setArticles, idx, 'readTime', e.target.value)} />
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          )}

          {/* TAB: STATS / NUMBERS */}
          {activeTab === 'stats' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal">
                {stats.map((s, idx) => (
                   <div key={s.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 flex gap-8 items-center group hover:border-orange-500/20 transition-all">
                      <input value={s.icon} className="w-20 h-20 bg-black border border-white/10 rounded-3xl text-4xl text-center shadow-inner" onChange={e => handleArrayUpdate(setStats, idx, 'icon', e.target.value)} />
                      <div className="flex-grow space-y-3">
                         <label className="text-[8px] text-slate-600 uppercase font-black block tracking-widest">Digital Counter Value</label>
                         <input value={s.value} className="w-full bg-black border border-white/10 p-4 rounded-xl text-3xl font-black text-orange-500 text-center shadow-2xl" onChange={e => handleArrayUpdate(setStats, idx, 'value', e.target.value)} />
                         <div className="grid grid-cols-2 gap-2">
                           <input value={s.label.ar} placeholder="عربي" className="bg-black border border-white/10 p-3 rounded-lg text-[10px] text-center" onChange={e => handleArrayUpdate(setStats, idx, 'label', e.target.value, 'ar')} />
                           <input value={s.label.en} placeholder="English" className="bg-black border border-white/10 p-3 rounded-lg text-[10px] text-center" onChange={e => handleArrayUpdate(setStats, idx, 'label', e.target.value, 'en')} />
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          )}

          {/* TAB: CERTIFICATES */}
          {activeTab === 'certs' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal">
                {certs.map((c, idx) => (
                   <div key={c.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 text-center group relative hover:border-emerald-500/20 transition-all">
                      <div className="h-32 mb-8 flex items-center justify-center">
                         <img src={c.img} className="max-h-full grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110" alt="Cert" />
                      </div>
                      <input value={c.name} className="w-full bg-black border border-white/10 p-3 rounded-xl text-[10px] font-black text-center mb-4 uppercase tracking-widest" onChange={e => handleArrayUpdate(setCerts, idx, 'name', e.target.value)} />
                      <input value={c.img} className="w-full bg-black border border-white/10 p-2 rounded-xl text-[7px] text-center font-mono text-slate-600" onChange={e => handleArrayUpdate(setCerts, idx, 'img', e.target.value)} />
                      <button onClick={() => deleteItem(setCerts, c.id)} className="absolute top-6 right-6 text-rose-500/30 hover:text-rose-500 transition-colors">✕</button>
                   </div>
                ))}
                <button onClick={() => addItem(setCerts, { name: 'GLOBAL ACCREDITATION', img: 'https://cdn-icons-png.flaticon.com/512/8146/8146761.png' })} className="border-2 border-dashed border-white/5 rounded-[3rem] p-12 text-slate-700 font-black hover:border-orange-500/40 hover:text-orange-500 transition-all flex flex-col items-center justify-center gap-4">
                   <span className="text-4xl">📜</span>
                   <span className="uppercase tracking-[0.3em] text-[9px]">Add New Certificate</span>
                </button>
             </div>
          )}

          {/* TAB: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal">
                {testimonials.map((t, idx) => (
                   <div key={t.id} className="bg-[#0a0a0a] p-12 rounded-[3.5rem] border border-white/5 relative group hover:border-orange-500/20 transition-all">
                      <div className="flex items-center gap-6 mb-10">
                         <div className="relative">
                            <img src={t.avatar} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10 group-hover:border-orange-500 transition-all" alt="Avatar" />
                            <input value={t.avatar} className="absolute top-full left-0 w-32 bg-black border border-white/10 p-1 mt-2 rounded text-[6px] font-mono" onChange={e => handleArrayUpdate(setTestimonials, idx, 'avatar', e.target.value)} />
                         </div>
                         <div className="flex-grow space-y-2">
                            <input value={t.name.ar} className="bg-transparent font-black block w-full text-lg focus:text-orange-500 outline-none" onChange={e => handleArrayUpdate(setTestimonials, idx, 'name', e.target.value, 'ar')} />
                            <input value={t.role.ar} className="bg-transparent text-[10px] text-orange-500 font-bold tracking-widest uppercase outline-none" onChange={e => handleArrayUpdate(setTestimonials, idx, 'role', e.target.value, 'ar')} />
                         </div>
                         <button onClick={() => deleteItem(setTestimonials, t.id)} className="text-rose-500/20 hover:text-rose-500 transition-all">✕</button>
                      </div>
                      <textarea value={t.content.ar} className="w-full bg-black border border-white/5 p-6 rounded-[2rem] text-sm h-40 italic leading-relaxed text-slate-400 focus:text-white transition-all outline-none" onChange={e => handleArrayUpdate(setTestimonials, idx, 'content', e.target.value, 'ar')} />
                   </div>
                ))}
                <button onClick={() => addItem(setTestimonials, { name: { ar: 'اسم العميل', en: 'Client Name' }, role: { ar: 'المنصب', en: 'Position' }, content: { ar: 'الرأي المكتوب هنا...', en: 'Feedback...' }, avatar: 'https://i.pravatar.cc/150' })} className="border-2 border-dashed border-white/5 rounded-[3.5rem] p-16 text-slate-700 font-black hover:border-orange-500 transition-all">+ Add Customer Review</button>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

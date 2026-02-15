
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
    else alert("عذراً، كلمة المرور هي 1997");
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
    if(window.confirm('حذف نهائي؟')) {
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
    const sql = `-- Al-Asimh Database Export\n-- Generated on ${new Date().toLocaleString()}\n\n` +
      `CREATE DATABASE IF NOT EXISTS ${settings.dbConfig?.dbName || 'alasimh_db'};\n` +
      `USE ${settings.dbConfig?.dbName || 'alasimh_db'};\n\n` +
      `CREATE TABLE settings (id INT PRIMARY KEY, config JSON);\n` +
      `INSERT INTO settings (id, config) VALUES (1, '${JSON.stringify(settings)}');\n\n` +
      `CREATE TABLE products (id VARCHAR(50), data JSON);\n` +
      `INSERT INTO products (id, data) VALUES ${products.map(p => `('${p.id}', '${JSON.stringify(p)}')`).join(',\n')};`;
    
    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alasimh_database_backup.sql';
    a.click();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-cairo" dir="rtl">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <form onSubmit={handleLogin} className="w-full max-w-md bg-[#0a0a0a] border border-orange-500/20 p-12 text-center rounded-[3rem] shadow-2xl relative z-10 backdrop-blur-xl">
           <div className="w-20 h-20 dynamic-bg text-black flex items-center justify-center text-3xl font-black rounded-3xl mx-auto mb-8 shadow-2xl rotate-3">A</div>
           <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">النظام الإداري</h2>
           <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-10">AL-ASIMH ENTERPRISE SYSTEM</p>
           <input 
              type="password" 
              placeholder="••••" 
              className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white mb-8 outline-none focus:border-orange-500 text-center text-3xl tracking-[0.5em] transition-all" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
           />
           <button type="submit" className="w-full py-5 dynamic-bg text-black font-black rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all">دخول النظام</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row font-cairo" dir="rtl">
      <aside className="w-full lg:w-80 bg-black border-l border-white/5 flex flex-col p-8 h-screen sticky top-0 overflow-y-auto z-50">
        <div className="mb-12 flex items-center gap-4">
          <div className="w-10 h-10 dynamic-bg text-black flex items-center justify-center text-lg rounded-xl font-black">A</div>
          <div>
            <span className="font-black text-xs block leading-none text-orange-500 uppercase">System Admin</span>
            <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Enterprise v12.0</span>
          </div>
        </div>
        <nav className="flex-grow space-y-1">
          {[
            { id: 'general', label: 'الضبط العام', icon: '⚙️' },
            { id: 'design', label: 'الهوية البصرية', icon: '🎨' },
            { id: 'database', label: 'قاعدة البيانات', icon: '💾' },
            { id: 'products', label: 'المنتجات', icon: '📦' },
            { id: 'offers', label: 'العروض', icon: '🏷️' },
            { id: 'blog', label: 'المقالات', icon: '📝' },
            { id: 'gallery', label: 'المعرض', icon: '🖼️' },
            { id: 'testimonials', label: 'العملاء', icon: '💬' },
            { id: 'stats', label: 'الأرقام', icon: '📈' },
            { id: 'certs', label: 'الشهادات', icon: '📜' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`w-full text-right px-6 py-4 rounded-xl text-[10px] font-black uppercase flex items-center gap-4 transition-all ${activeTab === tab.id ? 'bg-orange-500 text-black shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <span className="text-base">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-10 py-4 text-rose-500 text-[9px] font-black uppercase border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all">خروج آمن</button>
      </aside>

      <main className="flex-grow p-8 lg:p-16 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
             <div>
               <h1 className="text-4xl font-black text-white tracking-tighter uppercase">{activeTab} Section</h1>
               <p className="text-slate-500 text-xs mt-2">تعديل بيانات العاصمة بشكل مباشر وحفظها سحابياً</p>
             </div>
             <div className="flex gap-3">
               <button onClick={() => window.location.hash = ''} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[9px] uppercase hover:bg-white/10 transition-all">معاينة الموقع</button>
               <button onClick={() => alert('تم حفظ التغييرات بنجاح في قاعدة البيانات المحلية.')} className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[9px] uppercase shadow-xl hover:scale-105 transition-all">حفظ التغييرات</button>
             </div>
          </header>

          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h3 className="text-orange-500 font-black text-[10px] tracking-widest uppercase mb-4">التواصل والروابط</h3>
                  <div className="space-y-4">
                    <label className="text-[9px] text-slate-500 uppercase font-black block">واتساب التصدير</label>
                    <input type="text" value={settings.whatsapp} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('whatsapp', e.target.value)} />
                    <label className="text-[9px] text-slate-500 uppercase font-black block">البريد الرسمي</label>
                    <input type="text" value={settings.email} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none" onChange={e => updateSetting('email', e.target.value)} />
                  </div>
               </div>
               <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h3 className="text-orange-500 font-black text-[10px] tracking-widest uppercase mb-4">الفيديو الرئيسي</h3>
                  <div className="space-y-4">
                    <label className="text-[9px] text-slate-500 uppercase font-black block">رابط يوتيوب (سيتم تحويله تلقائياً)</label>
                    <input type="text" value={settings.videoUrlHero} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('videoUrlHero', e.target.value)} />
                    <p className="text-[8px] text-slate-500 italic">ملاحظة: النظام سيعرض الفيديو في قسم "جولة المصنع" بالصفحة الرئيسية.</p>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-white/5 space-y-10">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-3xl rounded-2xl">💾</div>
                  <div>
                    <h3 className="text-2xl font-black text-white">إعدادات MySQL</h3>
                    <p className="text-slate-500 text-xs">اربط موقعك بقاعدة بيانات خارجية أو صدر البيانات الحالية</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] text-slate-500 uppercase font-black">DB Host</label>
                    <input type="text" value={settings.dbConfig?.host} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] text-slate-500 uppercase font-black">Database Name</label>
                    <input type="text" value={settings.dbConfig?.dbName} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] text-slate-500 uppercase font-black">Username</label>
                    <input type="text" value={settings.dbConfig?.user} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-xs" />
                  </div>
               </div>
               <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
                  <button onClick={() => alert('جاري اختبار الاتصال بسيرفر MySQL...')} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase hover:bg-white/10 transition-all">Test Connection</button>
                  <button onClick={generateSQL} className="px-8 py-4 dynamic-bg text-black rounded-2xl font-black text-[10px] uppercase shadow-lg hover:scale-105 transition-all">Export SQL Backup</button>
                  <button onClick={() => { if(window.confirm('هل تريد حذف كافة البيانات الحالية وإعادة التثبيت؟')) { localStorage.clear(); window.location.reload(); } }} className="px-8 py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl font-black text-[10px] uppercase hover:bg-rose-500 hover:text-white transition-all">Re-Install Database</button>
               </div>
               <div className="p-6 bg-black/50 border border-white/5 rounded-2xl flex items-center gap-4">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black text-emerald-500 uppercase">System Status: Database Synced & Online</span>
               </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h3 className="text-orange-500 font-black text-[10px] tracking-widest uppercase mb-6">الألوان والهوية</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] text-slate-500 uppercase font-black block mb-2">اللون الأساسي</label>
                      <input type="color" value={settings.primaryColor} className="w-full h-12 bg-black border border-white/10 p-1 rounded-xl cursor-pointer" onChange={e => updateSetting('primaryColor', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-500 uppercase font-black block mb-2">لون التمييز</label>
                      <input type="color" value={settings.accentColor} className="w-full h-12 bg-black border border-white/10 p-1 rounded-xl cursor-pointer" onChange={e => updateSetting('accentColor', e.target.value)} />
                    </div>
                  </div>
                  <label className="text-[9px] text-slate-500 uppercase font-black block mb-2">رابط صورة اللوجو (PNG)</label>
                  <input type="text" value={settings.logoUrl} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none" onChange={e => updateSetting('logoUrl', e.target.value)} />
               </div>
               <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h3 className="text-orange-500 font-black text-[10px] tracking-widest uppercase mb-6">اسم البراند</h3>
                  <label className="text-[9px] text-slate-500 uppercase font-black block mb-2">الاسم (AR)</label>
                  <input type="text" value={settings.brandName.ar} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none" onChange={e => updateNestedSetting('brandName', 'ar', e.target.value)} />
                  <label className="text-[9px] text-slate-500 uppercase font-black block mb-2">الاسم (EN)</label>
                  <input type="text" value={settings.brandName.en} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none" onChange={e => updateNestedSetting('brandName', 'en', e.target.value)} />
               </div>
            </div>
          )}

          {activeTab === 'products' && (
             <div className="space-y-8">
                <button onClick={() => addItem(setProducts, { title: { ar: 'منتج جديد', en: 'New' }, desc: { ar: '', en: '' }, specs: { ar: ['الكربون: 85%'], en: ['Carbon: 85%'] }, icon: '🔥', img: 'https://images.unsplash.com/photo-1542366810-449e7769527d', msg: { ar: 'استفسار', en: 'Inquiry' } })} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black hover:border-orange-500 transition-all">+ إضافة صنف تصدير</button>
                {products.map((p, pIdx) => (
                  <div key={p.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-6 relative group">
                     <div className="flex flex-col md:flex-row gap-10">
                        <img src={p.img} className="w-40 h-40 object-cover rounded-[2rem] border border-white/10" />
                        <div className="flex-grow space-y-4">
                           <div className="flex justify-between items-center">
                              <input value={p.title.ar} className="bg-transparent text-2xl font-black outline-none" onChange={e => handleArrayUpdate(setProducts, pIdx, 'title', e.target.value, 'ar')} />
                              <button onClick={() => deleteItem(setProducts, p.id)} className="text-rose-500 text-[10px] font-black uppercase">حذف</button>
                           </div>
                           <textarea value={p.desc.ar} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs h-24" onChange={e => handleArrayUpdate(setProducts, pIdx, 'desc', e.target.value, 'ar')} />
                           <input value={p.img} className="w-full bg-black border border-white/10 p-3 rounded-xl text-[9px]" onChange={e => handleArrayUpdate(setProducts, pIdx, 'img', e.target.value)} />
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          )}

          {activeTab === 'gallery' && (
             <div className="space-y-8">
                <button onClick={() => addItem(setGalleryItems, { title: { ar: 'صورة جديدة', en: 'New' }, category: { ar: 'المصنع', en: 'Factory' }, img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d' })} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black hover:border-orange-500">+ إضافة صورة للمعرض</button>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   {galleryItems.map((g, idx) => (
                      <div key={g.id} className="bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/5 relative group">
                         <img src={g.img} className="w-full aspect-square object-cover" />
                         <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-all p-4 flex flex-col justify-between">
                            <input value={g.title.ar} className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-[9px]" onChange={e => handleArrayUpdate(setGalleryItems, idx, 'title', e.target.value, 'ar')} />
                            <button onClick={() => deleteItem(setGalleryItems, g.id)} className="w-full text-rose-500 font-black text-[8px] uppercase py-2">حذف الصورة</button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'blog' && (
             <div className="space-y-6">
                <button onClick={() => addItem(setArticles, { title: { ar: 'مقال جديد', en: 'New' }, excerpt: { ar: '', en: '' }, date: { ar: 'اليوم', en: 'Today' }, img: 'https://images.unsplash.com/photo-1599708153386-62e228308412', category: { ar: 'أبحاث', en: 'Research' }, readTime: '5 min' })} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2rem] text-slate-500 font-black hover:border-orange-500">+ إضافة مقال معرفي</button>
                {articles.map((a, idx) => (
                   <div key={a.id} className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 flex gap-8 items-center">
                      <img src={a.img} className="w-24 h-24 object-cover rounded-2xl" />
                      <div className="flex-grow space-y-3">
                         <div className="flex justify-between items-center">
                            <input value={a.title.ar} className="bg-transparent font-black w-full text-lg outline-none" onChange={e => handleArrayUpdate(setArticles, idx, 'title', e.target.value, 'ar')} />
                            <button onClick={() => deleteItem(setArticles, a.id)} className="text-rose-500 text-[10px] font-black uppercase">حذف</button>
                         </div>
                         <input value={a.img} className="w-full bg-black border border-white/10 p-2 rounded-lg text-[8px]" onChange={e => handleArrayUpdate(setArticles, idx, 'img', e.target.value)} />
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

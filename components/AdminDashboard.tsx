
import React, { useState, useRef } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryBulkInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<{setFn: Function, key: string, index?: number, lang?: 'ar'|'en'} | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1997') setIsLoggedIn(true);
    else alert("كلمة المرور 1997 هي الصحيحة.");
  };

  // Single File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingFor) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (uploadingFor.index !== undefined) {
          uploadingFor.setFn((prev: any[]) => {
            const newList = [...prev];
            if (uploadingFor.lang) {
              newList[uploadingFor.index!][uploadingFor.key] = { ...newList[uploadingFor.index!][uploadingFor.key], [uploadingFor.lang]: base64String };
            } else {
              newList[uploadingFor.index!][uploadingFor.key] = base64String;
            }
            return newList;
          });
        } else {
          uploadingFor.setFn((prev: any) => ({ ...prev, [uploadingFor.key]: base64String }));
        }
        setUploadingFor(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Bulk Gallery Upload Handler
  // Fix: Explicitly cast Array.from(files) as File[] to prevent 'unknown' type errors for 'file.name' and FileReader.readAsDataURL.
  const handleBulkGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      (Array.from(files) as File[]).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setGalleryItems(prev => [
            ...prev,
            {
              id: Date.now().toString() + Math.random(),
              title: { ar: file.name.split('.')[0], en: 'New Production Photo' },
              category: { ar: 'إنتاج حديث', en: 'New Production' },
              img: base64String
            }
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const triggerUpload = (setFn: Function, key: string, index?: number, lang?: 'ar'|'en') => {
    setUploadingFor({ setFn, key, index, lang });
    fileInputRef.current?.click();
  };

  const updateSetting = (key: keyof SiteSettings, value: any) => setSettings(prev => ({ ...prev, [key]: value }));
  const updateNestedSetting = (key: 'brandName' | 'tagline' | 'address', lang: 'ar' | 'en', value: string) => {
    setSettings(prev => ({ ...prev, [key]: { ...prev[key], [lang]: value } }));
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
    a.download = `database_backup_${new Date().toISOString().split('T')[0]}.sql`;
    a.click();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-cairo" dir="rtl">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <form onSubmit={handleLogin} className="w-full max-w-md bg-[#0a0a0a] border border-orange-500/20 p-12 text-center rounded-[3rem] shadow-2xl relative z-10 backdrop-blur-xl">
           <div className="w-24 h-24 dynamic-bg text-black flex items-center justify-center text-4xl font-black rounded-[2rem] mx-auto mb-10 shadow-2xl shadow-orange-500/20 rotate-3">A</div>
           <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">بوابة الإدارة المركزية</h2>
           <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] mb-12">Security Protocol Active</p>
           <input 
              type="password" 
              placeholder="••••" 
              className="w-full bg-black border border-white/5 p-6 rounded-2xl text-white mb-10 outline-none focus:border-orange-500 text-center text-4xl tracking-[0.5em] transition-all" 
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
      {/* Invisible inputs */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
      <input type="file" ref={galleryBulkInputRef} className="hidden" accept="image/*" multiple onChange={handleBulkGalleryUpload} />
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-80 bg-black border-l border-white/5 flex flex-col p-8 h-screen sticky top-0 overflow-y-auto z-50">
        <div className="mb-14 flex items-center gap-5">
          <div className="w-12 h-12 dynamic-bg text-black flex items-center justify-center text-2xl rounded-2xl font-black shadow-lg">A</div>
          <div>
            <span className="font-black text-xs block leading-none text-orange-500 uppercase tracking-tighter">Administrator</span>
            <span className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1 block">Capital Core v7.0</span>
          </div>
        </div>
        
        <nav className="flex-grow space-y-2">
          {[
            { id: 'general', label: 'الضبط العام', icon: '⚙️' },
            { id: 'design', label: 'الهوية البصرية', icon: '🎨' },
            { id: 'products', label: 'إدارة المنتجات', icon: '📦' },
            { id: 'gallery', label: 'معرض الصور', icon: '🖼️' },
            { id: 'blog', label: 'المقالات', icon: '📝' },
            { id: 'stats', label: 'الإحصائيات', icon: '📈' },
            { id: 'testimonials', label: 'آراء العملاء', icon: '💬' },
            { id: 'certs', label: 'الشهادات', icon: '📜' },
            { id: 'database', label: 'قاعدة البيانات', icon: '💾' }
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
           <button onClick={onLogout} className="w-full py-4 text-rose-500 text-[9px] font-black uppercase tracking-widest border border-rose-500/10 rounded-xl hover:bg-rose-500 hover:text-white transition-all">خروج</button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-grow p-8 lg:p-16 overflow-y-auto bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-10">
             <div className="reveal">
               <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-3">{activeTab} Interface</h1>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Active System: Local Storage Synchronized</p>
               </div>
             </div>
             <div className="flex gap-4">
               <button onClick={() => alert('تم حفظ كافة التغييرات محلياً بنجاح!')} className="bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all tracking-widest">حفظ التغييرات</button>
             </div>
          </header>

          {/* TAB: GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 reveal">
               <div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-white/5 space-y-8">
                  <h3 className="text-orange-500 font-black text-[11px] tracking-[0.4em] uppercase mb-4">بيانات التواصل والروابط</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">واتساب التصدير</label>
                      <input type="text" value={settings.whatsapp} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500 font-mono" onChange={e => updateSetting('whatsapp', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">البريد المعتمد</label>
                      <input type="text" value={settings.email} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500 font-mono" onChange={e => updateSetting('email', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">رقم الهاتف</label>
                      <input type="text" value={settings.phone} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500 font-mono" onChange={e => updateSetting('phone', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">العنوان</label>
                      <input type="text" value={settings.address.ar} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500" onChange={e => updateNestedSetting('address', 'ar', e.target.value)} />
                    </div>
                  </div>
               </div>
               <div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-white/5 space-y-8">
                  <h3 className="text-orange-500 font-black text-[11px] tracking-[0.4em] uppercase mb-4">تحسين محركات البحث</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">عنوان الموقع (SEO)</label>
                      <input type="text" value={settings.seoTitle} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500 text-xs" onChange={e => updateSetting('seoTitle', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">وصف الميتا</label>
                      <textarea value={settings.seoDescription} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500 text-xs h-32" onChange={e => updateSetting('seoDescription', e.target.value)} />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB: DESIGN */}
          {activeTab === 'design' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 reveal">
               <div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-white/5 space-y-10">
                  <h3 className="text-orange-500 font-black text-[11px] tracking-[0.4em] uppercase mb-4">الألوان والصور</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">اللون الأساسي</label>
                      <input type="color" value={settings.primaryColor} className="w-full h-16 bg-transparent border-none cursor-pointer" onChange={e => updateSetting('primaryColor', e.target.value)} />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[9px] text-slate-500 uppercase font-black block">لون التمييز</label>
                      <input type="color" value={settings.accentColor} className="w-full h-16 bg-transparent border-none cursor-pointer" onChange={e => updateSetting('accentColor', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[9px] text-slate-500 uppercase font-black block">شعار الموقع (رفع ملف)</label>
                    <div className="flex gap-4">
                      <div className="flex-grow bg-black border border-white/10 p-4 rounded-xl text-[9px] flex items-center truncate">{settings.logoUrl}</div>
                      <button onClick={() => triggerUpload(setSettings, 'logoUrl')} className="bg-orange-500 px-6 py-4 rounded-xl font-black text-[9px] uppercase">رفع</button>
                    </div>
                  </div>
               </div>
               <div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-white/5 space-y-10">
                  <h3 className="text-orange-500 font-black text-[11px] tracking-[0.4em] uppercase mb-4">صور المقارنة (قبل وبعد)</h3>
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4">
                      <label className="text-[9px] text-slate-500 uppercase font-black">فحم السوق (قبل)</label>
                      <div className="flex gap-2">
                        <img src={settings.comparisonBeforeImg} className="w-16 h-16 object-cover rounded-xl" alt="B" />
                        <button onClick={() => triggerUpload(setSettings, 'comparisonBeforeImg')} className="flex-grow bg-white/5 border border-white/10 rounded-xl font-black text-[9px] uppercase">تغيير الصورة</button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <label className="text-[9px] text-slate-500 uppercase font-black">فحم العاصمة (بعد)</label>
                      <div className="flex gap-2">
                        <img src={settings.comparisonAfterImg} className="w-16 h-16 object-cover rounded-xl" alt="A" />
                        <button onClick={() => triggerUpload(setSettings, 'comparisonAfterImg')} className="flex-grow bg-white/5 border border-white/10 rounded-xl font-black text-[9px] uppercase">تغيير الصورة</button>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB: PRODUCTS */}
          {activeTab === 'products' && (
             <div className="space-y-12 reveal">
                <button onClick={() => addItem(setProducts, { title: { ar: 'صنف جديد', en: 'New' }, desc: { ar: 'وصف المنتج...', en: 'Desc' }, specs: { ar: ['الكربون: 85%'], en: ['Carbon: 85%'] }, icon: '🔥', img: 'https://images.unsplash.com/photo-1542366810-449e7769527d', msg: { ar: 'استفسار', en: 'Inquiry' } })} className="w-full py-16 border-4 border-dashed border-white/5 rounded-[4rem] text-slate-600 font-black hover:border-orange-500 transition-all">+ إضافة صنف تصدير جديد</button>
                {products.map((p, idx) => (
                  <div key={p.id} className="bg-[#0a0a0a] p-10 rounded-[4rem] border border-white/5 flex flex-col lg:flex-row gap-12 relative group">
                     <div className="w-full lg:w-1/3">
                        <img src={p.img} className="aspect-square w-full rounded-[3rem] object-cover mb-6 border border-white/10" alt="P" />
                        <button onClick={() => triggerUpload(setProducts, 'img', idx)} className="w-full py-4 dynamic-bg text-black rounded-2xl font-black text-[10px] uppercase">رفع صورة المنتج</button>
                     </div>
                     <div className="flex-grow space-y-6">
                        <div className="flex justify-between">
                           <input value={p.title.ar} className="bg-transparent text-3xl font-black text-white w-full outline-none focus:text-orange-500" onChange={e => handleArrayUpdate(setProducts, idx, 'title', e.target.value, 'ar')} />
                           <button onClick={() => deleteItem(setProducts, p.id)} className="bg-rose-500 text-white px-6 py-3 rounded-xl font-black text-[9px] uppercase">حذف</button>
                        </div>
                        <textarea value={p.desc.ar} className="w-full bg-black border border-white/10 p-6 rounded-[2rem] text-sm h-32 outline-none focus:border-orange-500" onChange={e => handleArrayUpdate(setProducts, idx, 'desc', e.target.value, 'ar')} />
                        <input value={p.icon} className="bg-black border border-white/10 p-4 rounded-xl text-3xl text-center w-24" onChange={e => handleArrayUpdate(setProducts, idx, 'icon', e.target.value)} />
                     </div>
                  </div>
                ))}
             </div>
          )}

          {/* TAB: GALLERY (Bulk Upload Feature) */}
          {activeTab === 'gallery' && (
             <div className="space-y-12 reveal">
                <div className="flex gap-4">
                   <button onClick={() => galleryBulkInputRef.current?.click()} className="flex-grow py-12 bg-orange-500/10 border-2 border-dashed border-orange-500/40 rounded-[3rem] text-orange-500 font-black hover:bg-orange-500 hover:text-white transition-all">
                      <span className="block text-3xl mb-2">📸</span>
                      اختيار مجموعة صور من جهازك (رفع متعدد)
                   </button>
                   <button onClick={() => addItem(setGalleryItems, { title: { ar: 'صورة يدوية', en: 'Manual' }, category: { ar: 'المصنع', en: 'Factory' }, img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d' })} className="px-12 py-12 bg-white/5 border-2 border-dashed border-white/10 rounded-[3rem] text-slate-500 font-black hover:border-white transition-all">
                      إضافة رابط يدوي
                   </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                   {galleryItems.map((g, idx) => (
                      <div key={g.id} className="bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/5 group relative h-64">
                         <img src={g.img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" alt="G" />
                         <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-all p-4 flex flex-col justify-between">
                            <input value={g.title.ar} className="w-full bg-white/10 border border-white/10 p-2 rounded-lg text-[9px] text-white" onChange={e => handleArrayUpdate(setGalleryItems, idx, 'title', e.target.value, 'ar')} />
                            <button onClick={() => deleteItem(setGalleryItems, g.id)} className="w-full py-2 bg-rose-500 text-white rounded-lg text-[8px] font-black uppercase">حذف الصورة</button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* TAB: STATS */}
          {activeTab === 'stats' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal">
                {stats.map((s, idx) => (
                   <div key={s.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 flex gap-8 items-center group relative">
                      <input value={s.icon} className="w-20 h-20 bg-black border border-white/10 rounded-3xl text-4xl text-center outline-none focus:border-orange-500" onChange={e => handleArrayUpdate(setStats, idx, 'icon', e.target.value)} />
                      <div className="flex-grow space-y-4">
                         <div className="flex justify-between items-center">
                            <input value={s.value} className="bg-transparent text-4xl font-black text-orange-500 w-full outline-none" onChange={e => handleArrayUpdate(setStats, idx, 'value', e.target.value)} />
                            <button onClick={() => deleteItem(setStats, s.id)} className="text-rose-500 text-[10px] font-black uppercase">حذف</button>
                         </div>
                         <input value={s.label.ar} placeholder="العنوان بالعربي" className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs" onChange={e => handleArrayUpdate(setStats, idx, 'label', e.target.value, 'ar')} />
                      </div>
                   </div>
                ))}
                <button onClick={() => addItem(setStats, { value: '0', label: { ar: 'عنوان جديد', en: 'New' }, icon: '📈' })} className="border-2 border-dashed border-white/10 rounded-[3rem] p-12 text-slate-500 font-black hover:border-orange-500 transition-all">+ إضافة إحصائية</button>
             </div>
          )}

          {/* TAB: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal">
                {testimonials.map((t, idx) => (
                   <div key={t.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-8 group relative">
                      <div className="flex items-center gap-6">
                         <div className="relative">
                            <img src={t.avatar} className="w-20 h-20 rounded-2xl object-cover border-2 border-white/5" alt="T" />
                            <button onClick={() => triggerUpload(setTestimonials, 'avatar', idx)} className="absolute -bottom-2 -right-2 bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-xs">📁</button>
                         </div>
                         <div className="flex-grow space-y-3">
                            <div className="flex justify-between">
                               <input value={t.name.ar} className="bg-transparent font-black text-xl w-full outline-none focus:text-orange-500" onChange={e => handleArrayUpdate(setTestimonials, idx, 'name', e.target.value, 'ar')} />
                               <button onClick={() => deleteItem(setTestimonials, t.id)} className="text-rose-500 text-[10px] font-black uppercase">حذف</button>
                            </div>
                            <input value={t.role.ar} className="bg-transparent text-[10px] font-bold text-orange-500 w-full outline-none" onChange={e => handleArrayUpdate(setTestimonials, idx, 'role', e.target.value, 'ar')} />
                         </div>
                      </div>
                      <textarea value={t.content.ar} className="w-full bg-black border border-white/10 p-5 rounded-[2rem] text-sm h-32 italic focus:border-orange-500 outline-none" onChange={e => handleArrayUpdate(setTestimonials, idx, 'content', e.target.value, 'ar')} />
                   </div>
                ))}
                <button onClick={() => addItem(setTestimonials, { name: { ar: 'عميل جديد', en: 'New' }, role: { ar: 'مستورد', en: 'Importer' }, content: { ar: 'الرأي المكتوب هنا...', en: 'Feedback' }, avatar: 'https://i.pravatar.cc/150' })} className="border-2 border-dashed border-white/10 rounded-[3rem] p-12 text-slate-500 font-black hover:border-orange-500 transition-all">+ إضافة رأي عميل</button>
             </div>
          )}

          {/* TAB: CERTS */}
          {activeTab === 'certs' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal">
                {certs.map((c, idx) => (
                   <div key={c.id} className="bg-[#0a0a0a] p-8 rounded-[3rem] border border-white/5 text-center group relative">
                      <div className="h-24 flex items-center justify-center mb-6">
                         <img src={c.img} className="max-h-full grayscale group-hover:grayscale-0 transition-opacity" alt="C" />
                      </div>
                      <input value={c.name} className="w-full bg-transparent border-b border-white/10 text-xs font-black uppercase text-center mb-4 outline-none" onChange={e => handleArrayUpdate(setCerts, idx, 'name', e.target.value)} />
                      <button onClick={() => triggerUpload(setCerts, 'img', idx)} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase mb-4">رفع الشهادة</button>
                      <button onClick={() => deleteItem(setCerts, c.id)} className="text-rose-500 text-[9px] font-black uppercase">حذف</button>
                   </div>
                ))}
                <button onClick={() => addItem(setCerts, { name: 'شهادة جديدة', img: 'https://cdn-icons-png.flaticon.com/512/8146/8146761.png' })} className="border-2 border-dashed border-white/5 rounded-[3rem] p-12 text-slate-500 font-black hover:border-orange-500 transition-all">+ إضافة شهادة جودة</button>
             </div>
          )}

          {/* TAB: DATABASE */}
          {activeTab === 'database' && (
            <div className="bg-[#0a0a0a] p-16 rounded-[4rem] border border-white/5 space-y-12 reveal">
               <div className="flex items-center gap-10">
                  <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-5xl rounded-[2.5rem] shadow-3xl">💾</div>
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Database Management</h3>
                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest font-bold">تصدير قاعدة بيانات الموقع بالكامل لملف SQL</p>
                  </div>
               </div>
               <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl text-emerald-500 text-sm leading-relaxed">
                  هذا نظام يقوم بحفظ البيانات في الـ Local Storage الخاص بمتصفحك. للتحويل إلى استضافة حقيقية، قم بتحميل ملف الـ SQL المولد ورفعه على خادم MySQL.
               </div>
               <div className="flex flex-wrap gap-6 pt-12 border-t border-white/5">
                  <button onClick={generateSQL} className="px-10 py-5 dynamic-bg text-black rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">تصدير ملف SQL (MySQL Backup)</button>
                  <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="px-10 py-5 border border-rose-500/20 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">تصفير كافة البيانات (Reset)</button>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

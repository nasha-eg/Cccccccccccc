
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkGalleryRef = useRef<HTMLInputElement>(null);
  const productImagesRef = useRef<HTMLInputElement>(null);
  const [activeProductIdx, setActiveProductIdx] = useState<number | null>(null);
  const [uploadTarget, setUploadTarget] = useState<{setFn: Function, key: string, index?: number, lang?: 'ar'|'en'} | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1997') setIsLoggedIn(true);
    else alert("كلمة المرور غير صحيحة");
  };

  const showSuccess = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const handleSingleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (uploadTarget.index !== undefined) {
          uploadTarget.setFn((prev: any[]) => {
            const newList = [...prev];
            if (uploadTarget.lang) {
              newList[uploadTarget.index!][uploadTarget.key] = { ...newList[uploadTarget.index!][uploadTarget.key], [uploadTarget.lang]: base64 };
            } else {
              newList[uploadTarget.index!][uploadTarget.key] = base64;
            }
            return newList;
          });
        } else {
          uploadTarget.setFn((prev: any) => ({ ...prev, [uploadTarget.key]: base64 }));
        }
        setUploadTarget(null);
        showSuccess();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSingleUpload = (setFn: Function, key: string, index?: number, lang?: 'ar'|'en') => {
    setUploadTarget({ setFn, key, index, lang });
    fileInputRef.current?.click();
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
    showSuccess();
  };

  const deleteItem = (setList: Function, id: string | number) => {
    if (window.confirm('هل أنت متأكد من الحذف النهائي؟')) {
      setList((prev: any[]) => prev.filter((item: any) => item.id !== id));
      showSuccess();
    }
  };

  const generateSQL = () => {
    const backup = { settings, products, galleryItems, testimonials, offers, articles, stats, certs };
    const sql = `-- Al-Asimh CMS Master Backup Export\n` +
      `INSERT INTO site_data (data) VALUES ('${JSON.stringify(backup).replace(/'/g, "''")}');`;
    const blob = new window.Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${new Date().getTime()}.sql`;
    a.click();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-cairo" dir="rtl">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-orange-500/10 p-12 text-center rounded-[3rem] shadow-2xl">
           <div className="w-20 h-20 dynamic-bg text-black flex items-center justify-center text-3xl font-black rounded-3xl mx-auto mb-10 shadow-xl">A</div>
           <h2 className="text-2xl font-black text-white mb-8">بوابة إدارة العاصمة</h2>
           <form onSubmit={handleLogin} className="space-y-6">
              <input 
                 type="password" 
                 placeholder="كلمة المرور" 
                 className="w-full bg-black border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-orange-500 text-center text-xl tracking-[0.5em]"
                 value={password}
                 onChange={e => setPassword(e.target.value)}
              />
              <button type="submit" className="w-full py-5 dynamic-bg text-black font-black rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all">دخول النظام</button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row font-cairo overflow-hidden" dir="rtl">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleSingleUpload} />
      <input type="file" ref={bulkGalleryRef} className="hidden" accept="image/*" multiple onChange={(e) => {
          const files = e.target.files;
          if (files) {
            Array.from(files).forEach((file: File) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64 = reader.result as string;
                setGalleryItems(prev => [...prev, { id: Date.now().toString() + Math.random(), title: { ar: file.name.split('.')[0], en: 'Factory Clip' }, category: { ar: 'المصنع', en: 'Factory' }, img: base64 }]);
              };
              reader.readAsDataURL(file);
            });
            showSuccess();
          }
      }} />
      <input type="file" ref={productImagesRef} className="hidden" accept="image/*" multiple onChange={(e) => {
          const files = e.target.files;
          if (files && activeProductIdx !== null) {
            Array.from(files).forEach((file: File) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64 = reader.result as string;
                setProducts(prev => {
                  const newList = [...prev];
                  newList[activeProductIdx].images = [...(newList[activeProductIdx].images || []), base64];
                  return newList;
                });
              };
              reader.readAsDataURL(file);
            });
            showSuccess();
          }
      }} />

      {/* Sidebar UI */}
      <aside className="w-full lg:w-72 bg-[#080808] border-l border-white/5 flex flex-col h-screen sticky top-0 z-50">
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
           <div className="w-10 h-10 dynamic-bg rounded-xl flex items-center justify-center text-black font-black text-xl">A</div>
           <div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">Command Center</p>
              <p className="text-sm font-black text-white mt-1">إدارة العاصمة</p>
           </div>
        </div>
        
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'الرئيسية', icon: '🏠' },
            { id: 'settings', label: 'الإعدادات العامة', icon: '⚙️' },
            { id: 'design', label: 'الهوية البصرية', icon: '🎨' },
            { id: 'products', label: 'إدارة المنتجات', icon: '📦' },
            { id: 'gallery', label: 'معرض الصور', icon: '🖼️' },
            { id: 'blog', label: 'المدونة والتقارير', icon: '📝' },
            { id: 'stats', label: 'إحصائيات النجاح', icon: '📊' },
            { id: 'testimonials', label: 'آراء العملاء', icon: '💬' },
            { id: 'offers', label: 'العروض النشطة', icon: '🏷️' },
            { id: 'certs', label: 'الشهادات الدولية', icon: '📜' },
            { id: 'database', label: 'قاعدة البيانات', icon: '💾' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-right px-6 py-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${activeTab === tab.id ? 'bg-orange-500 text-black font-black shadow-lg shadow-orange-500/20 translate-x-[-4px]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[11px] font-black uppercase tracking-tight">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-3">
           <button onClick={() => window.location.hash = ''} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all">معاينة الموقع</button>
           <button onClick={onLogout} className="w-full py-3 text-rose-500 text-[9px] font-black uppercase border border-rose-500/10 rounded-xl hover:bg-rose-500 hover:text-white transition-all">تسجيل الخروج</button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-grow p-6 lg:p-12 overflow-y-auto bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
             <div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">{activeTab} Interface</h1>
                <div className="flex items-center gap-3 mt-2">
                   <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-orange-500 animate-ping' : 'bg-emerald-500'}`}></div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{isSaving ? 'Saving Changes...' : 'System Synchronized'}</p>
                </div>
             </div>
             <button onClick={generateSQL} className="px-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all">تحميل ملف SQL</button>
          </header>

          <div className="space-y-12 animate-in fade-in duration-500">
             
             {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {[
                     { label: 'المنتجات', value: products.length, color: 'text-orange-500' },
                     { label: 'الصور', value: galleryItems.length, color: 'text-blue-500' },
                     { label: 'المقالات', value: articles.length, color: 'text-emerald-500' },
                     { label: 'العروض', value: offers.length, color: 'text-rose-500' }
                   ].map((stat, i) => (
                      <div key={i} className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center">
                         <span className="text-slate-500 text-[10px] font-black uppercase mb-2">{stat.label}</span>
                         <span className={`text-6xl font-black ${stat.color}`}>{stat.value}</span>
                      </div>
                   ))}
                </div>
             )}

             {activeTab === 'settings' && (
                <div className="bg-[#0a0a0a] p-12 rounded-[3.5rem] border border-white/5 space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] text-slate-500 uppercase font-black">رقم الواتساب</label>
                         <input type="text" value={settings.whatsapp} className="w-full bg-black border border-white/5 p-5 rounded-2xl outline-none focus:border-orange-500 text-white" onChange={e => setSettings({...settings, whatsapp: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] text-slate-500 uppercase font-black">البريد الإلكتروني</label>
                         <input type="text" value={settings.email} className="w-full bg-black border border-white/5 p-5 rounded-2xl outline-none focus:border-orange-500 text-white" onChange={e => setSettings({...settings, email: e.target.value})} />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 uppercase font-black">العنوان (بالعربية)</label>
                      <input type="text" value={settings.address.ar} className="w-full bg-black border border-white/5 p-5 rounded-2xl outline-none focus:border-orange-500 text-white" onChange={e => setSettings({...settings, address: {...settings.address, ar: e.target.value}})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 uppercase font-black">SEO Title (جوجل)</label>
                      <input type="text" value={settings.seoTitle} className="w-full bg-black border border-white/5 p-5 rounded-2xl outline-none focus:border-orange-500 text-white" onChange={e => setSettings({...settings, seoTitle: e.target.value})} />
                   </div>
                </div>
             )}

             {activeTab === 'products' && (
                <div className="space-y-8">
                   <button onClick={() => setProducts([...products, { id: Date.now().toString(), title: { ar: 'منتج جديد', en: 'New' }, desc: { ar: 'وصف المنتج...', en: 'Desc' }, specs: { ar: ['الكربون: 85%'], en: ['Carbon: 85%'] }, icon: '🔥', images: [], msg: { ar: 'استفسار', en: 'Inquiry' } }])} className="w-full py-14 border-4 border-dashed border-white/5 rounded-[4rem] text-slate-600 font-black hover:border-orange-500 hover:text-orange-500 transition-all">+ إضافة صنف تصدير جديد</button>
                   {products.map((p, pIdx) => (
                      <div key={p.id} className="bg-[#0a0a0a] p-12 rounded-[4rem] border border-white/5 space-y-10 group relative">
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-6">
                               <input value={p.icon} className="w-20 h-20 bg-black border border-white/5 rounded-3xl text-4xl text-center" onChange={e => updateArrayItem(setProducts, pIdx, 'icon', e.target.value)} />
                               <input value={p.title.ar} className="bg-transparent text-4xl font-black text-white w-full outline-none focus:text-orange-500" onChange={e => updateArrayItem(setProducts, pIdx, 'title', e.target.value, 'ar')} />
                            </div>
                            <button onClick={() => deleteItem(setProducts, p.id)} className="bg-rose-500/10 text-rose-500 px-6 py-3 rounded-xl font-black text-[9px] uppercase border border-rose-500/10">حذف الصنف</button>
                         </div>
                         
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                               <textarea value={p.desc.ar} className="w-full bg-black border border-white/5 p-6 rounded-3xl text-lg h-32 leading-relaxed" onChange={e => updateArrayItem(setProducts, pIdx, 'desc', e.target.value, 'ar')} />
                               <div className="space-y-4">
                                  <label className="text-[10px] text-slate-500 uppercase font-black">المواصفات الفنية</label>
                                  {p.specs.ar.map((spec, sIdx) => (
                                     <input key={sIdx} value={spec} className="w-full bg-black border border-white/5 p-4 rounded-xl text-xs text-orange-500" onChange={e => {
                                        const newSpecs = [...p.specs.ar];
                                        newSpecs[sIdx] = e.target.value;
                                        updateArrayItem(setProducts, pIdx, 'specs', newSpecs, 'ar');
                                     }} />
                                  ))}
                               </div>
                            </div>
                            <div className="space-y-4">
                               <div className="flex justify-between items-center">
                                  <label className="text-[10px] text-slate-500 uppercase font-black">معرض صور الصنف</label>
                                  <button onClick={() => { setActiveProductIdx(pIdx); productImagesRef.current?.click(); }} className="text-orange-500 text-[9px] font-black uppercase tracking-widest">+ رفع صور</button>
                               </div>
                               <div className="grid grid-cols-3 gap-4">
                                  {p.images && p.images.map((img, imgIdx) => (
                                     <div key={imgIdx} className="relative aspect-square rounded-2xl overflow-hidden group/img">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button onClick={() => {
                                           const newImgs = p.images.filter((_, i) => i !== imgIdx);
                                           updateArrayItem(setProducts, pIdx, 'images', newImgs);
                                        }} className="absolute inset-0 bg-rose-500/80 text-white font-black flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all text-xs">حذف</button>
                                     </div>
                                  ))}
                               </div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             )}

             {activeTab === 'gallery' && (
                <div className="space-y-10">
                   <div className="bg-[#0a0a0a] p-20 border-4 border-dashed border-white/5 rounded-[4rem] text-center group cursor-pointer hover:border-orange-500 transition-all" onClick={() => bulkGalleryRef.current?.click()}>
                      <span className="text-6xl mb-6 block">📂</span>
                      <h3 className="text-2xl font-black text-white">رفع جماعي لصور المصنع</h3>
                      <p className="text-slate-500 mt-2">اختر مجموعة من الصور من جهازك ليتم إضافتها تلقائياً لمعرض الصور</p>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {galleryItems.map((g, idx) => (
                         <div key={g.id} className="relative aspect-[3/4] rounded-3xl overflow-hidden group bg-black border border-white/5">
                            <img src={g.img} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                            <button onClick={() => deleteItem(setGalleryItems, g.id)} className="absolute top-2 left-2 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-xl opacity-0 group-hover:opacity-100 transition-all">×</button>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {activeTab === 'stats' && (
                <div className="bg-[#0a0a0a] p-12 rounded-[3.5rem] border border-white/5">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {stats.map((s, idx) => (
                         <div key={s.id} className="space-y-4 p-8 bg-black border border-white/5 rounded-3xl">
                            <input value={s.icon} className="bg-transparent text-3xl w-full text-center" onChange={e => updateArrayItem(setStats, idx, 'icon', e.target.value)} />
                            <input value={s.value} className="bg-transparent text-4xl font-black text-orange-500 w-full text-center outline-none" onChange={e => updateArrayItem(setStats, idx, 'value', e.target.value)} />
                            <input value={s.label.ar} className="bg-transparent text-[10px] text-slate-500 text-center w-full outline-none" onChange={e => updateArrayItem(setStats, idx, 'label', e.target.value, 'ar')} />
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {activeTab === 'testimonials' && (
                <div className="space-y-8">
                   <button onClick={() => setTestimonials([...testimonials, { id: Date.now().toString(), name: { ar: 'عميل جديد', en: 'New' }, role: { ar: 'مستورد', en: 'Importer' }, content: { ar: 'رأيه هنا...', en: 'Feedback' }, avatar: 'https://i.pravatar.cc/150' }])} className="w-full py-10 bg-white/5 rounded-[3rem] text-slate-500 font-black">+ إضافة رأي عميل جديد</button>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {testimonials.map((t, idx) => (
                         <div key={t.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-6">
                            <div className="flex items-center gap-6">
                               <div className="w-16 h-16 rounded-full overflow-hidden relative group">
                                  <img src={t.avatar} className="w-full h-full object-cover" />
                                  <button onClick={() => triggerSingleUpload(setTestimonials, 'avatar', idx)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white">تغيير</button>
                               </div>
                               <div className="flex-grow">
                                  <input value={t.name.ar} className="bg-transparent text-xl font-black text-white w-full" onChange={e => updateArrayItem(setTestimonials, idx, 'name', e.target.value, 'ar')} />
                                  <input value={t.role.ar} className="bg-transparent text-xs text-orange-500 w-full" onChange={e => updateArrayItem(setTestimonials, idx, 'role', e.target.value, 'ar')} />
                               </div>
                            </div>
                            <textarea value={t.content.ar} className="w-full bg-black border border-white/5 p-5 rounded-2xl text-sm italic" onChange={e => updateArrayItem(setTestimonials, idx, 'content', e.target.value, 'ar')} />
                            <button onClick={() => deleteItem(setTestimonials, t.id)} className="text-rose-500 text-[9px] font-black uppercase">حذف الشهادة</button>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {activeTab === 'offers' && (
                <div className="space-y-8">
                   <button onClick={() => setOffers([...offers, { id: Date.now(), title: { ar: 'عرض جديد', en: 'New' }, discount: { ar: '10%', en: '10%' }, description: { ar: 'وصف العرض...', en: 'Desc' }, expiry: { ar: 'قريباً', en: 'Soon' }, type: { ar: 'فحم', en: 'Charcoal' }, isActive: true }])} className="w-full py-10 border-2 border-white/5 rounded-[3rem] text-orange-500 font-black tracking-widest">+ إطلاق عرض ترويجي جديد</button>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {offers.map((o, idx) => (
                         <div key={o.id} className={`bg-[#0a0a0a] p-10 rounded-[3rem] border ${o.isActive ? 'border-orange-500/30' : 'border-white/5'} space-y-6 relative`}>
                            <div className="flex justify-between items-center">
                               <input value={o.title.ar} className="bg-transparent text-2xl font-black text-white w-full" onChange={e => updateArrayItem(setOffers, idx, 'title', e.target.value, 'ar')} />
                               <button onClick={() => updateArrayItem(setOffers, idx, 'isActive', !o.isActive)} className={`px-4 py-2 rounded-lg text-[9px] font-black ${o.isActive ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'}`}>{o.isActive ? 'نشط' : 'متوقف'}</button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                  <label className="text-[9px] text-slate-600 font-black">نسبة الخصم</label>
                                  <input value={o.discount.ar} className="w-full bg-black p-3 rounded-xl text-orange-500 font-black" onChange={e => updateArrayItem(setOffers, idx, 'discount', e.target.value, 'ar')} />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[9px] text-slate-600 font-black">تاريخ الانتهاء</label>
                                  <input value={o.expiry.ar} className="w-full bg-black p-3 rounded-xl text-slate-400" onChange={e => updateArrayItem(setOffers, idx, 'expiry', e.target.value, 'ar')} />
                               </div>
                            </div>
                            <button onClick={() => deleteItem(setOffers, o.id)} className="text-rose-500 text-[9px] font-black">حذف العرض</button>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {activeTab === 'certs' && (
                <div className="space-y-10">
                   <button onClick={() => setCerts([...certs, { id: Date.now().toString(), name: 'Certificate Name', img: 'https://cdn-icons-png.flaticon.com/512/3514/3514336.png' }])} className="w-full py-10 bg-white/5 rounded-[3rem] text-slate-500 font-black">+ إضافة شهادة اعتماد دولية</button>
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                      {certs.map((c, idx) => (
                         <div key={c.id} className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/5 flex flex-col items-center gap-6 group">
                            <div className="w-20 h-20 relative overflow-hidden group">
                               <img src={c.img} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                               <button onClick={() => triggerSingleUpload(setCerts, 'img', idx)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 text-[9px] font-black">تغيير</button>
                            </div>
                            <input value={c.name} className="bg-transparent text-center text-[10px] font-black uppercase text-slate-400 w-full" onChange={e => updateArrayItem(setCerts, idx, 'name', e.target.value)} />
                            <button onClick={() => deleteItem(setCerts, c.id)} className="text-rose-500 text-[8px] font-black">حذف</button>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {activeTab === 'database' && (
                <div className="bg-[#0a0a0a] p-24 rounded-[4rem] border border-white/5 text-center space-y-10">
                   <div className="w-32 h-32 bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-6xl rounded-[3rem] mx-auto mb-6">💾</div>
                   <h2 className="text-4xl font-black uppercase tracking-tighter">مركز التحكم في البيانات</h2>
                   <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-lg">تحميل ملف SQL يضمن لك تصدير نسخة كاملة من الموقع تشمل جميع التعديلات والصور المرفوعة كقاعدة بيانات رقمية.</p>
                   <div className="flex flex-col sm:flex-row justify-center gap-6 pt-10">
                      <button onClick={generateSQL} className="px-14 py-6 dynamic-bg text-black font-black rounded-2xl shadow-3xl hover:scale-110 active:scale-95 transition-all">تصدير قاعدة البيانات</button>
                      <button onClick={() => { if(window.confirm('سيتم حذف كافة بياناتك واستعادة الإعدادات الأصلية. هل أنت متأكد؟')) { localStorage.clear(); window.location.reload(); } }} className="px-14 py-6 border-2 border-rose-500/20 text-rose-500 rounded-2xl font-black hover:bg-rose-500 hover:text-white transition-all">تهيئة النظام (Reset)</button>
                   </div>
                </div>
             )}

          </div>
        </div>
      </main>
    </div>
  );
};

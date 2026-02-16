
import React, { useState, useRef, useEffect } from 'react';
import { Offer } from './Offers';
import { Article } from './Blog';
import { SiteSettings, Product, GalleryItem, Testimonial, StatItem, CertificateItem, Language } from '../App';
import { dbService } from '../services/dbService';

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
  const [dbStatus, setDbStatus] = useState<'connected' | 'syncing' | 'error'>('connected');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkGalleryRef = useRef<HTMLInputElement>(null);
  const productImagesRef = useRef<HTMLInputElement>(null);
  const [activeProductIdx, setActiveProductIdx] = useState<number | null>(null);
  const [uploadTarget, setUploadTarget] = useState<{setFn: Function, key: string, index?: number, lang?: 'ar'|'en'} | null>(null);

  // Auto-Sync System
  const syncToDB = async (tableName: string, data: any) => {
    setDbStatus('syncing');
    setIsSaving(true);
    const result = await dbService.updateTable(tableName, data);
    if (result.success) {
      setTimeout(() => {
        setIsSaving(false);
        setDbStatus('connected');
      }, 800);
    } else {
      setDbStatus('error');
    }
  };

  useEffect(() => { if(isLoggedIn) syncToDB('site_settings', settings); }, [settings]);
  useEffect(() => { if(isLoggedIn) syncToDB('site_products', products); }, [products]);
  useEffect(() => { if(isLoggedIn) syncToDB('site_gallery', galleryItems); }, [galleryItems]);
  useEffect(() => { if(isLoggedIn) syncToDB('site_testimonials', testimonials); }, [testimonials]);
  useEffect(() => { if(isLoggedIn) syncToDB('site_offers', offers); }, [offers]);
  useEffect(() => { if(isLoggedIn) syncToDB('site_articles', articles); }, [articles]);
  useEffect(() => { if(isLoggedIn) syncToDB('site_stats', stats); }, [stats]);
  useEffect(() => { if(isLoggedIn) syncToDB('site_certs', certs); }, [certs]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1997') setIsLoggedIn(true);
    else alert("كلمة المرور غير صحيحة");
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
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = (setFn: Function, key: string, index?: number, lang?: 'ar'|'en') => {
    setUploadTarget({ setFn, key, index, lang });
    fileInputRef.current?.click();
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
    if (window.confirm('هل أنت متأكد من الحذف النهائي؟')) {
      setList((prev: any[]) => prev.filter((item: any) => item.id !== id));
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-cairo" dir="rtl">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-orange-500/20 p-12 text-center rounded-[3rem] shadow-2xl">
           <div className="w-20 h-20 dynamic-bg text-black flex items-center justify-center text-3xl font-black rounded-3xl mx-auto mb-10 shadow-[0_0_30px_rgba(245,158,11,0.3)]">A</div>
           <h2 className="text-2xl font-black text-white mb-8 tracking-tighter">نظام إدارة العاصمة</h2>
           <form onSubmit={handleLogin} className="space-y-6">
              <input type="password" placeholder="رمز الأمان" className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white text-center text-5xl outline-none focus:border-orange-500 transition-all placeholder:text-white/5" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
              <button type="submit" className="w-full py-5 dynamic-bg text-black font-black rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-xs">فتح لوحة التحكم</button>
           </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: '🏠' },
    { id: 'settings', label: 'إعدادات الموقع', icon: '⚙️' },
    { id: 'seo', label: 'تحسين المحركات', icon: '🔍' },
    { id: 'products', label: 'المنتجات', icon: '📦' },
    { id: 'gallery', label: 'المعرض', icon: '🖼️' },
    { id: 'blog', label: 'المدونة', icon: '📝' },
    { id: 'offers', label: 'العروض', icon: '🏷️' },
    { id: 'testimonials', label: 'الآراء', icon: '💬' },
    { id: 'stats', label: 'الأرقام', icon: '📊' },
    { id: 'certs', label: 'الشهادات', icon: '📜' },
    { id: 'database', label: 'البيانات', icon: '💾' }
  ];

  const BilingualInput = ({ label, valueAr, valueEn, onChangeAr, onChangeEn, textarea = false }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/20 p-6 rounded-3xl border border-white/5">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
           {label} (AR)
        </label>
        {textarea ? (
          <textarea className="w-full bg-black border border-white/5 p-4 rounded-xl text-white outline-none focus:border-orange-500 transition-all text-sm h-32 leading-relaxed" value={valueAr} onChange={e => onChangeAr(e.target.value)} />
        ) : (
          <input className="w-full bg-black border border-white/5 p-4 rounded-xl text-white outline-none focus:border-orange-500 transition-all text-sm" value={valueAr} onChange={e => onChangeAr(e.target.value)} />
        )}
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
           {label} (EN)
        </label>
        {textarea ? (
          <textarea className="w-full bg-black border border-white/5 p-4 rounded-xl text-white outline-none focus:border-orange-500 transition-all text-sm h-32 leading-relaxed font-sans" dir="ltr" value={valueEn} onChange={e => onChangeEn(e.target.value)} />
        ) : (
          <input className="w-full bg-black border border-white/5 p-4 rounded-xl text-white outline-none focus:border-orange-500 transition-all text-sm font-sans" dir="ltr" value={valueEn} onChange={e => onChangeEn(e.target.value)} />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row font-cairo" dir="rtl">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleSingleUpload} />
      <input type="file" ref={bulkGalleryRef} className="hidden" accept="image/*" multiple onChange={(e) => {
          const files = e.target.files;
          if (files) {
            Array.from(files).forEach((file: File) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                setGalleryItems(prev => [...prev, { id: Date.now().toString() + Math.random(), title: { ar: 'صورة جديدة', en: 'New' }, category: { ar: 'المصنع', en: 'Factory' }, img: reader.result as string }]);
              };
              reader.readAsDataURL(file);
            });
          }
      }} />
      <input type="file" ref={productImagesRef} className="hidden" accept="image/*" multiple onChange={(e) => {
          const files = e.target.files;
          if (files && activeProductIdx !== null) {
            Array.from(files).forEach((file: File) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                setProducts(prev => {
                  const newList = [...prev];
                  newList[activeProductIdx].images = [...(newList[activeProductIdx].images || []), reader.result as string];
                  return newList;
                });
              };
              reader.readAsDataURL(file);
            });
          }
      }} />

      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-[#080808] border-l border-white/5 flex flex-col h-screen sticky top-0 z-50 overflow-y-auto scrollbar-hide">
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
           <div className="w-10 h-10 dynamic-bg rounded-xl flex items-center justify-center text-black font-black text-xl shadow-lg">A</div>
           <div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">Database Integrated</p>
              <p className="text-sm font-black text-white mt-1">إدارة العاصمة</p>
           </div>
        </div>
        <nav className="flex-grow p-4 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-right px-6 py-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${activeTab === item.id ? 'bg-orange-500 text-black font-black shadow-[0_10px_30px_rgba(245,158,11,0.2)] scale-105' : 'text-slate-400 hover:bg-white/5'}`}>
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-black uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/5 space-y-3">
           <button onClick={() => window.location.hash = ''} className="w-full py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 border border-white/5 transition-all">العودة للموقع</button>
           <button onClick={onLogout} className="w-full py-3 text-rose-500 text-[9px] font-black uppercase border border-rose-500/10 rounded-xl hover:bg-rose-500 hover:text-white transition-all">خروج آمن</button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-grow p-6 lg:p-12 overflow-y-auto bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
             <div>
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{activeTab} Interface</h1>
                <div className="flex items-center gap-3 mt-4">
                   <div className={`w-2.5 h-2.5 rounded-full ${dbStatus === 'syncing' ? 'bg-orange-500 animate-ping' : dbStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 animate-pulse'}`}></div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                     {dbStatus === 'syncing' ? 'SYNCING TO MYSQL...' : dbStatus === 'connected' ? 'CONNECTED TO DATABASE' : 'SYNC ERROR'}
                   </p>
                </div>
             </div>
             <div className="flex gap-4">
                <button onClick={() => {
                   const data = { settings, products, galleryItems, testimonials, offers, articles, stats, certs };
                   const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
                   const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `full_backup_${Date.now()}.json`; a.click();
                }} className="px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:scale-105 transition-all">تصدير قاعدة البيانات</button>
             </div>
          </header>

          <div className="space-y-12 animate-in fade-in duration-700">
             
             {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                   {[
                     { label: 'المنتجات', v: products.length, c: 'text-orange-500', i: '📦' },
                     { label: 'المقالات', v: articles.length, c: 'text-emerald-500', i: '📝' },
                     { label: 'العروض', v: offers.length, c: 'text-rose-500', i: '🏷️' },
                     { label: 'المعرض', v: galleryItems.length, c: 'text-blue-500', i: '🖼️' }
                   ].map((s, i) => (
                      <div key={i} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 text-center shadow-xl">
                         <span className="text-3xl mb-4 block">{s.i}</span>
                         <span className="text-slate-500 text-[10px] font-black uppercase mb-2 block">{s.label}</span>
                         <span className={`text-6xl font-black ${s.c}`}>{s.v}</span>
                      </div>
                   ))}
                </div>
             )}

             {activeTab === 'settings' && (
                <div className="bg-[#0a0a0a] p-12 rounded-[4rem] border border-white/5 space-y-12 shadow-2xl">
                   <div className="section">
                      <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-orange-500">الهوية المرئية</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase">الشعار (Logo)</label>
                            <img src={settings.logoUrl} className="h-20 object-contain bg-black p-4 rounded-3xl border border-white/5" />
                            <button onClick={() => triggerUpload(setSettings, 'logoUrl')} className="w-full py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase">تغيير</button>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase">اللون الأساسي</label>
                            <input type="color" value={settings.primaryColor} className="w-full h-20 bg-black p-2 rounded-3xl cursor-pointer" onChange={e => setSettings({...settings, primaryColor: e.target.value})} />
                            <p className="text-center text-[10px] font-bold">{settings.primaryColor}</p>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase">خلفية الهيرو</label>
                            <img src={settings.heroBg} className="h-20 w-full object-cover rounded-3xl border border-white/5" />
                            <button onClick={() => triggerUpload(setSettings, 'heroBg')} className="w-full py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase">تغيير</button>
                         </div>
                      </div>
                   </div>

                   <div className="section border-t border-white/5 pt-12">
                      <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-orange-500">صور المقارنة (Quality Slider)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase">الصورة (قبل - فحم عادي)</label>
                            <img src={settings.comparisonBeforeImg} className="aspect-video w-full object-cover rounded-3xl border border-white/5" />
                            <button onClick={() => triggerUpload(setSettings, 'comparisonBeforeImg')} className="w-full py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase">رفع صورة جديدة</button>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase">الصورة (بعد - فحم العاصمة)</label>
                            <img src={settings.comparisonAfterImg} className="aspect-video w-full object-cover rounded-3xl border border-white/5" />
                            <button onClick={() => triggerUpload(setSettings, 'comparisonAfterImg')} className="w-full py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase">رفع صورة جديدة</button>
                         </div>
                      </div>
                   </div>

                   <div className="section border-t border-white/5 pt-12">
                      <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-orange-500">بيانات التواصل</h3>
                      <BilingualInput label="اسم العلامة" valueAr={settings.brandName.ar} valueEn={settings.brandName.en} onChangeAr={(v:any) => setSettings({...settings, brandName: {...settings.brandName, ar: v}})} onChangeEn={(v:any) => setSettings({...settings, brandName: {...settings.brandName, en: v}})} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase">واتساب</label>
                            <input className="w-full bg-black border border-white/5 p-4 rounded-xl text-white outline-none" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase">البريد</label>
                            <input className="w-full bg-black border border-white/5 p-4 rounded-xl text-white outline-none" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} />
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'seo' && (
                <div className="bg-[#0a0a0a] p-12 rounded-[4rem] border border-white/5 space-y-12 shadow-2xl">
                   <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-orange-500">تحسين محركات البحث (SEO Engine)</h3>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase">عنوان الموقع في جوجل (Meta Title)</label>
                         <input className="w-full bg-black border border-white/5 p-4 rounded-xl text-white outline-none focus:border-orange-500" value={settings.seoTitle} onChange={e => setSettings({...settings, seoTitle: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase">وصف الموقع (Meta Description)</label>
                         <textarea className="w-full bg-black border border-white/5 p-4 rounded-xl text-white outline-none focus:border-orange-500 h-32" value={settings.seoDescription} onChange={e => setSettings({...settings, seoDescription: e.target.value})} />
                      </div>
                      <div className="p-6 bg-orange-500/5 rounded-3xl border border-orange-500/10">
                         <p className="text-[10px] font-bold text-orange-500 uppercase mb-2">نصيحة الخبير:</p>
                         <p className="text-xs text-slate-400 leading-relaxed italic">تأكد من تضمين كلمات مثل "فحم"، "تصدير"، "برتقال"، و "مصر" لزيادة فرص ظهورك في النتائج الأولى للمستوردين الأجانب.</p>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'products' && (
                <div className="space-y-12">
                   <button onClick={() => setProducts([...products, { id: Date.now().toString(), title: { ar: 'صنف جديد', en: 'New Item' }, desc: { ar: 'الوصف هنا', en: 'Description here' }, specs: { ar: ['الكربون: 85%'], en: ['Carbon: 85%'] }, icon: '🔥', images: [], msg: { ar: 'استفسار تصدير', en: 'Export Inquiry' } }])} className="w-full py-12 border-4 border-dashed border-white/5 rounded-[4rem] text-slate-600 font-black hover:border-orange-500 hover:text-orange-500 transition-all uppercase tracking-widest text-xs">+ إضافة منتج جديد</button>
                   {products.map((p, idx) => (
                      <div key={p.id} className="bg-[#0a0a0a] p-12 rounded-[4rem] border border-white/5 space-y-10 shadow-2xl">
                         <div className="flex justify-between items-center border-b border-white/5 pb-6">
                            <div className="flex items-center gap-6">
                               <input value={p.icon} className="w-16 h-16 bg-black border border-white/10 rounded-2xl text-2xl text-center" onChange={e => updateArray(setProducts, idx, 'icon', e.target.value)} />
                               <h3 className="text-2xl font-black">{p.title.ar}</h3>
                            </div>
                            <button onClick={() => deleteItem(setProducts, p.id)} className="text-rose-500 text-[10px] font-black uppercase px-6 py-2 bg-rose-500/10 rounded-xl">حذف المنتج</button>
                         </div>
                         
                         <BilingualInput label="اسم المنتج" valueAr={p.title.ar} valueEn={p.title.en} onChangeAr={(v:any) => updateArray(setProducts, idx, 'title', v, 'ar')} onChangeEn={(v:any) => updateArray(setProducts, idx, 'title', v, 'en')} />
                         <BilingualInput label="الوصف التفصيلي" valueAr={p.desc.ar} valueEn={p.desc.en} onChangeAr={(v:any) => updateArray(setProducts, idx, 'desc', v, 'ar')} onChangeEn={(v:any) => updateArray(setProducts, idx, 'desc', v, 'en')} textarea />

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                               <div className="flex justify-between items-center">
                                  <label className="text-[10px] font-black text-slate-500 uppercase">المواصفات الفنية (AR):</label>
                                  <button onClick={() => {
                                    const newSpecs = [...p.specs.ar, 'جديد: 0%'];
                                    updateArray(setProducts, idx, 'specs', newSpecs, 'ar');
                                  }} className="text-[9px] text-orange-500 font-black">+ إضافة مواصفة</button>
                               </div>
                               <div className="space-y-3">
                                  {p.specs.ar.map((s, si) => (
                                     <div key={si} className="flex gap-3">
                                        <input value={s} className="w-full bg-black border border-white/5 p-4 rounded-xl text-xs text-orange-500 font-bold" onChange={e => {
                                           const newSpecs = [...p.specs.ar]; newSpecs[si] = e.target.value; updateArray(setProducts, idx, 'specs', newSpecs, 'ar');
                                        }} />
                                        <button onClick={() => {
                                           const newSpecs = p.specs.ar.filter((_, i) => i !== si);
                                           updateArray(setProducts, idx, 'specs', newSpecs, 'ar');
                                        }} className="text-rose-500 px-4 bg-rose-500/10 rounded-xl">×</button>
                                     </div>
                                  ))}
                               </div>
                            </div>
                            <div className="space-y-6">
                               <div className="flex justify-between items-center">
                                  <label className="text-[10px] font-black text-slate-500 uppercase">معرض صور المنتج:</label>
                                  <button onClick={() => { setActiveProductIdx(idx); productImagesRef.current?.click(); }} className="text-orange-500 text-[9px] font-black uppercase tracking-widest">+ رفع صور</button>
                               </div>
                               <div className="grid grid-cols-4 gap-3 bg-black/40 p-6 rounded-3xl border border-white/5">
                                  {p.images.map((img, ii) => (
                                     <div key={ii} className="relative aspect-square rounded-2xl overflow-hidden group/img">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button onClick={() => {
                                           const ni = p.images.filter((_, i) => i !== ii);
                                           updateArray(setProducts, idx, 'images', ni);
                                        }} className="absolute inset-0 bg-rose-500/90 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 font-black text-[10px] transition-all">حذف</button>
                                     </div>
                                  ))}
                               </div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             )}

             {activeTab === 'stats' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                   {stats.map((s, idx) => (
                      <div key={s.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 text-center space-y-8 shadow-xl">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase">الأيقونة</label>
                            <input className="w-full bg-black border border-white/5 p-4 rounded-xl text-4xl text-center" value={s.icon} onChange={e => updateArray(setStats, idx, 'icon', e.target.value)} />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase">القيمة</label>
                            <input className="w-full bg-black border border-white/5 p-4 rounded-xl text-3xl font-black text-orange-500 text-center" value={s.value} onChange={e => updateArray(setStats, idx, 'value', e.target.value)} />
                         </div>
                         <BilingualInput label="التسمية" valueAr={s.label.ar} valueEn={s.label.en} onChangeAr={(v:any) => updateArray(setStats, idx, 'label', v, 'ar')} onChangeEn={(v:any) => updateArray(setStats, idx, 'label', v, 'en')} />
                      </div>
                   ))}
                </div>
             )}

             {activeTab === 'database' && (
                <div className="bg-[#0a0a0a] p-24 rounded-[5rem] border border-white/5 text-center space-y-12 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full"></div>
                   <div className="w-40 h-40 bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-8xl rounded-[3.5rem] mx-auto mb-6 shadow-2xl relative z-10">💾</div>
                   <div className="relative z-10">
                      <h2 className="text-5xl font-black uppercase tracking-tighter leading-tight mb-6">إدارة خادم البيانات</h2>
                      <p className="text-slate-400 max-w-2xl mx-auto text-xl font-light leading-relaxed italic border-r-4 border-emerald-500 pr-8 text-right">
                        النظام متصل حالياً بقاعدة بيانات **MySQL** عبر واجهة `dbService`. جميع العمليات تتم بمزامنة لحظية لضمان عدم فقدان البيانات.
                      </p>
                   </div>
                   <div className="flex flex-col sm:flex-row justify-center gap-8 pt-12 relative z-10">
                      <button onClick={() => {
                        if(window.confirm('سيتم حذف كافة البيانات المخصصة وإرجاع الموقع لحالته الأصلية. هل أنت متأكد؟')) { localStorage.clear(); window.location.reload(); }
                      }} className="px-16 py-7 border-2 border-rose-500/20 text-rose-500 rounded-3xl font-black hover:bg-rose-500 hover:text-white transition-all uppercase text-[11px] tracking-widest">تصفير قاعدة البيانات (Reset)</button>
                   </div>
                </div>
             )}

          </div>
        </div>
      </main>
    </div>
  );
};

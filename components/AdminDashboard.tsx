
import React, { useState, useRef, useEffect } from 'react';
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
    setTimeout(() => setIsSaving(false), 2000);
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-cairo" dir="rtl">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-orange-500/10 p-12 text-center rounded-[3rem] shadow-2xl">
           <div className="w-20 h-20 dynamic-bg text-black flex items-center justify-center text-3xl font-black rounded-3xl mx-auto mb-10 shadow-xl">A</div>
           <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-widest">Capital Command Center</h2>
           <form onSubmit={handleLogin} className="space-y-6">
              <input type="password" placeholder="••••" className="w-full bg-black border border-white/5 p-6 rounded-2xl text-white text-center text-4xl outline-none focus:border-orange-500" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="submit" className="w-full py-5 dynamic-bg text-black font-black rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all">دخول النظام</button>
           </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'الرئيسية', icon: '🏠' },
    { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
    { id: 'design', label: 'التصميم', icon: '🎨' },
    { id: 'products', label: 'المنتجات', icon: '📦' },
    { id: 'gallery', label: 'المعرض', icon: '🖼️' },
    { id: 'blog', label: 'المدونة', icon: '📝' },
    { id: 'stats', label: 'الإحصائيات', icon: '📊' },
    { id: 'testimonials', label: 'الآراء', icon: '💬' },
    { id: 'offers', label: 'العروض', icon: '🏷️' },
    { id: 'certs', label: 'الشهادات', icon: '📜' },
    { id: 'database', label: 'البيانات', icon: '💾' }
  ];

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
                setGalleryItems(prev => [...prev, { id: Date.now().toString() + Math.random(), title: { ar: file.name.split('.')[0], en: 'Production' }, category: { ar: 'المصنع', en: 'Factory' }, img: base64 }]);
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

      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-[#080808] border-l border-white/5 flex flex-col h-screen sticky top-0 z-50 overflow-y-auto">
        <div className="p-8 mb-4 border-b border-white/5 flex items-center gap-4">
           <div className="w-10 h-10 dynamic-bg rounded-xl flex items-center justify-center text-black font-black text-xl">A</div>
           <div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">Admin Panel</p>
              <p className="text-sm font-black text-white mt-1">إدارة العاصمة</p>
           </div>
        </div>
        
        <nav className="flex-grow p-4 space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-right px-6 py-4 rounded-2xl flex items-center gap-4 transition-all ${activeTab === tab.id ? 'bg-orange-500 text-black font-black shadow-lg shadow-orange-500/20 translate-x-[-4px]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs uppercase tracking-tight">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-3">
           <button onClick={() => window.location.hash = ''} className="w-full py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase border border-white/5 hover:bg-white/10 transition-all">خروج للموقع</button>
           <button onClick={onLogout} className="w-full py-3 text-rose-500 text-[9px] font-black uppercase hover:bg-rose-500 hover:text-white transition-all rounded-xl border border-rose-500/10">تسجيل الخروج</button>
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
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{isSaving ? 'Saving Changes...' : 'System Ready'}</p>
                </div>
             </div>
             <button onClick={() => { 
                const backup = { settings, products, galleryItems, testimonials, offers, articles, stats, certs };
                const blob = new Blob([JSON.stringify(backup)], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = 'backup.json'; a.click();
             }} className="px-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all">تحميل نسخة احتياطية</button>
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
                         <label className="text-[10px] text-slate-500 font-black">واتساب</label>
                         <input value={settings.whatsapp} className="w-full bg-black border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-orange-500" onChange={e => setSettings({...settings, whatsapp: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] text-slate-500 font-black">البريد</label>
                         <input value={settings.email} className="w-full bg-black border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-orange-500" onChange={e => setSettings({...settings, email: e.target.value})} />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 font-black">العنوان</label>
                      <input value={settings.address.ar} className="w-full bg-black border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-orange-500" onChange={e => setSettings({...settings, address: {...settings.address, ar: e.target.value}})} />
                   </div>
                </div>
             )}

             {activeTab === 'design' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-8">
                      <h3 className="text-orange-500 font-black text-xs uppercase tracking-widest">الهوية البصرية</h3>
                      <div className="flex items-center gap-10">
                         <div className="w-24 h-24 bg-black border border-white/5 rounded-3xl p-4 flex items-center justify-center">
                            <img src={settings.logoUrl} className="max-w-full max-h-full object-contain" />
                         </div>
                         <button onClick={() => triggerSingleUpload(setSettings, 'logoUrl')} className="px-8 py-4 bg-orange-500 text-black rounded-xl font-black text-[10px] uppercase">تغيير الشعار</button>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <input type="color" value={settings.primaryColor} className="w-full h-12 bg-transparent border-none cursor-pointer" onChange={e => setSettings({...settings, primaryColor: e.target.value})} />
                         <input type="color" value={settings.accentColor} className="w-full h-12 bg-transparent border-none cursor-pointer" onChange={e => setSettings({...settings, accentColor: e.target.value})} />
                      </div>
                   </div>
                   <div className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-8">
                      <h3 className="text-orange-500 font-black text-xs uppercase tracking-widest">صور المقارنة</h3>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="aspect-video bg-black rounded-2xl overflow-hidden relative group">
                            <img src={settings.comparisonBeforeImg} className="w-full h-full object-cover" />
                            <button onClick={() => triggerSingleUpload(setSettings, 'comparisonBeforeImg')} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 font-black text-[10px]">تغيير "قبل"</button>
                         </div>
                         <div className="aspect-video bg-black rounded-2xl overflow-hidden relative group">
                            <img src={settings.comparisonAfterImg} className="w-full h-full object-cover" />
                            <button onClick={() => triggerSingleUpload(setSettings, 'comparisonAfterImg')} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 font-black text-[10px]">تغيير "بعد"</button>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'products' && (
                <div className="space-y-8">
                   <button onClick={() => setProducts([...products, { id: Date.now().toString(), title: { ar: 'منتج جديد', en: 'New' }, desc: { ar: 'وصف المنتج...', en: 'Desc' }, specs: { ar: ['الكربون: 85%'], en: ['Carbon: 85%'] }, icon: '🔥', images: [], msg: { ar: 'استفسار', en: 'Inquiry' } }])} className="w-full py-12 border-4 border-dashed border-white/5 rounded-[3rem] text-slate-500 font-black hover:border-orange-500 transition-all uppercase tracking-widest">+ إضافة صنف جديد</button>
                   {products.map((p, pIdx) => (
                      <div key={p.id} className="bg-[#0a0a0a] p-12 rounded-[4rem] border border-white/5 space-y-8 relative group shadow-2xl">
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-6">
                               <input value={p.icon} className="w-16 h-16 bg-black border border-white/10 rounded-2xl text-2xl text-center" onChange={e => updateArrayItem(setProducts, pIdx, 'icon', e.target.value)} />
                               <input value={p.title.ar} className="bg-transparent text-3xl font-black text-white w-full outline-none focus:text-orange-500" onChange={e => updateArrayItem(setProducts, pIdx, 'title', e.target.value, 'ar')} />
                            </div>
                            <button onClick={() => deleteItem(setProducts, p.id)} className="bg-rose-500/10 text-rose-500 px-6 py-3 rounded-xl font-black text-[9px] uppercase border border-rose-500/20">حذف الصنف</button>
                         </div>
                         
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                               <textarea value={p.desc.ar} className="w-full bg-black border border-white/10 p-6 rounded-3xl text-sm h-32 leading-relaxed" onChange={e => updateArrayItem(setProducts, pIdx, 'desc', e.target.value, 'ar')} />
                               <div className="grid grid-cols-2 gap-4">
                                  {p.specs.ar.map((spec, sIdx) => (
                                     <input key={sIdx} value={spec} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs text-orange-500" onChange={e => {
                                        const newSpecs = [...p.specs.ar]; newSpecs[sIdx] = e.target.value; updateArrayItem(setProducts, pIdx, 'specs', newSpecs, 'ar');
                                     }} />
                                  ))}
                               </div>
                            </div>
                            <div className="space-y-4">
                               <div className="flex justify-between items-center">
                                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">معرض الصور</label>
                                  <button onClick={() => { setActiveProductIdx(pIdx); productImagesRef.current?.click(); }} className="text-[9px] font-black text-orange-500 uppercase">+ رفع صور</button>
                               </div>
                               <div className="grid grid-cols-3 gap-3">
                                  {p.images && p.images.map((img, imgIdx) => (
                                     <div key={imgIdx} className="relative aspect-square rounded-xl overflow-hidden group/thumb shadow-lg">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button onClick={() => { const newImgs = p.images.filter((_, i) => i !== imgIdx); updateArrayItem(setProducts, pIdx, 'images', newImgs); }} className="absolute inset-0 bg-rose-500/80 flex items-center justify-center text-white opacity-0 group-hover/thumb:opacity-100 transition-all text-xs font-black">حذف</button>
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
                      <h3 className="text-2xl font-black text-white uppercase">رفع صور المصنع</h3>
                      <p className="text-slate-500 mt-2">اختر مجموعة من الصور لرفعها دفعة واحدة للموقع</p>
                   </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {galleryItems.map((g, idx) => (
                         <div key={g.id} className="relative aspect-[3/4] rounded-3xl overflow-hidden group bg-black border border-white/5 shadow-2xl">
                            <img src={g.img} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                            <button onClick={() => deleteItem(setGalleryItems, g.id)} className="absolute top-2 left-2 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-xl opacity-0 group-hover:opacity-100 transition-all">×</button>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {activeTab === 'database' && (
                <div className="bg-[#0a0a0a] p-24 rounded-[4rem] border border-white/5 text-center space-y-10">
                   <div className="w-32 h-32 bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-6xl rounded-[3rem] mx-auto mb-6">💾</div>
                   <h2 className="text-4xl font-black uppercase tracking-tighter">مركز التحكم في البيانات</h2>
                   <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-lg italic">"كل تعديل تقوم به يتم حفظه فوراً في متصفحك. استخدم زر المسح إذا أردت استعادة الإعدادات الأصلية للشركة."</p>
                   <div className="flex flex-col sm:flex-row justify-center gap-6 pt-10">
                      <button onClick={() => { if(window.confirm('سيتم حذف كافة بياناتك واستعادة الإعدادات الأصلية. هل أنت متأكد؟')) { localStorage.clear(); window.location.reload(); } }} className="px-14 py-6 border-2 border-rose-500/20 text-rose-500 rounded-2xl font-black hover:bg-rose-500 hover:text-white transition-all uppercase text-xs tracking-widest">تهيئة النظام (Factory Reset)</button>
                   </div>
                </div>
             )}

          </div>
        </div>
      </main>
    </div>
  );
};

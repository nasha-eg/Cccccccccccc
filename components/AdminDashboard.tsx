
import React, { useState, useEffect } from 'react';
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
  
  // Auto-Sync System
  const syncToDB = async (tableName: string, data: any) => {
    setDbStatus('syncing');
    setIsSaving(true);
    const result = await dbService.updateTable(tableName, data);
    if (result.success) {
      setTimeout(() => {
        setIsSaving(false);
        setDbStatus('connected');
      }, 500);
    } else {
      setDbStatus('error');
    }
  };

  // Sync states on change
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

  const ImageInput = ({ label, value, onChange }: any) => (
    <div className="space-y-3">
       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">{label}</label>
       <div className="flex gap-3">
          <input 
            className="flex-grow bg-black border border-white/5 p-4 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all font-sans" 
            placeholder="انسخ رابط الصورة هنا (e.g. https://image.com/charcoal.jpg)" 
            value={value} 
            onChange={e => onChange(e.target.value)} 
          />
          {value && (
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-slate-900">
              <img src={value} className="w-full h-full object-cover" alt="Preview" onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=Error')} />
            </div>
          )}
       </div>
    </div>
  );

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
    { id: 'products', label: 'المنتجات', icon: '📦' },
    { id: 'gallery', label: 'المعرض', icon: '🖼️' },
    { id: 'blog', label: 'المدونة', icon: '📝' },
    { id: 'offers', label: 'العروض', icon: '🏷️' },
    { id: 'testimonials', label: 'الآراء', icon: '💬' },
    { id: 'stats', label: 'الأرقام', icon: '📊' },
    { id: 'certs', label: 'الشهادات', icon: '📜' },
    { id: 'database', label: 'البيانات', icon: '💾' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row font-cairo" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-[#080808] border-l border-white/5 flex flex-col h-screen sticky top-0 z-50 overflow-y-auto scrollbar-hide">
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
           <div className="w-10 h-10 dynamic-bg rounded-xl flex items-center justify-center text-black font-black text-xl shadow-lg">A</div>
           <div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">Control Tower</p>
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
                     {dbStatus === 'syncing' ? 'DATABASE SYNCING...' : dbStatus === 'connected' ? 'ALL SYSTEMS OPERATIONAL' : 'SYNC ERROR'}
                   </p>
                </div>
             </div>
          </header>

          <div className="space-y-12 animate-in fade-in duration-700">
             
             {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                   {[
                     { label: 'الأصناف', v: products.length, c: 'text-orange-500', i: '📦' },
                     { label: 'التقارير', v: articles.length, c: 'text-emerald-500', i: '📝' },
                     { label: 'العروض', v: offers.length, c: 'text-rose-500', i: '🏷️' },
                     { label: 'المعرض', v: galleryItems.length, c: 'text-blue-500', i: '🖼️' }
                   ].map((s, i) => (
                      <div key={i} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 text-center shadow-xl">
                         <span className="text-3xl mb-4 block">{s.i}</span>
                         <span className="text-slate-500 text-[10px] font-black uppercase mb-2 block tracking-widest">{s.label}</span>
                         <span className={`text-6xl font-black ${s.c}`}>{s.v}</span>
                      </div>
                   ))}
                </div>
             )}

             {activeTab === 'settings' && (
                <div className="bg-[#0a0a0a] p-12 rounded-[4rem] border border-white/5 space-y-12 shadow-2xl">
                   <div className="section space-y-8">
                      <h3 className="text-xl font-black uppercase tracking-widest text-orange-500 border-b border-white/5 pb-4">صور الهوية (روابط خارجية)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <ImageInput label="شعار الشركة (Logo URL)" value={settings.logoUrl} onChange={(v:any) => setSettings({...settings, logoUrl: v})} />
                         <ImageInput label="خلفية الموقع (Hero BG URL)" value={settings.heroBg} onChange={(v:any) => setSettings({...settings, heroBg: v})} />
                         <ImageInput label="صورة المقارنة (قبل)" value={settings.comparisonBeforeImg} onChange={(v:any) => setSettings({...settings, comparisonBeforeImg: v})} />
                         <ImageInput label="صورة المقارنة (بعد)" value={settings.comparisonAfterImg} onChange={(v:any) => setSettings({...settings, comparisonAfterImg: v})} />
                      </div>
                   </div>
                   <div className="section border-t border-white/5 pt-12 space-y-8">
                      <h3 className="text-xl font-black uppercase tracking-widest text-orange-500 border-b border-white/5 pb-4">بيانات التواصل</h3>
                      <BilingualInput label="اسم العلامة التجارية" valueAr={settings.brandName.ar} valueEn={settings.brandName.en} onChangeAr={(v:any) => setSettings({...settings, brandName: {...settings.brandName, ar: v}})} onChangeEn={(v:any) => setSettings({...settings, brandName: {...settings.brandName, en: v}})} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase">واتساب</label>
                            <input className="w-full bg-black border border-white/5 p-4 rounded-xl text-white outline-none focus:border-orange-500" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase">البريد الإلكتروني</label>
                            <input className="w-full bg-black border border-white/5 p-4 rounded-xl text-white outline-none focus:border-orange-500" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} />
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'products' && (
                <div className="space-y-12">
                   <button onClick={() => setProducts([...products, { id: Date.now().toString(), title: { ar: 'صنف جديد', en: 'New' }, desc: { ar: 'وصف المنتج هنا', en: 'Description' }, specs: { ar: ['الكربون: 85%'], en: ['Carbon: 85%'] }, icon: '🔥', images: ["https://images.unsplash.com/photo-1542366810-449e7769527d"], msg: { ar: 'استفسار', en: 'Inquiry' } }])} className="w-full py-12 border-4 border-dashed border-white/5 rounded-[4rem] text-slate-600 font-black hover:border-orange-500 hover:text-orange-500 transition-all uppercase text-xs">+ إضافة صنف جديد</button>
                   {products.map((p, idx) => (
                      <div key={p.id} className="bg-[#0a0a0a] p-12 rounded-[4rem] border border-white/5 space-y-10 shadow-2xl relative">
                         <button onClick={() => deleteItem(setProducts, p.id)} className="absolute top-8 left-8 text-rose-500 text-[10px] font-black uppercase px-6 py-2 bg-rose-500/10 rounded-xl">حذف</button>
                         <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                            <input value={p.icon} className="w-16 h-16 bg-black border border-white/10 rounded-2xl text-2xl text-center" onChange={e => updateArray(setProducts, idx, 'icon', e.target.value)} />
                            <h3 className="text-2xl font-black">{p.title.ar}</h3>
                         </div>
                         <BilingualInput label="اسم المنتج" valueAr={p.title.ar} valueEn={p.title.en} onChangeAr={(v:any) => updateArray(setProducts, idx, 'title', v, 'ar')} onChangeEn={(v:any) => updateArray(setProducts, idx, 'title', v, 'en')} />
                         <ImageInput label="رابط صورة المنتج" value={p.images[0]} onChange={(v:any) => updateArray(setProducts, idx, 'images', [v])} />
                         <BilingualInput label="الوصف" valueAr={p.desc.ar} valueEn={p.desc.en} onChangeAr={(v:any) => updateArray(setProducts, idx, 'desc', v, 'ar')} onChangeEn={(v:any) => updateArray(setProducts, idx, 'desc', v, 'en')} textarea />
                      </div>
                   ))}
                </div>
             )}

             {activeTab === 'gallery' && (
                <div className="space-y-12">
                   <button onClick={() => setGalleryItems([...galleryItems, { id: Date.now().toString(), title: { ar: 'صورة جديدة', en: 'New' }, category: { ar: 'المصنع', en: 'Factory' }, img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d' }])} className="w-full py-12 border-4 border-dashed border-white/5 rounded-[4rem] text-slate-600 font-black hover:border-blue-500 transition-all uppercase text-xs">+ إضافة صورة للمعرض</button>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {galleryItems.map((g, idx) => (
                         <div key={g.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-6 shadow-xl relative">
                            <button onClick={() => deleteItem(setGalleryItems, g.id)} className="absolute top-6 left-6 text-rose-500 text-[10px] font-black">حذف</button>
                            <ImageInput label="رابط الصورة" value={g.img} onChange={(v:any) => updateArray(setGalleryItems, idx, 'img', v)} />
                            <BilingualInput label="عنوان الصورة" valueAr={g.title.ar} valueEn={g.title.en} onChangeAr={(v:any) => updateArray(setGalleryItems, idx, 'title', v, 'ar')} onChangeEn={(v:any) => updateArray(setGalleryItems, idx, 'title', v, 'en')} />
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {activeTab === 'blog' && (
                <div className="space-y-12">
                   <button onClick={() => setArticles([...articles, { id: Date.now(), title: { ar: 'مقال جديد', en: 'New' }, excerpt: { ar: 'ملخص المقال', en: 'Summary' }, date: { ar: 'اليوم', en: 'Today' }, img: 'https://images.unsplash.com/photo-1599708153386-62e228308412', category: { ar: 'جودة', en: 'Quality' }, readTime: '5 min' }])} className="w-full py-12 border-4 border-dashed border-white/5 rounded-[4rem] text-slate-600 font-black hover:border-emerald-500 transition-all uppercase text-xs">+ إضافة مقال</button>
                   {articles.map((art, idx) => (
                      <div key={art.id} className="bg-[#0a0a0a] p-12 rounded-[4rem] border border-white/5 space-y-8 shadow-2xl relative">
                         <button onClick={() => deleteItem(setArticles, art.id)} className="absolute top-8 left-8 text-rose-500 text-[10px] font-black">حذف</button>
                         <ImageInput label="رابط الغلاف" value={art.img} onChange={(v:any) => updateArray(setArticles, idx, 'img', v)} />
                         <BilingualInput label="العنوان" valueAr={art.title.ar} valueEn={art.title.en} onChangeAr={(v:any) => updateArray(setArticles, idx, 'title', v, 'ar')} onChangeEn={(v:any) => updateArray(setArticles, idx, 'title', v, 'en')} />
                         <BilingualInput label="الملخص" valueAr={art.excerpt.ar} valueEn={art.excerpt.en} onChangeAr={(v:any) => updateArray(setArticles, idx, 'excerpt', v, 'ar')} onChangeEn={(v:any) => updateArray(setArticles, idx, 'excerpt', v, 'en')} textarea />
                      </div>
                   ))}
                </div>
             )}

             {activeTab === 'offers' && (
                <div className="space-y-12">
                   <button onClick={() => setOffers([...offers, { id: Date.now(), title: { ar: 'عرض جديد', en: 'New' }, discount: { ar: '10%', en: '10%' }, description: { ar: 'وصف العرض', en: 'Details' }, expiry: { ar: 'قريباً', en: 'Soon' }, type: { ar: 'فحم', en: 'Charcoal' }, isActive: true }])} className="w-full py-12 border-4 border-dashed border-white/5 rounded-[4rem] text-slate-600 font-black hover:border-orange-500 transition-all uppercase text-xs">+ إضافة عرض</button>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {offers.map((off, idx) => (
                         <div key={off.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-6 shadow-xl relative">
                            <button onClick={() => deleteItem(setOffers, off.id)} className="absolute top-6 left-6 text-rose-500 text-[10px] font-black">حذف</button>
                            <div className="flex gap-4">
                               <input value={off.discount.ar} className="w-24 bg-orange-500 text-black font-black p-3 rounded-xl text-center" onChange={e => updateArray(setOffers, idx, 'discount', e.target.value, 'ar')} />
                               <input value={off.title.ar} className="flex-grow bg-black border border-white/5 p-3 rounded-xl font-black" onChange={e => updateArray(setOffers, idx, 'title', e.target.value, 'ar')} />
                            </div>
                            <BilingualInput label="التفاصيل" valueAr={off.description.ar} valueEn={off.description.en} onChangeAr={(v:any) => updateArray(setOffers, idx, 'description', v, 'ar')} onChangeEn={(v:any) => updateArray(setOffers, idx, 'description', v, 'en')} textarea />
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {activeTab === 'testimonials' && (
                <div className="space-y-12">
                   <button onClick={() => setTestimonials([...testimonials, { id: Date.now().toString(), name: { ar: 'عميل جديد', en: 'New' }, role: { ar: 'منصب', en: 'Role' }, content: { ar: 'التعليق', en: 'Comment' }, avatar: 'https://i.pravatar.cc/150' }])} className="w-full py-12 border-4 border-dashed border-white/5 rounded-[4rem] text-slate-600 font-black hover:border-emerald-500 transition-all uppercase text-xs">+ إضافة رأي</button>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {testimonials.map((t, idx) => (
                         <div key={t.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-6 shadow-xl relative">
                            <button onClick={() => deleteItem(setTestimonials, t.id)} className="absolute top-6 left-6 text-rose-500 text-[10px] font-black">حذف</button>
                            <ImageInput label="الصورة الشخصية" value={t.avatar} onChange={(v:any) => updateArray(setTestimonials, idx, 'avatar', v)} />
                            <BilingualInput label="الاسم" valueAr={t.name.ar} valueEn={t.name.en} onChangeAr={(v:any) => updateArray(setTestimonials, idx, 'name', v, 'ar')} onChangeEn={(v:any) => updateArray(setTestimonials, idx, 'name', v, 'en')} />
                            <BilingualInput label="الرأي" valueAr={t.content.ar} valueEn={t.content.en} onChangeAr={(v:any) => updateArray(setTestimonials, idx, 'content', v, 'ar')} onChangeEn={(v:any) => updateArray(setTestimonials, idx, 'content', v, 'en')} textarea />
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {activeTab === 'stats' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                   {stats.map((s, idx) => (
                      <div key={s.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 text-center space-y-6 shadow-xl">
                         <input value={s.icon} className="w-16 h-16 bg-black border border-white/10 rounded-full text-3xl text-center mx-auto" onChange={e => updateArray(setStats, idx, 'icon', e.target.value)} />
                         <input value={s.value} className="w-full bg-black border border-white/5 p-4 rounded-xl text-4xl font-black text-orange-500 text-center outline-none" onChange={e => updateArray(setStats, idx, 'value', e.target.value)} />
                         <BilingualInput label="الوصف" valueAr={s.label.ar} valueEn={s.label.en} onChangeAr={(v:any) => updateArray(setStats, idx, 'label', v, 'ar')} onChangeEn={(v:any) => updateArray(setStats, idx, 'label', v, 'en')} />
                      </div>
                   ))}
                </div>
             )}

             {activeTab === 'certs' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {certs.map((c, idx) => (
                      <div key={c.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 space-y-6 shadow-xl text-center group">
                         <button onClick={() => deleteItem(setCerts, c.id)} className="text-rose-500 text-[10px] font-black uppercase opacity-20 group-hover:opacity-100 transition-all mb-2">حذف</button>
                         <ImageInput label="شعار الشهادة" value={c.img} onChange={(v:any) => updateArray(setCerts, idx, 'img', v)} />
                         <input value={c.name} className="w-full bg-black border border-white/5 p-3 rounded-xl text-center text-xs font-black" onChange={e => updateArray(setCerts, idx, 'name', e.target.value)} />
                      </div>
                   ))}
                   <button onClick={() => setCerts([...certs, { id: Date.now().toString(), name: 'ISO', img: 'https://cdn-icons-png.flaticon.com/512/8146/8146761.png' }])} className="p-12 border-4 border-dashed border-white/5 rounded-[3rem] text-slate-700 font-black hover:border-orange-500 transition-all uppercase text-[10px]">+ إضافة شهادة</button>
                </div>
             )}

             {activeTab === 'database' && (
                <div className="bg-[#0a0a0a] p-24 rounded-[5rem] border border-white/5 text-center space-y-12 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full"></div>
                   <div className="w-40 h-40 bg-orange-500/10 text-orange-500 flex items-center justify-center text-8xl rounded-[3.5rem] mx-auto mb-6 shadow-2xl relative z-10">💾</div>
                   <h2 className="text-5xl font-black uppercase tracking-tighter relative z-10 leading-tight">مركز مزامنة البيانات</h2>
                   <p className="text-slate-400 max-w-2xl mx-auto text-xl font-light italic relative z-10">
                     يتم حفظ كافة التعديلات في الوقت الفعلي. تأكد من استخدام روابط صور مباشرة (Direct Links) لضمان سرعة تحميل الموقع.
                   </p>
                   <div className="flex flex-col sm:flex-row justify-center gap-8 pt-12 relative z-10">
                      <button onClick={() => {
                        if(window.confirm('هل أنت متأكد من تصفير كافة البيانات وإرجاعها لحالتها الأصلية؟')) { localStorage.clear(); window.location.reload(); }
                      }} className="px-16 py-7 border-2 border-rose-500/20 text-rose-500 rounded-3xl font-black hover:bg-rose-500 hover:text-white transition-all uppercase text-[11px] tracking-widest">تصفير قاعدة البيانات</button>
                   </div>
                </div>
             )}

          </div>
        </div>
      </main>
    </div>
  );
};

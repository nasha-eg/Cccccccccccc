
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
    else alert("كلمة المرور غير صحيحة. يرجى إدخال 1997.");
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
    if(window.confirm('هل أنت متأكد؟ سيتم الحذف فوراً.')) {
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

  const handleSpecUpdate = (pIdx: number, sIdx: number, value: string, lang: 'ar' | 'en') => {
    setProducts(prev => {
      const newList = [...prev];
      const newSpecs = [...newList[pIdx].specs[lang]];
      newSpecs[sIdx] = value;
      newList[pIdx].specs = { ...newList[pIdx].specs, [lang]: newSpecs };
      return newList;
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 font-cairo" dir="rtl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,orange_0%,transparent_70%)]"></div>
        <form onSubmit={handleLogin} className="w-full max-w-md bg-[#0a0a0a] border border-orange-500/20 p-12 text-center rounded-[3rem] shadow-2xl relative z-10 backdrop-blur-3xl">
           <div className="w-20 h-20 dynamic-bg text-black flex items-center justify-center text-3xl font-black rounded-3xl mx-auto mb-8 shadow-2xl">A</div>
           <h2 className="text-2xl font-black text-white mb-2 tracking-tighter">بوابة العاصمة الذكية</h2>
           <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-10">Protected Administration Console</p>
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
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-80 bg-black border-l border-white/5 flex flex-col p-8 h-screen sticky top-0 overflow-y-auto z-50">
        <div className="mb-12 flex items-center gap-4">
          <div className="w-10 h-10 dynamic-bg text-black flex items-center justify-center text-lg rounded-xl font-black">A</div>
          <div>
            <span className="font-black text-xs block leading-none">AL-ASIMH</span>
            <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Global CMS v8.0</span>
          </div>
        </div>
        
        <nav className="flex-grow space-y-1">
          {[
            { id: 'general', label: 'الضبط العام', icon: '⚙️' },
            { id: 'design', label: 'الهوية البصرية', icon: '🎨' },
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
              className={`w-full text-right px-6 py-4 rounded-xl text-[10px] font-black uppercase flex items-center gap-4 transition-all ${activeTab === tab.id ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
            >
              <span className="text-base">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>
        
        <button onClick={onLogout} className="mt-10 py-4 text-rose-500 text-[9px] font-black uppercase border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all">خروج آمن</button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8 lg:p-16 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
             <div>
               <h1 className="text-4xl font-black text-white tracking-tighter capitalize">{activeTab} Section</h1>
               <p className="text-slate-500 text-xs mt-2">أنت الآن تقوم بتعديل بيانات العاصمة بشكل مباشر</p>
             </div>
             <div className="flex gap-3">
               <button onClick={() => window.location.hash = ''} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[9px] uppercase hover:bg-white/10 transition-all">معاينة</button>
               <button onClick={() => alert('تم الحفظ بنجاح!')} className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[9px] uppercase shadow-xl hover:scale-105 transition-all">تثبيت التغييرات</button>
             </div>
          </header>

          {/* TAB: GENERAL */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h3 className="text-orange-500 font-black text-[10px] tracking-widest uppercase mb-4">التواصل</h3>
                  <div className="space-y-4">
                    <label className="text-[9px] text-slate-500 uppercase font-black block mb-2">رقم واتساب التصدير</label>
                    <input type="text" value={settings.whatsapp} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('whatsapp', e.target.value)} />
                    <label className="text-[9px] text-slate-500 uppercase font-black block mb-2">البريد الرسمي</label>
                    <input type="text" value={settings.email} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('email', e.target.value)} />
                  </div>
               </div>
               <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h3 className="text-orange-500 font-black text-[10px] tracking-widest uppercase mb-4">الفيديو والصورة الرئيسية</h3>
                  <div className="space-y-4">
                    <label className="text-[9px] text-slate-500 uppercase font-black block mb-2">رابط يوتيوب (Embed)</label>
                    <input type="text" value={settings.videoUrlHero} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('videoUrlHero', e.target.value)} />
                    <label className="text-[9px] text-slate-500 uppercase font-black block mb-2">رابط صورة الخلفية (Hero)</label>
                    <input type="text" value={settings.heroBg} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('heroBg', e.target.value)} />
                  </div>
               </div>
            </div>
          )}

          {/* TAB: DESIGN (IDENTITY) */}
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
                  <label className="text-[9px] text-slate-500 uppercase font-black block mb-2">رابط اللوجو</label>
                  <input type="text" value={settings.logoUrl} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('logoUrl', e.target.value)} />
               </div>
               <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h3 className="text-orange-500 font-black text-[10px] tracking-widest uppercase mb-6">نصوص البراند</h3>
                  <label className="text-[9px] text-slate-500 uppercase font-black block mb-2">اسم الشركة (عربي)</label>
                  <input type="text" value={settings.brandName.ar} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none" onChange={e => updateNestedSetting('brandName', 'ar', e.target.value)} />
                  <label className="text-[9px] text-slate-500 uppercase font-black block mb-2">الشعار النصي (AR)</label>
                  <input type="text" value={settings.tagline.ar} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none" onChange={e => updateNestedSetting('tagline', 'ar', e.target.value)} />
               </div>
            </div>
          )}

          {/* TAB: PRODUCTS */}
          {activeTab === 'products' && (
             <div className="space-y-8">
                <button onClick={() => addItem(setProducts, { title: { ar: 'صنف جديد', en: 'New Grade' }, desc: { ar: 'وصف المنتج هنا...', en: 'Desc here...' }, specs: { ar: ['الكربون: 85%'], en: ['Carbon: 85%'] }, icon: '🔥', img: 'https://images.unsplash.com/photo-1542366810-449e7769527d', msg: { ar: 'استفسار عن الصنف', en: 'Inquiry' } })} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[3rem] text-slate-500 font-black hover:border-orange-500 transition-all">+ إضافة منتج تصدير جديد</button>
                {products.map((p, pIdx) => (
                  <div key={p.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5">
                     <div className="flex flex-col md:flex-row gap-10">
                        <div className="w-full md:w-1/3">
                           <img src={p.img} className="w-full aspect-square object-cover rounded-[2rem] border border-white/10 mb-4" />
                           <input value={p.img} placeholder="رابط الصورة" className="w-full bg-black border border-white/10 p-3 rounded-xl text-[9px]" onChange={e => handleArrayUpdate(setProducts, pIdx, 'img', e.target.value)} />
                        </div>
                        <div className="flex-grow space-y-4">
                           <div className="flex justify-between items-center">
                              <input value={p.title.ar} className="bg-transparent text-2xl font-black outline-none focus:text-orange-500" onChange={e => handleArrayUpdate(setProducts, pIdx, 'title', e.target.value, 'ar')} />
                              <button onClick={() => deleteItem(setProducts, p.id)} className="text-rose-500 text-[10px] font-black uppercase">حذف</button>
                           </div>
                           <textarea value={p.desc.ar} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs h-24" onChange={e => handleArrayUpdate(setProducts, pIdx, 'desc', e.target.value, 'ar')} />
                           <div className="space-y-2">
                              <p className="text-[9px] text-orange-500 font-black uppercase tracking-widest">المواصفات الفنية</p>
                              <div className="grid grid-cols-2 gap-3">
                                 {p.specs.ar.map((s, sIdx) => (
                                    <input key={sIdx} value={s} className="w-full bg-white/5 border border-white/5 p-3 rounded-xl text-[10px]" onChange={e => handleSpecUpdate(pIdx, sIdx, e.target.value, 'ar')} />
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          )}

          {/* TAB: GALLERY */}
          {activeTab === 'gallery' && (
             <div className="space-y-8">
                <button onClick={() => addItem(setGalleryItems, { title: { ar: 'مشهد جديد', en: 'New View' }, category: { ar: 'المصنع', en: 'Factory' }, img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d' })} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black hover:border-orange-500 transition-all">+ إضافة صورة للمعرض</button>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                   {galleryItems.map((g, idx) => (
                     <div key={g.id} className="relative group aspect-square rounded-[2rem] overflow-hidden border border-white/5">
                        <img src={g.img} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-all p-6 flex flex-col justify-between">
                           <input value={g.title.ar} className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-[10px]" onChange={e => handleArrayUpdate(setGalleryItems, idx, 'title', e.target.value, 'ar')} />
                           <input value={g.img} className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-[8px]" onChange={e => handleArrayUpdate(setGalleryItems, idx, 'img', e.target.value)} />
                           <button onClick={() => deleteItem(setGalleryItems, g.id)} className="bg-rose-500 py-2 rounded-lg text-[9px] font-black">حذف</button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          )}

          {/* TAB: OFFERS */}
          {activeTab === 'offers' && (
             <div className="space-y-6">
                <button onClick={() => addItem(setOffers, { title: { ar: 'عنوان العرض', en: 'New Offer' }, discount: { ar: '10%', en: '10%' }, description: { ar: 'وصف العرض...', en: 'Desc...' }, expiry: { ar: 'قريباً', en: 'Soon' }, type: { ar: 'فحم', en: 'Charcoal' }, isActive: true })} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black hover:border-orange-500 transition-all">+ عرض جديد</button>
                {offers.map((o, idx) => (
                  <div key={o.id} className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5">
                     <div className="flex justify-between items-center mb-6">
                        <input value={o.title.ar} className="bg-transparent text-xl font-black outline-none" onChange={e => handleArrayUpdate(setOffers, idx, 'title', e.target.value, 'ar')} />
                        <div className="flex items-center gap-3">
                           <input type="checkbox" checked={o.isActive} onChange={e => handleArrayUpdate(setOffers, idx, 'isActive', e.target.checked)} className="accent-orange-500" />
                           <button onClick={() => deleteItem(setOffers, o.id)} className="text-rose-500 text-[10px] font-black">حذف</button>
                        </div>
                     </div>
                     <div className="grid grid-cols-3 gap-4">
                        <input value={o.discount.ar} placeholder="الخصم" className="bg-black border border-white/10 p-3 rounded-xl text-xs" onChange={e => handleArrayUpdate(setOffers, idx, 'discount', e.target.value, 'ar')} />
                        <input value={o.expiry.ar} placeholder="الصلاحية" className="bg-black border border-white/10 p-3 rounded-xl text-xs" onChange={e => handleArrayUpdate(setOffers, idx, 'expiry', e.target.value, 'ar')} />
                        <input value={o.type.ar} placeholder="النوع" className="bg-black border border-white/10 p-3 rounded-xl text-xs" onChange={e => handleArrayUpdate(setOffers, idx, 'type', e.target.value, 'ar')} />
                     </div>
                  </div>
                ))}
             </div>
          )}

          {/* TAB: BLOG */}
          {activeTab === 'blog' && (
             <div className="space-y-8">
                <button onClick={() => addItem(setArticles, { title: { ar: 'عنوان المقال', en: 'New' }, excerpt: { ar: 'مقدمة...', en: 'Excerpt...' }, date: { ar: 'اليوم', en: 'Today' }, img: 'https://images.unsplash.com/photo-1599708153386-62e228308412', category: { ar: 'أخبار', en: 'News' }, readTime: '5 min' })} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black hover:border-orange-500 transition-all">+ إضافة مقال</button>
                {articles.map((a, idx) => (
                  <div key={a.id} className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 flex gap-8">
                     <img src={a.img} className="w-32 h-32 object-cover rounded-2xl" />
                     <div className="flex-grow space-y-3">
                        <div className="flex justify-between">
                           <input value={a.title.ar} className="bg-transparent font-black w-full" onChange={e => handleArrayUpdate(setArticles, idx, 'title', e.target.value, 'ar')} />
                           <button onClick={() => deleteItem(setArticles, a.id)} className="text-rose-500 text-[10px]">حذف</button>
                        </div>
                        <textarea value={a.excerpt.ar} className="w-full bg-black border border-white/10 p-3 rounded-xl text-[10px] h-16" onChange={e => handleArrayUpdate(setArticles, idx, 'excerpt', e.target.value, 'ar')} />
                        <input value={a.img} className="w-full bg-black border border-white/10 p-2 rounded-lg text-[8px]" onChange={e => handleArrayUpdate(setArticles, idx, 'img', e.target.value)} />
                     </div>
                  </div>
                ))}
             </div>
          )}

          {/* TAB: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((t, idx) => (
                  <div key={t.id} className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5">
                     <div className="flex items-center gap-4 mb-6">
                        <img src={t.avatar} className="w-12 h-12 rounded-full" />
                        <div className="flex-grow">
                           <input value={t.name.ar} className="bg-transparent font-black block w-full text-xs" onChange={e => handleArrayUpdate(setTestimonials, idx, 'name', e.target.value, 'ar')} />
                           <input value={t.role.ar} className="bg-transparent text-[10px] text-orange-500" onChange={e => handleArrayUpdate(setTestimonials, idx, 'role', e.target.value, 'ar')} />
                        </div>
                        <button onClick={() => deleteItem(setTestimonials, t.id)} className="text-rose-500 text-[9px]">حذف</button>
                     </div>
                     <textarea value={t.content.ar} className="w-full bg-black border border-white/10 p-4 rounded-xl text-[11px] h-24 italic" onChange={e => handleArrayUpdate(setTestimonials, idx, 'content', e.target.value, 'ar')} />
                  </div>
                ))}
                <button onClick={() => addItem(setTestimonials, { name: { ar: 'عميل جديد', en: 'New' }, role: { ar: 'مستورد', en: 'Importer' }, content: { ar: 'رأي العميل...', en: 'Review...' }, avatar: 'https://i.pravatar.cc/150' })} className="border-2 border-dashed border-white/10 rounded-[2.5rem] p-8 text-slate-500 font-black">+ إضافة رأي</button>
             </div>
          )}

          {/* TAB: CERTS */}
          {activeTab === 'certs' && (
             <div className="grid grid-cols-3 gap-6">
                {certs.map((c, idx) => (
                   <div key={c.id} className="bg-[#0a0a0a] p-6 rounded-3xl border border-white/5 text-center">
                      <img src={c.img} className="h-16 mx-auto mb-4 grayscale" />
                      <input value={c.name} className="w-full bg-black border border-white/10 p-2 rounded-lg text-[10px] text-center mb-2" onChange={e => handleArrayUpdate(setCerts, idx, 'name', e.target.value)} />
                      <input value={c.img} className="w-full bg-black border border-white/10 p-2 rounded-lg text-[8px] text-center" onChange={e => handleArrayUpdate(setCerts, idx, 'img', e.target.value)} />
                      <button onClick={() => deleteItem(setCerts, c.id)} className="text-rose-500 text-[9px] mt-2">حذف</button>
                   </div>
                ))}
                <button onClick={() => addItem(setCerts, { name: 'New Cert', img: 'https://cdn-icons-png.flaticon.com/512/8146/8146761.png' })} className="border-2 border-dashed border-white/10 rounded-3xl p-6 text-slate-500 font-black">+ شهادة</button>
             </div>
          )}

          {/* TAB: STATS */}
          {activeTab === 'stats' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((s, idx) => (
                   <div key={s.id} className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 flex gap-6 items-center">
                      <input value={s.icon} className="w-16 h-16 bg-black border border-white/10 rounded-2xl text-2xl text-center" onChange={e => handleArrayUpdate(setStats, idx, 'icon', e.target.value)} />
                      <div className="flex-grow space-y-2">
                         <input value={s.value} className="w-full bg-black border border-white/10 p-2 rounded-xl text-lg font-black text-orange-500" onChange={e => handleArrayUpdate(setStats, idx, 'value', e.target.value)} />
                         <input value={s.label.ar} className="w-full bg-black border border-white/10 p-2 rounded-xl text-[10px]" onChange={e => handleArrayUpdate(setStats, idx, 'label', e.target.value, 'ar')} />
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

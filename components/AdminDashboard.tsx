
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
    if (password === '1997') {
      setIsLoggedIn(true);
    } else {
      alert("كلمة المرور غير صحيحة!");
    }
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
    if(window.confirm('هل أنت متأكد من الحذف؟')) {
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

  // Specialized specs editor for products
  const handleSpecUpdate = (prodIdx: number, specIdx: number, value: string, lang: 'ar' | 'en') => {
    setProducts(prev => {
      const newList = [...prev];
      newList[prodIdx].specs[lang][specIdx] = value;
      return newList;
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 font-cairo" dir="rtl">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,orange_0%,transparent_70%)]"></div>
        <form onSubmit={handleLogin} className="w-full max-w-md bg-[#0a0a0a] border border-orange-500/20 p-12 text-center rounded-[3rem] shadow-2xl relative z-10 backdrop-blur-xl">
           <div className="w-20 h-20 dynamic-bg text-black flex items-center justify-center text-3xl font-black rounded-[2rem] mx-auto mb-8 shadow-[0_0_30px_rgba(245,158,11,0.3)]">A</div>
           <h2 className="text-2xl font-black text-white mb-2 tracking-tighter">نظام إدارة العاصمة</h2>
           <p className="text-slate-500 text-xs mb-10">يرجى إدخال كلمة المرور للمتابعة</p>
           <input 
              type="password" 
              placeholder="كلمة المرور (1997)" 
              className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white mb-8 outline-none focus:border-orange-500 text-center text-2xl tracking-[0.5em] transition-all" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
           />
           <button type="submit" className="w-full py-5 dynamic-bg text-black font-black rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest">فتح النظام</button>
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
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Enterprise CMS v5.0</span>
          </div>
        </div>
        
        <nav className="flex-grow space-y-1.5">
          {[
            { id: 'general', label: 'الإعدادات العامة', icon: '⚙️' },
            { id: 'design', label: 'الهوية والألوان', icon: '🎨' },
            { id: 'products', label: 'إدارة المنتجات', icon: '📦' },
            { id: 'offers', label: 'العروض الترويجية', icon: '🏷️' },
            { id: 'blog', label: 'المدونة والمقالات', icon: '📝' },
            { id: 'gallery', label: 'معرض الصور', icon: '🖼️' },
            { id: 'testimonials', label: 'آراء العملاء', icon: '💬' },
            { id: 'stats', label: 'أرقام النجاح', icon: '📈' },
            { id: 'certs', label: 'شهادات الجودة', icon: '📜' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`w-full text-right px-6 py-4 rounded-2xl text-[10px] font-black uppercase flex items-center gap-4 transition-all ${activeTab === tab.id ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20 scale-[1.02]' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
            >
              <span className="text-base">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>
        
        <div className="mt-10 pt-8 border-t border-white/5">
          <button onClick={onLogout} className="w-full py-4 text-rose-500 text-[9px] font-black uppercase border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all">تسجيل الخروج</button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-grow p-8 lg:p-16">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
             <div>
               <h1 className="text-4xl font-black text-white tracking-tighter">
                 {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} <span className="text-orange-500">Editor</span>
               </h1>
               <p className="text-slate-500 text-xs mt-2">قم بتحديث بيانات موقع العاصمة بشكل حي وفوري</p>
             </div>
             <div className="flex gap-3">
               <button onClick={() => window.location.hash = ''} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[9px] uppercase hover:bg-white/10 transition-all">معاينة الموقع</button>
               <button onClick={() => alert('تم الحفظ تلقائياً في ذاكرة المتصفح')} className="bg-orange-500 text-black px-8 py-4 rounded-2xl font-black text-[9px] uppercase shadow-xl hover:scale-105 transition-all">حفظ البيانات</button>
             </div>
          </header>

          {/* Tab Content: General */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h3 className="text-orange-500 font-black text-xs uppercase tracking-widest mb-4">بيانات الاتصال</h3>
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[9px] text-slate-500 font-black uppercase mb-2 block">رقم الواتساب (بدون +)</label>
                      <input type="text" value={settings.whatsapp} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('whatsapp', e.target.value)} />
                    </div>
                    <div className="group">
                      <label className="text-[9px] text-slate-500 font-black uppercase mb-2 block">رقم الهاتف الرسمي</label>
                      <input type="text" value={settings.phone} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('phone', e.target.value)} />
                    </div>
                    <div className="group">
                      <label className="text-[9px] text-slate-500 font-black uppercase mb-2 block">البريد الإلكتروني</label>
                      <input type="text" value={settings.email} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('email', e.target.value)} />
                    </div>
                  </div>
               </div>
               <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h3 className="text-orange-500 font-black text-xs uppercase tracking-widest mb-4">الـ SEO والوسائط</h3>
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[9px] text-slate-500 font-black uppercase mb-2 block">عنوان المتصفح (SEO Title)</label>
                      <input type="text" value={settings.seoTitle} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('seoTitle', e.target.value)} />
                    </div>
                    <div className="group">
                      <label className="text-[9px] text-slate-500 font-black uppercase mb-2 block">رابط فيديو اليوتيوب الرئيسي</label>
                      <input type="text" value={settings.videoUrlHero} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('videoUrlHero', e.target.value)} />
                    </div>
                    <div className="group">
                      <label className="text-[9px] text-slate-500 font-black uppercase mb-2 block">رابط صورة الهيرو (Hero BG)</label>
                      <input type="text" value={settings.heroBg} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('heroBg', e.target.value)} />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* Tab Content: Identity & Design */}
          {activeTab === 'design' && (
             <div className="space-y-8">
               <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5">
                  <h3 className="text-orange-500 font-black text-xs uppercase tracking-widest mb-8">الهوية البصرية والألوان</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <div className="flex items-center gap-6">
                          <img src={settings.logoUrl} className="w-20 h-20 bg-white p-3 rounded-2xl object-contain border border-white/10" />
                          <div className="flex-grow">
                             <label className="text-[9px] text-slate-500 font-black uppercase mb-2 block">رابط اللوجو</label>
                             <input type="text" value={settings.logoUrl} className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs" onChange={e => updateSetting('logoUrl', e.target.value)} />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] text-slate-500 font-black uppercase mb-2 block">اللون الأساسي</label>
                            <input type="color" value={settings.primaryColor} className="w-full h-12 bg-black border border-white/10 p-1 rounded-xl cursor-pointer" onChange={e => updateSetting('primaryColor', e.target.value)} />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-500 font-black uppercase mb-2 block">اللون الثانوي</label>
                            <input type="color" value={settings.accentColor} className="w-full h-12 bg-black border border-white/10 p-1 rounded-xl cursor-pointer" onChange={e => updateSetting('accentColor', e.target.value)} />
                          </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="space-y-4">
                          <label className="text-[9px] text-slate-500 font-black uppercase block">اسم البراند (عربي / EN)</label>
                          <input type="text" value={settings.brandName.ar} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" placeholder="العاصمة" onChange={e => updateNestedSetting('brandName', 'ar', e.target.value)} />
                          <input type="text" value={settings.brandName.en} className="w-full bg-black border border-white/10 p-4 rounded-xl text-sm" placeholder="Al-Asimh" onChange={e => updateNestedSetting('brandName', 'en', e.target.value)} />
                       </div>
                    </div>
                  </div>
               </div>
               
               <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h3 className="text-orange-500 font-black text-xs uppercase tracking-widest mb-4">النصوص التعريفية (Tagline & Address)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[9px] text-slate-500 font-black uppercase">الشعار النصي (AR)</label>
                        <textarea value={settings.tagline.ar} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs h-24" onChange={e => updateNestedSetting('tagline', 'ar', e.target.value)} />
                        <label className="text-[9px] text-slate-500 font-black uppercase">Tagline (EN)</label>
                        <textarea value={settings.tagline.en} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs h-24" onChange={e => updateNestedSetting('tagline', 'en', e.target.value)} />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[9px] text-slate-500 font-black uppercase">العنوان (AR)</label>
                        <textarea value={settings.address.ar} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs h-24" onChange={e => updateNestedSetting('address', 'ar', e.target.value)} />
                        <label className="text-[9px] text-slate-500 font-black uppercase">Address (EN)</label>
                        <textarea value={settings.address.en} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs h-24" onChange={e => updateNestedSetting('address', 'en', e.target.value)} />
                     </div>
                  </div>
               </div>
             </div>
          )}

          {/* Tab Content: Products */}
          {activeTab === 'products' && (
            <div className="space-y-8">
               <button onClick={() => addItem(setProducts, { title: { ar: 'صنف جديد', en: 'New Grade' }, desc: { ar: '', en: '' }, specs: { ar: ['الكربون: 80%', 'الرماد: 2%'], en: ['Carbon: 80%', 'Ash: 2%'] }, icon: '🔥', img: 'https://images.unsplash.com/photo-1542366810-449e7769527d', msg: { ar: 'استفسار عن الصنف الجديد', en: 'Inquiry' } })} className="w-full py-12 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black hover:border-orange-500/50 hover:text-white transition-all">+ إضافة صنف فحم جديد</button>
               <div className="space-y-12">
                  {products.map((p, pIdx) => (
                    <div key={p.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                       <div className="flex flex-col md:flex-row gap-10">
                          <div className="w-full md:w-1/3">
                             <img src={p.img} className="w-full aspect-square object-cover rounded-[2rem] border border-white/10 mb-4" />
                             <input value={p.img} className="w-full bg-black border border-white/10 p-2 rounded-lg text-[9px] text-slate-500" onChange={e => handleArrayUpdate(setProducts, pIdx, 'img', e.target.value)} />
                          </div>
                          <div className="flex-grow space-y-6">
                             <div className="flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                   <input value={p.icon} className="w-12 bg-black border border-white/10 p-2 rounded-lg text-xl text-center" onChange={e => handleArrayUpdate(setProducts, pIdx, 'icon', e.target.value)} />
                                   <input value={p.title.ar} className="bg-transparent text-2xl font-black outline-none focus:text-orange-500" onChange={e => handleArrayUpdate(setProducts, pIdx, 'title', e.target.value, 'ar')} />
                                </div>
                                <button onClick={() => deleteItem(setProducts, p.id)} className="text-rose-500 font-black text-[10px] uppercase">حذف</button>
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <textarea value={p.desc.ar} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs h-24" placeholder="الوصف بالعربي" onChange={e => handleArrayUpdate(setProducts, pIdx, 'desc', e.target.value, 'ar')} />
                                <textarea value={p.desc.en} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs h-24" placeholder="Description (EN)" onChange={e => handleArrayUpdate(setProducts, pIdx, 'desc', e.target.value, 'en')} />
                             </div>

                             <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest">المواصفات الفنية</h4>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                      {p.specs.ar.map((s, sIdx) => (
                                         <input key={sIdx} value={s} className="w-full bg-white/5 border border-white/5 p-2 rounded-lg text-[10px]" onChange={e => handleSpecUpdate(pIdx, sIdx, e.target.value, 'ar')} />
                                      ))}
                                   </div>
                                   <div className="space-y-2">
                                      {p.specs.en.map((s, sIdx) => (
                                         <input key={sIdx} value={s} className="w-full bg-white/5 border border-white/5 p-2 rounded-lg text-[10px]" onChange={e => handleSpecUpdate(pIdx, sIdx, e.target.value, 'en')} />
                                      ))}
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Tab Content: Gallery */}
          {activeTab === 'gallery' && (
             <div className="space-y-10">
                <button onClick={() => addItem(setGalleryItems, { title: { ar: 'مشهد جديد', en: '' }, category: { ar: 'المصنع', en: 'Factory' }, img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d' })} className="w-full py-12 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black">+ إضافة مشهد حي للمصنع</button>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                   {galleryItems.map((g, idx) => (
                     <div key={g.id} className="relative aspect-square rounded-[2rem] overflow-hidden group border border-white/5">
                        <img src={g.img} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-all p-6 flex flex-col justify-between backdrop-blur-sm">
                           <div className="space-y-3">
                              <label className="text-[8px] text-slate-500 uppercase font-black">العنوان (AR)</label>
                              <input value={g.title.ar} className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-[10px]" onChange={e => handleArrayUpdate(setGalleryItems, idx, 'title', e.target.value, 'ar')} />
                              <label className="text-[8px] text-slate-500 uppercase font-black">رابط الصورة</label>
                              <input value={g.img} className="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-[9px]" onChange={e => handleArrayUpdate(setGalleryItems, idx, 'img', e.target.value)} />
                           </div>
                           <button onClick={() => deleteItem(setGalleryItems, g.id)} className="w-full py-2 bg-rose-500 text-white rounded-lg text-[10px] font-black uppercase">حذف</button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          )}

          {/* Tab Content: Stats */}
          {activeTab === 'stats' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((s, idx) => (
                   <div key={s.id} className="bg-[#0a0a0a] p-8 rounded-3xl border border-white/5 flex gap-6 items-center">
                      <input value={s.icon} className="w-16 h-16 bg-black border border-white/10 rounded-2xl text-2xl text-center" onChange={e => handleArrayUpdate(setStats, idx, 'icon', e.target.value)} />
                      <div className="flex-grow space-y-3">
                         <div className="flex gap-4">
                            <input value={s.value} className="w-1/3 bg-black border border-white/10 p-2 rounded-xl text-lg font-black text-orange-500 text-center" onChange={e => handleArrayUpdate(setStats, idx, 'value', e.target.value)} />
                            <div className="flex-grow space-y-2">
                               <input value={s.label.ar} className="w-full bg-black border border-white/10 p-2 rounded-lg text-xs" placeholder="النص عربي" onChange={e => handleArrayUpdate(setStats, idx, 'label', e.target.value, 'ar')} />
                               <input value={s.label.en} className="w-full bg-black border border-white/10 p-2 rounded-lg text-xs" placeholder="Label English" onChange={e => handleArrayUpdate(setStats, idx, 'label', e.target.value, 'en')} />
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          )}

          {/* Simple Pattern for other sections... */}
          {(['offers', 'blog', 'testimonials', 'certs']).includes(activeTab) && (
            <div className="text-center py-20 bg-[#0a0a0a] rounded-[3rem] border border-white/5">
               <span className="text-4xl mb-6 block">⚙️</span>
               <h3 className="text-xl font-black text-white">يتم الآن تجهيز واجهة {activeTab} المتطورة</h3>
               <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">سيتم إضافة محرر النصوص والوسائط لهذا القسم في التحديث القادم لضمان تجربة مستخدم مثالية.</p>
               <button onClick={() => setActiveTab('general')} className="mt-8 px-8 py-3 bg-orange-500 text-black rounded-xl font-black text-xs uppercase">العودة للرئيسية</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

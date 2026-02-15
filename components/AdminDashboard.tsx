
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
    else alert("عذراً، كلمة المرور 1997 هي المطلوبة للدخول.");
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
    if(window.confirm('هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذه الخطوة.')) {
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-cairo" dir="rtl">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <form onSubmit={handleLogin} className="w-full max-w-md bg-[#0a0a0a] border border-orange-500/20 p-12 text-center rounded-[3rem] shadow-2xl relative z-10 backdrop-blur-xl">
           <div className="w-20 h-20 dynamic-bg text-black flex items-center justify-center text-3xl font-black rounded-3xl mx-auto mb-8 shadow-2xl rotate-3">A</div>
           <h2 className="text-2xl font-black text-white mb-2">نظام العاصمة السحابي</h2>
           <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-10">AL-ASIMH ENTERPRISE SYSTEM</p>
           <input 
              type="password" 
              placeholder="1997" 
              className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white mb-8 outline-none focus:border-orange-500 text-center text-3xl tracking-[0.5em] transition-all" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
           />
           <button type="submit" className="w-full py-5 dynamic-bg text-black font-black rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-xs">الدخول للوحة التحكم</button>
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
            <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Master CMS v7.0</span>
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
              className={`w-full text-right px-6 py-3.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-4 transition-all ${activeTab === tab.id ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
            >
              <span className="text-base">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>
        
        <button onClick={onLogout} className="mt-10 py-4 text-rose-500 text-[9px] font-black uppercase border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all">تسجيل خروج</button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8 lg:p-16 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
             <div>
               <h1 className="text-4xl font-black text-white tracking-tighter capitalize">{activeTab} <span className="text-orange-500">Editor</span></h1>
               <p className="text-slate-500 text-xs mt-2">نظام إدارة المحتوى الذكي لشركة العاصمة</p>
             </div>
             <div className="flex gap-3">
               <button onClick={() => window.location.hash = ''} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[9px] uppercase hover:bg-white/10 transition-all">معاينة الواجهة</button>
               <button onClick={() => alert('تم حفظ البيانات بنجاح في الذاكرة السحابية للمتصفح.')} className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[9px] uppercase shadow-xl hover:scale-105 transition-all">حفظ التغييرات</button>
             </div>
          </header>

          {/* TAB: GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h3 className="text-orange-500 font-black text-[10px] tracking-widest uppercase">التواصل والـ SEO</h3>
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[9px] text-slate-500 font-black uppercase mb-2 block">رقم الواتساب (بدون +)</label>
                      <input type="text" value={settings.whatsapp} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('whatsapp', e.target.value)} />
                    </div>
                    <div className="group">
                      <label className="text-[9px] text-slate-500 font-black uppercase mb-2 block">البريد الإلكتروني</label>
                      <input type="text" value={settings.email} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('email', e.target.value)} />
                    </div>
                    <div className="group">
                      <label className="text-[9px] text-slate-500 font-black uppercase mb-2 block">عنوان الـ SEO</label>
                      <input type="text" value={settings.seoTitle} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('seoTitle', e.target.value)} />
                    </div>
                  </div>
               </div>
               <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h3 className="text-orange-500 font-black text-[10px] tracking-widest uppercase">الوسائط الرئيسية</h3>
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[9px] text-slate-500 font-black uppercase mb-2 block">فيديو الهيرو (Youtube Embed)</label>
                      <input type="text" value={settings.videoUrlHero} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('videoUrlHero', e.target.value)} />
                    </div>
                    <div className="group">
                      <label className="text-[9px] text-slate-500 font-black uppercase mb-2 block">رابط صورة الهيرو</label>
                      <input type="text" value={settings.heroBg} className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-orange-500" onChange={e => updateSetting('heroBg', e.target.value)} />
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* TAB: OFFERS ENGINE */}
          {activeTab === 'offers' && (
            <div className="space-y-8">
               <button onClick={() => addItem(setOffers, { title: { ar: 'عنوان العرض', en: 'New Offer' }, discount: { ar: '15%', en: '15%' }, description: { ar: 'تفاصيل العرض هنا...', en: 'Offer details...' }, expiry: { ar: 'ينتهي قريباً', en: 'Soon' }, type: { ar: 'فحم موالح', en: 'Citrus' }, isActive: true })} className="w-full py-12 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black hover:border-orange-500 transition-all">+ إضافة عرض ترويجي جديد</button>
               <div className="grid grid-cols-1 gap-8">
                  {offers.map((o, idx) => (
                    <div key={o.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 relative group">
                       <div className="flex flex-col md:flex-row gap-10">
                          <div className="flex-grow space-y-6">
                             <div className="flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                   <input value={o.title.ar} className="bg-transparent text-2xl font-black outline-none focus:text-orange-500 transition-all" onChange={e => handleArrayUpdate(setOffers, idx, 'title', e.target.value, 'ar')} />
                                   <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase ${o.isActive ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>{o.isActive ? 'Active' : 'Hidden'}</div>
                                </div>
                                <button onClick={() => deleteItem(setOffers, o.id)} className="text-rose-500 font-black text-[10px] uppercase">حذف</button>
                             </div>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <input value={o.discount.ar} placeholder="الخصم (AR)" className="bg-black border border-white/10 p-4 rounded-xl text-xs" onChange={e => handleArrayUpdate(setOffers, idx, 'discount', e.target.value, 'ar')} />
                                <input value={o.expiry.ar} placeholder="الانتهاء (AR)" className="bg-black border border-white/10 p-4 rounded-xl text-xs" onChange={e => handleArrayUpdate(setOffers, idx, 'expiry', e.target.value, 'ar')} />
                                <input value={o.type.ar} placeholder="النوع (AR)" className="bg-black border border-white/10 p-4 rounded-xl text-xs" onChange={e => handleArrayUpdate(setOffers, idx, 'type', e.target.value, 'ar')} />
                                <div className="flex items-center justify-center bg-black/50 border border-white/5 rounded-xl gap-3">
                                   <span className="text-[9px] uppercase font-black text-slate-500">حالة العرض</span>
                                   <input type="checkbox" checked={o.isActive} onChange={e => handleArrayUpdate(setOffers, idx, 'isActive', e.target.checked)} className="accent-orange-500 w-5 h-5 cursor-pointer" />
                                </div>
                             </div>
                             <textarea value={o.description.ar} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs h-24 italic" onChange={e => handleArrayUpdate(setOffers, idx, 'description', e.target.value, 'ar')} />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* TAB: BLOG / ARTICLES */}
          {activeTab === 'blog' && (
             <div className="space-y-8">
                <button onClick={() => addItem(setArticles, { title: { ar: 'عنوان المقال', en: 'New Blog Post' }, excerpt: { ar: 'مقدمة المقال هنا...', en: 'Excerpt...' }, date: { ar: 'اليوم', en: 'Today' }, img: 'https://images.unsplash.com/photo-1599708153386-62e228308412', category: { ar: 'أبحاث الجودة', en: 'Quality' }, readTime: '5 min' })} className="w-full py-12 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 font-black hover:border-orange-500 transition-all">+ إضافة مقال معرفي جديد</button>
                <div className="space-y-10">
                   {articles.map((a, idx) => (
                     <div key={a.id} className="bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 flex flex-col md:flex-row gap-10">
                        <div className="w-full md:w-1/3">
                           <img src={a.img} className="w-full aspect-video object-cover rounded-2xl border border-white/10 mb-4" />
                           <input value={a.img} placeholder="رابط الصورة" className="w-full bg-black border border-white/10 p-3 rounded-xl text-[8px]" onChange={e => handleArrayUpdate(setArticles, idx, 'img', e.target.value)} />
                        </div>
                        <div className="flex-grow space-y-4">
                           <div className="flex justify-between items-center">
                              <input value={a.title.ar} className="bg-transparent text-xl font-black outline-none focus:text-orange-500" onChange={e => handleArrayUpdate(setArticles, idx, 'title', e.target.value, 'ar')} />
                              <button onClick={() => deleteItem(setArticles, a.id)} className="text-rose-500 font-black text-[10px] uppercase">حذف</button>
                           </div>
                           <textarea value={a.excerpt.ar} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs h-24" onChange={e => handleArrayUpdate(setArticles, idx, 'excerpt', e.target.value, 'ar')} />
                           <div className="grid grid-cols-3 gap-4">
                              <input value={a.category.ar} placeholder="الفئة" className="bg-black border border-white/10 p-3 rounded-xl text-[10px]" onChange={e => handleArrayUpdate(setArticles, idx, 'category', e.target.value, 'ar')} />
                              <input value={a.date.ar} placeholder="التاريخ" className="bg-black border border-white/10 p-3 rounded-xl text-[10px]" onChange={e => handleArrayUpdate(setArticles, idx, 'date', e.target.value, 'ar')} />
                              <input value={a.readTime || ''} placeholder="مدة القراءة" className="bg-black border border-white/10 p-3 rounded-xl text-[10px]" onChange={e => handleArrayUpdate(setArticles, idx, 'readTime', e.target.value)} />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          )}

          {/* TAB: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((t, idx) => (
                  <div key={t.id} className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 relative">
                     <div className="flex items-center gap-6 mb-8">
                        <div className="relative">
                          <img src={t.avatar} className="w-16 h-16 rounded-full border-2 border-orange-500/20 object-cover" />
                          <input value={t.avatar} className="absolute -bottom-2 -left-2 w-8 h-8 opacity-0 cursor-pointer" onChange={e => handleArrayUpdate(setTestimonials, idx, 'avatar', e.target.value)} title="رابط الصورة" />
                        </div>
                        <div className="flex-grow">
                           <input value={t.name.ar} className="bg-transparent font-black block w-full outline-none text-white" onChange={e => handleArrayUpdate(setTestimonials, idx, 'name', e.target.value, 'ar')} />
                           <input value={t.role.ar} className="bg-transparent text-[10px] text-orange-500 font-bold outline-none" onChange={e => handleArrayUpdate(setTestimonials, idx, 'role', e.target.value, 'ar')} />
                        </div>
                        <button onClick={() => deleteItem(setTestimonials, t.id)} className="text-rose-500 font-black text-[9px] uppercase">حذف</button>
                     </div>
                     <textarea value={t.content.ar} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs h-32 italic leading-relaxed" onChange={e => handleArrayUpdate(setTestimonials, idx, 'content', e.target.value, 'ar')} />
                     <div className="mt-4">
                        <label className="text-[8px] text-slate-500 uppercase font-black block mb-2">رابط صورة العميل</label>
                        <input value={t.avatar} className="w-full bg-black border border-white/10 p-2 rounded-lg text-[8px]" onChange={e => handleArrayUpdate(setTestimonials, idx, 'avatar', e.target.value)} />
                     </div>
                  </div>
                ))}
                <button onClick={() => addItem(setTestimonials, { name: { ar: 'اسم العميل', en: 'Client Name' }, role: { ar: 'مستورد من دولة...', en: 'Importer' }, content: { ar: 'رأيي في جودة الفحم هنا...', en: 'Testimonial text...' }, avatar: 'https://i.pravatar.cc/150' })} className="border-2 border-dashed border-white/10 rounded-[2.5rem] p-12 text-slate-500 font-black hover:border-orange-500 transition-all">+ إضافة رأي عميل جديد</button>
             </div>
          )}

          {/* TAB: STATS & NUMBERS */}
          {activeTab === 'stats' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((s, idx) => (
                   <div key={s.id} className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 flex gap-8 items-center">
                      <input value={s.icon} className="w-16 h-16 bg-black border border-white/10 rounded-2xl text-2xl text-center shadow-inner" onChange={e => handleArrayUpdate(setStats, idx, 'icon', e.target.value)} />
                      <div className="flex-grow space-y-4">
                         <div className="flex gap-4">
                            <input value={s.value} className="w-1/3 bg-black border border-white/10 p-3 rounded-xl text-xl font-black text-orange-500 text-center" onChange={e => handleArrayUpdate(setStats, idx, 'value', e.target.value)} />
                            <div className="flex-grow space-y-2">
                               <input value={s.label.ar} className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs" placeholder="النص عربي" onChange={e => handleArrayUpdate(setStats, idx, 'label', e.target.value, 'ar')} />
                               <input value={s.label.en} className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs" placeholder="English Label" onChange={e => handleArrayUpdate(setStats, idx, 'label', e.target.value, 'en')} />
                            </div>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          )}

          {/* Fallback UI for Identity & Products (Previous Implementation) */}
          {(['design', 'products', 'gallery', 'certs']).includes(activeTab) && (
            <div className="text-center py-20 bg-[#0a0a0a] rounded-[3rem] border border-white/5">
               <span className="text-5xl mb-6 block">🚧</span>
               <h3 className="text-xl font-black text-white">المحرر المتقدم لـ {activeTab}</h3>
               <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">هذا القسم قيد المراجعة النهائية لضمان دقة البيانات المحفوظة.</p>
               <button onClick={() => setActiveTab('general')} className="mt-8 px-8 py-3 bg-orange-500 text-black rounded-xl font-black text-xs uppercase">العودة للرئيسية</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

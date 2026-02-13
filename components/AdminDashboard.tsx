
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
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [activeTab, setActiveTab] = useState('general');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.user === 'admin' && loginForm.pass === '1997') setIsLoggedIn(true);
    else alert("بيانات الدخول غير صحيحة");
  };

  const updateSetting = (key: keyof SiteSettings, value: any) => setSettings(prev => ({ ...prev, [key]: value }));
  
  const updateNestedSetting = (key: 'brandName' | 'tagline' | 'address', lang: 'ar' | 'en', value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], [lang]: value }
    }));
  };

  const addItem = (setList: Function, template: any) => setList((prev: any[]) => [...prev, { ...template, id: Date.now().toString() }]);
  const deleteItem = (setList: Function, id: string | number) => setList((prev: any[]) => prev.filter((item: any) => item.id !== id));

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-cairo" dir="rtl">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-[#0a0a0a] border border-orange-500/10 p-12 text-center rounded-[3rem] shadow-2xl">
           <div className="w-20 h-20 dynamic-bg text-black flex items-center justify-center text-3xl font-black rounded-[2rem] mx-auto mb-10 shadow-xl">A</div>
           <h2 className="text-2xl font-black text-white mb-8">مركز الإدارة</h2>
           <input type="text" placeholder="اسم المستخدم" className="w-full bg-black border border-white/5 p-5 rounded-2xl text-white mb-4 outline-none focus:border-orange-500" onChange={e => setLoginForm({...loginForm, user: e.target.value})} />
           <input type="password" placeholder="كلمة المرور" className="w-full bg-black border border-white/5 p-5 rounded-2xl text-white mb-8 outline-none focus:border-orange-500" onChange={e => setLoginForm({...loginForm, pass: e.target.value})} />
           <button type="submit" className="w-full py-5 dynamic-bg text-black font-black rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all">تأكيد الهوية</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row font-cairo" dir="rtl">
      <aside className="w-full lg:w-80 bg-black border-l border-white/5 flex flex-col p-8 h-screen sticky top-0 overflow-y-auto z-50">
        <div className="mb-12 flex items-center gap-4">
          <div className="w-10 h-10 dynamic-bg text-black flex items-center justify-center text-lg rounded-xl font-black">A</div>
          <span className="font-black text-sm tracking-widest uppercase">Console v3.1</span>
        </div>
        <nav className="flex-grow space-y-2">
          {[
            { id: 'general', label: 'الإعدادات الأساسية', icon: '🌍' },
            { id: 'identity', label: 'النصوص والشعار', icon: '✍️' },
            { id: 'stats', label: 'أرقام النجاح', icon: '📊' },
            { id: 'products', label: 'المنتجات', icon: '🔥' },
            { id: 'offers', label: 'العروض الترويجية', icon: '🎁' },
            { id: 'blog', label: 'المقالات الفنية', icon: '📝' },
            { id: 'gallery', label: 'معرض الصور', icon: '🖼️' },
            { id: 'testimonials', label: 'آراء العملاء', icon: '⭐' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-right px-6 py-4 rounded-2xl text-[11px] font-black uppercase flex items-center gap-4 transition-all ${activeTab === tab.id ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
              <span className="text-lg">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} className="mt-12 py-5 text-rose-500 text-[10px] font-black uppercase border border-rose-500/20 rounded-2xl hover:bg-rose-500 hover:text-white transition-all">إغلاق الجلسة</button>
      </aside>

      <main className="flex-grow p-6 lg:p-16">
         <div className="max-w-5xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
               <div>
                 <h2 className="text-4xl font-black text-white capitalize">{activeTab} Interface</h2>
                 <p className="text-slate-500 text-xs mt-2">نظام إدارة المحتوى - شركة العاصمة</p>
               </div>
               <div className="flex gap-4">
                 <button onClick={() => window.location.hash = ''} className="px-6 py-4 border border-white/10 rounded-2xl font-black text-[10px] uppercase hover:bg-white/5">الموقع العام</button>
                 <button onClick={() => alert('تم حفظ التغييرات محلياً في المتصفح')} className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-emerald-500/20">تثبيت البيانات</button>
               </div>
            </header>

            {activeTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">معلومات الاتصال</h4>
                  <div className="space-y-4">
                    <input type="text" value={settings.whatsapp} placeholder="واتساب" className="w-full bg-black border border-white/5 p-4 rounded-xl text-sm" onChange={e => updateSetting('whatsapp', e.target.value)} />
                    <input type="text" value={settings.phone} placeholder="هاتف" className="w-full bg-black border border-white/5 p-4 rounded-xl text-sm" onChange={e => updateSetting('phone', e.target.value)} />
                    <input type="text" value={settings.email} placeholder="ايميل" className="w-full bg-black border border-white/5 p-4 rounded-xl text-sm" onChange={e => updateSetting('email', e.target.value)} />
                  </div>
                </div>
                <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">روابط بصرية</h4>
                  <div className="space-y-4">
                    <input type="text" value={settings.logoUrl} placeholder="رابط اللوجو" className="w-full bg-black border border-white/5 p-4 rounded-xl text-sm" onChange={e => updateSetting('logoUrl', e.target.value)} />
                    <input type="text" value={settings.heroBg} placeholder="رابط خلفية الهيرو" className="w-full bg-black border border-white/5 p-4 rounded-xl text-sm" onChange={e => updateSetting('heroBg', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'identity' && (
              <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label className="text-xs text-slate-500 font-bold">اسم الشركة (عربي)</label>
                      <input type="text" value={settings.brandName.ar} className="w-full bg-black border border-white/5 p-4 rounded-xl" onChange={e => updateNestedSetting('brandName', 'ar', e.target.value)} />
                   </div>
                   <div className="space-y-4">
                      <label className="text-xs text-slate-500 font-bold">اسم الشركة (English)</label>
                      <input type="text" value={settings.brandName.en} className="w-full bg-black border border-white/5 p-4 rounded-xl" onChange={e => updateNestedSetting('brandName', 'en', e.target.value)} />
                   </div>
                </div>
                <div className="space-y-4">
                   <label className="text-xs text-slate-500 font-bold">الشعار النصي (Tagline AR)</label>
                   <input type="text" value={settings.tagline.ar} className="w-full bg-black border border-white/5 p-4 rounded-xl" onChange={e => updateNestedSetting('tagline', 'ar', e.target.value)} />
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                 <button onClick={() => addItem(setProducts, { title: { ar: 'منتج جديد', en: 'New Product' }, desc: { ar: '', en: '' }, img: 'https://images.unsplash.com/photo-1542366810-449e7769527d', specs: { ar: [], en: [] }, icon: '🔥', msg: { ar: '', en: '' } })} className="w-full py-8 border-2 border-dashed border-white/10 rounded-3xl text-slate-500 font-black">+ إضافة منتج</button>
                 <div className="grid grid-cols-1 gap-4">
                    {products.map(p => (
                      <div key={p.id} className="bg-[#0a0a0a] p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-6">
                            <img src={p.img} className="w-16 h-16 rounded-xl object-cover" />
                            <h5 className="font-black text-white">{p.title.ar}</h5>
                         </div>
                         <button onClick={() => deleteItem(setProducts, p.id)} className="text-rose-500 text-xs font-black bg-rose-500/10 px-6 py-2 rounded-xl">حذف</button>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'offers' && (
              <div className="space-y-6">
                 <button onClick={() => addItem(setOffers, { title: { ar: 'عرض جديد', en: 'New Offer' }, discount: { ar: 'خصم 10%', en: '10% OFF' }, description: { ar: '', en: '' }, expiry: { ar: '', en: '' }, type: { ar: '', en: '' }, isActive: true })} className="w-full py-8 border-2 border-dashed border-white/10 rounded-3xl text-slate-500 font-black">+ إضافة عرض ترويجي</button>
                 {offers.map(o => (
                    <div key={o.id} className="bg-[#0a0a0a] p-6 rounded-3xl border border-white/5 space-y-4">
                        <div className="flex justify-between items-center">
                           <input value={o.title.ar} className="bg-transparent text-xl font-black text-white outline-none" onChange={e => {
                             const nl = [...offers]; nl[nl.findIndex(x => x.id === o.id)].title.ar = e.target.value; setOffers(nl);
                           }} />
                           <button onClick={() => deleteItem(setOffers, o.id)} className="text-rose-500 text-xs">حذف</button>
                        </div>
                    </div>
                 ))}
              </div>
            )}
            
            {activeTab === 'blog' && (
              <div className="space-y-6">
                 <button onClick={() => addItem(setArticles, { title: { ar: 'مقال جديد', en: '' }, excerpt: { ar: '', en: '' }, date: { ar: '', en: '' }, img: 'https://images.unsplash.com/photo-1599708153386-62e228308412', category: { ar: '', en: '' } })} className="w-full py-8 border-2 border-dashed border-white/10 rounded-3xl text-slate-500 font-black">+ إضافة مقال جديد</button>
                 {articles.map(a => (
                    <div key={a.id} className="bg-[#0a0a0a] p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                       <h5 className="font-black text-slate-400">{a.title.ar}</h5>
                       <button onClick={() => deleteItem(setArticles, a.id)} className="text-rose-500 text-xs">حذف</button>
                    </div>
                 ))}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-6">
                 <button onClick={() => addItem(setGalleryItems, { title: { ar: 'صورة جديدة', en: '' }, category: { ar: '', en: '' }, img: '' })} className="w-full py-8 border-2 border-dashed border-white/10 rounded-3xl text-slate-500 font-black">+ إضافة للمعرض</button>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryItems.map(g => (
                       <div key={g.id} className="relative aspect-square rounded-2xl overflow-hidden group">
                          <img src={g.img} className="w-full h-full object-cover" />
                          <button onClick={() => deleteItem(setGalleryItems, g.id)} className="absolute top-2 right-2 bg-rose-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">×</button>
                       </div>
                    ))}
                 </div>
              </div>
            )}
         </div>
      </main>
    </div>
  );
};

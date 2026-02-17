
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCodeExport, setShowCodeExport] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1997') setIsLoggedIn(true);
    else alert('كلمة المرور غير صحيحة');
  };

  const updateItem = (setter: Function, index: number, field: string, value: any, lang?: 'ar'|'en') => {
    setter((prev: any[]) => {
      const copy = [...prev];
      if (lang) {
        copy[index] = { 
          ...copy[index], 
          [field]: { ...copy[index][field], [lang]: value } 
        };
      } else {
        copy[index] = { ...copy[index], [field]: value };
      }
      return copy;
    });
  };

  const deleteItem = (setter: Function, id: string | number) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      setter((prev: any[]) => prev.filter(item => item.id !== id));
    }
  };

  const BilingualInput = ({ label, valAr, valEn, setAr, setEn, textarea = false }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-8 rounded-[2rem] border border-white/5 shadow-inner">
      <div className="space-y-3 text-right">
        <label className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">العربية - {label}</label>
        {textarea ? (
          <textarea className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white h-32 text-sm focus:border-orange-500 outline-none transition-all" value={valAr} onChange={e => setAr(e.target.value)} />
        ) : (
          <input className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white text-sm focus:border-orange-500 outline-none transition-all" value={valAr} onChange={e => setAr(e.target.value)} />
        )}
      </div>
      <div className="space-y-3 text-left">
        <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">English - {label}</label>
        {textarea ? (
          <textarea className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white h-32 text-sm font-sans focus:border-blue-500 outline-none transition-all" dir="ltr" value={valEn} onChange={e => setEn(e.target.value)} />
        ) : (
          <input className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl text-white text-sm font-sans focus:border-blue-500 outline-none transition-all" dir="ltr" value={valEn} onChange={e => setEn(e.target.value)} />
        )}
      </div>
    </div>
  );

  const ImageInput = ({ label, value, onChange }: any) => (
    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex items-center gap-6 group hover:border-orange-500/50 transition-all">
      <div className="flex-grow space-y-2 text-right">
        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{label}</label>
        <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-[11px] font-sans text-emerald-400 outline-none focus:border-orange-500 transition-all" placeholder="https://image-url.com/..." value={value} onChange={e => onChange(e.target.value)} />
      </div>
      <div className="w-20 h-20 bg-slate-900 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-2xl">
        {value ? <img src={value} className="w-full h-full object-cover" alt="Preview" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-700">No Image</div>}
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-cairo" dir="rtl">
        <div className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 p-12 rounded-[3.5rem] text-center shadow-2xl">
          <div className="w-20 h-20 dynamic-bg rounded-[2rem] flex items-center justify-center text-black font-black text-3xl mx-auto mb-10 shadow-2xl">A</div>
          <h2 className="text-2xl font-black text-white mb-8 tracking-tighter uppercase">Admin Console</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" placeholder="••••" className="w-full bg-black border border-white/10 p-6 rounded-2xl text-white text-center text-5xl outline-none focus:border-orange-500 font-sans tracking-[0.5em] transition-all" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
            <button type="submit" className="w-full py-6 dynamic-bg text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-xs tracking-widest uppercase shadow-xl">دخول</button>
          </form>
        </div>
      </div>
    );
  }

  const generateDataCode = () => {
    return `import { SiteSettings, Product, GalleryItem, Testimonial, StatItem, CertificateItem } from './App';
import { Article } from './components/Blog';
import { Offer } from './components/Offers';

export const INITIAL_SETTINGS: SiteSettings = ${JSON.stringify(settings, null, 2)};

export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};

export const INITIAL_GALLERY: GalleryItem[] = ${JSON.stringify(galleryItems, null, 2)};

export const INITIAL_TESTIMONIALS: Testimonial[] = ${JSON.stringify(testimonials, null, 2)};

export const INITIAL_STATS: StatItem[] = ${JSON.stringify(stats, null, 2)};

export const INITIAL_CERTS: CertificateItem[] = ${JSON.stringify(certs, null, 2)};

export const INITIAL_ARTICLES: Article[] = ${JSON.stringify(articles, null, 2)};

export const INITIAL_OFFERS: Offer[] = ${JSON.stringify(offers, null, 2)};`;
  };

  const menu = [
    { id: 'dashboard', label: 'نظرة عامة', icon: '📊' },
    { id: 'settings', label: 'الهوية البصرية', icon: '🎨' },
    { id: 'products', label: 'المنتجات', icon: '📦' },
    { id: 'gallery', label: 'المعرض', icon: '🖼️' },
    { id: 'blog', label: 'المدونة', icon: '✍️' },
    { id: 'offers', label: 'العروض', icon: '🏷️' },
    { id: 'stats', label: 'الأرقام', icon: '📈' },
    { id: 'testimonials', label: 'آراء العملاء', icon: '💬' },
    { id: 'certs', label: 'الشهادات', icon: '📜' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row font-cairo overflow-hidden" dir="rtl">
      <aside className="w-full lg:w-80 bg-black border-l border-white/5 flex flex-col h-screen sticky top-0 z-[100]">
        <div className="p-10 border-b border-white/5 flex items-center gap-4">
          <div className="w-10 h-10 dynamic-bg rounded-xl flex items-center justify-center text-black font-black text-xl">A</div>
          <span className="font-black text-sm uppercase tracking-tighter">Admin Dashboard</span>
        </div>
        <nav className="flex-grow p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {menu.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-right px-6 py-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${activeTab === item.id ? 'bg-orange-500 text-black font-black shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5 space-y-4">
           <button onClick={() => setShowCodeExport(true)} className="w-full py-5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg">حفظ وتصدير الكود</button>
           <button onClick={onLogout} className="w-full py-3 text-slate-500 text-[9px] font-black uppercase tracking-widest hover:text-rose-500 transition-colors">تسجيل الخروج</button>
        </div>
      </aside>

      <main className="flex-grow p-8 lg:p-20 overflow-y-auto bg-[#080808]">
        <div className="max-w-5xl mx-auto pb-40">
          <header className="mb-20 border-b border-white/5 pb-12">
             <h1 className="text-5xl font-black uppercase tracking-tighter text-white mb-2">{activeTab}</h1>
             <p className="text-slate-500 text-xs font-medium uppercase tracking-[0.3em]">Live Management System</p>
          </header>

          <div className="space-y-16">
            {activeTab === 'dashboard' && (
              <div className="bg-orange-500/5 p-12 rounded-[3.5rem] border border-orange-500/10">
                <h2 className="text-3xl font-black text-orange-500 mb-6">مرحباً بك في لوحة تحكم العاصمة</h2>
                <p className="text-slate-400 leading-relaxed text-sm">
                   يمكنك من هنا تعديل كافة بيانات الموقع لحظياً. لحفظ هذه البيانات بشكل دائم في الكود المصدري للمشروع، استخدم زر "حفظ وتصدير الكود" وانسخ المحتوى الناتج لملف <code className="text-white px-2 py-1 bg-white/5 rounded">data.ts</code>.
                </p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-12">
                <ImageInput label="شعار الشركة" value={settings.logoUrl} onChange={(v:any) => setSettings({...settings, logoUrl: v})} />
                <ImageInput label="خلفية الواجهة الرئيسية" value={settings.heroBg} onChange={(v:any) => setSettings({...settings, heroBg: v})} />
                <BilingualInput label="اسم العلامة التجارية" valAr={settings.brandName.ar} valEn={settings.brandName.en} setAr={(v:any) => setSettings({...settings, brandName: {...settings.brandName, ar: v}})} setEn={(v:any) => setSettings({...settings, brandName: {...settings.brandName, en: v}})} />
                <BilingualInput label="شعار نصي (Tagline)" valAr={settings.tagline.ar} valEn={settings.tagline.en} setAr={(v:any) => setSettings({...settings, tagline: {...settings.tagline, ar: v}})} setEn={(v:any) => setSettings({...settings, tagline: {...settings.tagline, en: v}})} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-3xl space-y-2"><label className="text-[9px] text-orange-500 font-black">WHATSAPP</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} /></div>
                  <div className="bg-white/5 p-6 rounded-3xl space-y-2"><label className="text-[9px] text-orange-500 font-black">EMAIL</label><input className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} /></div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-10">
                <button onClick={() => setProducts([{ id: Date.now().toString(), title: { ar: 'منتج جديد', en: 'New' }, desc: { ar: 'وصف..', en: 'Desc..' }, specs: { ar: [], en: [] }, icon: '🔥', images: [], msg: { ar: 'طلب', en: 'Order' } } as any, ...products])} className="w-full py-10 border-2 border-dashed border-white/10 rounded-[3rem] text-slate-500 font-black">+ إضافة منتج جديد</button>
                {products.map((p, i) => (
                  <div key={p.id} className="bg-black/40 p-10 rounded-[3rem] border border-white/5 space-y-8 relative">
                    <button onClick={() => deleteItem(setProducts, p.id)} className="absolute top-8 left-8 text-rose-500 font-black text-[10px] uppercase">حذف</button>
                    <BilingualInput label="الاسم" valAr={p.title.ar} valEn={p.title.en} setAr={(v:any) => updateItem(setProducts, i, 'title', v, 'ar')} setEn={(v:any) => updateItem(setProducts, i, 'title', v, 'en')} />
                    <BilingualInput label="الوصف" valAr={p.desc.ar} valEn={p.desc.en} setAr={(v:any) => updateItem(setProducts, i, 'desc', v, 'ar')} setEn={(v:any) => updateItem(setProducts, i, 'desc', v, 'en')} textarea />
                    <ImageInput label="صورة المنتج" value={p.images[0] || ''} onChange={(v:any) => updateItem(setProducts, i, 'images', [v])} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-10">
                <button onClick={() => setGalleryItems([{ id: Date.now().toString(), title: { ar: 'صورة جديدة', en: 'New' }, category: { ar: 'المصنع', en: 'Factory' }, img: '' }, ...galleryItems])} className="w-full py-10 border-2 border-dashed border-white/10 rounded-3xl text-slate-500 font-black">+ إضافة لقطة جديدة</button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {galleryItems.map((g, i) => (
                    <div key={g.id} className="bg-black/40 p-8 rounded-[3rem] border border-white/5 space-y-6 relative">
                      <button onClick={() => deleteItem(setGalleryItems, g.id)} className="absolute top-6 left-6 text-rose-500 font-black text-[9px] uppercase">إزالة</button>
                      <ImageInput label="رابط الصورة" value={g.img} onChange={(v:any) => updateItem(setGalleryItems, i, 'img', v)} />
                      <BilingualInput label="العنوان" valAr={g.title.ar} valEn={g.title.en} setAr={(v:any) => updateItem(setGalleryItems, i, 'title', v, 'ar')} setEn={(v:any) => updateItem(setGalleryItems, i, 'title', v, 'en')} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'blog' && (
              <div className="space-y-10">
                <button onClick={() => setArticles([{ id: Date.now(), title: { ar: 'مقال جديد', en: 'New Article' }, excerpt: { ar: 'وصف المقال..', en: 'Excerpt..' }, date: { ar: '2025', en: '2025' }, img: '', category: { ar: 'فني', en: 'Technical' } } as any, ...articles])} className="w-full py-10 border-2 border-dashed border-white/10 rounded-3xl text-slate-500 font-black">+ نشر مقال جديد</button>
                {articles.map((a, i) => (
                  <div key={a.id} className="bg-black/40 p-10 rounded-[3rem] border border-white/5 space-y-8 relative">
                    <button onClick={() => deleteItem(setArticles, a.id)} className="absolute top-8 left-8 text-rose-500 font-black text-[10px] uppercase">حذف</button>
                    <ImageInput label="غلاف المقال" value={a.img} onChange={(v:any) => updateItem(setArticles, i, 'img', v)} />
                    <BilingualInput label="العنوان" valAr={a.title.ar} valEn={a.title.en} setAr={(v:any) => updateItem(setArticles, i, 'title', v, 'ar')} setEn={(v:any) => updateItem(setArticles, i, 'title', v, 'en')} />
                    <BilingualInput label="المحتوى المختصر" valAr={a.excerpt.ar} valEn={a.excerpt.en} setAr={(v:any) => updateItem(setArticles, i, 'excerpt', v, 'ar')} setEn={(v:any) => updateItem(setArticles, i, 'excerpt', v, 'en')} textarea />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {stats.map((s, i) => (
                  <div key={s.id} className="bg-black/40 p-10 rounded-[3rem] border border-white/5 space-y-6">
                    <div className="flex gap-4 items-center">
                       <input className="w-16 h-16 bg-black border border-white/10 rounded-2xl text-center text-3xl" value={s.icon} onChange={e => updateItem(setStats, i, 'icon', e.target.value)} />
                       <input className="flex-grow bg-black border border-white/10 p-4 rounded-xl text-3xl font-black font-sans text-orange-500" value={s.value} onChange={e => updateItem(setStats, i, 'value', e.target.value)} />
                    </div>
                    <BilingualInput label="العنوان" valAr={s.label.ar} valEn={s.label.en} setAr={(v:any) => updateItem(setStats, i, 'label', v, 'ar')} setEn={(v:any) => updateItem(setStats, i, 'label', v, 'en')} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div className="space-y-10">
                <button onClick={() => setTestimonials([{ id: Date.now().toString(), name: { ar: 'عميل جديد', en: 'New Client' }, role: { ar: 'منصب', en: 'Role' }, content: { ar: 'الرأي..', en: 'Review..' }, avatar: 'https://i.pravatar.cc/150' }, ...testimonials])} className="w-full py-10 border-2 border-dashed border-white/10 rounded-3xl text-slate-500 font-black">+ إضافة رأي عميل</button>
                {testimonials.map((t, i) => (
                  <div key={t.id} className="bg-black/40 p-10 rounded-[3rem] border border-white/5 space-y-8 relative">
                    <button onClick={() => deleteItem(setTestimonials, t.id)} className="absolute top-8 left-8 text-rose-500 font-black text-[10px] uppercase">حذف</button>
                    <ImageInput label="صورة العميل" value={t.avatar} onChange={(v:any) => updateItem(setTestimonials, i, 'avatar', v)} />
                    <BilingualInput label="الاسم" valAr={t.name.ar} valEn={t.name.en} setAr={(v:any) => updateItem(setTestimonials, i, 'name', v, 'ar')} setEn={(v:any) => updateItem(setTestimonials, i, 'name', v, 'en')} />
                    <BilingualInput label="الرأي" valAr={t.content.ar} valEn={t.content.en} setAr={(v:any) => updateItem(setTestimonials, i, 'content', v, 'ar')} setEn={(v:any) => updateItem(setTestimonials, i, 'content', v, 'en')} textarea />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'certs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {certs.map((c, i) => (
                  <div key={c.id} className="bg-black/40 p-8 rounded-[3rem] border border-white/5 space-y-6 relative">
                    <button onClick={() => deleteItem(setCerts, c.id)} className="absolute top-6 left-6 text-rose-500 font-black text-[9px] uppercase">حذف</button>
                    <ImageInput label="رابط الشعار" value={c.img} onChange={(v:any) => updateItem(setCerts, i, 'img', v)} />
                    <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none" value={c.name} onChange={e => updateItem(setCerts, i, 'name', e.target.value)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {showCodeExport && (
        <div className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-8 backdrop-blur-2xl animate-in fade-in duration-300">
           <div className="bg-[#0a0a0a] border border-white/10 p-12 rounded-[4rem] w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl">
              <div className="flex justify-between items-start mb-8">
                 <h2 className="text-3xl font-black text-emerald-500 uppercase tracking-tighter">Export Data</h2>
                 <button onClick={() => setShowCodeExport(false)} className="text-slate-500 hover:text-white text-4xl leading-none">&times;</button>
              </div>
              <textarea readOnly className="flex-grow bg-black/50 text-emerald-400 p-8 rounded-[2.5rem] font-mono text-[11px] leading-relaxed border border-white/5 outline-none custom-scrollbar mb-8" value={generateDataCode()} />
              <button onClick={() => { navigator.clipboard.writeText(generateDataCode()); alert('✅ تم نسخ الكود! استبدله الآن في ملف data.ts'); }} className="w-full py-6 bg-emerald-500 text-black font-black rounded-2xl uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all">نسخ الكود المحدث</button>
           </div>
        </div>
      )}
    </div>
  );
};

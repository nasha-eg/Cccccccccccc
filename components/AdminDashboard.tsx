
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
  const bulkGalleryRef = useRef<HTMLInputElement>(null);
  const productImagesRef = useRef<HTMLInputElement>(null);
  
  // خاص لرفع صور إضافية لمنتج معين
  const [activeProductIdx, setActiveProductIdx] = useState<number | null>(null);

  const [uploadTarget, setUploadTarget] = useState<{setFn: Function, key: string, index?: number, lang?: 'ar'|'en'} | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1997') setIsLoggedIn(true);
    else alert("كلمة المرور غير صحيحة (التلميح: 1997)");
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

  const handleBulkGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      (Array.from(files) as File[]).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setGalleryItems(prev => [
            ...prev,
            {
              id: Date.now().toString() + Math.random(),
              title: { ar: file.name.split('.')[0], en: 'New Production' },
              category: { ar: 'المصنع', en: 'Factory' },
              img: base64
            }
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleProductImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && activeProductIdx !== null) {
      (Array.from(files) as File[]).forEach(file => {
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
  };

  const deleteItem = (setList: Function, id: string | number) => {
    if (window.confirm('هل أنت متأكد من الحذف النهائي لهذا العنصر؟')) {
      setList((prev: any[]) => prev.filter((item: any) => item.id !== id));
    }
  };

  const removeProductImage = (pIdx: number, imgIdx: number) => {
    setProducts(prev => {
      const newList = [...prev];
      newList[pIdx].images = newList[pIdx].images.filter((_, i) => i !== imgIdx);
      return newList;
    });
  };

  const generateSQL = () => {
    const backup = { settings, products, galleryItems, testimonials, offers, articles, stats, certs };
    const sql = `-- Al-Asimh Master Backup Export\n` +
      `CREATE DATABASE IF NOT EXISTS alasimh_db;\n` +
      `USE alasimh_db;\n` +
      `CREATE TABLE IF NOT EXISTS site_store (id INT PRIMARY KEY, data LONGTEXT);\n` +
      `INSERT INTO site_store (id, data) VALUES (1, '${JSON.stringify(backup).replace(/'/g, "''")}') ON DUPLICATE KEY UPDATE data = VALUES(data);`;
    
    const blob = new window.Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alasimh_backup_${new Date().toISOString().split('T')[0]}.sql`;
    a.click();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-cairo" dir="rtl">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-orange-500/20 p-12 text-center rounded-[3rem] shadow-2xl animate-in fade-in zoom-in duration-500">
           <div className="w-24 h-24 dynamic-bg text-black flex items-center justify-center text-4xl font-black rounded-3xl mx-auto mb-10 shadow-2xl">A</div>
           <h2 className="text-3xl font-black text-white mb-2 uppercase">بوابة الإدارة</h2>
           <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] mb-12">Security Protocol Active</p>
           <input 
              type="password" 
              placeholder="••••" 
              className="w-full bg-black border border-white/5 p-6 rounded-2xl text-white mb-8 outline-none focus:border-orange-500 text-center text-4xl tracking-[0.5em] transition-all" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
           />
           <button onClick={handleLogin} className="w-full py-6 dynamic-bg text-black font-black rounded-2xl shadow-2xl hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-xs">ولوج النظام</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row font-cairo overflow-hidden" dir="rtl">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleSingleUpload} />
      <input type="file" ref={bulkGalleryRef} className="hidden" accept="image/*" multiple onChange={handleBulkGalleryUpload} />
      <input type="file" ref={productImagesRef} className="hidden" accept="image/*" multiple onChange={handleProductImagesUpload} />

      <aside className="w-full lg:w-80 bg-black border-l border-white/5 flex flex-col p-8 h-screen sticky top-0 overflow-y-auto z-50">
        <div className="mb-14 flex items-center gap-5">
          <div className="w-12 h-12 dynamic-bg text-black flex items-center justify-center text-2xl rounded-2xl font-black shadow-lg">A</div>
          <div>
            <span className="font-black text-xs block leading-none text-orange-500 uppercase tracking-tighter">Administrator</span>
            <span className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1 block">Capital Core v8.0</span>
          </div>
        </div>
        
        <nav className="flex-grow space-y-2">
          {[
            { id: 'general', label: 'الضبط العام', icon: '⚙️' },
            { id: 'design', label: 'الهوية البصرية', icon: '🎨' },
            { id: 'products', label: 'إدارة المنتجات', icon: '📦' },
            { id: 'gallery', label: 'معرض الصور', icon: '🖼️' },
            { id: 'blog', label: 'المقالات والتقارير', icon: '📝' },
            { id: 'stats', label: 'الإحصائيات الحية', icon: '📈' },
            { id: 'testimonials', label: 'آراء العملاء', icon: '💬' },
            { id: 'certs', label: 'الشهادات المعتمدة', icon: '📜' },
            { id: 'offers', label: 'العروض الترويجية', icon: '🏷️' },
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
           <button onClick={onLogout} className="w-full py-4 text-rose-500 text-[9px] font-black uppercase tracking-widest border border-rose-500/10 rounded-xl hover:bg-rose-500 hover:text-white transition-all">خروج آمن</button>
        </div>
      </aside>

      <main className="flex-grow p-8 lg:p-16 overflow-y-auto bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-10">
             <div>
               <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-3">{activeTab} Interface</h1>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">تكامل البيانات: نشط ومحفوظ تلقائياً</p>
               </div>
             </div>
             <div className="flex gap-4">
               <button onClick={() => alert('تمت مزامنة كافة البيانات مع الواجهة الأمامية بنجاح!')} className="bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all tracking-widest">مزامنة الآن</button>
             </div>
          </header>

          {/* ... بقية الأقسام (general, design) كما هي ... */}

          {activeTab === 'products' && (
             <div className="space-y-12 reveal">
                <button onClick={() => setProducts([...products, { id: Date.now().toString(), title: { ar: 'منتج جديد', en: 'New' }, desc: { ar: 'وصف المنتج...', en: 'Desc' }, specs: { ar: ['الكربون: 85%'], en: ['Carbon: 85%'] }, icon: '🔥', images: [], msg: { ar: 'استفسار', en: 'Inquiry' } }])} className="w-full py-16 border-4 border-dashed border-white/5 rounded-[4rem] text-slate-600 font-black hover:border-orange-500 hover:text-orange-500 transition-all">+ إضافة منتج تصدير جديد</button>
                {products.map((p, pIdx) => (
                  <div key={p.id} className="bg-[#0a0a0a] p-12 rounded-[4rem] border border-white/5 flex flex-col gap-12 relative group shadow-2xl">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                           <input value={p.icon} className="bg-black border border-white/10 p-4 rounded-xl text-3xl text-center w-20" onChange={e => updateArrayItem(setProducts, pIdx, 'icon', e.target.value)} />
                           <input value={p.title.ar} className="bg-transparent text-4xl font-black text-white w-full outline-none focus:text-orange-500 transition-colors" placeholder="اسم الصنف" onChange={e => updateArrayItem(setProducts, pIdx, 'title', e.target.value, 'ar')} />
                        </div>
                        <button onClick={() => deleteItem(setProducts, p.id)} className="bg-rose-500/10 text-rose-500 px-6 py-3 rounded-xl font-black text-[9px] uppercase border border-rose-500/20">حذف الصنف</button>
                     </div>

                     {/* Product Gallery Management */}
                     <div className="space-y-6">
                        <div className="flex justify-between items-center">
                           <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">معرض صور المنتج (صور متعددة)</label>
                           <button 
                             onClick={() => { setActiveProductIdx(pIdx); productImagesRef.current?.click(); }}
                             className="px-6 py-3 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-xl text-[9px] font-black uppercase hover:bg-orange-500 hover:text-black transition-all"
                           >
                             + إضافة صور لهذا المنتج
                           </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                           {p.images && p.images.map((img, imgIdx) => (
                              <div key={imgIdx} className="relative aspect-square rounded-2xl overflow-hidden group/img shadow-lg border border-white/5">
                                 <img src={img} className="w-full h-full object-cover" />
                                 <button 
                                   onClick={() => removeProductImage(pIdx, imgIdx)}
                                   className="absolute top-2 right-2 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all text-xs"
                                 >
                                   ×
                                 </button>
                              </div>
                           ))}
                           {(!p.images || p.images.length === 0) && (
                              <div className="aspect-square rounded-2xl border-2 border-dashed border-white/5 flex items-center justify-center text-slate-600 text-[10px] font-bold uppercase text-center p-4">
                                لا يوجد صور
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="space-y-8">
                        <textarea value={p.desc.ar} className="w-full bg-black border border-white/10 p-8 rounded-[2rem] text-lg h-32 outline-none focus:border-orange-500 transition-all leading-relaxed" placeholder="الوصف الفني..." onChange={e => updateArrayItem(setProducts, pIdx, 'desc', e.target.value, 'ar')} />
                        <div className="space-y-2">
                           <label className="text-[9px] text-slate-500 uppercase font-black block">رسالة الواتساب</label>
                           <input value={p.msg.ar} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs text-slate-400" onChange={e => updateArrayItem(setProducts, pIdx, 'msg', e.target.value, 'ar')} />
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          )}

          {/* ... بقية الأقسام (gallery, blog, etc) كما هي ... */}

          {activeTab === 'database' && (
            <div className="bg-[#0a0a0a] p-16 rounded-[4rem] border border-white/5 space-y-12 reveal text-center shadow-3xl">
               <div className="w-32 h-32 bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-6xl rounded-[3rem] mx-auto mb-10 shadow-inner">💾</div>
               <h2 className="text-4xl font-black text-white uppercase tracking-tighter">إدارة البيانات والتصدير</h2>
               <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed text-lg italic">
                 "هذا النظام يتيح لك تصدير نسخة احتياطية كاملة للموقع بما في ذلك الصور المرفوعة كأكواد رقمية، مما يضمن أمان بياناتك وسهولة نقلها لأي خادم مستقبلي."
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-8 pt-12 border-t border-white/5">
                 <button onClick={generateSQL} className="px-14 py-6 dynamic-bg text-black rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all">تصدير ملف SQL (Master Backup)</button>
                 <button onClick={() => { if(window.confirm('سيؤدي هذا لمسح كافة التعديلات واستعادة الحالة الأولية للموقع. هل أنت متأكد؟')) { localStorage.clear(); window.location.reload(); } }} className="px-14 py-6 border-2 border-rose-500/20 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">تهيئة النظام (Factory Reset)</button>
               </div>
               <div className="pt-10">
                  <span className="text-slate-600 text-[10px] uppercase font-bold tracking-[0.3em]">Capital Data Protection v8.0.2</span>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

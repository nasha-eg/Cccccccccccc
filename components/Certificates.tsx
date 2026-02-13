
import React from 'react';
import { CertificateItem } from '../App';

interface CertificatesProps {
  lang: 'ar' | 'en';
  certs: CertificateItem[];
  mini?: boolean;
}

export const Certificates: React.FC<CertificatesProps> = ({ lang, certs, mini }) => {
  if (!certs || certs.length === 0) return null;

  if (mini) {
    return (
      <div className="flex gap-4">
        {certs.map((c) => (
          <div key={c.id} className="w-12 h-12 bg-slate-50 rounded-xl p-2 border border-slate-100 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-help" title={c.name}>
            <img src={c.img} alt={c.name} className="max-w-full max-h-full opacity-60" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-24 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <span className="text-slate-300 font-black text-[10px] uppercase tracking-[0.5em] mb-12 block">Global Standards Compliance</span>
        <div className="flex flex-wrap justify-center gap-16 md:gap-32 items-center opacity-30 hover:opacity-100 transition-opacity duration-700">
           {certs.map((c) => (
             <div key={c.id} className="flex flex-col items-center gap-4 group">
                <img src={c.img} className="h-16 md:h-20 grayscale group-hover:grayscale-0 transition-all" alt={c.name} />
                <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 uppercase tracking-widest">{c.name}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

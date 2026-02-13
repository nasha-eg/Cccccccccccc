
import React from 'react';
import { StatItem } from '../App';

interface StatsProps {
  lang: 'ar' | 'en';
  stats: StatItem[];
}

export const Stats: React.FC<StatsProps> = ({ lang, stats }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat) => (
            <div key={stat.id} className="reveal text-center group cursor-default">
              <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">{stat.icon}</div>
              <div className="text-4xl md:text-6xl font-black text-slate-900 mb-2 tracking-tighter group-hover:text-orange-500 transition-colors">{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-600 transition-colors">{stat.label[lang]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

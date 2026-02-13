
import React, { useState, useRef } from 'react';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ 
  beforeImage, 
  afterImage,
  beforeLabel = "فحم تقليدي",
  afterLabel = "معيار العاصمة"
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  return (
    <div className="flex flex-col gap-10 w-full">
      <div 
        ref={containerRef}
        className="relative w-full aspect-[16/9] overflow-hidden cursor-col-resize select-none border-4 border-slate-100 shadow-premium rounded-[3rem] bg-slate-50"
        onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onMouseDown={(e) => handleMove(e.clientX)}
      >
        {/* Capital Standard - High Quality */}
        <div className="absolute inset-0">
          <img src={afterImage} alt="Capital Quality" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-orange-500/5 backdrop-brightness-110"></div>
        </div>
        
        {/* Traditional - Low Quality */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden transition-all duration-75"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img src={beforeImage} alt="Traditional" className="w-full h-full object-cover grayscale brightness-75 contrast-125" />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Handle System */}
        <div 
          className="absolute inset-y-0 z-30 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-orange-500">
            <div className="flex gap-1 animate-pulse">
               <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
               <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-8 right-8 z-40">
          <div className="px-6 py-2.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl">
            {afterLabel}
          </div>
        </div>
        <div className="absolute top-8 left-8 z-40">
          <div className="px-6 py-2.5 bg-black/60 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-white/10">
            {beforeLabel}
          </div>
        </div>
      </div>

      {/* Comparison Fact Sheet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 group hover:border-slate-300 transition-colors">
            <h4 className="font-black text-slate-400 text-[9px] uppercase tracking-widest mb-4">المشاكل الشائعة</h4>
            <ul className="space-y-2 text-xs font-bold text-slate-500">
               <li>• نسبة رطوبة عالية تؤدي لأدخنة كثيفة</li>
               <li>• روائح كبريتية مزعجة أثناء الاشتعال</li>
               <li>• رماد متساقط بكثرة بلون داكن</li>
            </ul>
         </div>
         <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100 group hover:border-orange-300 transition-colors">
            <h4 className="font-black text-orange-400 text-[9px] uppercase tracking-widest mb-4">ضمان العاصمة</h4>
            <ul className="space-y-2 text-xs font-bold text-orange-900">
               <li>• رطوبة مثالية أقل من 3% للاشتعال الهادئ</li>
               <li>• بدون رائحة أو أدخنة (مفرز يدوياً)</li>
               <li>• رماد أبيض ناصع وثبات حراري عالي</li>
            </ul>
         </div>
      </div>
    </div>
  );
};

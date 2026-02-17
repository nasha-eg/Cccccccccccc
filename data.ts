
import { SiteSettings, Product, GalleryItem, Testimonial, StatItem, CertificateItem } from './App';
import { Article } from './components/Blog';
import { Offer } from './components/Offers';

export const INITIAL_SETTINGS: SiteSettings = {
  logoUrl: "https://cdn-icons-png.flaticon.com/512/7580/7580628.png",
  favicon: "https://cdn-icons-png.flaticon.com/512/7580/7580628.png",
  heroBg: "https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=85",
  videoUrlHero: "",
  videoUrlFooter: "",
  brandName: {
    ar: "العاصمة",
    en: "Al-Asimh"
  },
  tagline: {
    ar: "نخب التصدير الأول للفحم المصري",
    en: "Egypt's Premier Export Grade Charcoal"
  },
  logoText: "Premium Charcoal",
  whatsapp: "201000187892",
  phone: "01000187892",
  email: "sales@alasimh.net",
  address: {
    ar: "دمياط - المنطقة الصناعية",
    en: "Damietta - Industrial Zone"
  },
  seoTitle: "شركة العاصمة للفحم",
  seoDescription: "تصدير الفحم النباتي",
  primaryColor: "#f59e0b",
  accentColor: "#fbbf24",
  comparisonBeforeImg: "https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=40",
  comparisonAfterImg: "https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=90"
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    title: {
      ar: "فحم البرتقال",
      en: "Orange Charcoal"
    },
    desc: {
      ar: "يتميز بصلابة عالية وفترة اشتعال طويلة تصل لـ 5 ساعات بدون أدخنة أو شرار.",
      en: "High density with up to 5 hours burning time, completely smokeless and spark-free."
    },
    specs: {
      ar: [
        "نسبة كربون 85%",
        "رطوبة أقل من 3%"
      ],
      en: [
        "85% Carbon",
        "Moisture < 3%"
      ]
    },
    icon: "🍊",
    images: [
      "https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=80"
    ],
    msg: {
      ar: "استفسار عن فحم البرتقال",
      en: "Inquiry about Orange Charcoal"
    }
  },
  {
    id: "2",
    title: {
      ar: "فحم الليمون",
      en: "Lemon Charcoal"
    },
    desc: {
      ar: "مثالي للأرجيلة والاستخدامات المنزلية، سريع الاشتعال ورماده أبيض ناصع كالثلج.",
      en: "Perfect for Shisha and home use, quick light with pure snow-white ash."
    },
    specs: {
      ar: [
        "رماد أبيض ناصع",
        "بدون شرار"
      ],
      en: [
        "Pure White Ash",
        "No Sparking"
      ]
    },
    icon: "🍋",
    images: [
      "https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=70"
    ],
    msg: {
      ar: "استفسار عن فحم الليمون",
      en: "Inquiry about Lemon Charcoal"
    }
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: "g1",
    title: {
      ar: "مرحلة الفرز اليدوي",
      en: "Manual Sorting Stage"
    },
    category: {
      ar: "المصنع",
      en: "Factory"
    },
    img: "https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=60"
  },
  {
    id: "g2",
    title: {
      ar: "تعبئة الشحنات الدولية",
      en: "Cargo Packing"
    },
    category: {
      ar: "الميناء",
      en: "Port"
    },
    img: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80"
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: {
      ar: "أحمد منصور",
      en: "Ahmed Mansour"
    },
    role: {
      ar: "تاجر جملة - دبي",
      en: "Wholesaler - Dubai"
    },
    content: {
      ar: "فحم العاصمة هو الأفضل من حيث الثبات الحراري وقلة الرماد، نعتمد عليهم في كافة شحناتنا.",
      en: "Al-Asimh charcoal is the best in terms of heat stability and low ash, our reliable partner."
    },
    avatar: "https://i.pravatar.cc/150?u=1"
  }
];

export const INITIAL_STATS: StatItem[] = [
  {
    id: "s1",
    value: "15,000",
    label: {
      ar: "طن سنوياً",
      en: "Tons / Year"
    },
    icon: "🚢"
  },
  {
    id: "s2",
    value: "24",
    label: {
      ar: "دولة تصدير",
      en: "Countries"
    },
    icon: "🌍"
  },
  {
    id: "s3",
    value: "100%",
    label: {
      ar: "جودة مضمونة",
      en: "Quality"
    },
    icon: "✅"
  },
  {
    id: "s4",
    value: "+10",
    label: {
      ar: "سنوات خبرة",
      en: "Years Exp"
    },
    icon: "🏗️"
  }
];

export const INITIAL_CERTS: CertificateItem[] = [
  {
    id: "c1",
    name: "ISO 9001",
    img: "https://cdn-icons-png.flaticon.com/512/9334/9334461.png"
  },
  {
    id: "c2",
    name: "Phytosanitary",
    img: "https://cdn-icons-png.flaticon.com/512/9334/9334461.png"
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 1,
    title: {
      ar: "معايير جودة فحم التصدير",
      en: "Charcoal Quality Standards"
    },
    excerpt: {
      ar: "دليل شامل للمستوردين حول كيفية فحص جودة الفحم النباتي المصري.",
      en: "A comprehensive guide for importers on charcoal quality standards."
    },
    date: {
      ar: "يناير 2025",
      en: "Jan 2025"
    },
    img: "https://images.unsplash.com/photo-1542366810-449e7769527d?auto=format&fit=crop&q=50",
    category: {
      ar: "ثقافة فنية",
      en: "Technical"
    }
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 1,
    title: {
      ar: "خصم الكميات الكبيرة",
      en: "Bulk Quantity Discount"
    },
    discount: {
      ar: "15%",
      en: "15%"
    },
    description: {
      ar: "خصم خاص للطلبات التي تتجاوز 40 قدم.",
      en: "Special discount for 40ft container orders."
    },
    expiry: {
      ar: "مارس 2025",
      en: "March 2025"
    },
    type: {
      ar: "عرض محدود",
      en: "Limited Offer"
    },
    isActive: true
  }
];


import { SiteSettings, Product, GalleryItem, Testimonial, StatItem, CertificateItem } from '../App';
import { Offer } from '../components/Offers';
import { Article } from '../components/Blog';

export interface DBConfig {
  apiUrl: string;
  apiKey: string;
  mode: 'local' | 'mysql';
}

const DEFAULT_CONFIG: DBConfig = {
  apiUrl: '', // رابط الـ API الخاص بسيرفرك
  apiKey: '', 
  mode: 'local'
};

export const dbService = {
  getConfig(): DBConfig {
    const saved = localStorage.getItem('db_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  },

  setConfig(config: DBConfig) {
    localStorage.setItem('db_config', JSON.stringify(config));
  },

  async getAllData() {
    const config = this.getConfig();
    
    // محاولة جلب البيانات من السيرفر لضمان المزامنة العالمية
    if (config.mode === 'mysql' && config.apiUrl) {
      try {
        const response = await fetch(`${config.apiUrl}/get_all_data.php`, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${config.apiKey}`,
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          const cloudData = await response.json();
          // تحديث الكاش المحلي للمزامنة المستمرة
          Object.keys(cloudData).forEach(key => {
            if (cloudData[key]) localStorage.setItem(key, JSON.stringify(cloudData[key]));
          });
          console.log("[Global Sync] Data successfully fetched from MySQL.");
          return cloudData;
        }
      } catch (e) {
        console.warn("[Sync Warning] Cloud DB unreachable, falling back to cached local data.", e);
      }
    }

    // الرد الاحتياطي من المتصفح (Local Storage)
    const keys = ['site_settings', 'site_products', 'site_gallery', 'site_testimonials', 'site_offers', 'site_articles', 'site_stats', 'site_certs'];
    const data: any = {};
    keys.forEach(key => {
      const saved = localStorage.getItem(key);
      data[key] = saved ? JSON.parse(saved) : null;
    });
    return data;
  },

  async updateTable(tableName: string, data: any) {
    const config = this.getConfig();
    
    // 1. الحفظ محلياً كـ Cache
    localStorage.setItem(tableName, JSON.stringify(data));

    // 2. المزامنة مع السيرفر ليراها الجميع (Global Update)
    if (config.mode === 'mysql' && config.apiUrl) {
      try {
        const response = await fetch(`${config.apiUrl}/update_data.php`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify({ 
            table: tableName, 
            content: data,
            timestamp: new Date().getTime() 
          })
        });
        
        const result = await response.json();
        return { success: response.ok && result.success };
      } catch (e) {
        console.error("[Global Sync Error] Failed to update MySQL:", e);
        return { success: false, error: "Network Error" };
      }
    }

    return { success: true };
  }
};

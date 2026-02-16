
import { SiteSettings, Product, GalleryItem, Testimonial, StatItem, CertificateItem } from '../App';
import { Offer } from '../components/Offers';
import { Article } from '../components/Blog';

// هيكل إعدادات قاعدة البيانات
export interface DBConfig {
  apiUrl: string;
  apiKey: string;
  mode: 'local' | 'mysql';
}

const DEFAULT_CONFIG: DBConfig = {
  apiUrl: '', 
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
    
    // إذا كان الربط MySQL مفعل
    if (config.mode === 'mysql' && config.apiUrl) {
      try {
        const response = await fetch(`${config.apiUrl}/get_data`, {
          headers: { 'Authorization': `Bearer ${config.apiKey}` }
        });
        if (response.ok) return await response.json();
      } catch (e) {
        console.error("MySQL Fetch Error, falling back to local:", e);
      }
    }

    // الرد الاحتياطي (Local Storage)
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
    console.log(`[DB Sync] Syncing ${tableName}...`);

    // حفظ محلي دائماً للسرعة والأمان
    localStorage.setItem(tableName, JSON.stringify(data));

    // إذا كان MySQL مفعل، أرسل البيانات للسيرفر
    if (config.mode === 'mysql' && config.apiUrl) {
      try {
        await fetch(`${config.apiUrl}/update_table`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify({ table: tableName, content: data })
        });
      } catch (e) {
        console.error("MySQL Sync Error:", e);
        return { success: false, error: e };
      }
    }

    return { success: true };
  }
};

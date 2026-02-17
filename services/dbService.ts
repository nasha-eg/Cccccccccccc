
export interface DBConfig {
  host: string;
  dbName: string;
  user: string;
  pass: string;
  mode: 'local' | 'mysql';
  apiUrl: string;
}

const DEFAULT_CONFIG: DBConfig = {
  host: '',
  dbName: '',
  user: '',
  pass: '',
  mode: 'local',
  apiUrl: window.location.origin + '/api.php'
};

export const dbService = {
  getConfig(): DBConfig {
    const saved = localStorage.getItem('alasimh_db_v3');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  },

  setConfig(config: DBConfig) {
    localStorage.setItem('alasimh_db_v3', JSON.stringify(config));
  },

  async getAllData() {
    const config = this.getConfig();
    
    if (config.mode === 'mysql' && config.apiUrl) {
      try {
        const response = await fetch(config.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'fetch_all', dbConfig: config })
        });
        
        const result = await response.json();
        if (result.success) {
          console.log("[DB] Synchronized with MySQL Cloud");
          return result.data;
        }
      } catch (e) {
        console.error("[DB] Cloud Offline, loading local cache", e);
      }
    }
    
    // محاولة استرجاع البيانات من الكاش المحلي فقط إذا فشل السيرفر
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
    
    // حفظ نسخة احتياطية محلية
    localStorage.setItem(tableName, JSON.stringify(data));

    if (config.mode === 'mysql' && config.apiUrl) {
      try {
        const response = await fetch(config.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'sync', 
            table: tableName, 
            content: data, 
            dbConfig: config 
          })
        });
        const result = await response.json();
        return { success: result.success };
      } catch (e) {
        return { success: false, error: e };
      }
    }
    return { success: true };
  }
};

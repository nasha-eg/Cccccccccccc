
export interface DBConfig {
  host: string;
  dbName: string;
  user: string;
  pass: string;
  mode: 'local' | 'mysql';
  apiUrl: string; // رابط ملف api.php على سيرفرك
}

const DEFAULT_CONFIG: DBConfig = {
  host: '',
  dbName: '',
  user: '',
  pass: '',
  mode: 'local',
  apiUrl: ''
};

export const dbService = {
  getConfig(): DBConfig {
    const saved = localStorage.getItem('db_config_mysql_v2');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  },

  setConfig(config: DBConfig) {
    localStorage.setItem('db_config_mysql_v2', JSON.stringify(config));
  },

  async getAllData() {
    const config = this.getConfig();
    console.log("[DB] Initializing Data Fetch from:", config.mode);
    
    if (config.mode === 'mysql' && config.apiUrl) {
      try {
        const response = await fetch(config.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'fetch_all', dbConfig: config })
        });
        
        if (!response.ok) throw new Error("API Response Error");
        
        const result = await response.json();
        if (result.success) {
          // تحديث الكاش المحلي دائماً للسرعة
          Object.keys(result.data).forEach(key => {
            localStorage.setItem(key, JSON.stringify(result.data[key]));
          });
          console.log("[DB] Cloud Sync Successful");
          return result.data;
        } else {
          console.warn("[DB] API Error Message:", result.message);
        }
      } catch (e) {
        console.error("MySQL Sync Failed, falling back to Local Storage:", e);
      }
    }
    
    // النسخة الاحتياطية (Local Storage)
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
    
    // حفظ محلي فوري دائماً
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
        console.error("[DB] Remote Sync Failed:", e);
        return { success: false, error: e };
      }
    }
    return { success: true };
  }
};

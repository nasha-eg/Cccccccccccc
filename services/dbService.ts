
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
  // إعدادات قاعدة البيانات هي الشيء الوحيد الذي يُحفظ في المتصفح ليعرف الموقع أين يتصل
  getConfig(): DBConfig {
    const saved = localStorage.getItem('alasimh_db_v4_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  },

  setConfig(config: DBConfig) {
    localStorage.setItem('alasimh_db_v4_config', JSON.stringify(config));
  },

  async getAllData() {
    const config = this.getConfig();
    
    // إذا لم يتم إعداد MySQL، نرجع فارغاً ليقوم التطبيق باستخدام البيانات الافتراضية لأول مرة فقط
    if (config.mode !== 'mysql' || !config.apiUrl) {
      console.warn("[DB] MySQL not configured. Using local fallback.");
      return null;
    }

    try {
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetch_all', dbConfig: config })
      });
      
      const result = await response.json();
      if (result.success) {
        console.log("[DB] Cloud Data Loaded Successfully");
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (e) {
      console.error("[DB] MySQL Fetch Error:", e);
      return null;
    }
  },

  async updateTable(tableName: string, data: any) {
    const config = this.getConfig();
    
    // لا نحفظ في localStorage هنا، نرسل للسيرفر مباشرة
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
        if (result.success) {
           console.log(`[DB] ${tableName} synchronized with Cloud DB`);
        }
        return { success: result.success };
      } catch (e) {
        console.error(`[DB] Failed to sync ${tableName}:`, e);
        return { success: false, error: e };
      }
    }
    return { success: true };
  }
};

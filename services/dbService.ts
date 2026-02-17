
export interface DBConfig {
  host: string;
  dbName: string;
  user: string;
  pass: string;
  mode: 'mysql';
  apiUrl: string;
}

export const dbService = {
  // نحفظ فقط بيانات الاتصال لنعرف كيف نتصل بالسيرفر
  getConfig(): DBConfig | null {
    const saved = localStorage.getItem('alasimh_db_auth');
    return saved ? JSON.parse(saved) : null;
  },

  setConfig(config: DBConfig) {
    localStorage.setItem('alasimh_db_auth', JSON.stringify(config));
  },

  async getAllData() {
    const config = this.getConfig();
    if (!config || !config.apiUrl) return null;

    try {
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetch_all', dbConfig: config })
      });
      const result = await response.json();
      if (result.success) return result.data;
      return null;
    } catch (e) {
      console.error("[CLOUD SYNC ERROR]", e);
      return null;
    }
  },

  async updateTable(tableName: string, data: any) {
    const config = this.getConfig();
    if (!config || !config.apiUrl) return { success: false };

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
};

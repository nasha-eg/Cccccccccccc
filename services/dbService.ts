
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
  // Config is stored locally to know where to connect
  getConfig(): DBConfig {
    const saved = localStorage.getItem('alasimh_cloud_v5');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  },

  setConfig(config: DBConfig) {
    localStorage.setItem('alasimh_cloud_v5', JSON.stringify(config));
  },

  async getAllData() {
    const config = this.getConfig();
    if (config.mode !== 'mysql' || !config.apiUrl) {
      console.warn("[CLOUD DB] MySQL not configured. No data fetched.");
      return null;
    }

    try {
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetch_all', dbConfig: config })
      });
      const result = await response.json();
      return result.success ? result.data : null;
    } catch (e) {
      console.error("[CLOUD DB] Connection Error:", e);
      return null;
    }
  },

  async updateTable(tableName: string, data: any) {
    const config = this.getConfig();
    if (config.mode === 'mysql' && config.apiUrl) {
      try {
        const response = await fetch(config.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'sync', table: tableName, content: data, dbConfig: config })
        });
        const result = await response.json();
        return { success: result.success };
      } catch (e) {
        console.error(`[CLOUD DB] Update failed for ${tableName}:`, e);
        return { success: false, error: e };
      }
    }
    return { success: true };
  }
};

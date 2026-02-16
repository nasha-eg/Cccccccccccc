
// Fix: Removed Offer and Article from App.tsx import as they are not exported there.
import { SiteSettings, Product, GalleryItem, Testimonial, StatItem, CertificateItem } from '../App';
// Fix: Import Offer and Article directly from their source files.
import { Offer } from '../components/Offers';
import { Article } from '../components/Blog';

// ملاحظة مهندس النظام: 
// للربط الفعلي بـ MySQL، قم بتغيير API_BASE_URL إلى رابط السيرفر الخاص بك (PHP أو Node.js)
const API_BASE_URL = '/api'; 

export const dbService = {
  // جلب كافة بيانات الموقع
  async getAllData() {
    try {
      // محاكاة طلب للسيرفر
      // في الإنتاج الحقيقي: const response = await fetch(`${API_BASE_URL}/get_all_data.php`);
      // return await response.json();

      // حالياً نستخدم localStorage كقاعدة بيانات محلية سريعة
      const keys = ['site_settings', 'site_products', 'site_gallery', 'site_testimonials', 'site_offers', 'site_articles', 'site_stats', 'site_certs'];
      const data: any = {};
      keys.forEach(key => {
        const saved = localStorage.getItem(key);
        data[key] = saved ? JSON.parse(saved) : null;
      });
      return data;
    } catch (error) {
      console.error("Database Fetch Error:", error);
      return null;
    }
  },

  // تحديث أي جدول في قاعدة البيانات
  async updateTable(tableName: string, data: any) {
    try {
      console.log(`[DB Sync] Updating table: ${tableName}...`);
      
      // في الإنتاج الحقيقي يتم الإرسال للسيرفر:
      /*
      const response = await fetch(`${API_BASE_URL}/update_data.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: tableName, content: data })
      });
      return await response.json();
      */

      // محاكاة نجاح العملية في البيئة الحالية
      localStorage.setItem(tableName, JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error("Database Update Error:", error);
      return { success: false, error };
    }
  }
};

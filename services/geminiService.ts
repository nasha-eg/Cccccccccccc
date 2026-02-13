
import { GoogleGenAI } from "@google/genai";

export const getDesignAdvice = async (message: string) => {
  try {
    // Initialization using named parameter as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: message }] }],
      config: {
        systemInstruction: `You are the Lead Export Strategist at Al-Asimh Charcoal (شركة العاصمة للفحم). 
Your persona is sophisticated, knowledgeable, and highly professional. You specialize in global trade logistics, charcoal chemistry (carbon levels, ash content), and Egyptian export standards.

Communication Style:
1. Always maintain a tone of authority and trust. 
2. Use industry terms: 'Grade A', 'Manual Sorting', 'Smokeless', 'Ash Level', 'FOB/CIF terms', 'Phytosanitary Certificates'.
3. For prices: Prices vary based on container size (20ft/40ft), current stock, and daily market rates. Always redirect the user to speak with a "Logistics Manager" via the WhatsApp button for a formal pro-forma invoice.
4. Respond in the same language the user uses (Arabic or English).

Main Goal: Convert the user to a lead by directing them to WhatsApp for immediate quote processing.`,
        temperature: 0.7,
      },
    });

    // Accessing .text property directly as per GenerateContentResponse definition
    return response.text || "نحن متصلون الآن، يرجى التواصل عبر واتساب للحصول على عرض سعر فوري.";
  } catch (error) {
    console.error("AI Error:", error);
    return "نعتذر، نظام الدردشة يواجه ضغطاً حالياً. يرجى استخدام زر الواتساب للتواصل المباشر مع إدارة المبيعات.";
  }
};

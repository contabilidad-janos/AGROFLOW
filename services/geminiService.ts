
import { GoogleGenAI } from "@google/genai";

export const analyzeCropImage = async (base64Image: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
      console.error("VITE_GEMINI_API_KEY is missing");
      return "Error: Clave de API no configurada.";
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image.split(',')[1],
    },
  };

  const textPart = {
    text: "Analiza esta imagen de un cultivo. Identifica posibles deficiencias de nutrientes, plagas o sugerencias de tratamiento. Responde en español de forma concisa para un agricultor en campo."
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [imagePart, textPart] },
    });
    return response.text || "No se pudo obtener un análisis claro.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error al conectar con la inteligencia artificial.";
  }
};

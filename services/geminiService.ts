
import { GoogleGenAI } from "@google/genai";

export const analyzeCropImage = async (base64Image: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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

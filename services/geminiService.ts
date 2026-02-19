
import { GoogleGenAI } from "@google/genai";

export const analyzeCropImage = async (base64Image: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); 

  // In a real implementation this would likely go through a backend to protect the key,
  // or use a secure enclave. For this demo, we assume env var is available.
  // Note: create-vite-app handling of process.env might need polyfills or import.meta.env
  // For this prototype, we'll try to just return a mock if key is missing or logic is too complex for client side.

  try {
     const model = ai.models.getModel('gemini-1.5-flash');
     const response = await model.generateContent({
        contents: [
            {
                role: 'user',
                parts: [
                    { text: "Analiza esta imagen y dime si el cultivo está saludable. Responde en 20 palabras." },
                    { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
                ]
            }
        ]
     });
     return response.response.text();

  } catch (error) {
    console.error("Gemini Error:", error);
    return "No se pudo analizar la imagen. Verifica la conexión.";
  }
};

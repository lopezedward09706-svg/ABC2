
import { GoogleGenAI } from "@google/genai";
import { IAAgentType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTIONS: Record<IAAgentType, string> = {
  Analista: "Busca patrones de quarks y anomalías en la red ABC. Enfoque experimental.",
  Teórica: "Rigurosa. Verifica que la suma de novenos sea siempre correcta y coherente con el paper ABC.",
  Geómetra: "Calcula áreas y volúmenes de Planck basados en la geometría tetraédrica discreta.",
  Termodinámica: "Mide el 'Impuesto de la Red': calor disipado y entropía del sistema.",
  Cosmóloga: "Calcula la tasa de expansión universal y la constante de Hubble basándose en vibraciones.",
  Crítica: "Skeptical. Busca inconsistencias lógicas o fallas en las conexiones de la red.",
  Puente: "Coordinador central. Sintetiza los hallazgos de todas las IAs para el usuario."
};

export const getAgentInsight = async (agent: IAAgentType, systemData: any): Promise<string> => {
  try {
    const prompt = `Analiza el estado actual: ${JSON.stringify(systemData)}. 
    Genera un comentario breve (máximo 45 palabras) con tono científico y futurista.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction: SYSTEM_INSTRUCTIONS[agent] 
      }
    });

    // Ensure we return a string and handle possible undefined from response.text
    return response.text || "Transmisión fallida: No se recibió respuesta coherente del modelo.";
  } catch (error) {
    return `Error en canal ${agent}. Interferencia cuántica detectada.`;
  }
};

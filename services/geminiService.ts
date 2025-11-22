
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string.
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generatePromptFromImage = async (file: File): Promise<AnalysisResult> => {
  try {
    const imagePart = await fileToGenerativePart(file);

    const prompt = `
      Act as an expert prompt engineer for AI image generators like Midjourney, Stable Diffusion, and DALL-E 3. 
      Analyze the uploaded image in extreme detail. 
      
      1. Write a high-quality, descriptive text prompt in English that would recreate this exact image.
      2. Translate that exact prompt into high-quality Simplified Chinese (zh-CN), optimized for AI understanding if possible.

      Include details about:
      - Subject matter (characters, objects, scene).
      - Art style (e.g., photorealistic, oil painting, 3D render, anime, cinematic).
      - Lighting (e.g., natural, volumetric, studio, neon).
      - Color palette (e.g., vibrant, pastel, monochrome, warm/cool tones).
      - Composition and camera angle.
      - Mood and atmosphere.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          imagePart,
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            english: { type: Type.STRING, description: "The detailed image generation prompt in English" },
            chinese: { type: Type.STRING, description: "The detailed image generation prompt translated to Simplified Chinese" }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("Error generating prompt:", error);
    throw error;
  }
};


import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ImageGenerationOptions } from "../types";

// Helper function to safely access environment variables
const getEnv = (key: string): string | undefined => {
  // 1. Try import.meta.env (Vite standard)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      const val = import.meta.env[`VITE_${key}`];
      if (val) return val;
    }
  } catch (e) {
    // Ignore errors if import.meta is not available
  }

  // 2. Fallback to process.env
  if (typeof process !== 'undefined' && process.env) {
     return process.env[`VITE_${key}`] || process.env[key];
  }
  return undefined;
};

// Configuration interface
interface AIConfig {
  provider: string;
  apiKey: string | undefined;
  baseUrl: string | undefined;
  model: string | undefined;
  // Specific config for Image Generation
  imgGenApiKey: string | undefined;
  imgGenBaseUrl: string | undefined;
  imgGenModel: string | undefined;
}

// Load config
const config: AIConfig = {
  provider: (getEnv('AI_PROVIDER') || 'gemini').toLowerCase(),
  apiKey: getEnv('API_KEY'), 
  baseUrl: getEnv('AI_BASE_URL'),
  model: getEnv('AI_MODEL'),
  
  // Image Gen Specifics (Fallback to main config if not set)
  imgGenApiKey: getEnv('IMG_GEN_API_KEY') || getEnv('API_KEY'),
  imgGenBaseUrl: getEnv('IMG_GEN_BASE_URL') || getEnv('AI_BASE_URL'),
  imgGenModel: getEnv('IMG_GEN_MODEL') || getEnv('AI_MODEL'),
};

/**
 * Converts a File object to a Base64 string.
 */
const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const SYSTEM_PROMPT = `
Act as an expert prompt engineer for AI image generators like Midjourney, Stable Diffusion, and DALL-E 3. 
Analyze the uploaded image in extreme detail. 

1. Write a high-quality, descriptive text prompt in English that would recreate this exact image.
2. Translate that exact prompt into high-quality Simplified Chinese (zh-CN).

Include details about:
- Subject matter (characters, objects, scene).
- Art style (e.g., photorealistic, oil painting, 3D render, anime, cinematic).
- Lighting (e.g., natural, volumetric, studio, neon).
- Color palette.
- Composition and camera angle.
- Mood and atmosphere.

Output MUST be a strict JSON object with keys "english" and "chinese".
`;

const generateWithGemini = async (file: File, base64Data: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ 
    apiKey: config.apiKey!,
    baseUrl: config.baseUrl
  });
  
  const modelName = config.model || 'gemini-2.5-flash';
  
  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType: file.type,
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          imagePart,
          { text: SYSTEM_PROMPT }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            english: { type: Type.STRING },
            chinese: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    throw new Error("API 返回了空内容，请重试。");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    handleError(error, "Gemini");
    throw error; 
  }
};

const generateWithOpenAI = async (file: File, base64Data: string): Promise<AnalysisResult> => {
  const modelName = config.model || 'gpt-4o';
  let url = config.baseUrl || 'https://api.openai.com/v1';
  
  if (!url.endsWith('/chat/completions')) {
      url = `${url.replace(/\/+$/, '')}/chat/completions`;
  }
  
  const payload = {
    model: modelName,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that outputs strictly valid JSON."
      },
      {
        role: "user",
        content: [
          { type: "text", text: SYSTEM_PROMPT },
          {
            type: "image_url",
            image_url: {
              url: `data:${file.type};base64,${base64Data}`
            }
          }
        ]
      }
    ],
    response_format: { type: "json_object" }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      await handleHttpError(response, "OpenAI");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) throw new Error("API 返回了空内容");
    
    return JSON.parse(content) as AnalysisResult;
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string, options: ImageGenerationOptions): Promise<string> => {
  // Use Image Gen specific API Key if available, otherwise main key
  const apiKey = config.imgGenApiKey;
  
  if (!apiKey) {
    throw new Error("未配置画图 API KEY (VITE_IMG_GEN_API_KEY 或 VITE_API_KEY)。请检查 .env 配置。");
  }

  let fullPrompt = prompt;
  if (options.style && options.style !== 'none') {
    fullPrompt = `${prompt}, art style: ${options.style}, high quality, detailed`;
  }

  // Determine Provider based on Selected Model from Env or Options
  // If options.model is passed from UI, use it. Otherwise use config.imgGenModel. 
  const selectedModel = (options.model || config.imgGenModel || 'gemini-2.5-flash-image').toLowerCase();
  
  const isOpenAI = selectedModel.includes('dall') || selectedModel.includes('gpt');

  if (isOpenAI) {
    return generateImageWithOpenAI(fullPrompt, options, apiKey);
  } else {
    return generateImageWithGemini(fullPrompt, options, apiKey);
  }
};

const generateImageWithGemini = async (prompt: string, options: ImageGenerationOptions, apiKey: string): Promise<string> => {
    const ai = new GoogleGenAI({ 
        apiKey: apiKey,
        baseUrl: config.imgGenBaseUrl || config.baseUrl // Use ImgGen Base URL if set
    });

    // Use the specific model from options (dropdown) or env
    let modelToUse = options.model || config.imgGenModel || 'gemini-2.5-flash-image';
    
    // Fallback for generic names if accidentally passed
    if (modelToUse === 'gemini' || modelToUse === 'gemini-2.5-flash') {
        modelToUse = 'gemini-2.5-flash-image';
    }

    try {
        const parts: any[] = [];
        
        if (options.referenceImage) {
            const base64 = await fileToBase64(options.referenceImage);
            parts.push({
                inlineData: {
                    data: base64,
                    mimeType: options.referenceImage.type
                }
            });
            parts.push({ text: "Based on this reference image, " + prompt });
        } else {
            parts.push({ text: prompt });
        }

        const response = await ai.models.generateContent({
            model: modelToUse,
            contents: { parts: parts },
            config: {
                imageConfig: {
                    aspectRatio: options.aspectRatio,
                }
            }
        });

        if (response.candidates?.[0]?.content?.parts) {
            let textResponse = '';
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
                if (part.text) {
                    textResponse += part.text;
                }
            }
            if (textResponse) {
                 throw new Error(`API 拒绝生成 (可能包含敏感内容): ${textResponse}`);
            }
        }
        throw new Error("API 未返回图片数据，也未返回错误说明。");
    } catch (error: any) {
        console.error("Gemini Image Gen Error:", error);
        handleError(error, "Gemini Image");
        throw error;
    }
};

const generateImageWithOpenAI = async (prompt: string, options: ImageGenerationOptions, apiKey: string): Promise<string> => {
    let url = config.imgGenBaseUrl || config.baseUrl || 'https://api.openai.com/v1';
    if (!url.endsWith('/images/generations')) {
        url = `${url.replace(/\/+$/, '')}/images/generations`;
    }

    let size = "1024x1024";
    if (options.aspectRatio === '16:9') size = "1792x1024"; 
    if (options.aspectRatio === '9:16') size = "1024x1792"; 
    
    const payload = {
        model: options.model || config.imgGenModel || "dall-e-3",
        prompt: prompt,
        n: 1,
        size: size,
        response_format: "b64_json"
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            await handleHttpError(response, "OpenAI Image");
        }

        const data = await response.json();
        const b64 = data.data?.[0]?.b64_json;
        if (b64) {
            return `data:image/png;base64,${b64}`;
        }
        const imgUrl = data.data?.[0]?.url;
        if (imgUrl) return imgUrl;

        throw new Error("未生成图片数据");
    } catch (error: any) {
        console.error("OpenAI Image Gen Error:", error);
        throw error;
    }
};

const handleError = (error: any, provider: string) => {
    const errorMsg = error.message || error.toString();
    if (errorMsg.includes("400")) throw new Error(`请求无效 (400): ${errorMsg}`);
    if (errorMsg.includes("401")) throw new Error(`${provider} API Key 无效 (401)。请检查 .env 配置。`);
    if (errorMsg.includes("403")) throw new Error("没有权限 (403)。");
    if (errorMsg.includes("429")) throw new Error("请求过于频繁 (429)。");
    if (errorMsg.includes("500")) throw new Error(`${provider} 服务错误 (5xx)。`);
    throw new Error(`${provider} 错误: ${errorMsg}`);
};

const handleHttpError = async (response: Response, context: string) => {
    if (response.status === 401) throw new Error(`${context} API Key 无效 (401)。如果您使用的是 Gemini Key，请确保配置的模型正确。`);
    if (response.status === 429) throw new Error("请求过于频繁 (429)。");
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `请求失败: ${response.statusText}`);
};

export const generatePromptFromImage = async (file: File): Promise<AnalysisResult> => {
  if (!config.apiKey) {
    throw new Error("未配置 API KEY。请在项目根目录创建 .env 文件并配置 VITE_API_KEY。");
  }
  const base64Data = await fileToBase64(file);
  if (config.provider === 'openai') {
    return generateWithOpenAI(file, base64Data);
  } else {
    return generateWithGemini(file, base64Data);
  }
};

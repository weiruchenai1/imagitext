import { AnalysisResult, ImageGenerationOptions } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const generatePromptFromImage = async (file: File): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/api/analyze-image`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `请求失败 (${response.status})`);
  }

  return await response.json();
};

export const generatePromptFromImageUrl = async (imageUrl: string): Promise<AnalysisResult> => {
  const response = await fetch(`${API_BASE_URL}/api/analyze-image-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ imageUrl })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `请求失败 (${response.status})`);
  }

  return await response.json();
};

export const generateImage = async (prompt: string, options: ImageGenerationOptions): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      aspectRatio: options.aspectRatio,
      style: options.style,
      model: options.model
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `请求失败 (${response.status})`);
  }

  const data = await response.json();
  return data.url;
};

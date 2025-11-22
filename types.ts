
export interface AnalysisResult {
  english: string;
  chinese: string;
}

export enum UploadType {
  FILE = 'FILE',
  URL = 'URL'
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export type Language = 'zh' | 'en';

export type View = 'image-to-prompt' | 'ai-painting';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface ImageGenerationOptions {
  aspectRatio: AspectRatio;
  style?: string;
  referenceImage?: File | null;
  model?: string;
}
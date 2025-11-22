
import React, { useState, useRef, useEffect } from 'react';
import { generateImage } from '../services/aiService';
import { translations } from '../translations';
import { AspectRatio } from '../types';

interface AIPaintingProps {
  lang: 'zh' | 'en';
}

const STORAGE_KEY_PROMPT = 'imagitext_painting_prompt';
const STORAGE_KEY_RESULT = 'imagitext_painting_result';
const STORAGE_KEY_SETTINGS = 'imagitext_painting_settings'; // Saves style, ratio, model

const RANDOM_PROMPTS = [
  "A futuristic city floating in the clouds, cyberpunk style, neon lights, 8k resolution",
  "A cute cat wearing astronaut suit sitting on the moon, digital art, vibrant colors",
  "An ancient temple hidden in a deep jungle, cinematic lighting, photorealistic, mist",
  "A portrait of a robot girl with flowers growing from her head, surrealism, oil painting style",
  "A cozy cabin in snowy mountains at sunset, warm lighting, peaceful atmosphere, 3d render",
  "An underwater kingdom with glowing jellyfishes and mermaids, fantasy art, detailed",
  "A vintage car driving on a coastal road in summer, retro style, lo-fi aesthetic"
];

export const AIPainting: React.FC<AIPaintingProps> = ({ lang }) => {
  const t = translations[lang].painting;
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Settings State
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [style, setStyle] = useState('none');
  const [model, setModel] = useState(''); 
  const [refImage, setRefImage] = useState<File | null>(null);
  const [isDraggingRef, setIsDraggingRef] = useState(false);
  
  const refInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize model options
  const [modelOptions, setModelOptions] = useState<{value: string, label: string}[]>([]);

  useEffect(() => {
    // Helper to get env
    const getEnv = (key: string) => {
         // @ts-ignore
         if (typeof import.meta !== 'undefined' && import.meta.env) return import.meta.env[`VITE_${key}`];
         // @ts-ignore
         if (typeof process !== 'undefined' && process.env) return process.env[`VITE_${key}`];
         return null;
    };

    // 1. Load Persisted Data
    const savedPrompt = localStorage.getItem(STORAGE_KEY_PROMPT);
    const savedResult = localStorage.getItem(STORAGE_KEY_RESULT);
    const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);

    if (savedPrompt) setPrompt(savedPrompt);
    if (savedResult) setResultUrl(savedResult);
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            if (settings.aspectRatio) setAspectRatio(settings.aspectRatio);
            if (settings.style) setStyle(settings.style);
            if (settings.model) setModel(settings.model);
        } catch (e) {}
    }

    // 2. Configure Models
    const imgGenModelEnv = getEnv('IMG_GEN_MODEL');
    const options: {value: string, label: string}[] = [];
    
    if (imgGenModelEnv) {
        // Support comma separated models e.g. "dall-e-3,gemini-2.5-flash-image"
        const models = imgGenModelEnv.split(',');
        models.forEach(m => {
            const trimmed = m.trim();
            if (trimmed) options.push({ value: trimmed, label: trimmed });
        });
    }
    
    // Fallbacks if nothing parsed
    if (options.length === 0) {
        const aiModel = getEnv('AI_MODEL');
        if (aiModel && (aiModel.includes('image') || aiModel.includes('dall'))) {
             options.push({ value: aiModel, label: aiModel });
        } else {
             options.push({ value: 'gemini-2.5-flash-image', label: 'Gemini 2.5 Flash Image (Default)' });
        }
    }

    setModelOptions(options);
    
    // Only set default model if we didn't restore one, or if restored one is invalid
    setModel(prev => {
        const exists = options.find(o => o.value === prev);
        return exists ? prev : options[0].value;
    });

  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Clear previous result from view and storage to avoid confusion
    setResultUrl(null);
    localStorage.removeItem(STORAGE_KEY_RESULT);

    setIsLoading(true);
    setError(null);

    // Save settings immediately
    localStorage.setItem(STORAGE_KEY_PROMPT, prompt);
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify({ aspectRatio, style, model }));

    try {
      const url = await generateImage(prompt, {
        aspectRatio,
        style,
        referenceImage: refImage,
        model: model
      });
      
      setResultUrl(url);
      localStorage.setItem(STORAGE_KEY_RESULT, url);

    } catch (err: any) {
      console.error(err);
      setError(err.message || t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `ai-painting-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRandomPrompt = () => {
    const random = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    setPrompt(random);
  };

  // Reference Image Handlers
  const handleRefFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
        setRefImage(file);
    }
  };

  const onRefInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        handleRefFileSelect(e.target.files[0]);
    }
  };

  const handleRefDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingRef(true);
  };

  const handleRefDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingRef(false);
  };

  const handleRefDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingRef(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleRefFileSelect(e.dataTransfer.files[0]);
    }
  };

  const toggleModal = () => {
    if (resultUrl) setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 pb-10">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5); 
          border-radius: 20px; 
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(115, 115, 115, 0.5); 
        }
      `}</style>

      {/* Title Header */}
      <div className="text-center mb-8">
        <div className="mb-4 p-3 bg-white dark:bg-[#252525] rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-700 w-14 h-14 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-black dark:text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t.title}</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT SIDEBAR: CONTROLS */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-[#252525] rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-700 p-5 space-y-5">
            
            {/* Aspect Ratio */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {t.settings.ratio}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['1:1', '16:9', '9:16', '4:3', '3:4'] as AspectRatio[]).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2 py-2 text-xs font-medium rounded-lg border transition-all ${
                      aspectRatio === ratio
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                        : 'bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-neutral-600 hover:border-slate-300 dark:hover:border-neutral-500'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div>
               <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {t.settings.style}
              </label>
              <div className="relative">
                  <select 
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-600 rounded-xl text-sm text-slate-700 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors appearance-none cursor-pointer"
                  >
                    <option value="none">{t.settings.styles.none}</option>
                    <option value="cinematic">{t.settings.styles.cinematic}</option>
                    <option value="anime">{t.settings.styles.anime}</option>
                    <option value="photography">{t.settings.styles.photography}</option>
                    <option value="digital">{t.settings.styles.digital}</option>
                    <option value="oil">{t.settings.styles.oil}</option>
                    <option value="cyberpunk">{t.settings.styles.cyberpunk}</option>
                    <option value="sketch">{t.settings.styles.sketch}</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                  </div>
              </div>
            </div>

             {/* Model Selection (Dropdown) */}
             <div>
               <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {t.settings.model}
              </label>
              <div className="relative">
                <select 
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-600 rounded-xl text-sm text-slate-700 dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors appearance-none cursor-pointer"
                >
                    {modelOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                  </div>
              </div>
            </div>

             {/* Random Prompt */}
            <button 
              type="button"
              onClick={handleRandomPrompt}
              className="w-full py-2.5 mt-4 bg-slate-100 dark:bg-neutral-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium hover:bg-slate-200 dark:hover:bg-neutral-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
              </svg>
              {t.settings.random}
            </button>

          </div>
        </div>

        {/* RIGHT SIDE: INPUT & RESULT */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-[#252525] rounded-2xl shadow-xl border border-slate-100 dark:border-neutral-700 overflow-hidden p-6 min-h-[500px] flex flex-col">
            
            <form onSubmit={handleSubmit} className="flex-shrink-0">
              {/* Reference Image Upload (Optional) */}
              <div className="mb-4">
                 <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    {t.settings.refImage}
                 </label>
                 {!refImage ? (
                   <div 
                     onClick={() => refInputRef.current?.click()}
                     onDragOver={handleRefDragOver}
                     onDragLeave={handleRefDragLeave}
                     onDrop={handleRefDrop}
                     className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all duration-300 ${
                        isDraggingRef 
                          ? 'border-black dark:border-white bg-slate-50 dark:bg-neutral-800' 
                          : 'border-slate-200 dark:border-neutral-600 hover:bg-slate-50 dark:hover:bg-neutral-800'
                     }`}
                   >
                     <input 
                       type="file" 
                       ref={refInputRef} 
                       className="hidden" 
                       accept="image/*" 
                       onChange={onRefInputChange}
                     />
                     <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 py-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span className="text-xs font-medium">{t.settings.refDrag}</span>
                     </div>
                   </div>
                 ) : (
                   <div className="relative w-full h-20 bg-slate-100 dark:bg-neutral-800 rounded-xl overflow-hidden flex items-center justify-start border border-slate-200 dark:border-neutral-600 pl-2">
                      <img src={URL.createObjectURL(refImage)} className="h-16 w-16 object-cover rounded-lg" alt="Ref" />
                      <div className="ml-3 flex-1 overflow-hidden">
                          <p className="text-xs text-slate-700 dark:text-slate-200 truncate">{refImage.name}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setRefImage(null); }}
                        className="absolute top-2 right-2 p-1 bg-white dark:bg-black/50 rounded-full hover:bg-red-50 text-slate-500 hover:text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                      </button>
                   </div>
                 )}
              </div>

              <textarea
                className="custom-scrollbar w-full p-4 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all resize-none h-28 text-sm"
                placeholder={t.placeholder}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
              />
              
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="px-8 py-2.5 bg-black dark:bg-[#323232] text-white rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-[#404040] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10"
                >
                  {isLoading ? t.generatingBtn : t.generateBtn}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-800/30 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Result Area */}
            <div className="flex-1 mt-6 min-h-[300px] bg-slate-50 dark:bg-neutral-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-neutral-700 flex items-center justify-center relative overflow-hidden">
               {isLoading ? (
                  <div className="flex flex-col items-center">
                     <div className="w-12 h-12 border-4 border-slate-200 dark:border-neutral-600 border-t-black dark:border-t-white rounded-full animate-spin mb-4"></div>
                     <p className="text-slate-400 dark:text-slate-500 text-sm font-medium animate-pulse">{t.generatingBtn}</p>
                  </div>
               ) : resultUrl ? (
                  <div 
                    className="relative w-full h-full flex items-center justify-center p-4 group cursor-zoom-in"
                    onClick={toggleModal}
                  >
                     <img 
                        src={resultUrl} 
                        alt="Generated Art" 
                        className="max-w-full max-h-[400px] object-contain rounded-lg shadow-lg transition-transform duration-500 hover:scale-[1.02]" 
                     />
                     
                     {/* Download Button */}
                     <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                            className="bg-white dark:bg-black text-black dark:text-white px-4 py-2 rounded-lg shadow-xl font-medium text-sm flex items-center gap-2 hover:scale-105 transition-transform border border-slate-100 dark:border-neutral-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-4.5-4.5h9l-4.5 4.5M12 12.75V3" />
                            </svg>
                            {t.download}
                        </button>
                    </div>
                  </div>
               ) : (
                  <div className="text-center text-slate-400 dark:text-slate-500 p-8">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto mb-3 opacity-20">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      <p className="text-sm">{t.resultPlaceholder}</p>
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>

       {/* Lightbox Modal */}
       {isModalOpen && resultUrl && (
        <div 
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={toggleModal}
        >
            <button 
                className="absolute top-4 right-4 text-white/70 hover:text-white p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                onClick={toggleModal}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <img 
                src={resultUrl} 
                alt="Full screen art" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()} 
            />
        </div>
      )}

    </div>
  );
};

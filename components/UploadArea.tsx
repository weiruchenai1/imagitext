
import React, { useCallback, useState, useRef } from 'react';
import { UploadType } from '../types';
import { translations } from '../translations';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  t: typeof translations.zh.upload;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect, isLoading, t }) => {
  const [activeTab, setActiveTab] = useState<UploadType>(UploadType.FILE);
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      } else {
        alert(t.errorType);
      }
    }
  }, [onFileSelect, t]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  const triggerFileInput = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    
    setUrlError(null);
    
    try {
        // Attempt to fetch the image
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Failed to fetch image');
        
        const blob = await response.blob();
        if (!blob.type.startsWith('image/')) {
            setUrlError('The URL does not point to a valid image.');
            return;
        }
        
        const file = new File([blob], "downloaded_image", { type: blob.type });
        onFileSelect(file);
    } catch (err) {
        setUrlError(t.errorImage);
    }
  };

  return (
    <div className="bg-white dark:bg-[#252525] rounded-3xl shadow-xl border border-slate-100 dark:border-neutral-700 overflow-hidden max-w-md w-full mx-auto transition-colors duration-300">
      <div className="p-6">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-neutral-700 mb-6">
          <button
            className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
              activeTab === UploadType.FILE 
                ? 'text-black dark:text-white' 
                : 'text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            onClick={() => setActiveTab(UploadType.FILE)}
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              {t.tabFile}
            </div>
            {activeTab === UploadType.FILE && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black dark:bg-white rounded-t-full" />
            )}
          </button>
          <button
            className={`pb-3 px-4 text-sm font-medium transition-colors relative ${
              activeTab === UploadType.URL 
                ? 'text-black dark:text-white' 
                : 'text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            onClick={() => setActiveTab(UploadType.URL)}
          >
             <div className="flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              {t.tabUrl}
             </div>
             {activeTab === UploadType.URL && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black dark:bg-white rounded-t-full" />
            )}
          </button>
        </div>

        {/* Upload Zone */}
        {activeTab === UploadType.FILE ? (
          <div
            className={`relative group cursor-pointer transition-all duration-300 rounded-2xl border-2 border-dashed h-64 flex flex-col items-center justify-center ${
              isDragging 
                ? 'border-black bg-slate-50 dark:bg-neutral-800' 
                : 'border-slate-200 dark:border-neutral-600 bg-slate-50/50 dark:bg-neutral-800/50 hover:border-slate-400 dark:hover:border-white hover:bg-slate-50 dark:hover:bg-neutral-800'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
             <input 
               type="file" 
               ref={fileInputRef}
               className="hidden" 
               accept="image/png, image/jpeg, image/webp"
               onChange={handleFileInput}
               disabled={isLoading}
             />
            
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#323232] shadow-sm flex items-center justify-center mb-4 text-slate-400 dark:text-white group-hover:text-black dark:group-hover:text-white group-hover:scale-110 transition-all duration-300">
               {/* Fixed Upload Icon */}
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-300 font-medium">
              {t.dragDropTitle}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
              {t.dragDropSub}
            </p>
            
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-[#252525]/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mb-2"></div>
                    <p className="text-sm font-medium text-black dark:text-white animate-pulse">{t.analyzingText}</p>
                </div>
            )}
          </div>
        ) : (
          <div className="h-64 flex flex-col justify-center p-2">
             <form onSubmit={handleUrlSubmit} className="w-full">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t.urlLabel}</label>
                    <input 
                        type="url" 
                        placeholder={t.urlPlaceholder} 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-900 dark:text-white focus:border-black focus:ring-2 focus:ring-gray-200 dark:focus:ring-neutral-500 outline-none transition-all text-sm placeholder:text-slate-400 dark:placeholder:text-neutral-500"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    {urlError && <p className="text-red-500 dark:text-red-400 text-xs mt-2">{urlError}</p>}
                </div>
                <button 
                    type="submit"
                    disabled={isLoading || !imageUrl}
                    className="w-full py-3 rounded-xl bg-black dark:bg-[#323232] text-white font-semibold text-sm hover:bg-gray-800 dark:hover:bg-[#404040] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-slate-200 dark:shadow-none"
                >
                    {isLoading ? t.analyzingBtn : t.analyzeBtn}
                </button>
             </form>
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { translations } from '../translations';

interface ResultSectionProps {
  imageFile: File | null;
  savedImageUrl?: string | null; // Added prop for persisted image URL
  promptResult: AnalysisResult;
  onReset: () => void;
  t: typeof translations.zh.result;
}

export const ResultSection: React.FC<ResultSectionProps> = ({ imageFile, savedImageUrl, promptResult, onReset, t }) => {
  const [copied, setCopied] = useState(false);
  const [isChinese, setIsChinese] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use either the File object URL or the saved Base64 string
  const displayUrl = imageFile ? URL.createObjectURL(imageFile) : (savedImageUrl || '');

  if (!displayUrl) return null;

  const currentPrompt = isChinese ? promptResult.chinese : promptResult.english;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleLanguage = () => {
      setIsChinese(!isChinese);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-[#252525] rounded-3xl shadow-xl border border-slate-100 dark:border-neutral-700 overflow-hidden transition-colors duration-300">
        
        {/* Image Preview Header with Modal Trigger */}
        <div 
            className="relative h-48 bg-slate-100 dark:bg-neutral-800 overflow-hidden group cursor-zoom-in"
            onClick={toggleModal}
        >
            <img 
                src={displayUrl} 
                alt="Uploaded preview" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <span className="text-white text-xs font-medium bg-black/30 px-2 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M10 1a1 1 0 00-1 1v.5a.5.5 0 01-.5.5h-.5a.5.5 0 01-.5-.5V2a1 1 0 00-2 0v.5a.5.5 0 01-.5.5h-.25a.5.5 0 01-.5-.5V2a1 1 0 00-2 0v.5a.5.5 0 01-.5.5h-.5a.5.5 0 01-.5-.5V2a1 1 0 00-1 1v14a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1v.5a.5.5 0 01-.5.5h-.5a.5.5 0 01-.5-.5V2zM8 10a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                    </svg>
                    {t.viewOriginal}
                </span>
            </div>
        </div>

        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    {t.title}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-neutral-700 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-neutral-600 transition-all"
                        title={t.switchTo}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                        </svg>
                        {isChinese ? t.langLabel : "EN"}
                    </button>
                     <button 
                        onClick={handleCopy}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            copied 
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' 
                            : 'bg-slate-100 dark:bg-neutral-700 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-neutral-600'
                        }`}
                    >
                        {copied ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                                {t.copied}
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                    <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                                    <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                                </svg>
                                {t.copy}
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-neutral-800 rounded-xl p-4 border border-slate-100 dark:border-neutral-700 mb-6 min-h-[120px]">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-mono whitespace-pre-wrap break-words">
                    {currentPrompt}
                </p>
            </div>

            <button 
                onClick={onReset}
                className="w-full py-3 rounded-xl bg-black dark:bg-[#323232] text-white font-semibold text-sm hover:bg-gray-800 dark:hover:bg-[#404040] active:scale-[0.98] transition-all shadow-md shadow-slate-200 dark:shadow-none"
            >
                {t.generateNext}
            </button>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {isModalOpen && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={toggleModal}
        >
            <button 
                className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
                onClick={toggleModal}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <img 
                src={displayUrl} 
                alt="Full screen preview" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()} 
            />
        </div>
      )}
    </div>
  );
};

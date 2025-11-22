
import React from 'react';
import { View } from '../types';
import { translations } from '../translations';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: View;
  onViewChange: (view: View) => void;
  lang: 'zh' | 'en';
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentView, onViewChange, lang }) => {
  const t = translations[lang].menu;

  const handleViewClick = (view: View) => {
    onViewChange(view);
    onClose();
  };

  return (
    <>
      {/* Backdrop - below header z-30 */}
      <div 
        className={`fixed inset-0 top-16 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel - below header z-40 */}
      <div 
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-[#191919] border-r border-slate-100 dark:border-neutral-800 z-30 transform transition-transform duration-300 ease-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-2 mt-2">
          <button
            onClick={() => handleViewClick('image-to-prompt')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              currentView === 'image-to-prompt'
                ? 'bg-slate-100 dark:bg-[#323232] text-black dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {t.imgToPrompt}
          </button>

          <button
            onClick={() => handleViewClick('ai-painting')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              currentView === 'ai-painting'
                ? 'bg-slate-100 dark:bg-[#323232] text-black dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
            {t.aiPainting}
          </button>
        </nav>
      </div>
    </>
  );
};

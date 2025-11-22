
import React from 'react';
import { Language } from '../types';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  lang: Language;
  toggleLang: () => void;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme, lang, toggleLang, onMenuClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-16 px-4 sm:px-6 bg-white/80 dark:bg-[#191919]/80 backdrop-blur-md border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between transition-colors duration-300">
      
      {/* Left: Menu Button & Brand */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-white transition-colors"
          aria-label="Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 ml-1 select-none">
            <div className="bg-white dark:bg-black text-black dark:text-white p-1.5 rounded-lg border border-slate-200 dark:border-neutral-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
                </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-100 font-inter">ImagiText</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* GitHub Link */}
        <a
          href="https://github.com/weiruchenai1/imagitext"
          target="_blank"
          rel="noopener noreferrer"
          className="h-9 w-9 flex items-center justify-center rounded-full bg-transparent border border-slate-200 dark:border-neutral-700 text-black dark:text-white hover:bg-slate-50 dark:hover:bg-neutral-700 transition-all"
        >
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
            <path d="M9 18c-4.51 2-5-2-7-2"></path>
          </svg>
        </a>

        {/* Language Toggle */}
        <button
          onClick={toggleLang}
          className="h-9 px-3 rounded-full bg-transparent border border-slate-200 dark:border-neutral-700 text-black dark:text-white hover:bg-slate-50 dark:hover:bg-neutral-700 transition-all text-xs font-semibold tracking-wide"
        >
          {lang === 'zh' ? 'EN' : '中'}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="h-9 w-9 flex items-center justify-center rounded-full bg-transparent border border-slate-200 dark:border-neutral-700 text-black dark:text-white hover:bg-slate-50 dark:hover:bg-neutral-700 transition-all"
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
};

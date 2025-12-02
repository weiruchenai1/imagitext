
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { UploadArea } from './components/UploadArea';
import { ResultSection } from './components/ResultSection';
import { AIPainting } from './components/AIPainting';
import { generatePromptFromImage } from './services/aiService';
import { AnalysisResult, Language, View } from './types';
import { translations } from './translations';

const STORAGE_KEY_RESULT = 'imagitext_analysis_result';
const STORAGE_KEY_THEME = 'imagitext_theme';
const STORAGE_KEY_LANGUAGE = 'imagitext_language';

// Detect system color scheme preference
const getSystemTheme = (): boolean => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false; // Default to light if detection not available
};

// Get initial theme from localStorage or system preference
const getInitialTheme = (): boolean => {
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
  if (savedTheme !== null) {
    return savedTheme === 'dark';
  }
  return getSystemTheme();
};

// Get initial language from localStorage or default to Chinese
const getInitialLanguage = (): Language => {
  const savedLang = localStorage.getItem(STORAGE_KEY_LANGUAGE);
  if (savedLang === 'en' || savedLang === 'zh') {
    return savedLang;
  }
  return 'zh'; // Default to Chinese
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [promptResult, setPromptResult] = useState<AnalysisResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(getInitialTheme);
  const [lang, setLang] = useState<Language>(getInitialLanguage);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<View>('image-to-prompt');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    try {
      const savedResult = localStorage.getItem(STORAGE_KEY_RESULT);
      if (savedResult) {
        const parsed = JSON.parse(savedResult);
        // Validate data format - ensure it has the expected structure
        if (parsed && typeof parsed.english === 'string' && typeof parsed.chinese === 'string') {
          setPromptResult(parsed);
        } else {
          // Clear invalid old data
          localStorage.removeItem(STORAGE_KEY_RESULT);
        }
      }
    } catch (e) {
      console.error("Failed to load persisted data", e);
      localStorage.removeItem(STORAGE_KEY_RESULT);
    }
  }, []);

  // Theme toggle logic
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem(STORAGE_KEY_THEME, newTheme ? 'dark' : 'light');
  };

  const toggleLang = () => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    setLang(newLang);
    localStorage.setItem(STORAGE_KEY_LANGUAGE, newLang);
  };

  const handleFileSelect = async (file: File) => {
    setUploadedFile(file);
    setSavedImageUrl(null);
    setIsLoading(true);
    setError(null);
    setPromptResult(null);

    try {
      const result = await generatePromptFromImage(file);
      setPromptResult(result);

      localStorage.setItem(STORAGE_KEY_RESULT, JSON.stringify(result));

      const imageUrl = URL.createObjectURL(file);
      setSavedImageUrl(imageUrl);

    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : t.app.unknownError;
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlAnalysis = async (result: AnalysisResult) => {
    setUploadedFile(null);
    setSavedImageUrl(null);
    setPromptResult(result);
    localStorage.setItem(STORAGE_KEY_RESULT, JSON.stringify(result));
  };

  const handleReset = () => {
    setUploadedFile(null);
    setPromptResult(null);
    setSavedImageUrl(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY_RESULT);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#191919] pb-20 transition-colors duration-300">
      {/* Fixed Header */}
      <Header 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        lang={lang}
        toggleLang={toggleLang}
        onMenuClick={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentView={currentView}
        onViewChange={(view) => {
            setCurrentView(view);
            // Keep persisted data when switching views
        }}
        lang={lang}
      />

      {/* Main Content with Top Padding for Fixed Header */}
      <div className="max-w-3xl mx-auto pt-24 px-4">
        
        <main className="transition-all duration-500 ease-in-out">
          
          {/* VIEW: Image To Prompt */}
          {currentView === 'image-to-prompt' && (
             <>
                {!promptResult ? (
                  <div className={`transition-opacity duration-500 ${promptResult ? 'opacity-0 absolute pointer-events-none' : 'opacity-100'}`}>
                    {/* Title Section for Image to Prompt */}
                    <div className="text-center mb-10">
                        <div className="mb-5 p-4 bg-white dark:bg-[#252525] rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-700 w-16 h-16 flex items-center justify-center mx-auto transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-black dark:text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-3 tracking-tight transition-colors">
                            {t.upload.pageTitle}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-base transition-colors">
                            {t.upload.pageSubtitle}
                        </p>
                    </div>

                     <UploadArea
                        onFileSelect={handleFileSelect}
                        onUrlAnalysis={handleUrlAnalysis}
                        isLoading={isLoading}
                        t={t.upload}
                     />
                     
                     {error && (
                       <div className="mt-6 mx-auto max-w-md bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-red-600 dark:text-red-400">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                              </svg>
                          </div>
                          <div className="flex-1">
                              <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">{t.app.analysisFailed}</h3>
                              <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed">
                                  {error}
                              </p>
                          </div>
                          <button 
                              onClick={() => setError(null)}
                              className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                          >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                              </svg>
                          </button>
                       </div>
                     )}
                  </div>
                ) : (
                   <ResultSection 
                      imageFile={uploadedFile}
                      savedImageUrl={savedImageUrl}
                      promptResult={promptResult} 
                      onReset={handleReset} 
                      t={t.result}
                   />
                )}
             </>
          )}

          {/* VIEW: AI Painting */}
          {currentView === 'ai-painting' && (
             <AIPainting lang={lang} />
          )}

        </main>

        <footer className="mt-16 text-center px-6">
            <p className="text-xs text-slate-400 dark:text-slate-500">
                {t.app.poweredBy} AI Models
            </p>
            <p className="text-xs text-slate-300 dark:text-slate-600 mt-2">
                &copy; {new Date().getFullYear()} ImagiText. {t.app.rights}
            </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

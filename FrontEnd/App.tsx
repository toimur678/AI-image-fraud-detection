import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { ChatSection } from './components/ChatSection';
import { ExifDisplay } from './components/ExifDisplay';
import { analyzeImageWithGemini } from './services/geminiService';
import { AnalysisResult, AnalysisStatus, ExifAnalysis } from './types';
import { analyzeExif } from './services/exifService';
import { messageBus } from './services/messageBus';
import { useEffect } from 'react';
import { Language } from './translations';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exifInfo, setExifInfo] = useState<ExifAnalysis | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  
  // Timing state
  const [exifTime, setExifTime] = useState<number | null>(null);
  const [geminiTime, setGeminiTime] = useState<number | null>(null);
  
  // Store image data for the second step
  const [imageData, setImageData] = useState<{base64: string, mimeType: string, fileName: string} | null>(null);

  const logActivity = (fileName: string, eTime: number, gTime: number | 'N/A') => {
    const logEntry = {
      filename: fileName,
      scanDate: new Date().toISOString(),
      exifScanTimeMs: Math.round(eTime),
      geminiScanTimeMs: gTime === 'N/A' ? 'N/A' : Math.round(gTime)
    };

    try {
      // Save to localStorage as a mock "file"
      const existingLogs = JSON.parse(localStorage.getItem('activitylog') || '[]');
      existingLogs.push(logEntry);

      // Limit log size to prevent QuotaExceededError
      const MAX_LOGS = 50;
      if (existingLogs.length > MAX_LOGS) {
        existingLogs.splice(0, existingLogs.length - MAX_LOGS);
      }

      localStorage.setItem('activitylog', JSON.stringify(existingLogs));
      console.log('Activity Logged:', logEntry);
    } catch (e) {
      console.warn('Failed to save activity log to localStorage:', e);
    }
  };

  const handleImageSelected = async (
    file: File,
    base64: string,
    mimeType: string,
    preview: string
  ) => {
    setPreviewUrl(preview);
    setImageData({ base64, mimeType, fileName: file.name });
    setStatus('analyzing');
    setError(null);
    setResult(null);
    setExifInfo(null);
    setExifTime(null);
    setGeminiTime(null);

    try {
      const start = performance.now();
      // 1) EXIF check only
      const exif = await analyzeExif(file);
      const end = performance.now();
      const duration = end - start;
      
      setExifTime(duration);
      setExifInfo(exif);
      setStatus('complete'); // Finished EXIF step

      // Log initial EXIF scan
      logActivity(file.name, duration, 'N/A');

    } catch (err) {
      console.error(err);
      setError('Failed to analyze image metadata.');
      setStatus('error');
    }
  };

  // Helper to convert base64 URL to File object so analyzeExif can read it
  const base64ToFile = async (base64Url: string, fileName: string, mimeType: string) => {
    const res = await fetch(base64Url);
    const blob = await res.blob();
    return new File([blob], fileName, { type: mimeType });
  };

  useEffect(() => {
    const unsub = messageBus.subscribe(async (msg) => {
      try {
        if (msg.type === 'image-upload' && msg.payload) {
          const { base64, mimeType, fileName, preview } = msg.payload;
          const file = await base64ToFile(base64, fileName, mimeType);
          handleImageSelected(file, base64, mimeType, preview || base64);
        }

        if (msg.type === 'trigger-scan') {
          // Start second-step scan if imageData present
          handleContinueScan();
        }
      } catch (e) {
        console.error('Error handling support message', e);
      }
    });

    return () => { if (unsub) unsub(); };
  }, [imageData]);

  const handleContinueScan = async () => {
    if (!imageData) return;
    
    setStatus('analyzing');
    try {
      const start = performance.now();
      const analysis = await analyzeImageWithGemini(imageData.base64, imageData.mimeType);
      const end = performance.now();
      const duration = end - start;

      setGeminiTime(duration);
      setResult(analysis);
      setStatus('complete');

      // Update log with Gemini time
      if (exifTime !== null) {
        logActivity(imageData.fileName, exifTime, duration);
      }

    } catch (err) {
      console.error(err);
      setError('Failed to analyze image with AI.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setPreviewUrl(null);
    setError(null);
    setExifInfo(null);
    setImageData(null);
    setExifTime(null);
    setGeminiTime(null);
  };

  return (
    <div className="h-screen w-full bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-[#4a5fff] via-[#5c70ff] to-[#4a5fff] flex flex-col overflow-hidden font-sans text-white">
      <Header language={language} setLanguage={setLanguage} />
      
      <main className="flex-1 flex gap-4 px-6 pb-6 min-h-0">
        {/* Left Main Area 70% */}
        <div className="w-[70%] flex flex-col gap-4 h-full">
          
          {/* Top Section 40% (Reduced size) */}
          <div className="h-[40%] flex gap-4 min-h-0">
            {/* Left-Top-Left: Image Viewer */}
            <div className="w-1/2 bg-slate-900/90 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden relative flex flex-col shadow-2xl">
              <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white/80 border border-white/10">
                Evidence File
              </div>
              {previewUrl ? (
                <div className="w-full h-full p-4 flex items-center justify-center">
                  <img 
                    src={previewUrl} 
                    alt="Evidence" 
                    className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
                  />
                </div>
              ) : (
                <ImageUploader 
                  onImageSelected={handleImageSelected} 
                  isAnalyzing={status === 'analyzing'} 
                  language={language}
                />
              )}
            </div>

            {/* Left-Top-Right: Control Center */}
            <div className="w-1/2 bg-slate-900/90 backdrop-blur-md rounded-3xl border border-white/10 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
              <ResultDisplay 
                status={status}
                result={result}
                exifInfo={exifInfo}
                onScanNew={handleReset}
                onContinue={handleContinueScan}
                exifTime={exifTime}
                geminiTime={geminiTime}
                language={language}
                error={error}
              />
            </div>
          </div>

          {/* Bottom Section 60% (Increased size): EXIF Data */}
          <div className="h-[60%] bg-slate-900/90 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden flex flex-col min-h-0 shadow-2xl">
            <ExifDisplay exifData={exifInfo} language={language} />
          </div>
        </div>

        {/* Right Sidebar 30%: Customer Chat */}
        <div className="w-[30%] bg-slate-900/90 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden flex flex-col h-full shadow-2xl">
          <ChatSection 
            currentUser="agent" 
            onScanImage={(file, base64, mimeType) => handleImageSelected(file, base64, mimeType, base64)}
            language={language}
            result={result}
            exifInfo={exifInfo}
          />
        </div>
      </main>
    </div>
  );
};

export default App;


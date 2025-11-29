import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { analyzeImageWithGemini } from './services/geminiService';
import { AnalysisResult, AnalysisStatus, DetectionVerdict, ExifAnalysis } from './types';
import { AlertTriangle } from 'lucide-react';
import { analyzeExif } from './services/exifService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exifInfo, setExifInfo] = useState<ExifAnalysis | null>(null);

  const handleImageSelected = async (
    file: File,
    base64: string,
    mimeType: string,
    preview: string
  ) => {
    setPreviewUrl(preview);
    setStatus('analyzing');
    setError(null);
    setResult(null);
    setExifInfo(null);

    try {
      // 1) EXIF check
      const exif = await analyzeExif(file);
      setExifInfo(exif);

      if (!exif.isOriginal) {
        // STOP HERE – do not call Gemini
        const reasoning =
          exif.reasons.join(' ') +
          ' For fraud investigation, please upload an unedited photo taken directly from the device camera.';

        const exifBasedResult: AnalysisResult = {
          verdict: DetectionVerdict.NOT_SURE,
          confidence: 0,
          reasoning
        };

        setResult(exifBasedResult);
        setStatus('complete');
        return;
      }

      // 2) Call Gemini only when EXIF shows no obvious editing
      const analysis = await analyzeImageWithGemini(base64, mimeType);
      setResult(analysis);
      setStatus('complete');
    } catch (err) {
      console.error(err);
      setError('Failed to analyze image. Please try again or check your API key.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setPreviewUrl(null);
    setError(null);
    setExifInfo(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Was this image made by Google AI?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            First we inspect the EXIF metadata for edits, then we ask Gemini to check for AI signatures
            when the photo looks original.
          </p>
        </div>

        {status === 'idle' && (
          <ImageUploader 
            onImageSelected={handleImageSelected} 
            isAnalyzing={false} 
          />
        )}

        {status === 'error' && (
          <div className="max-w-xl mx-auto mt-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="bg-red-100 p-3 rounded-full mb-4">
                <AlertTriangle className="text-red-600 w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Analysis Failed</h3>
              <p className="text-slate-600 mb-6">{error}</p>
              <button 
                onClick={handleReset}
                className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {(status === 'analyzing' || status === 'complete') && (
          <ResultDisplay 
            result={result} 
            isLoading={status === 'analyzing'} 
            previewUrl={previewUrl}
            onReset={handleReset}
          />
        )}
      </main>
      
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} AI Detector. This tool uses EXIF + Gemini to detect AI and may make mistakes.</p>
      </footer>
    </div>
  );
};

export default App;

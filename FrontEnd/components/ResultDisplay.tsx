import React from 'react';
import { AnalysisResult, DetectionVerdict } from '../types';
import { CheckCircle2, XCircle, HelpCircle, AlertTriangle } from 'lucide-react';

interface ResultDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  previewUrl: string | null;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading, previewUrl, onReset }) => {
  if (!previewUrl) return null;

  const getVerdictColor = (verdict: DetectionVerdict) => {
    switch (verdict) {
      case DetectionVerdict.YES: return 'bg-purple-100 text-purple-700 border-purple-200';
      case DetectionVerdict.NO: return 'bg-green-100 text-green-700 border-green-200';
      case DetectionVerdict.NOT_SURE: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getVerdictIcon = (verdict: DetectionVerdict) => {
    switch (verdict) {
      case DetectionVerdict.YES: return <SparklesIcon className="w-12 h-12 text-purple-600" />;
      case DetectionVerdict.NO: return <CheckCircle2 className="w-12 h-12 text-green-600" />;
      case DetectionVerdict.NOT_SURE: return <HelpCircle className="w-12 h-12 text-amber-600" />;
      default: return null;
    }
  };

  const getVerdictHeadline = (verdict: DetectionVerdict) => {
    switch (verdict) {
      case DetectionVerdict.YES: return 'Likely Google AI';
      case DetectionVerdict.NO: return 'Likely Human / Other';
      case DetectionVerdict.NOT_SURE: return 'Uncertain';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 flex flex-col md:flex-row gap-8 items-start animate-fade-in">
      
      {/* Image Preview Column */}
      <div className="w-full md:w-1/2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative aspect-square md:aspect-auto md:h-[400px] w-full overflow-hidden rounded-xl bg-slate-100">
           <img 
            src={previewUrl} 
            alt="Analyzed content" 
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Result Column */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-50 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-800">Analyzing Image...</h3>
            <p className="text-slate-500 mt-2 text-center max-w-xs">
              Checking for visual artifacts, metadata patterns, and stylistic markers.
            </p>
          </div>
        ) : result ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm h-full flex flex-col">
            <div className="flex items-start justify-between mb-6">
               <div className={`px-4 py-2 rounded-full border text-sm font-semibold tracking-wide uppercase ${getVerdictColor(result.verdict)}`}>
                  AI Detection Result
               </div>
               {result.confidence > 0 && (
                 <div className="text-sm font-medium text-slate-400">
                   {result.confidence}% Confidence
                 </div>
               )}
            </div>

            <div className="flex flex-col items-center text-center mb-8">
               <div className="mb-4 p-4 rounded-full bg-slate-50">
                 {getVerdictIcon(result.verdict)}
               </div>
               <h2 className="text-3xl font-bold text-slate-900 mb-2">
                 {result.verdict}
               </h2>
               <p className="text-lg text-slate-600 font-medium">
                 {getVerdictHeadline(result.verdict)}
               </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100">
              <h4 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">Analysis</h4>
              <p className="text-slate-600 leading-relaxed">
                {result.reasoning}
              </p>
            </div>

            <div className="mt-auto">
              <button 
                onClick={onReset}
                className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Analyze Another Image
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

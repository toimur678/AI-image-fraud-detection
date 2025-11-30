import React from 'react';
import { AnalysisResult, DetectionVerdict, ExifAnalysis } from '../types';
import { CheckCircle2, HelpCircle, AlertTriangle, Scan, Upload, Sparkles, Clock } from 'lucide-react';
import { Language, translations } from '../translations';

interface ResultDisplayProps {
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  result: AnalysisResult | null;
  exifInfo: ExifAnalysis | null;
  onScanNew: () => void;
  onContinue: () => void;
  exifTime: number | null;
  geminiTime: number | null;
  language: Language;
  error?: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  status, 
  result, 
  exifInfo, 
  onScanNew, 
  onContinue,
  exifTime,
  geminiTime,
  language,
  error
}) => {
  const t = translations[language].resultDisplay;

  // State: Error
  if (status === 'error') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-400">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Analysis Failed</h3>
        <p className="text-white/60 text-sm max-w-xs leading-relaxed mb-4">
          {error || "An error occurred during analysis."}
        </p>
        <button
            onClick={onScanNew}
            className="py-1.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-semibold transition-all"
          >
            Try Again
          </button>
      </div>
    );
  }

  // State: Analyzing
  if (status === 'analyzing') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-400 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{t.scanning}</h3>
        <p className="text-white/60 text-sm">{exifInfo ? t.analyzingGemini : t.analyzing}</p>
      </div>
    );
  }

  // State: Idle (No image yet)
  if (status === 'idle') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 text-indigo-400">
          <Scan size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{t.ready}</h3>
        <p className="text-white/60 text-sm max-w-xs leading-relaxed">
          {t.uploadPrompt}
        </p>
      </div>
    );
  }

  // State: EXIF Done, Waiting for Gemini or Result
  const showContinue = exifInfo && !result && status !== 'error';
  const showResult = !!result;

  // Calculate score for display
  // For EXIF: if edited (not original) = high % red, if unedited (original) = low % green
  // For Gemini: confidence represents certainty of the verdict
  //   - If verdict is YES (AI) → show confidence as-is (high % = red)
  //   - If verdict is NO (Real) → invert confidence (high confidence in real = low % = green)
  const score = result 
    ? (result.verdict === DetectionVerdict.YES 
        ? result.confidence // AI detected: high % red
        : 100 - result.confidence) // Real detected: invert (95% confident it's real = 5% shown)
    : (exifInfo?.isOriginal ? 5 : 85); // EXIF: original=5% green, edited=85% red
  
  const scoreLabel = result 
    ? (result.verdict === DetectionVerdict.YES ? t.aiGenerated : t.realImage) 
    : (exifInfo?.isOriginal ? t.unedited : t.edited);
  
  const scoreColor = score > 50 ? 'text-red-400' : 'text-green-400';
  const ringColor = score > 50 ? 'stroke-red-500' : 'stroke-green-500';

  // Format time helper
  const formatTime = (ms: number | null) => ms ? `${Math.round(ms)}ms` : 'N/A';
  const totalTime = (exifTime || 0) + (geminiTime || 0);

  return (
    <div className="w-full h-full flex items-center justify-between animate-fade-in px-4 py-3">
      
      {/* Left Side: Score Circle */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Background Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="42"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-white/10"
            />
            {/* Progress Ring */}
            <circle
              cx="48"
              cy="48"
              r="42"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * score) / 100}
              strokeLinecap="round"
              className={`${ringColor} transition-all duration-1000 ease-out`}
            />
          </svg>
          
          {/* Center Text */}
          <div className="absolute flex flex-col items-center">
            <span className={`text-2xl font-bold ${scoreColor}`}>
              {score}%
            </span>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider mt-2">
          {scoreLabel}
        </span>
      </div>

      {/* Right Side: Info and Actions */}
      <div className="flex-1 flex flex-col justify-between h-full ml-4 min-w-0">
        
        {/* Top: Status and Timing Info */}
        <div className="flex flex-col gap-1.5">
          <div>
            <h2 className="text-lg font-bold text-white mb-0.5 break-words">
              {scoreLabel}
            </h2>
            <p className="text-white/70 text-xs">
              {showResult ? t.aiComplete : t.metaComplete}
            </p>
          </div>
          
          {/* Processing Time Info */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full border border-white/10 text-[11px] font-medium text-white/80 w-fit">
              <Clock size={11} />
              <span>{t.total}: {formatTime(totalTime)}</span>
            </div>
            {/* <div className="text-[9px] text-white/50 pl-1">
              EXIF: {formatTime(exifTime)} • AI: {formatTime(geminiTime)}
            </div> */}
          </div>
        </div>

        {/* Bottom: Action Buttons */}
        <div className="flex flex-col gap-2">
          {showContinue && (
            <button
              onClick={onContinue}
              className="w-full py-1.5 px-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-full text-sm font-semibold shadow-lg shadow-black/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} />
              <span className="truncate">{t.scanGemini}</span>
            </button>
          )}
          
          <button
            onClick={onScanNew}
            className={`w-full py-1.5 px-3 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-1.5
              ${showContinue 
                ? 'bg-white/10 border-2 border-white/20 text-white hover:bg-white/20' 
                : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-black/20'}
            `}
          >
            <Upload size={14} />
            <span className="truncate">{t.scanNew}</span>
          </button>
        </div>
      </div>
    </div>
  );
};


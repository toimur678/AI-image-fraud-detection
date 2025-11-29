import React from 'react';
import { AnalysisResult, DetectionVerdict, ExifAnalysis } from '../types';
import { CheckCircle2, HelpCircle, AlertTriangle, Scan, Upload, Sparkles, Clock } from 'lucide-react';

interface ResultDisplayProps {
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  result: AnalysisResult | null;
  exifInfo: ExifAnalysis | null;
  onScanNew: () => void;
  onContinue: () => void;
  exifTime: number | null;
  geminiTime: number | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  status, 
  result, 
  exifInfo, 
  onScanNew, 
  onContinue,
  exifTime,
  geminiTime
}) => {

  // State: Analyzing
  if (status === 'analyzing') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-400 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Scanning Image...</h3>
        <p className="text-white/60 text-sm">Analyzing metadata and visual patterns</p>
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
        <h3 className="text-xl font-bold text-white mb-2">Ready to Scan</h3>
        <p className="text-white/60 text-sm max-w-xs leading-relaxed">
          Upload an image to begin the forensic analysis process.
        </p>
      </div>
    );
  }

  // State: EXIF Done, Waiting for Gemini or Result
  const showContinue = exifInfo && !result && status !== 'error';
  const showResult = !!result;

  // Calculate score for display (Mock logic for now if not present)
  const score = result ? result.confidence : (exifInfo?.isOriginal ? 0 : 88);
  const scoreLabel = result ? (result.verdict === DetectionVerdict.YES ? 'Fake' : 'Real') : (exifInfo?.isOriginal ? 'Clean' : 'Suspicious');
  const scoreColor = score > 50 ? 'text-red-400' : 'text-green-400';
  const ringColor = score > 50 ? 'stroke-red-500' : 'stroke-green-500';

  // Format time helper
  const formatTime = (ms: number | null) => ms ? `${Math.round(ms)}ms` : 'N/A';
  const totalTime = (exifTime || 0) + (geminiTime || 0);

  return (
    <div className="w-full h-full flex items-center justify-between animate-fade-in px-6 py-4">
      
      {/* Left Side: Score Circle */}
      <div className="flex-shrink-0">
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Background Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="64"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-white/10"
            />
            {/* Progress Ring */}
            <circle
              cx="72"
              cy="72"
              r="64"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={402}
              strokeDashoffset={402 - (402 * score) / 100}
              strokeLinecap="round"
              className={`${ringColor} transition-all duration-1000 ease-out`}
            />
          </svg>
          
          {/* Center Text */}
          <div className="absolute flex flex-col items-center">
            <span className={`text-4xl font-bold ${scoreColor}`}>
              {score}%
            </span>
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider mt-1">
              {scoreLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Right Side: Info and Actions */}
      <div className="flex-1 flex flex-col justify-between h-full ml-6">
        
        {/* Top: Status and Timing Info */}
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 break-words">
              {showResult ? result?.verdict : (exifInfo?.isOriginal ? 'No' : 'Suspicious')}
            </h2>
            <p className="text-white/70 text-sm">
              {showResult ? 'AI Analysis Complete' : 'Metadata Analysis Complete'}
            </p>
          </div>
          
          {/* Processing Time Info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/10 text-xs font-medium text-white/80 w-fit">
              <Clock size={12} />
              <span>Total: {formatTime(totalTime)}</span>
            </div>
            <div className="text-[10px] text-white/50 pl-1">
              EXIF: {formatTime(exifTime)} • AI: {formatTime(geminiTime)}
            </div>
          </div>
        </div>

        {/* Bottom: Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {showContinue && (
            <button
              onClick={onContinue}
              className="w-full py-2 px-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-full font-semibold shadow-lg shadow-black/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              <span className="truncate">Scan with Gemini</span>
            </button>
          )}
          
          <button
            onClick={onScanNew}
            className={`w-full py-2 px-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2
              ${showContinue 
                ? 'bg-white/10 border-2 border-white/20 text-white hover:bg-white/20' 
                : 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-black/20'}
            `}
          >
            <Upload size={16} />
            <span className="truncate">Scan New File</span>
          </button>
        </div>
      </div>
    </div>
  );
};


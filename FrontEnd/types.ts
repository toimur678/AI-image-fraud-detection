export enum DetectionVerdict {
  YES = 'Yes',
  NO = 'No',
  NOT_SURE = 'Not sure'
}

export interface AnalysisResult {
  verdict: DetectionVerdict;
  confidence: number;
  reasoning: string;
}

export type AnalysisStatus = 'idle' | 'analyzing' | 'complete' | 'error';

// EXIF analysis
export interface ExifAnalysis {
  isOriginal: boolean;        // true = no obvious edits found
  reasons: string[];          // why we flagged as edited / original
  cameraMake?: string;
  cameraModel?: string;
  software?: string;
  hasGps: boolean;
  hasExif: boolean;
}

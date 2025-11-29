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

export interface GradCamRegion {
  x: number;
  y: number;
  r: number;
}

export interface AnalysisResult {
  diagnosis: 'Malignant' | 'Benign';
  confidence: number;
  limeExplanation: string;
  shapExplanation: string[];
  gradCamRegion: GradCamRegion;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface PatientCase {
  id: string;
  patientId: string;
  date: string;
  status: 'Pending' | 'Analyzed' | 'In Review';
  imageFile: File | null;
  previewUrl: string | null;
  analysisResult?: AnalysisResult;
  chatHistory: ChatMessage[];
  notes?: string;
}

export interface User {
  name: string;
  email: string;
  specialization: string;
}
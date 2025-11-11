import type { PatientCase } from '../types';

const DB_KEY = 'radiology_cases_v2';

const initialCases: PatientCase[] = [
  {
    id: 'case-1',
    patientId: 'P001-img4.jpeg',
    date: '2024-07-28',
    status: 'Analyzed',
    imageFile: null,
    previewUrl: 'https://storage.googleapis.com/aistudio-hosting/test-assets/mammogram-benign.jpg',
    analysisResult: {
      diagnosis: 'Benign',
      confidence: 0.1488,
      limeExplanation: 'The model predicts this mammogram as benign with 14.88% confidence. Observed Pattern: no abnormality — uniformly low activation across the scan. The Grad-CAM average activation (0.00) suggests low model attention overall, typical for non-cancerous mammograms.',
      shapExplanation: ['Low Density', 'Smooth Margins', 'Uniform Tissue'],
      gradCamRegion: { x: 0.6, y: 0.4, r: 0.2 },
    },
    chatHistory: [],
    notes: '',
  },
  {
    id: 'case-2',
    patientId: 'P002-img6.jpg',
    date: '2024-07-27',
    status: 'Analyzed',
    imageFile: null,
    previewUrl: 'https://images.unsplash.com/photo-1579154233213-439d5c8a3f78?q=80&w=2724&auto=format&fit=crop',
    analysisResult: {
      diagnosis: 'Benign',
      confidence: 0.2238,
      limeExplanation: 'The model predicts this mammogram as benign with 22.38% confidence. Observed Pattern: no abnormality — uniformly low activation across the scan. The Grad-CAM average activation (0.06) suggests low model attention overall, typical for non-cancerous mammograms.',
      shapExplanation: ['Uniform Density', 'Clear Margins', 'No Microcalcifications'],
      gradCamRegion: { x: 0.45, y: 0.55, r: 0.25 },
    },
    chatHistory: [],
    notes: 'Follow-up required for patient history of fibrocystic changes.',
  },
   {
    id: 'case-3',
    patientId: 'P003-img5.jpg',
    date: '2024-07-26',
    status: 'Analyzed',
    imageFile: null,
    previewUrl: 'https://storage.googleapis.com/aistudio-hosting/test-assets/mammogram-malignant.jpg',
    analysisResult: {
      diagnosis: 'Malignant',
      confidence: 0.9533,
      limeExplanation: 'The model predicts this mammogram as benign with 95.33% confidence. Observed Pattern: slightly active zones possibly indicating microcalcifications. The Grad-CAM shows high activation in a concentrated area.',
      shapExplanation: ['High Density Mass', 'Irregular Shape', 'Spiculated Margins'],
      gradCamRegion: { x: 0.5, y: 0.5, r: 0.15 },
    },
    chatHistory: [],
    notes: 'Urgent biopsy recommended.',
  }
];

export const getCases = (): PatientCase[] => {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (data) {
      // Basic check to ensure the data is an array
      const parsedData = JSON.parse(data);
      if (Array.isArray(parsedData)) {
          // Filter out imageFile as it cannot be stringified/parsed
          return parsedData.map(c => ({...c, imageFile: null}));
      }
    }
    // If no data or data is invalid, initialize with default cases
    localStorage.setItem(DB_KEY, JSON.stringify(initialCases));
    return initialCases;
  } catch (error) {
    console.error("Failed to read from localStorage:", error);
    // Fallback to initial cases if parsing fails
    return initialCases;
  }
};

export const saveCases = (cases: PatientCase[]): void => {
  try {
    // We don't store the File object in localStorage
    const casesToStore = cases.map(({ imageFile, ...rest }) => rest);
    localStorage.setItem(DB_KEY, JSON.stringify(casesToStore));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};
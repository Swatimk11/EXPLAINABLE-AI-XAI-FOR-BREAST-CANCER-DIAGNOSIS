import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisResult, ChatMessage } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash';

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType
    },
  };
};

export const analyzeImage = async (base64Data: string, mimeType: string): Promise<AnalysisResult> => {
  const prompt = `
You are an expert Explainable AI (XAI) system specializing in breast cancer diagnosis from medical images. Your task is to analyze the provided image and return a detailed diagnostic report in a strict JSON format.

Based on the image, provide the following:
1. A diagnosis: either "Malignant" or "Benign".
2. A confidence score for the diagnosis, as a decimal number between 0.85 and 0.99.
3. A LIME (Local Interpretable Model-agnostic Explanations) style explanation: A short, clear paragraph explaining the local features in the image that led to the prediction. For example, "The model focused on a small, irregular mass with spiculated margins in the upper-left quadrant, which are strong indicators of malignancy."
4. A SHAP (SHapley Additive exPlanations) style explanation: A list of the top 3 most influential features and their contribution. Use concise terms. For example, ["Irregular Shape", "High Density", "Spiculated Margins"].
5. A Grad-CAM (Gradient-weighted Class Activation Mapping) region: Identify the single most important region in the image that the model focused on. Provide its center coordinates (x, y) and radius (r) as normalized values between 0.0 and 1.0, where (0,0) is the top-left corner. The radius should be between 0.1 and 0.3.

Return ONLY a valid JSON object with the following structure. Do not include any other text, markdown, or explanations outside of the JSON.

{
  "diagnosis": "Malignant" | "Benign",
  "confidence": number,
  "limeExplanation": string,
  "shapExplanation": string[],
  "gradCamRegion": {
    "x": number,
    "y": number,
    "r": number
  }
}
`;

  try {
    const imagePart = fileToGenerativePart(base64Data, mimeType);
    
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            limeExplanation: { type: Type.STRING },
            shapExplanation: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            gradCamRegion: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                r: { type: Type.NUMBER },
              },
              required: ['x', 'y', 'r'],
            },
          },
          required: [
            'diagnosis',
            'confidence',
            'limeExplanation',
            'shapExplanation',
            'gradCamRegion',
          ],
        },
      },
    });

    const jsonText = response.text.trim();
    const result: AnalysisResult = JSON.parse(jsonText);
    
    if (!result.diagnosis || !result.confidence || !result.gradCamRegion) {
        throw new Error("Incomplete analysis data received from AI.");
    }

    return result;

  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    throw new Error('Failed to get analysis from AI. The model may be unable to process this image.');
  }
};

export const continueChatStream = async (
  analysisContext: AnalysisResult,
  history: ChatMessage[],
  newMessage: string
) => {
  const systemInstruction = `You are an expert radiology assistant. You are communicating with a professional radiologist. Provide concise, accurate, and helpful information based on their questions. Do not repeat the initial diagnosis unless asked. Be formal and professional.`;
  
  const contextMessage = {
    role: 'user',
    parts: [{ text: `I am reviewing a medical image with the following initial AI analysis: ${JSON.stringify(analysisContext)}. Please answer my follow-up questions.` }]
  };
  const contextResponse = {
    role: 'model',
    parts: [{ text: "Understood. I am ready to assist with your questions regarding this case." }]
  };

  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  const chat = ai.chats.create({
    model,
    history: [contextMessage, contextResponse, ...formattedHistory],
    config: { systemInstruction },
  });

  const resultStream = await chat.sendMessageStream({ message: newMessage });
  return resultStream;
};
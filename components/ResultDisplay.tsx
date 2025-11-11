import React, { useState } from 'react';
import type { AnalysisResult, ChatMessage } from '../types';
import HeatmapOverlay from './HeatmapOverlay';
import ChatInterface from './ChatInterface';

interface ResultDisplayProps {
  result?: AnalysisResult;
  isLoading: boolean;
  previewUrl: string | null;
  notes?: string;
  onNotesChange: (notes: string) => void;
  chatHistory: ChatMessage[];
  isReplying: boolean;
  onSendMessage: (message: string) => void;
  isPatientView?: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  result, 
  isLoading, 
  previewUrl, 
  notes, 
  onNotesChange,
  chatHistory,
  isReplying,
  onSendMessage,
  isPatientView = false,
}) => {
  const [showHeatmap, setShowHeatmap] = useState(true);

  if (isLoading) {
    return (
      <div className="text-center py-10 flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        <p className="text-gray-600 mt-4">AI is analyzing the image...</p>
        <p className="text-sm text-gray-500">This may take a moment.</p>
      </div>
    );
  }

  if (!result) {
    return (
        <div className="space-y-6">
            <div>
              <h3 className="text-md font-semibold text-gray-700">Medical Image</h3>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border mt-2 bg-black">
                {previewUrl ? 
                  <img src={previewUrl} alt="Pending analysis" className="w-full h-full object-contain" /> :
                  <div className="flex items-center justify-center h-full text-gray-400">No Image Uploaded</div>
                }
              </div>
            </div>
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                <p>{isPatientView ? 'Your report is not yet available.' : 'Pending analysis.'}</p>
                {!isPatientView && <p className="text-sm mt-1">Click "Analyze Image" to generate the report.</p>}
            </div>
             <div>
              <h3 className="text-md font-semibold text-gray-700">Radiologist's Notes</h3>
              <textarea
                placeholder="Notes can be added after analysis is complete."
                className="w-full h-24 p-2 mt-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                disabled
              ></textarea>
            </div>
             <div className="mt-4 pt-4 border-t flex-shrink-0">
                 <ChatInterface 
                    history={[]}
                    isReplying={false}
                    onSendMessage={() => {}}
                    disabled={true}
                 />
            </div>
        </div>
    );
  }

  const isMalignant = result.diagnosis === 'Malignant';
  const confidencePercentage = (result.confidence * 100).toFixed(1);

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-6">
        {/* Static Report */}
        <div className={`p-4 rounded-lg ${isMalignant ? 'bg-red-50' : 'bg-green-50'}`}>
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold text-gray-700 flex items-center">
              <span>Prediction:</span>
              <span className="mx-2" role="img" aria-label={isMalignant ? 'negative result' : 'positive result'}>
                {isMalignant ? '💔' : '💗'}
              </span>
              <span className={isMalignant ? 'text-red-600' : 'text-green-600'}>
                {result.diagnosis}
              </span>
            </div>
            {!isPatientView && (
              <div className="text-right">
                <p className={`text-sm font-medium ${isMalignant ? 'text-red-700' : 'text-green-700'}`}>CONFIDENCE</p>
                <p className={`text-2xl font-bold ${isMalignant ? 'text-red-800' : 'text-green-800'}`}>{confidencePercentage}%</p>
              </div>
            )}
          </div>
        </div>

        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Panel 1: Original Image */}
                <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-rose-50/50 px-3 py-2 border-b">
                        <h4 className="text-sm font-semibold text-gray-600 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            Original Image
                        </h4>
                    </div>
                    <div className="relative w-full aspect-square bg-black">
                        {previewUrl && <img src={previewUrl} alt="Original mammogram" className="w-full h-full object-contain" />}
                    </div>
                </div>

                {/* Panel 2: Grad-CAM Heatmap */}
                <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-rose-50/50 px-3 py-2 border-b flex justify-between items-center">
                        <h4 className="text-sm font-semibold text-gray-600 flex items-center">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45.385c-.345.675-.5 1.425-.5 2.182V6a2 2 0 002 2h1a2 2 0 002-2v-.172c0-.757-.155-1.507-.455-2.182a1 1 0 00-1.45-.385l-.295.148a1 1 0 01-1.222 0l-.295-.148zM9 12a1 1 0 011-1h1v1a1 1 0 11-2 0zm-5 4a1 1 0 011-1h8a1 1 0 110 2H5a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            Grad-CAM Heatmap
                        </h4>
                         {!isPatientView && (
                            <label htmlFor="heatmap-toggle" className="flex items-center cursor-pointer">
                                <span className="mr-2 text-xs text-gray-500">Show</span>
                                <div className="relative">
                                    <input type="checkbox" id="heatmap-toggle" className="sr-only" checked={showHeatmap} onChange={() => setShowHeatmap(!showHeatmap)} />
                                    <div className={`block w-10 h-6 rounded-full transition-colors ${showHeatmap ? 'bg-pink-600' : 'bg-gray-200'}`}></div>
                                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showHeatmap ? 'translate-x-full' : 'translate-x-0'}`}></div>
                                </div>
                            </label>
                        )}
                    </div>
                    <div className="relative w-full aspect-square bg-black">
                        {previewUrl && <img src={previewUrl} alt="Mammogram with heatmap" className="w-full h-full object-contain" />}
                        {showHeatmap && <HeatmapOverlay region={result.gradCamRegion} />}
                    </div>
                </div>
            </div>
        </div>


        <div>
          <h3 className="text-md font-semibold text-gray-700">LIME Explanation</h3>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 mt-2 rounded-md border border-gray-200">"{result.limeExplanation}"</p>
        </div>
        
        {!isPatientView && (
            <div>
              <h3 className="text-md font-semibold text-gray-700">SHAP Feature Importance</h3>
              <p className="text-sm text-gray-500 mt-1">Top features influencing the decision:</p>
              <ul className="space-y-2 mt-2">
                {result.shapExplanation.map((feature, index) => (
                  <li key={index} className="flex items-center bg-gray-50 p-2 rounded-md">
                    <span className={`w-6 h-6 flex items-center justify-center font-bold text-white text-sm rounded-full ${isMalignant ? 'bg-red-500' : 'bg-green-500'}`}>{index + 1}</span>
                    <span className="ml-3 font-medium text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
        )}
        
        <div>
          <h3 className="text-md font-semibold text-gray-700">Radiologist's Notes</h3>
          {isPatientView ? (
             <div className="w-full h-24 p-2 mt-2 border bg-gray-50 border-gray-200 rounded-md">
                <p className="text-sm text-gray-700">{notes || 'No notes available.'}</p>
             </div>
          ) : (
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Add your observations here..."
              className="w-full h-24 p-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
            ></textarea>
          )}
        </div>
      </div>
      
      {/* Chat Interface */}
      <div className="mt-4 pt-4 border-t flex-shrink-0">
         <ChatInterface 
            history={chatHistory}
            isReplying={isReplying}
            onSendMessage={onSendMessage}
            disabled={isPatientView}
         />
      </div>
    </div>
  );
};

export default ResultDisplay;
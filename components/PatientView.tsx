import React from 'react';
import type { PatientCase } from '../types';
import ResultDisplay from './ResultDisplay';

interface PatientViewProps {
  patientId: string;
  cases: PatientCase[];
  onLogout: () => void;
}

const PatientView: React.FC<PatientViewProps> = ({ patientId, cases, onLogout }) => {
  const patientCase = cases.find(c => c.patientId === patientId);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-blue-800">Patient Portal</h1>
          <p className="text-sm text-gray-600">Your Case Details</p>
        </div>
        <button onClick={onLogout} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Logout
        </button>
      </header>
      <main className="flex-1 p-8 overflow-y-auto">
        {patientCase ? (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Report for Case: {patientCase.patientId}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-600">Medical Image</h3>
                 {patientCase.previewUrl ? (
                    <img src={patientCase.previewUrl} alt={`Case ${patientCase.patientId}`} className="w-full rounded-lg border border-gray-200" />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">No image available</div>
                  )}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-600">Diagnostic Report</h3>
                <ResultDisplay
                    result={patientCase.analysisResult}
                    isLoading={false}
                    previewUrl={patientCase.previewUrl}
                    notes={patientCase.notes}
                    onNotesChange={() => {}} // No-op for patient view
                    chatHistory={patientCase.chatHistory}
                    isReplying={false}
                    onSendMessage={() => {}} // No-op for patient view
                    isPatientView={true}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <h2 className="text-2xl font-bold">Case Not Found</h2>
            <p className="mt-2">We could not find a case associated with your Patient ID.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientView;

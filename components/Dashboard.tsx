
import React, { useState, useEffect } from 'react';
import type { PatientCase, User } from '../types';
import ResultDisplay from './ResultDisplay';
import FileUpload from './FileUpload';
import AssignPatientModal from './AssignPatientModal';
import { analyzeImage, continueChatStream } from '../services/geminiService';
import Spinner from './Spinner';

interface DashboardProps {
    user: User;
    cases: PatientCase[];
    setCases: React.Dispatch<React.SetStateAction<PatientCase[]>>;
    onLogout: () => void;
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });


const Dashboard: React.FC<DashboardProps> = ({ user, cases, setCases, onLogout }) => {
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(cases.length > 0 ? cases[0].id : null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (selectedCaseId && !cases.find(c => c.id === selectedCaseId)) {
            setSelectedCaseId(cases.length > 0 ? cases[0].id : null);
        }
         if (!selectedCaseId && cases.length > 0) {
            setSelectedCaseId(cases[0].id);
        }
    }, [cases, selectedCaseId]);

    const handleFileSelect = (file: File) => {
        setNewImageFile(file);
        setIsModalOpen(true);
    };

    const handleAssignPatient = (patientId: string) => {
        if (!newImageFile) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const newCase: PatientCase = {
                id: `case-${Date.now()}`,
                patientId: `${patientId.toUpperCase()}-${newImageFile.name}`,
                date: new Date().toISOString().split('T')[0],
                status: 'Pending',
                imageFile: newImageFile,
                previewUrl: reader.result as string,
                chatHistory: [],
                notes: '',
            };
            setCases(prevCases => [newCase, ...prevCases]);
            setSelectedCaseId(newCase.id);
        }
        reader.readAsDataURL(newImageFile);

        setIsModalOpen(false);
        setNewImageFile(null);
    };

    const handleAnalyze = async (caseToAnalyze: PatientCase) => {
        setIsAnalyzing(true);
        setError(null);
        try {
            let base64Data: string;
            let mimeType: string;

            if (caseToAnalyze.imageFile) {
                base64Data = await toBase64(caseToAnalyze.imageFile);
                mimeType = caseToAnalyze.imageFile.type;
            } else if (caseToAnalyze.previewUrl) {
                if (caseToAnalyze.previewUrl.startsWith('data:')) {
                    const parts = caseToAnalyze.previewUrl.split(',');
                    const mimeMatch = parts[0].match(/:(.*?);/);
                    mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
                    base64Data = parts[1];
                } else {
                    const response = await fetch(caseToAnalyze.previewUrl);
                    const blob = await response.blob();
                    const file = new File([blob], "image.jpg", { type: blob.type });
                    base64Data = await toBase64(file);
                    mimeType = file.type;
                }
            } else {
                throw new Error("No image source found for analysis.");
            }

            const result = await analyzeImage(base64Data, mimeType);
            
            updateCase(caseToAnalyze.id, {
                analysisResult: result,
                status: 'Analyzed',
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            alert(`Analysis failed: ${errorMessage}`);
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const updateCase = (caseId: string, updates: Partial<PatientCase>) => {
        setCases(prevCases =>
            prevCases.map(c => (c.id === caseId ? { ...c, ...updates } : c))
        );
    };
    
    const handleSendMessage = async (message: string) => {
        if (!selectedCase || !selectedCase.analysisResult) return;
        
        const userMessage = { role: 'user' as const, text: message };
        const updatedHistory = [...selectedCase.chatHistory, userMessage];
        updateCase(selectedCase.id, { chatHistory: updatedHistory });
        setIsReplying(true);

        try {
            const stream = await continueChatStream(
                selectedCase.analysisResult,
                selectedCase.chatHistory,
                message
            );

            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                const modelMessage = { role: 'model' as const, text: fullResponse };
                updateCase(selectedCase.id, { chatHistory: [...updatedHistory, modelMessage] });
            }
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = { role: 'model' as const, text: 'Sorry, I encountered an error.' };
            updateCase(selectedCase.id, { chatHistory: [...updatedHistory, errorMessage] });
        } finally {
            setIsReplying(false);
        }
    };
    
    const selectedCase = cases.find(c => c.id === selectedCaseId);

    const getStatusChip = (status: PatientCase['status']) => {
        switch (status) {
            case 'Analyzed':
                return <span className="text-xs font-medium text-green-800 bg-green-100 px-2 py-1 rounded-full">Analyzed</span>;
            case 'In Review':
                 return <span className="text-xs font-medium text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full">In Review</span>;
            case 'Pending':
                 return <span className="text-xs font-medium text-gray-800 bg-gray-200 px-2 py-1 rounded-full">Pending</span>;
        }
    }

    return (
        <div className="flex h-[calc(100vh-110px)] bg-gray-50 overflow-hidden">
            <aside className="w-full max-w-sm flex flex-col bg-white border-r border-gray-200">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Radiology Worklist</h2>
                    <p className="text-sm text-gray-500">AI-Assisted Diagnostics</p>
                </div>
                <div className="p-4">
                    <FileUpload onFileUpload={handleFileSelect} isLoading={isAnalyzing} />
                </div>
                <nav className="flex-grow overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                        {cases.map(c => (
                            <li key={c.id}>
                                <button 
                                    onClick={() => setSelectedCaseId(c.id)}
                                    className={`w-full text-left p-4 hover:bg-pink-50 transition-colors focus:outline-none ${selectedCaseId === c.id ? 'bg-pink-100' : ''}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-900 truncate">{c.patientId}</p>
                                        {getStatusChip(c.status)}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{c.date}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                 <div className="p-4 mt-auto border-t flex flex-col space-y-2">
                    <button 
                        onClick={onLogout} 
                        className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:bg-gray-100 p-2 rounded-md transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        <span>Logout</span>
                    </button>
                    <div className="text-xs text-gray-400 text-center">
                        <p>For educational purposes only.</p>
                        <p>© 2025 P.A. College of Engineering</p>
                    </div>
                </div>
            </aside>

            <main className="flex-1 p-6 overflow-y-auto">
                {selectedCase ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b">
                             <h1 className="text-2xl font-bold text-gray-800 truncate pr-4">Case: {selectedCase.patientId}</h1>
                             {selectedCase.status === 'Pending' && (
                                <button
                                    onClick={() => handleAnalyze(selectedCase)}
                                    disabled={isAnalyzing}
                                    className="bg-pink-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center disabled:bg-gray-400 min-w-[140px]"
                                >
                                   {isAnalyzing ? <Spinner /> : null}
                                   <span className={isAnalyzing ? 'ml-2' : ''}>
                                     {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                                   </span>
                                </button>
                             )}
                        </div>
                       
                        <ResultDisplay
                            result={selectedCase.analysisResult}
                            isLoading={isAnalyzing}
                            previewUrl={selectedCase.previewUrl}
                            notes={selectedCase.notes}
                            onNotesChange={(notes) => updateCase(selectedCase.id, { notes, status: 'In Review' })}
                            chatHistory={selectedCase.chatHistory}
                            isReplying={isReplying}
                            onSendMessage={handleSendMessage}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 9h16" />
                        </svg>
                        <h2 className="text-xl font-semibold">No Cases Available</h2>
                        <p className="mt-2">Please upload a new case to begin.</p>
                    </div>
                )}
            </main>
            
            <AssignPatientModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAssignPatient}
                existingPatientIds={cases.map(c => c.patientId.split('-')[0])}
            />
        </div>
    );
};

export default Dashboard;

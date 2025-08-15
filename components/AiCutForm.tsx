
import React, { useState } from 'react';
import { findVideoSegments } from '../services/geminiService';
import type { AiQuestion, ProcessedVideo, AiAnalysisResult } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface AiCutFormProps {
    isProcessing: boolean;
    onProcessingStart: (message: string) => void;
    onProcessingComplete: (videos: ProcessedVideo[], results: AiAnalysisResult[]) => void;
    onProcessingError: (error: string) => void;
}

export const AiCutForm: React.FC<AiCutFormProps> = ({ isProcessing, onProcessingStart, onProcessingComplete, onProcessingError }) => {
    const [questions, setQuestions] = useState<AiQuestion[]>([{ id: crypto.randomUUID(), text: '' }]);
    const [merge, setMerge] = useState(false);

    const addQuestion = () => {
        setQuestions([...questions, { id: crypto.randomUUID(), text: '' }]);
    };

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const handleQuestionChange = (id: string, text: string) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
    };
    
    const handleProcess = async () => {
        const validQuestions = questions.filter(q => q.text.trim() !== '');
        if (validQuestions.length === 0) {
            onProcessingError("Please enter at least one question.");
            return;
        }

        onProcessingStart("Analyzing questions with AI...");

        try {
            const analysisResults = await findVideoSegments(validQuestions.map(q => q.text));
            onProcessingStart("AI analysis complete. Cutting video segments...");

            // Simulate backend cutting based on AI results
            setTimeout(() => {
                const results: ProcessedVideo[] = merge ? 
                [{
                    id: 'merged_ai',
                    url: `https://picsum.photos/seed/${crypto.randomUUID()}/800/450`,
                    title: 'Merged Video (AI Cut)'
                }] :
                analysisResults.map((res, i) => ({
                    id: `ai_cut_${i}`,
                    url: `https://picsum.photos/seed/${res.question}/800/450`,
                    title: `Clip for: "${res.question}"`
                }));

                onProcessingComplete(results, analysisResults);
            }, 2000);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            onProcessingError(errorMessage);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Questions for AI</label>
                <div className="space-y-3">
                    {questions.map((question) => (
                        <div key={question.id} className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="e.g., When was the Eiffel Tower built?"
                                value={question.text}
                                onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button
                                onClick={() => removeQuestion(question.id)}
                                disabled={questions.length <= 1}
                                className="p-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
                 <button
                    onClick={addQuestion}
                    className="flex items-center space-x-2 mt-3 text-sm font-medium text-indigo-400 hover:text-indigo-300"
                >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Question</span>
                </button>
            </div>
            
            <div className="flex items-center">
                <input
                    id="ai-merge-videos"
                    type="checkbox"
                    checked={merge}
                    onChange={(e) => setMerge(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="ai-merge-videos" className="ml-2 block text-sm text-gray-300">
                    Merge segments into one video
                </label>
            </div>

            <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            >
                {isProcessing ? 'Processing...' : 'Find and Cut'}
            </button>
        </div>
    );
};

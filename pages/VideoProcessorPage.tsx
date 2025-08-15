import React, { useState } from 'react';
import { ControlPanel } from '../components/ControlPanel';
import { PreviewPanel } from '../components/PreviewPanel';
import type { AiAnalysisResult, ProcessedVideo } from '../types';

export const VideoProcessorPage: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [processedVideos, setProcessedVideos] = useState<ProcessedVideo[]>([]);
    const [aiResults, setAiResults] = useState<AiAnalysisResult[]>([]);
    const [processingMessage, setProcessingMessage] = useState<string>('');

    const handleVideoUpload = (file: File) => {
        setVideoFile(file);
        setProcessedVideos([]);
        setAiResults([]);
        setProcessingMessage('');
    };
    
    const handleReset = () => {
        setVideoFile(null);
        setProcessedVideos([]);
        setAiResults([]);
        setIsProcessing(false);
        setProcessingMessage('');
    };

    const handleProcessing = (videos: ProcessedVideo[], results: AiAnalysisResult[] = []) => {
        setProcessedVideos(videos);
        setAiResults(results);
        setIsProcessing(false);
        setProcessingMessage('');
    };

    const handleProcessingStart = (message: string) => {
        setIsProcessing(true);
        setProcessingMessage(message);
        setProcessedVideos([]);
        setAiResults([]);
    };
    
    const handleProcessingError = (error: string) => {
        setIsProcessing(false);
        setProcessingMessage(`Error: ${error}`);
    };

    return (
        <div className="flex flex-col md:flex-row w-full h-full overflow-hidden">
            <div className="w-full md:w-[450px] lg:w-[500px] bg-gray-800/50 p-6 flex-shrink-0 overflow-y-auto">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-white">AI Video Processor</h1>
                    <p className="text-gray-400">Cut and process your videos with precision.</p>
                </header>
                <ControlPanel
                    videoFile={videoFile}
                    onVideoUpload={handleVideoUpload}
                    onProcessingStart={handleProcessingStart}
                    onProcessingComplete={handleProcessing}
                    onProcessingError={handleProcessingError}
                    onReset={handleReset}
                    isProcessing={isProcessing}
                />
            </div>
            <div className="flex-1 p-6 flex flex-col bg-gray-900">
                <PreviewPanel 
                  isProcessing={isProcessing} 
                  processedVideos={processedVideos} 
                  aiResults={aiResults}
                  processingMessage={processingMessage}
                  videoFile={videoFile}
                />
            </div>
        </div>
    );
};
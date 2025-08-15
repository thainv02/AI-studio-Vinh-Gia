import React from 'react';
import { VideoUpload } from './VideoUpload';
import { ProcessingTabs } from './ProcessingTabs';
import type { AiAnalysisResult, ProcessedVideo } from '../types';

interface ControlPanelProps {
    videoFile: File | null;
    isProcessing: boolean;
    onVideoUpload: (file: File) => void;
    onProcessingStart: (message: string) => void;
    onProcessingComplete: (videos: ProcessedVideo[], results: AiAnalysisResult[]) => void;
    onProcessingError: (error: string) => void;
    onReset: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
    videoFile, 
    isProcessing,
    onVideoUpload, 
    onProcessingStart, 
    onProcessingComplete,
    onProcessingError,
    onReset
}) => {
    return (
        <div className="flex flex-col h-full">
            <div className="space-y-8">
                <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                    <h2 className="text-lg font-semibold text-white mb-4">1. Upload Video</h2>
                    <VideoUpload onUpload={onVideoUpload} onReset={onReset} currentFile={videoFile} />
                </div>

                {videoFile && (
                    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                        <h2 className="text-lg font-semibold text-white mb-4">2. Processing Options</h2>
                        <ProcessingTabs 
                            onProcessingStart={onProcessingStart}
                            onProcessingComplete={onProcessingComplete}
                            onProcessingError={onProcessingError}
                            isProcessing={isProcessing}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
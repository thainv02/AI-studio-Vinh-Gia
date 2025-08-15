import React, { useState } from 'react';
import type { Transcription } from '../types';
import { SpinnerIcon, MicrophoneIcon, DownloadIcon, MagicIcon, DocumentTextIcon } from './icons';

interface SttResultsPanelProps {
    isProcessing: boolean;
    processingStage: string;
    transcription: Transcription | null;
    advancedResult: string | null;
    error: string | null;
}

type ResultTab = 'transcription' | 'advanced';

const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const Placeholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 border-2 border-dashed border-gray-700 rounded-xl">
        <MicrophoneIcon className="h-16 w-16 mb-4" />
        <h3 className="text-xl font-semibold text-gray-400">Results will appear here</h3>
        <p>Provide a source and start the transcription process.</p>
    </div>
);

const LoadingState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 border-2 border-dashed border-gray-700 rounded-xl">
        <SpinnerIcon className="h-12 w-12 mb-4 text-indigo-400" />
        <h3 className="text-xl font-semibold text-gray-300">Processing...</h3>
        <p>{message}</p>
    </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-red-400 border-2 border-dashed border-red-500/50 rounded-xl p-4">
       <h3 className="text-xl font-semibold">{message}</h3>
   </div>
);

const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const SttResultsPanel: React.FC<SttResultsPanelProps> = ({ isProcessing, processingStage, transcription, advancedResult, error }) => {
    const [activeTab, setActiveTab] = useState<ResultTab>('transcription');
    const [showTimestamps, setShowTimestamps] = useState(true);

    if (isProcessing) {
        return <LoadingState message={processingStage} />;
    }
    if (error) {
        return <ErrorState message={error} />;
    }
    if (!transcription) {
        return <Placeholder />;
    }

    const renderTabButton = (tabId: ResultTab, icon: React.ReactNode, text: string) => {
        const isActive = activeTab === tabId;
        return (
            <button
                onClick={() => setActiveTab(tabId)}
                disabled={tabId === 'advanced' && !advancedResult}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                }`}
            >
                {icon}
                <span>{text}</span>
            </button>
        );
    };

    const getTranscriptionText = () => {
        if (!transcription) return '';
        if (showTimestamps && transcription.segments?.length) {
            return transcription.segments.map(seg => `[${formatTime(seg.start)} --> ${formatTime(seg.end)}] ${seg.text}`).join('\n\n');
        }
        return transcription.text;
    };

    return (
        <div className="w-full h-full flex flex-col">
            <header className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Transcription Results</h2>
            </header>
            <div className="flex space-x-2 p-1 bg-gray-800 rounded-lg mb-6 self-start">
                {renderTabButton('transcription', <DocumentTextIcon className="h-5 w-5" />, 'Transcription')}
                {renderTabButton('advanced', <MagicIcon className="h-5 w-5" />, 'Advanced Result')}
            </div>

            <div className="flex-grow bg-gray-800/50 border border-gray-700 rounded-xl flex flex-col overflow-hidden">
                {activeTab === 'transcription' ? (
                    <>
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-wrap gap-2">
                             <div className="flex items-center">
                                <input
                                    id="show-timestamps"
                                    type="checkbox"
                                    checked={showTimestamps}
                                    onChange={(e) => setShowTimestamps(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="show-timestamps" className="ml-2 block text-sm text-gray-300">Show Timestamps</label>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => downloadFile(getTranscriptionText(), 'transcription.txt', 'text/plain')} className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-gray-300 bg-gray-700 hover:bg-gray-600">
                                    <DownloadIcon className="h-4 w-4" /> <span>TXT</span>
                                </button>
                                <button onClick={() => downloadFile(getTranscriptionText(), 'transcription.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')} className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-gray-300 bg-gray-700 hover:bg-gray-600">
                                    <DownloadIcon className="h-4 w-4" /> <span>DOCX</span>
                                </button>
                            </div>
                        </div>
                        <textarea
                            readOnly
                            value={getTranscriptionText()}
                            className="w-full h-full p-4 bg-transparent text-gray-200 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                        />
                    </>
                ) : (
                    <>
                         <div className="p-4 border-b border-gray-700 flex justify-end items-center">
                            <div className="flex space-x-2">
                                <button onClick={() => downloadFile(advancedResult!, 'advanced_result.txt', 'text/plain')} className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-gray-300 bg-gray-700 hover:bg-gray-600">
                                    <DownloadIcon className="h-4 w-4" /> <span>TXT</span>
                                </button>
                                <button onClick={() => downloadFile(advancedResult!, 'advanced_result.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')} className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-gray-300 bg-gray-700 hover:bg-gray-600">
                                    <DownloadIcon className="h-4 w-4" /> <span>DOCX</span>
                                </button>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto w-full">
                            <pre className="text-gray-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                {advancedResult}
                            </pre>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

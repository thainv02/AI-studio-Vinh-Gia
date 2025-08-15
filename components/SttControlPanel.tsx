import React, { useState } from 'react';
import { UploadIcon, LinkIcon } from './icons';
import { MediaUpload } from './MediaUpload';

interface SttControlPanelProps {
    isProcessing: boolean;
    onStart: (options: { useAdvanced: boolean }) => void;
}

type InputType = 'upload' | 'url';

export const SttControlPanel: React.FC<SttControlPanelProps> = ({ isProcessing, onStart }) => {
    const [inputType, setInputType] = useState<InputType>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState('');
    const [useAdvanced, setUseAdvanced] = useState(true);

    const canStart = !isProcessing && (file !== null || url.trim() !== '');

    const handleStartClick = () => {
        if (canStart) {
            onStart({ useAdvanced });
        }
    };
    
    const handleReset = () => {
        setFile(null);
    }

    const renderTabButton = (tabId: InputType, icon: React.ReactNode, text: string) => {
        const isActive = inputType === tabId;
        return (
            <button
                onClick={() => setInputType(tabId)}
                className={`flex-1 flex justify-center items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
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

    return (
        <div className="space-y-8">
            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                <h2 className="text-lg font-semibold text-white mb-4">1. Provide Source</h2>
                <div className="flex space-x-2 p-1 bg-gray-900/50 rounded-lg mb-6">
                    {renderTabButton('upload', <UploadIcon className="h-5 w-5" />, 'Upload File')}
                    {renderTabButton('url', <LinkIcon className="h-5 w-5" />, 'From URL')}
                </div>
                {inputType === 'upload' ? (
                    <MediaUpload onUpload={setFile} onReset={handleReset} currentFile={file} accept="audio/*,video/*" />
                ) : (
                    <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                )}
            </div>

            <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
                <h2 className="text-lg font-semibold text-white mb-4">2. Options</h2>
                <div className="flex items-center">
                    <input
                        id="advanced-processing"
                        type="checkbox"
                        checked={useAdvanced}
                        onChange={(e) => setUseAdvanced(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="advanced-processing" className="ml-3 block text-sm text-gray-300">
                        Advanced Processing with Gemini
                        <p className="text-xs text-gray-500">Summarize, analyze, and format the transcript.</p>
                    </label>
                </div>
            </div>

            <button
                onClick={handleStartClick}
                disabled={!canStart}
                className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            >
                {isProcessing ? 'Processing...' : 'Start Transcription'}
            </button>
        </div>
    );
};

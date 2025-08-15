
import React, { useState } from 'react';
import { ManualCutForm } from './ManualCutForm';
import { AiCutForm } from './AiCutForm';
import { ScissorIcon, MagicIcon } from './icons';
import type { AiAnalysisResult, ProcessedVideo } from '../types';

type Tab = 'manual' | 'ai';

interface ProcessingTabsProps {
    isProcessing: boolean;
    onProcessingStart: (message: string) => void;
    onProcessingComplete: (videos: ProcessedVideo[], results?: AiAnalysisResult[]) => void;
    onProcessingError: (error: string) => void;
}

export const ProcessingTabs: React.FC<ProcessingTabsProps> = (props) => {
    const [activeTab, setActiveTab] = useState<Tab>('manual');

    const renderTabButton = (tabId: Tab, icon: React.ReactNode, text: string) => {
        const isActive = activeTab === tabId;
        return (
            <button
                onClick={() => setActiveTab(tabId)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
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
        <div>
            <div className="flex space-x-2 p-1 bg-gray-900/50 rounded-lg mb-6">
                {renderTabButton('manual', <ScissorIcon className="h-5 w-5" />, 'Manual Cut')}
                {renderTabButton('ai', <MagicIcon className="h-5 w-5" />, 'AI Cut')}
            </div>

            <div>
                {activeTab === 'manual' && <ManualCutForm {...props} />}
                {activeTab === 'ai' && <AiCutForm {...props} />}
            </div>
        </div>
    );
};

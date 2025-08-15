import React, { useState } from 'react';
import { SttControlPanel } from '../components/SttControlPanel';
import { SttResultsPanel } from '../components/SttResultsPanel';
import type { Transcription } from '../types';

// Mock data for simulation
const MOCK_TRANSCRIPTION: Transcription = {
    text: "Hello and welcome to this presentation. Today we are going to discuss the future of renewable energy and its impact on the global economy. We will cover solar, wind, and geothermal sources. First, let's talk about the advancements in solar panel technology. They have become much more efficient and affordable over the last decade.",
    segments: [
        { start: 1.2, end: 3.5, text: "Hello and welcome to this presentation." },
        { start: 3.8, end: 8.9, text: "Today we are going to discuss the future of renewable energy and its impact on the global economy." },
        { start: 9.1, end: 11.5, text: "We will cover solar, wind, and geothermal sources." },
        { start: 12.0, end: 15.3, text: "First, let's talk about the advancements in solar panel technology." },
        { start: 15.6, end: 19.8, text: "They have become much more efficient and affordable over the last decade." },
    ]
};

const MOCK_ADVANCED_RESULT = `### Summary of the Presentation

The presentation focuses on the future of renewable energy and its economic impact. The key topics covered are solar, wind, and geothermal energy sources. The speaker begins by highlighting the significant progress in solar panel technology, noting improvements in both efficiency and cost-effectiveness over the past ten years.

### Key Points:
- **Topic:** Future of Renewable Energy
- **Sources Discussed:** Solar, Wind, Geothermal
- **Initial Focus:** Advancements in Solar Technology
    - Increased efficiency
    - Reduced cost

### Action Items:
- Analyze market trends for solar panel adoption.
- Prepare a follow-up on wind and geothermal energy.
`;


export const SpeechToTextPage: React.FC = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStage, setProcessingStage] = useState('');
    const [transcription, setTranscription] = useState<Transcription | null>(null);
    const [advancedResult, setAdvancedResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleStartProcessing = (options: { useAdvanced: boolean }) => {
        setIsProcessing(true);
        setError(null);
        setTranscription(null);
        setAdvancedResult(null);

        const stages = [
            "Initializing process...",
            "Extracting audio stream...",
            "Transcribing with AI...",
            ...(options.useAdvanced ? ["Applying advanced Gemini model..."] : []),
            "Finalizing results..."
        ];

        let currentStage = 0;
        setProcessingStage(stages[currentStage]);

        const stageInterval = setInterval(() => {
            currentStage++;
            if (currentStage < stages.length) {
                setProcessingStage(stages[currentStage]);
            } else {
                clearInterval(stageInterval);
                setTranscription(MOCK_TRANSCRIPTION);
                if (options.useAdvanced) {
                    setAdvancedResult(MOCK_ADVANCED_RESULT);
                }
                setIsProcessing(false);
                setProcessingStage('');
            }
        }, 1500);
    };

    return (
        <div className="flex flex-col md:flex-row w-full h-full overflow-hidden">
            <div className="w-full md:w-[450px] lg:w-[500px] bg-gray-800/50 p-6 flex-shrink-0 overflow-y-auto">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-white">Speech to Text</h1>
                    <p className="text-gray-400">Transcribe audio from files or links effortlessly.</p>
                </header>
                <SttControlPanel 
                    isProcessing={isProcessing} 
                    onStart={handleStartProcessing} 
                />
            </div>
            <div className="flex-1 p-6 flex flex-col bg-gray-900">
                <SttResultsPanel
                    isProcessing={isProcessing}
                    processingStage={processingStage}
                    transcription={transcription}
                    advancedResult={advancedResult}
                    error={error}
                />
            </div>
        </div>
    );
};

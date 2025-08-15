
import React from 'react';
import type { ProcessedVideo, AiAnalysisResult } from '../types';
import { SpinnerIcon, VideoIcon } from './icons';

interface PreviewPanelProps {
    isProcessing: boolean;
    processedVideos: ProcessedVideo[];
    aiResults: AiAnalysisResult[];
    processingMessage: string;
    videoFile: File | null;
}

const Placeholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 border-2 border-dashed border-gray-700 rounded-xl">
        <VideoIcon className="h-16 w-16 mb-4" />
        <h3 className="text-xl font-semibold text-gray-400">Your results will appear here</h3>
        <p>Upload a video and start processing to see the output.</p>
    </div>
);

const LoadingState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 border-2 border-dashed border-gray-700 rounded-xl">
        <SpinnerIcon className="h-12 w-12 mb-4 text-indigo-400" />
        <h3 className="text-xl font-semibold text-gray-300">Processing...</h3>
        <p>{message}</p>
    </div>
);

const VideoPreviewCard: React.FC<{ video: ProcessedVideo }> = ({ video }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <div className="aspect-video bg-black flex items-center justify-center">
            {/* In a real app, this would be a <video> tag */}
            <img src={video.url} alt={video.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-4">
            <h4 className="font-semibold text-white truncate">{video.title}</h4>
        </div>
    </div>
);

const AiResultsTable: React.FC<{ results: AiAnalysisResult[] }> = ({ results }) => (
     <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">AI Analysis Results</h3>
        <div className="bg-gray-800 rounded-lg border border-gray-700">
            <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Question</th>
                        <th scope="col" className="px-6 py-3">Timestamp</th>
                        <th scope="col" className="px-6 py-3">Reasoning</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, index) => (
                        <tr key={index} className="border-b border-gray-700">
                            <td className="px-6 py-4 font-medium text-white">{result.question}</td>
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-indigo-300">{result.startTime} - {result.endTime}</td>
                             <td className="px-6 py-4">{result.reasoning}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


export const PreviewPanel: React.FC<PreviewPanelProps> = ({ isProcessing, processedVideos, aiResults, processingMessage, videoFile }) => {
    const hasResults = processedVideos.length > 0;
    
    if (isProcessing) {
        return <LoadingState message={processingMessage} />;
    }

    if (!videoFile) {
        return <Placeholder />;
    }

    return (
        <div className="w-full h-full flex flex-col">
            <header className="mb-6">
                <h2 className="text-2xl font-bold text-white">Results Preview</h2>
            </header>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                { !hasResults && !processingMessage && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 border-2 border-dashed border-gray-700 rounded-xl">
                        <h3 className="text-xl font-semibold text-gray-400">Ready to Process</h3>
                        <p>Choose an option from the left panel to begin.</p>
                    </div>
                )}
                
                { processingMessage && !isProcessing && (
                     <div className="flex flex-col items-center justify-center h-full text-center text-red-400 border-2 border-dashed border-red-500/50 rounded-xl p-4">
                        <h3 className="text-xl font-semibold">{processingMessage}</h3>
                    </div>
                )}

                {aiResults.length > 0 && <AiResultsTable results={aiResults} />}
                
                {hasResults && (
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Processed Clips</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {processedVideos.map(video => (
                                <VideoPreviewCard key={video.id} video={video} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

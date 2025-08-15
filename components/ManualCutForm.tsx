
import React, { useState } from 'react';
import type { TimeSegment, ProcessedVideo } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface ManualCutFormProps {
    isProcessing: boolean;
    onProcessingStart: (message: string) => void;
    onProcessingComplete: (videos: ProcessedVideo[]) => void;
}

export const ManualCutForm: React.FC<ManualCutFormProps> = ({ isProcessing, onProcessingStart, onProcessingComplete }) => {
    const [segments, setSegments] = useState<TimeSegment[]>([{ id: crypto.randomUUID(), start: '00:00:00', end: '00:00:10' }]);
    const [merge, setMerge] = useState(false);

    const addSegment = () => {
        setSegments([...segments, { id: crypto.randomUUID(), start: '', end: '' }]);
    };

    const removeSegment = (id: string) => {
        setSegments(segments.filter(s => s.id !== id));
    };

    const handleSegmentChange = <T,>(id: string, field: keyof TimeSegment, value: T) => {
        setSegments(segments.map(s => s.id === id ? { ...s, [field]: value } : s));
    };
    
    const handleProcess = () => {
        onProcessingStart("Cutting video based on time segments...");
        
        // Simulate backend processing
        setTimeout(() => {
            const results: ProcessedVideo[] = merge ? 
            [{
                id: 'merged_manual',
                url: `https://picsum.photos/seed/${crypto.randomUUID()}/800/450`,
                title: 'Merged Video (Manual Cut)'
            }] :
            segments.map((seg, i) => ({
                id: `manual_cut_${i}`,
                url: `https://picsum.photos/seed/${seg.id}/800/450`,
                title: `Clip ${i + 1} (${seg.start} - ${seg.end})`
            }));

            onProcessingComplete(results);
        }, 3000);
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time Segments</label>
                <div className="space-y-3">
                    {segments.map((segment, index) => (
                        <div key={segment.id} className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="00:01:23"
                                value={segment.start}
                                onChange={(e) => handleSegmentChange(segment.id, 'start', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="text"
                                placeholder="00:05:30"
                                value={segment.end}
                                onChange={(e) => handleSegmentChange(segment.id, 'end', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button
                                onClick={() => removeSegment(segment.id)}
                                disabled={segments.length <= 1}
                                className="p-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    onClick={addSegment}
                    className="flex items-center space-x-2 mt-3 text-sm font-medium text-indigo-400 hover:text-indigo-300"
                >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Segment</span>
                </button>
            </div>
            
            <div className="flex items-center">
                <input
                    id="merge-videos"
                    type="checkbox"
                    checked={merge}
                    onChange={(e) => setMerge(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="merge-videos" className="ml-2 block text-sm text-gray-300">
                    Merge segments into one video
                </label>
            </div>

            <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            >
                {isProcessing ? 'Processing...' : 'Start Processing'}
            </button>
        </div>
    );
};

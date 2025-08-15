import React from 'react';
import { FilmIcon } from '../components/icons';

export const VideoCreationPage: React.FC = () => {
    return (
        <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
                <FilmIcon className="h-24 w-24 mx-auto text-gray-600 mb-4" />
                <h1 className="text-4xl font-bold text-white mb-2">AI Video Creation</h1>
                <p className="text-lg text-gray-400">This feature is under development. Create stunning videos from text prompts.</p>
            </div>
        </div>
    );
};
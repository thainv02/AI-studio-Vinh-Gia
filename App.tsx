import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { VideoProcessorPage } from './pages/VideoProcessorPage';
import { SpeechToTextPage } from './pages/SpeechToTextPage';
import { VideoCreationPage } from './pages/VideoCreationPage';

export type Page = 'processor' | 'speech' | 'creation';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('processor');

    const renderPage = () => {
        switch (currentPage) {
            case 'processor':
                return <VideoProcessorPage />;
            case 'speech':
                return <SpeechToTextPage />;
            case 'creation':
                return <VideoCreationPage />;
            default:
                return <VideoProcessorPage />;
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row bg-gray-900 text-gray-200 font-sans">
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
            <main className="flex-1 flex flex-col overflow-hidden">
                {renderPage()}
            </main>
        </div>
    );
};

export default App;
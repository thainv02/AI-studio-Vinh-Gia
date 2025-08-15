import React from 'react';
import { LogoIcon, ScissorIcon, MicrophoneIcon, FilmIcon } from './icons';
import type { Page } from '../App';

interface SidebarProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
            isActive
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
    return (
        <div className="w-full md:w-64 bg-gray-800/60 border-r border-gray-700/50 p-4 flex flex-col flex-shrink-0">
            <div className="flex items-center space-x-3 p-2 mb-6">
                <LogoIcon className="h-8 w-8 text-indigo-400" />
                <span className="text-xl font-bold text-white">AI Studio</span>
            </div>
            <nav className="flex flex-col space-y-2">
                <NavItem
                    icon={<ScissorIcon className="h-6 w-6" />}
                    label="Video Processor"
                    isActive={currentPage === 'processor'}
                    onClick={() => onNavigate('processor')}
                />
                <NavItem
                    icon={<MicrophoneIcon className="h-6 w-6" />}
                    label="Speech to Text"
                    isActive={currentPage === 'speech'}
                    onClick={() => onNavigate('speech')}
                />
                <NavItem
                    icon={<FilmIcon className="h-6 w-6" />}
                    label="AI Video Creation"
                    isActive={currentPage === 'creation'}
                    onClick={() => onNavigate('creation')}
                />
            </nav>
        </div>
    );
};
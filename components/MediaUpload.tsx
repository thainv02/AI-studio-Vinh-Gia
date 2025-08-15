import React, { useState, useCallback, useEffect } from 'react';
import { UploadIcon, VideoIcon, TrashIcon, MicrophoneIcon } from './icons';

interface MediaUploadProps {
    onUpload: (file: File) => void;
    onReset: () => void;
    currentFile: File | null;
    accept: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ onUpload, onReset, currentFile, accept }) => {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!currentFile) {
            setProgress(0);
            setIsUploading(false);
        }
    }, [currentFile]);

    const handleFileSelect = useCallback((file: File | null) => {
        if (file) {
            setIsUploading(true);
            setProgress(0);
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setIsUploading(false);
                        onUpload(file);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 50);
        }
    }, [onUpload]);

    const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);
    
    const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    }, [handleFileSelect]);
    
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };
    
    const FileIcon = currentFile?.type.startsWith('video/') ? VideoIcon : MicrophoneIcon;

    if (currentFile) {
        return (
            <div className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3 truncate">
                    <FileIcon className="h-6 w-6 text-indigo-400 flex-shrink-0" />
                    <span className="text-gray-200 truncate" title={currentFile.name}>{currentFile.name}</span>
                </div>
                <button onClick={onReset} className="p-2 rounded-full hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors">
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <label
                htmlFor="media-input"
                className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-indigo-400 bg-gray-700' : 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">Video or Audio files</p>
                </div>
                <input id="media-input" type="file" accept={accept} className="hidden" onChange={onFileChange} />

                {isUploading && (
                  <div className="absolute inset-0 bg-gray-800/80 rounded-lg flex items-center justify-center p-4">
                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                        <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                )}
            </label>
        </div>
    );
};

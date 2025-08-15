
export interface TimeSegment {
    id: string;
    start: string;
    end: string;
}

export interface AiQuestion {
    id: string;
    text: string;
}

export interface AiAnalysisResult {
    question: string;
    startTime: string;
    endTime: string;
    reasoning: string;
}

export interface ProcessedVideo {
    id: string;
    url: string; // This would be a blob URL or server URL in a real app
    title: string;
}

export interface TranscriptionSegment {
    start: number; // in seconds
    end: number; // in seconds
    text: string;
}

export interface Transcription {
    text: string;
    segments: TranscriptionSegment[];
}

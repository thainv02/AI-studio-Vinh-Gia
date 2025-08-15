
import { GoogleGenAI, Type } from "@google/genai";
import type { AiAnalysisResult } from '../types';

// IMPORTANT: This service assumes the API key is set in the environment.
// Do not add any UI or code to handle the API key.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("Gemini API key not found in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = "gemini-2.5-flash";

const systemInstruction = `You are an expert video analysis AI. Your task is to analyze a user's questions and determine the precise start and end timestamps (in HH:MM:SS format) within a hypothetical video where the answer to each question is most likely to be found. You must also provide a brief reasoning for your choice. A full transcript of the video is not available, so you must infer the content based on the questions. Assume the video is a standard educational documentary or lecture. Respond only with the JSON object.`;

export const findVideoSegments = async (questions: string[]): Promise<AiAnalysisResult[]> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }
    
    const prompt = `Based on a hypothetical video's content, identify the start and end timestamps for the following questions: \n\n${questions.map(q => `- ${q}`).join('\n')}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: {
                                type: Type.STRING,
                                description: "The original user question."
                            },
                            startTime: {
                                type: Type.STRING,
                                description: "The start time of the relevant segment in HH:MM:SS format."
                            },
                            endTime: {
                                type: Type.STRING,
                                description: "The end time of the relevant segment in HH:MM:SS format."
                            },
                            reasoning: {
                                type: Type.STRING,
                                description: "A brief explanation of why this segment was chosen."
                            }
                        },
                        required: ["question", "startTime", "endTime", "reasoning"]
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        const results = JSON.parse(jsonText) as AiAnalysisResult[];
        
        return results;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get analysis from AI. Please check the console for details.");
    }
};

import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    // In a real scenario, this key comes from process.env.API_KEY
    // Assuming the environment is set up correctly as per instructions.
    // If process.env.API_KEY is missing, this might throw, so we handle safely in the UI.
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
        console.warn("API Key not found in environment variables.");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateBlogContent = async (topic: string): Promise<string> => {
    try {
        const ai = getClient();
        if (!process.env.API_KEY) throw new Error("Missing API Key");

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Write a short, aesthetic blog post about "${topic}". 
            The style should be personal, reflective, and calm. 
            Use Markdown formatting. 
            Include a blockquote somewhere.`,
        });

        return response.text || "";
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
};
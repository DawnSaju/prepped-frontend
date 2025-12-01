import { MemoryBank, ExecutionStep, ChatSession } from '../types';

const API_BASE_URL = 'https://prepped-backend.vercel.app';

export interface ChatResponse {
    response: string;
    is_handoff: boolean;
    current_profile: any; // We'll map this to MemoryBank
    agent_name: string;
    trace: ExecutionStep[];
}

export const sendMessageToBackend = async (
    message: string,
    sessionId: string,
    audio?: string,
    userId?: string
): Promise<{ text: string; memoryBank: MemoryBank; agentName: string; isHandoff: boolean; trace: ExecutionStep[] }> => {
    try {
        const res = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: sessionId,
                message: message,
                audio: audio,
                user_id: userId
            }),
        });

        if (!res.ok) {
            throw new Error(`Backend error: ${res.statusText}`);
        }

        const data: ChatResponse = await res.json();

        // Map backend profile to frontend MemoryBank
        const backendProfile = data.current_profile;
        
        const memoryBank: MemoryBank = {
            chiefComplaint: backendProfile.main_complaint || "",
            symptomTimeline: backendProfile.symptoms.map((s: any) => ({
                description: s.description,
                duration: s.duration,
                severity: s.severity
            })),
            currentMedications: backendProfile.medications || [],
            familyHistory: backendProfile.family_history || [],
            suggestedQuestions: backendProfile.suggested_questions || []
        };

        return {
            text: data.response,
            memoryBank: memoryBank,
            agentName: data.agent_name,
            isHandoff: data.is_handoff,
            trace: data.trace || []
        };

    } catch (error) {
        console.error("API Call Failed:", error);
        throw error;
    }
};

export const getSessions = async (userId?: string): Promise<ChatSession[]> => {
    try {
        const url = userId ? `${API_BASE_URL}/sessions?user_id=${userId}` : `${API_BASE_URL}/sessions`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Backend error: ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch sessions:", error);
        return [];
    }
};

export const getSession = async (sessionId: string): Promise<{ memoryBank: MemoryBank; messages: any[] }> => {
    try {
        const res = await fetch(`${API_BASE_URL}/session/${sessionId}`);
        if (!res.ok) {
            throw new Error(`Backend error: ${res.statusText}`);
        }
        const data = await res.json();
        
        // Map backend profile to frontend MemoryBank
        const memoryBank: MemoryBank = {
            chiefComplaint: data.main_complaint || "",
            symptomTimeline: data.symptoms.map((s: any) => ({
                description: s.description,
                duration: s.duration,
                severity: s.severity
            })),
            currentMedications: data.medications || [],
            familyHistory: data.family_history || [],
            suggestedQuestions: data.suggested_questions || []
        };

        // Map backend messages to frontend Message format
        const messages = (data.messages || []).map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            type: msg.type || 'text',
            timestamp: msg.timestamp,
            agentName: msg.agent_name,
            trace: msg.trace
        }));

        return { memoryBank, messages };
    } catch (error) {
        console.error("Failed to fetch session:", error);
        throw error;
    }
};

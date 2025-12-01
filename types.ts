export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant'
}

export enum MessageType {
  TEXT = 'text',
  FIGMA_CARD = 'figma_card',
  IMAGE = 'image',
  AUDIO = 'audio'
}

export interface ExecutionStep {
  type: 'thought' | 'tool_call' | 'action' | 'handoff';
  content: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  timestamp: number;
  imageUrl?: string;
  audioData?: string;
  agentName?: string;
  action?: {
    label: string;
    url: string;
  };
  trace?: ExecutionStep[];
}

export interface ChatSession {
  id: string;
  title: string;
  date: string;
  preview: string;
}

export interface Symptom {
  description: string;
  duration: string;
  severity: string;
  notes?: string;
}

export interface MemoryBank {
  chiefComplaint: string;
  symptomTimeline: Symptom[];
  currentMedications: string[];
  familyHistory: string[];
  suggestedQuestions: string[];
}
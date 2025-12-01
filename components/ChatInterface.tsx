"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Message, MessageRole, MessageType, ChatSession } from '../types';
import { MessageBubble } from './ui/MessageBubble';
import { ChatInput } from './ui/ChatInput';
import { NeoButton } from './ui/NeoButton';
import { sendMessageToBackend, getSessions, getSession } from '../services/backendService';
import { account } from '../services/appwrite';
import { PanelLeftIcon, ThingChipIcon, ChevronDownIcon, CheckIcon, ThingRetroMacIcon, CodeIcon, ThingCubeIcon, ShareIcon } from './Icons';
import { Sidebar } from './Sidebar';
import { SettingsModal } from './SettingsModal';
import { ProfileModal } from './ProfileModal';
import { CallModal } from './CallModal';
import { SharePopover } from './ShareModal';
import { DocumentTitle } from './DocumentTitle';
import { MemoryBank } from '../types';

const MODELS = [
    { id: 'gemini-2.5-flash', name: 'Intake Nurse (Agent A)', description: 'Active Listener & Data Extractor' },
    { id: 'gemini-3-pro-preview', name: 'Medical Analyst (Agent B)', description: 'Synthesizer & Fact-Checker' },
];

const STARTER_PROMPTS = [
    {
        icon: <ThingRetroMacIcon className="w-5 h-5" />,
        title: "Start Intake",
        description: "Begin a new medical intake session",
        prompt: "I'm ready to start my medical intake."
    },
    {
        icon: <ThingChipIcon className="w-5 h-5" />,
        title: "Symptom Check",
        description: "Describe a specific symptom",
        prompt: "I have a new symptom I'm worried about."
    },
    {
        icon: <ThingCubeIcon className="w-5 h-5" />,
        title: "Medication Review",
        description: "Review current medications",
        prompt: "I need to review my current medications."
    }
];

export const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionIdParam = searchParams.get('session_id');

    useEffect(() => {
        const checkAuthAndLoadSessions = async () => {
            try {
                const user = await account.get();
                setUser(user);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', user.$id);
                
                const fetchedSessions = await getSessions(user.$id);
                setSessions(fetchedSessions);
            } catch (error) {
                if (localStorage.getItem('isLoggedIn')) {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userId');
                    router.push('/');
                } else {
                     router.push('/');
                }
            }
        };
        checkAuthAndLoadSessions();
    }, []);

    useEffect(() => {
        if (!sessionIdParam) {
            const newId = Date.now().toString();
            router.replace(`/dashboard?session_id=${newId}`);
        } else {
            setActiveSessionId(sessionIdParam);

            const loadSessionData = async () => {
                setIsLoading(true);
                try {
                    const { messages: loadedMessages, memoryBank: loadedMemory } = await getSession(sessionIdParam);
                    setMessages(loadedMessages);
                    setMemoryBank(loadedMemory);
                } catch (error) {
                    console.error("Error loading session:", error);
                    setMessages([]);
                } finally {
                    setIsLoading(false);
                }
            };
            loadSessionData();
        }
    }, [sessionIdParam, router]);

    const [selectedModel, setSelectedModel] = useState(MODELS[0]);
    const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
    const modelMenuRef = useRef<HTMLDivElement>(null);
    const shareButtonRef = useRef<HTMLDivElement>(null);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCallOpen, setIsCallOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [systemInstruction, setSystemInstruction] = useState("You are 'Prepped', a medical intake advocate. Your role is to conduct a structured interview to prepare the patient for a doctor's visit. You are warm, professional, and non-judgmental. Do NOT diagnose. Do NOT suggest medications. If the user mentions a life-threatening emergency (chest pain, trouble breathing), immediately tell them to call emergency services. Ask one question at a time. Start by asking 'What brings you in today?'.");

    const [memoryBank, setMemoryBank] = useState<MemoryBank>({
        chiefComplaint: "",
        symptomTimeline: [],
        currentMedications: [],
        familyHistory: [],
        suggestedQuestions: []
    });

    const [documentTitle, setDocumentTitle] = useState("Untitled Document");
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'synced'>('saved');
    const [lastEdited, setLastEdited] = useState(new Date());

    useEffect(() => {
        if (saveStatus === 'saving') {
            const timer = setTimeout(() => {
                setSaveStatus('saved');
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [saveStatus]);

    const handleDocumentChange = () => {
        setSaveStatus('saving');
        setLastEdited(new Date());
    };

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const streamRef = useRef<boolean>(true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const activeSession = sessions.find(s => s.id === activeSessionId);

    const handleTitleChange = (newTitle: string) => {
        if (activeSessionId) {
            setSessions(sessions.map(s =>
                s.id === activeSessionId ? { ...s, title: newTitle } : s
            ));
            setDocumentTitle(newTitle);
        }
    };

    useEffect(() => {
        if (activeSession) {
            setDocumentTitle(activeSession.title);
        }
    }, [activeSession]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modelMenuRef.current && !modelMenuRef.current.contains(event.target as Node)) {
                setIsModelMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (shareButtonRef.current && !shareButtonRef.current.contains(event.target as Node)) {
                setIsShareOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSendMessage = async (content: string, mediaBase64?: string) => {
        let msgType = MessageType.TEXT;
        let imageUrl = undefined;
        let audioData = undefined;

        if (mediaBase64) {
            if (mediaBase64.startsWith('data:audio')) {
                msgType = MessageType.AUDIO;
                audioData = mediaBase64;
            } else if (mediaBase64.startsWith('data:image')) {
                msgType = MessageType.IMAGE;
                imageUrl = mediaBase64;
            }
        }

        const newMessage: Message = {
            id: Date.now().toString(),
            role: MessageRole.USER,
            content,
            type: msgType,
            timestamp: Date.now(),
            imageUrl,
            audioData
        };

        setMessages((prev) => [...prev, newMessage]);
        setIsLoading(true);
        streamRef.current = true;

        try {
            const aiMessageId = (Date.now() + 1).toString();

            const userId = localStorage.getItem('userId') || undefined;
            const response = await sendMessageToBackend(content, activeSessionId || 'default', audioData, userId);

            const aiMessage: Message = {
                id: aiMessageId,
                role: MessageRole.ASSISTANT,
                content: response.text,
                type: MessageType.TEXT,
                timestamp: Date.now(),
                agentName: response.agentName,
                trace: response.trace,
                action: response.isHandoff ? {
                    label: "View Doctor Briefing",
                    url: `/canvas?session_id=${activeSessionId}`
                } : undefined
            };

            setMessages((prev) => [...prev, aiMessage]);

            setMemoryBank(response.memoryBank);

        } catch (error) {
            console.error('Failed to get response', error);
            const errorMessage: Message = {
                id: Date.now().toString(),
                role: MessageRole.ASSISTANT,
                content: "I'm having trouble connecting to the server. Please make sure the backend is running.",
                type: MessageType.TEXT,
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStopGeneration = () => {
        streamRef.current = false;
        setIsLoading(false);
    };

    const handleNewChat = () => {
        const newSessionId = Date.now().toString();
        const newSession: ChatSession = {
            id: newSessionId,
            title: 'New Conversation',
            date: 'Today',
            preview: ''
        };
        setSessions(prev => [newSession, ...prev]);
        router.push(`/dashboard?session_id=${newSessionId}`);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleSelectSession = (sessionId: string) => {
        router.push(`/dashboard?session_id=${sessionId}`);
    };



    const handleLogout = async () => {
        try {
            await account.deleteSession('current');
        } catch (e) {
            console.error("Logout error", e);
        }
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        router.push('/');
    };

    return (
        <div className="flex h-screen w-full bg-white dark:bg-[#2a2a2a] relative overflow-hidden transition-all duration-300">

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelectSession={handleSelectSession}
                onNewChat={handleNewChat}
                onNavigateHome={handleLogout}
                onOpenSettings={() => {
                    setIsSettingsOpen(true);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                onOpenProfile={() => {
                    setIsProfileOpen(true);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                onOpenCall={() => {
                    setIsCallOpen(true);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                memoryBank={memoryBank}
                user={user}
            />

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />

            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />

            <CallModal
                isOpen={isCallOpen}
                onClose={() => setIsCallOpen(false)}
                sessionId={activeSessionId}
            />

            <div
                className={`
            flex-1 h-full flex flex-col relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${isSidebarOpen ? 'md:pl-[280px]' : 'pl-0'}
        `}
            >
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="fixed top-6 left-4 md:left-6 z-50 p-2.5 rounded-full bg-white/50 dark:bg-[#3a3a3a]/50 border border-gray-200/50 dark:border-[#454545] hover:bg-white dark:hover:bg-[#454545] transition-all shadow-sm backdrop-blur-md group duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        aria-label="Open sidebar"
                    >
                        <PanelLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                    </button>
                )}

                <div className="flex-1 flex overflow-hidden bg-white dark:bg-[#2a2a2a]">

                    <div className="flex-1 flex flex-col h-full relative">
                        <div className="flex-1 overflow-y-auto px-4 pt-20 pb-4 space-y-4 max-w-3xl mx-auto w-full no-scrollbar">
                            {messages.map((msg, idx) => (
                                <MessageBubble key={msg.id || idx} message={msg} />
                            ))}
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full px-6 relative overflow-hidden">
                                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none flex items-center justify-center">
                                        <div className="absolute h-full w-px border-l border-dashed border-black dark:border-white"></div>
                                        <div className="absolute w-full h-px border-t border-dashed border-black dark:border-white"></div>
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#ffffff_80%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#2a2a2a_80%)]"></div>
                                    </div>

                                    <div className="relative z-10 text-center mb-12 max-w-2xl mx-auto">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#3a3a3a] border border-gray-200 dark:border-[#454545] shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase">System Ready</span>
                                        </div>

                                        <h2 className="text-5xl md:text-6xl font-semibold tracking-tighter text-gray-900 dark:text-white mb-6 leading-[0.95] animate-in fade-in zoom-in-95 duration-700 delay-100">
                                            Medical <br />
                                            <span className="text-transparent bg-clip-text bg-linear-to-b from-gray-400 to-gray-800 dark:from-zinc-400 dark:to-zinc-100">Intake.</span>
                                        </h2>

                                        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-medium max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                                            I'm here to help prepare you for your doctor's visit.
                                            Select a topic to begin the intake process.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-4xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                                        {STARTER_PROMPTS.map((starter, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSendMessage(starter.prompt)}
                                                className="group relative flex flex-col items-start p-6 text-left h-full min-h-[180px] rounded-3xl bg-white dark:bg-[#3a3a3a] border border-gray-200/80 dark:border-[#454545] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:border-gray-300/80 dark:hover:border-gray-500 hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-linear-to-br from-gray-50 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                                <div className="relative z-10 w-full h-full flex flex-col">
                                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-[#2a2a2a] border border-gray-100 dark:border-[#454545] flex items-center justify-center mb-auto text-gray-900 dark:text-white group-hover:scale-110 transition-transform duration-500">
                                                        {starter.icon}
                                                    </div>

                                                    <div className="mt-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">
                                                            {starter.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                                            {starter.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-gray-200 dark:border-[#454545] bg-white dark:bg-[#2a2a2a]">
                            <div className="max-w-3xl mx-auto w-full">
                                <ChatInput
                                    onSendMessage={handleSendMessage}
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
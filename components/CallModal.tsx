import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NeoButton } from './ui/NeoButton';
import { XIcon, PhoneIcon, CheckIcon } from './Icons';
import { API_BASE_URL } from '../services/backendService';

interface CallModalProps {
    isOpen: boolean;
    onClose: () => void;
    sessionId: string | null;
}

export const CallModal: React.FC<CallModalProps> = ({ isOpen, onClose, sessionId }) => {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [status, setStatus] = useState<'idle' | 'calling' | 'connected' | 'completed' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [callStatus, setCallStatus] = useState<string>('');
    const [agentStatus, setAgentStatus] = useState<string>('');
    const [lastMessage, setLastMessage] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            setErrorMessage('');
            setCallStatus('');
            setAgentStatus('');
            setLastMessage('');
        }
    }, [isOpen]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isOpen && status === 'connected' && sessionId) {
            intervalId = setInterval(async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/session/${sessionId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setCallStatus(data.call_status);
                        setAgentStatus(data.status);
                        
                        if (data.messages && data.messages.length > 0) {
                            const lastMsg = data.messages[data.messages.length - 1];
                            setLastMessage(lastMsg.content);
                        }
                        
                        if (data.call_status === 'completed') {
                            setStatus('completed');
                            clearInterval(intervalId);
                            setTimeout(() => {
                                onClose();
                                router.push(`/canvas?session_id=${sessionId}`);
                            }, 2000);
                        } else if (['busy', 'failed', 'no-answer'].includes(data.call_status)) {
                            setStatus('error');
                            setErrorMessage(`Call ended: ${data.call_status}`);
                            clearInterval(intervalId);
                        }
                    }
                } catch (error) {
                    console.error("Polling error:", error);
                }
            }, 2000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isOpen, status, sessionId, onClose, router]);

    if (!isOpen) return null;

    const handleCall = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionId) return;

        setStatus('calling');
        setErrorMessage('');

        try {
            const res = await fetch(`${API_BASE_URL}/initiate-call`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: sessionId,
                    phone_number: phoneNumber
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Failed to initiate call');
            }

            setStatus('connected');
        } catch (error: any) {
            console.error("Call failed:", error);
            setStatus('error');
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e1e1e] rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md overflow-hidden border border-gray-200 dark:border-[#333] animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="p-4 md:p-6 border-b border-gray-100 dark:border-[#333] flex justify-between items-center">
                    <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <PhoneIcon className="w-5 h-5" />
                        Start Voice Interview
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 md:p-6 pb-8 md:pb-6">
                    {status === 'idle' || status === 'error' ? (
                        <form onSubmit={handleCall} className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Enter your phone number to receive a call from the Intake Nurse.
                            </p>
                            
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="+15551234567"
                                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#333] rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-all"
                                    required
                                />
                            </div>

                            {status === 'error' && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-xs text-red-600 dark:text-red-400">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="pt-2">
                                <NeoButton type="submit" width="w-full" height="h-[44px]">
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">Call Me Now</span>
                                </NeoButton>
                            </div>
                        </form>
                    ) : status === 'completed' ? (
                         <div className="text-center py-8 space-y-4">
                            <div className="relative w-16 h-16 mx-auto">
                                <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center text-white shadow-lg">
                                    <CheckIcon className="w-8 h-8" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Interview Complete</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Refreshing your dashboard...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 space-y-4">
                            <div className="relative w-16 h-16 mx-auto">
                                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                                <div className="relative bg-green-500 rounded-full w-16 h-16 flex items-center justify-center text-white shadow-lg">
                                    <PhoneIcon className="w-8 h-8" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {callStatus === 'ringing' ? 'Ringing...' : 
                                     callStatus === 'in-progress' ? 'Call in Progress' : 
                                     'Calling you...'}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Please answer your phone to start the interview.
                                </p>
                                
                                {agentStatus && (
                                    <div className="mt-4 p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg border border-gray-100 dark:border-[#333]">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <div className={`w-2 h-2 rounded-full ${agentStatus === 'interview' ? 'bg-blue-500' : 'bg-purple-500'} animate-pulse`}></div>
                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                {agentStatus === 'interview' ? 'Interviewing' : 
                                                 agentStatus === 'analysis' ? 'Analyzing Data' : 
                                                 agentStatus}
                                            </span>
                                        </div>
                                        {lastMessage && (
                                            <p className="text-xs text-gray-600 dark:text-gray-300 italic line-clamp-3">
                                                "{lastMessage}"
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={onClose}
                                className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white underline"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

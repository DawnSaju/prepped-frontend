import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpIcon, PaperclipIcon, XIcon, SquareIcon, MicIcon, StopCircleIcon } from '../Icons';
import { NeoButton } from './NeoButton';
import { useTheme } from '../ThemeContext';

interface ChatInputProps {
    onSendMessage: (message: string, media?: string) => void;
    isLoading: boolean;
    onStop?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, onStop }) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);

    const { theme } = useTheme();

    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (isLoading && onStop) {
            onStop();
            return;
        }

        if ((inputValue.trim() || selectedImage) && !isLoading) {
            onSendMessage(inputValue, selectedImage || undefined);
            setInputValue('');
            setSelectedImage(null);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                if (fileInputRef.current) fileInputRef.current.value = '';
            };
            reader.readAsDataURL(file);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/mp3' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Audio = reader.result as string;
                    onSendMessage('', base64Audio);
                };
                reader.readAsDataURL(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingDuration(0);
            timerRef.current = window.setInterval(() => {
                setRecordingDuration(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please ensure permissions are granted.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const inputContainerShadow = theme === 'dark' ? 'none' : "rgba(0, 0, 0, 0.1) 0px 2px 4px inset, rgba(0, 0, 0, 0.06) 0px 1px 2px inset, rgba(255, 255, 255, 0.8) 0px 1px 0px";
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="
                relative w-full 
                bg-linear-to-b from-gray-100 to-gray-200 dark:from-[#3a3a3a] dark:to-[#3a3a3a]
                rounded-2xl md:rounded-3xl
                border border-gray-300/50 dark:border-[#454545]
                flex flex-col
                transition-all duration-300
            "
            style={{ boxShadow: inputContainerShadow }}
        >
            {selectedImage && (
                <div className="px-4 pt-4 pb-0 animate-in slide-in-from-bottom-2 fade-in duration-300">
                    <div className="relative inline-block">
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="h-20 w-auto rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 shadow-md hover:bg-black transition-colors"
                        >
                            <XIcon className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-2 p-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                />

                <div className="flex-1 min-h-12 flex items-center">
                    {isRecording ? (
                        <div className="flex items-center justify-between px-4 w-full animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
                                <span className="text-gray-900 dark:text-white font-mono font-medium">{formatTime(recordingDuration)}</span>
                                <span className="text-gray-500 text-sm">Recording...</span>
                            </div>
                            <button
                                type="button"
                                onClick={stopRecording}
                                className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                            >
                                <StopCircleIcon className="w-6 h-6" />
                            </button>
                        </div>
                    ) : (
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Describe your symptoms..."
                            disabled={isLoading}
                            className="w-full bg-transparent border-none outline-none text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-4 h-full"
                        />
                    )}
                </div>

                <div className="flex items-center gap-1">
                    {!isRecording && (
                        <NeoButton
                            onClick={() => fileInputRef.current?.click()}
                            width="w-11"
                            height="h-11"
                            type="button"
                            className="scale-90"
                            disabled={isLoading}
                        >
                            <PaperclipIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </NeoButton>
                    )}

                    {!inputValue.trim() && !selectedImage && !isRecording && !isLoading ? (
                        <NeoButton
                            type="button"
                            onClick={startRecording}
                            width="w-11"
                            height="h-11"
                            className="scale-90"
                        >
                            <MicIcon className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                        </NeoButton>
                    ) : !isRecording && (
                        <NeoButton
                            type="submit"
                            disabled={(!inputValue.trim() && !selectedImage && !isLoading)}
                            width="w-11"
                            height="h-11"
                            className="scale-90"
                        >
                            {isLoading ? (
                                <SquareIcon className="w-4 h-4 text-gray-900 dark:text-gray-100 fill-current" />
                            ) : (
                                <ArrowUpIcon className="w-5 h-5 text-gray-900 dark:text-gray-100 drop-shadow-sm" />
                            )}
                        </NeoButton>
                    )}
                </div>
            </div>
        </form>
    );
};;
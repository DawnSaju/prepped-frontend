import React, { useState, useEffect } from 'react';
import { XIcon, ThingDialIcon, CheckIcon, MoonIcon, SunIcon } from './Icons';
import { NeoButton } from './ui/NeoButton';
import { NeoSlider } from './ui/NeoSlider';
import { useTheme } from './ThemeContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    // systemInstruction and onSave are deprecated but kept for compatibility if needed, 
    // or we can remove them if we update the parent.
    // Let's make them optional for now.
    systemInstruction?: string;
    onSave?: (instruction: string) => void;
}

const NeoToggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
        onClick={onChange}
        className={`
            relative h-8 w-14 rounded-full p-1 transition-all duration-300 ease-in-out flex items-center
            shadow-[inset_0_1px_2px_rgba(0,0,0,0.1),inset_0_-1px_2px_rgba(255,255,255,0.5)] 
            dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.4),inset_0_-1px_2px_rgba(255,255,255,0.03)]
            ${checked 
                ? 'bg-linear-to-b from-gray-700 to-gray-900 dark:from-black dark:to-[#1a1a1a]' 
                : 'bg-linear-to-b from-gray-200 to-gray-300 dark:from-[#2a2a2a] dark:to-[#3a3a3a]'
            }
        `}
    >
        <span
            className={`
                pointer-events-none inline-block h-6 w-6 rounded-full 
                bg-linear-to-br from-white via-gray-100 to-gray-200 
                dark:from-[#6a6a6a] dark:via-[#5a5a5a] dark:to-[#4a4a4a]
                shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.8)] 
                dark:shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]
                transform ring-0 transition duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${checked ? 'translate-x-6' : 'translate-x-0'}
            `}
        />
    </button>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    systemInstruction,
    onSave
}) => {
    const [streamResponses, setStreamResponses] = useState(true);
    const [autoRead, setAutoRead] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);
    const [creativity, setCreativity] = useState(0.7);
    const [isAnimating, setIsAnimating] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        if (isOpen) {
            // setInstruction(systemInstruction); // Removed
            setIsAnimating(true);
        } else {
            const timer = setTimeout(() => setIsAnimating(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !isAnimating) return null;

    const handleSave = () => {
        // onSave(instruction); // Removed
        // In a real app, you would save 'creativity' and 'streamResponses' here
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div
                className="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className={`
        relative 
        w-full max-w-lg 
        bg-white dark:bg-[#3a3a3a]
        rounded-3xl 
        shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] 
        dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]
        border border-gray-200 dark:border-[#454545]
        p-6 
        m-4
        transform transition-all duration-300
        ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
      `}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#2a2a2a] border border-gray-100 dark:border-[#454545] flex items-center justify-center">
                            <ThingDialIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">System Settings</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Configure how the AI behaves</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#4a4a4a] transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6 mb-8">
                    <div className="pb-6 border-b border-gray-100 dark:border-[#454545]">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 text-center">Appearance</label>
                        <div className="flex justify-center">
                            <div className="relative flex bg-gray-100 dark:bg-[#2a2a2a] p-1 rounded-xl">
                                <button
                                    onClick={() => theme === 'dark' && toggleTheme()}
                                    className={`
                                relative z-10 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                ${theme === 'light'
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                        }
                            `}
                                >
                                    <SunIcon className="w-4 h-4" />
                                    Light
                                </button>
                                <button
                                    onClick={() => theme === 'light' && toggleTheme()}
                                    className={`
                                relative z-10 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                ${theme === 'dark'
                                            ? 'bg-[#3a3a3a] text-white shadow-sm ring-1 ring-white/10'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                        }
                            `}
                                >
                                    <MoonIcon className="w-4 h-4" />
                                    Dark
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center py-2 border-b border-gray-100 dark:border-[#454545] pb-6">
                        <NeoSlider
                            value={creativity}
                            min={0}
                            max={1}
                            step={0.1}
                            onChange={setCreativity}
                            label="Creativity Level"
                        />
                        <p className="mt-3 text-xs text-gray-400 text-center">
                            Adjusts response randomness (Temperature)
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Preferences</label>
                        
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#2a2a2a] border border-gray-100 dark:border-[#454545]">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Stream Responses</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Show text as it's being generated</span>
                                </div>
                                <NeoToggle checked={streamResponses} onChange={() => setStreamResponses(!streamResponses)} />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#2a2a2a] border border-gray-100 dark:border-[#454545]">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Auto-Read Responses</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Automatically play audio for new messages</span>
                                </div>
                                <NeoToggle checked={autoRead} onChange={() => setAutoRead(!autoRead)} />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#2a2a2a] border border-gray-100 dark:border-[#454545]">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Reduce Motion</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Minimize animations and transitions</span>
                                </div>
                                <NeoToggle checked={reduceMotion} onChange={() => setReduceMotion(!reduceMotion)} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#4a4a4a] rounded-xl transition-colors border border-transparent dark:border-gray-700"
                    >
                        Cancel
                    </button>
                    <NeoButton
                        onClick={handleSave}
                        width="w-24"
                        height="h-11"
                        className="scale-95"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Save</span>
                            <CheckIcon className="w-4 h-4 text-gray-800 dark:text-gray-200" />
                        </div>
                    </NeoButton>
                </div>
            </div>
        </div>
    );
};
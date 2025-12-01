"use client";

import React, { useState, useRef } from 'react';
import { CopyIcon, CheckIcon, DownloadIcon } from './Icons';
import { NeoButton } from './ui/NeoButton';
import { useTheme } from './ThemeContext';

interface SharePopoverProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SharePopover: React.FC<SharePopoverProps> = ({ isOpen, onClose }) => {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'social'>('link');
    const { theme } = useTheme();
    const cardRef = useRef<HTMLDivElement>(null);

    // Generate a mock share link (in production, this would come from your backend)
    const shareLink = typeof window !== 'undefined'
        ? `${window.location.origin}/share/${Math.random().toString(36).substr(2, 9)}`
        : 'https://app.example.com/share/abc123';

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (!isOpen) return null;

    const inputContainerShadow = theme === 'dark' ? 'none' : "rgba(0, 0, 0, 0.05) 0px 1px 2px inset";

    return (
        <>
            <div
                className="fixed inset-0 z-90 md:hidden"
                onClick={onClose}
            />

            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[340px] bg-linear-to-b from-gray-100 to-gray-200 dark:from-[#3a3a3a] dark:to-[#3a3a3a] rounded-3xl border border-gray-300/50 dark:border-[#454545] shadow-2xl z-100 animate-in fade-in zoom-in-95 duration-200"
                style={{ boxShadow: theme === 'dark' ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.15)' }}
            >
                <div className="p-5">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight mb-1">
                            Share Workspace
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Invite collaborators instantly
                        </p>
                    </div>

                    <div className="flex gap-2 mb-4">
                        {(['link', 'qr', 'social'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${activeTab === tab
                                    ? 'bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-40">
                        {activeTab === 'link' && (
                            <div className="space-y-3 animate-in fade-in duration-200">
                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                        Share Link
                                    </label>
                                    <div className="flex gap-2">
                                        <div
                                            className="flex-1 px-3 py-2.5 bg-linear-to-b from-gray-50 to-gray-100 dark:from-[#2a2a2a] dark:to-[#2a2a2a] border border-gray-300/50 dark:border-[#454545] rounded-xl text-xs text-gray-600 dark:text-gray-300 truncate font-mono"
                                            style={{ boxShadow: inputContainerShadow }}
                                        >
                                            {shareLink}
                                        </div>
                                        <NeoButton
                                            onClick={handleCopyLink}
                                            width="w-[70px]"
                                            height="h-[38px]"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                {copied ? (
                                                    <>
                                                        <CheckIcon className="w-3.5 h-3.5 text-gray-800 dark:text-gray-200" />
                                                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Done</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CopyIcon className="w-3.5 h-3.5 text-gray-800 dark:text-gray-200" />
                                                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Copy</span>
                                                    </>
                                                )}
                                            </div>
                                        </NeoButton>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'qr' && (
                            <div className="flex flex-col items-center animate-in fade-in duration-200">
                                <div className="bg-white p-4 rounded-2xl shadow-md mb-3">
                                    <div className="w-[140px] h-[140px] bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                        QR Code
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center font-medium">
                                    Scan to join workspace
                                </p>
                            </div>
                        )}

                        {activeTab === 'social' && (
                            <div className="flex flex-col items-center animate-in fade-in duration-200">
                                <div
                                    ref={cardRef}
                                    className="w-full aspect-[1.91/1] rounded-xl overflow-hidden relative flex flex-col items-center justify-center p-4 mb-4 shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                                    }}
                                >
                                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-indigo-500/30 via-purple-500/10 to-transparent animate-spin-slow pointer-events-none" />

                                    <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

                                    <div className="relative z-10 flex flex-col items-center text-center w-full">

                                        <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full mb-2 backdrop-blur-sm">
                                            <span className="relative flex h-1.5 w-1.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                            </span>
                                            <span className="text-[8px] font-bold text-red-400 tracking-wider uppercase">Live Access</span>
                                        </div>

                                        <h4 className="text-white font-black text-lg tracking-tight mb-0.5 drop-shadow-lg">
                                            Project Alpha
                                        </h4>
                                        <p className="text-gray-400 text-[8px] font-medium tracking-widest uppercase mb-3">
                                            Design Intelligence Workspace
                                        </p>

                                        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 p-1.5 pr-3 rounded-lg scale-90 origin-center">
                                            <div className="bg-white p-1 rounded-md">
                                                <div className="w-8 h-8 bg-gray-100"></div>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-white text-[10px] font-bold leading-tight">Join Session</p>
                                                <p className="text-gray-500 text-[8px] leading-tight">Scan to collaborate</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <NeoButton
                                    width="w-full"
                                    height="h-[38px]"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <DownloadIcon className="w-4 h-4 text-gray-800 dark:text-gray-200" />
                                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Download Access Pass</span>
                                    </div>
                                </NeoButton>
                            </div>
                        )}
                    </div>

                    <p className="mt-4 text-[10px] text-gray-400 dark:text-gray-500 text-center leading-relaxed">
                        Anyone with the link can edit
                    </p>
                </div >
            </div >
        </>
    );
};

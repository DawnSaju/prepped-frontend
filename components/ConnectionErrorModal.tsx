import React from 'react';
import { WifiOffIcon, AlertTriangleIcon } from './Icons';

interface ConnectionErrorModalProps {
    isOpen: boolean;
    onRetry: () => void;
    isRetrying?: boolean;
}

export const ConnectionErrorModal: React.FC<ConnectionErrorModalProps> = ({
    isOpen,
    onRetry,
    isRetrying
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 dark:bg-black/40 backdrop-blur-md transition-opacity duration-300 animate-in fade-in">
            <div className="
                relative 
                w-full max-w-md 
                bg-white dark:bg-[#3a3a3a]
                rounded-3xl 
                shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] 
                dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]
                border border-gray-200 dark:border-[#454545]
                p-6 
                transform transition-all duration-300
                scale-100 translate-y-0
                animate-in zoom-in-95 slide-in-from-bottom-2
            ">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center justify-center mb-4">
                        <WifiOffIcon className="w-8 h-8 text-red-500 dark:text-red-400" />
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight mb-2">Connection Failed</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[260px]">
                        Unable to connect to the server. Please check your internet connection and try again.
                    </p>
                </div>

                <div className="flex justify-center">
                    <button 
                        onClick={onRetry}
                        disabled={isRetrying}
                        type="button" 
                        className="group relative flex items-center justify-center rounded-2xl bg-transparent cursor-pointer disabled:cursor-not-allowed w-full h-12 scale-100 active:scale-95 transition-transform duration-200"
                    >
                        <div className="
                            absolute inset-0 rounded-2xl 
                            shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15),0_4px_10px_-4px_rgba(0,0,0,0.1)] 
                            dark:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.6)]
                            transition-shadow duration-500 
                            group-active:shadow-[0_8px_25px_-10px_rgba(0,0,0,0.15),0_4px_10px_-4px_rgba(0,0,0,0.1)] dark:group-active:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.5)]
                        "></div>
                        <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-[#ededed] to-[#d5d5d5] dark:from-[#525252] dark:to-[#3f3f3f]"></div>
                        <div className="absolute inset-1 rounded-xl bg-linear-to-b from-white to-white/30 dark:from-[#4a4a4a] dark:to-[#3a3a3a] p-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-none ring-1 ring-black/5 dark:ring-0 transition-all duration-500">
                            <div className="h-full w-full rounded-lg bg-linear-to-b from-[#F7F7F7] to-[#F0F0F0] dark:from-[#454545] dark:to-[#3a3a3a] shadow-[inset_0_0_10px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] border border-transparent dark:border-[#525252]"></div>
                        </div>
                        <div className="relative z-10 transition-opacity duration-300 opacity-90 group-hover:opacity-100">
                            <div className="flex items-center gap-2">
                                {isRetrying ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-gray-800 dark:border-gray-200 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Connecting...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Try Again</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { XIcon, TrashIcon } from './Icons';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isLoading
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in">
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
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#2a2a2a] border border-gray-100 dark:border-[#454545] flex items-center justify-center">
                            <TrashIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">{title}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#4a4a4a] transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-8">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#4a4a4a] rounded-xl transition-colors border border-transparent dark:border-gray-700"
                    >
                        Cancel
                    </button>
                    
                    <button 
                        onClick={onConfirm}
                        disabled={isLoading}
                        type="button" 
                        className="group relative flex items-center justify-center rounded-2xl bg-transparent cursor-pointer disabled:cursor-not-allowed w-28 h-11 scale-95"
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
                                {isLoading ? (
                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Deleting...</span>
                                ) : (
                                    <>
                                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Delete</span>
                                        <TrashIcon className="w-4 h-4 text-gray-800 dark:text-gray-200" />
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

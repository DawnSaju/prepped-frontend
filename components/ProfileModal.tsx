import React, { useState } from 'react';
import {
    XIcon,
    UserIcon,
    CreditCardIcon,
    BellIcon,
    LockIcon,
    DownloadIcon,
    CheckIcon
} from './Icons';
import { NeoButton } from './ui/NeoButton';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user?: any;
}

type Tab = 'general' | 'security';

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user }) => {
    const [activeTab, setActiveTab] = useState<Tab>('general');

    if (!isOpen) return null;

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'general', label: 'General', icon: <UserIcon className="w-4 h-4" /> },
        { id: 'security', label: 'Security', icon: <LockIcon className="w-4 h-4" /> },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="
        relative w-full max-w-lg
        bg-white dark:bg-[#3a3a3a]
        rounded-3xl 
        shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]
        border border-gray-200 dark:border-[#454545]
        p-6
        flex flex-col
        animate-in zoom-in-95 duration-300
      ">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Profile & Settings</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account details</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#4a4a4a] transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex p-1 bg-gray-100 dark:bg-[#2a2a2a] rounded-xl mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === tab.id
                                    ? 'bg-white dark:bg-[#4a4a4a] text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }
              `}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-6 mb-6">
                    {activeTab === 'general' && (
                        <div className="space-y-5 animate-in slide-in-from-right-4 fade-in duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-[#444] dark:to-[#333] border border-gray-200 dark:border-[#454545] flex items-center justify-center text-xl font-bold text-gray-500 dark:text-gray-400">
                                    {user?.name ? user.name.substring(0, 2).toUpperCase() : 'JD'}
                                </div>
                                <div>
                                    <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">Change Photo</button>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Max 1MB. JPG or PNG.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Name</label>
                                    <input type="text" defaultValue={user?.name || "John Doe"} className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#454545] text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 outline-none transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Email</label>
                                <input type="email" defaultValue={user?.email || "demo@design.com"} className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#454545] text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 outline-none transition-all" />
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-5 animate-in slide-in-from-right-4 fade-in duration-300">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">New Password</label>
                                <input type="password" className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#454545] text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10 outline-none transition-all" />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                                <div>
                                    <h5 className="text-sm font-bold text-red-600 dark:text-red-400">Delete Account</h5>
                                    <p className="text-xs text-red-500/80 mt-0.5">This action is permanent.</p>
                                </div>
                                <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#454545]">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#4a4a4a] rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <NeoButton
                        width="w-24"
                        height="h-9"
                        className="scale-100"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Save</span>
                            <CheckIcon className="w-3.5 h-3.5 text-gray-800 dark:text-gray-200" />
                        </div>
                    </NeoButton>
                </div>
            </div>
        </div>
    );
};
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChatSession, MemoryBank } from '../types';
import { PlusIcon, SettingsIcon, LogOutIcon, XIcon, MessageSquareIcon, ShieldIcon, MoreHorizontalIcon, CodeIcon, PanelLeftIcon, ThingChipIcon, ZapIcon, FileIcon, UserIcon, SparklesIcon, PhoneIcon } from './Icons';
import { NeoButton } from './ui/NeoButton';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onNavigateHome: () => void;
  onOpenSettings: () => void;
  onOpenProfile?: () => void;
  onOpenCall?: () => void;
  memoryBank: MemoryBank;
  user?: any;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onNavigateHome,
  onOpenSettings,
  onOpenProfile,
  onOpenCall,
  memoryBank,
  user
}) => {
  const [activeTab, setActiveTab] = useState<'context' | 'history'>('context');
  const router = useRouter();

  // Group sessions by category (using 'date' field as category)
  const groupedSessions = sessions.reduce((acc, session) => {
    if (!acc[session.date]) {
      acc[session.date] = [];
    }
    acc[session.date].push(session);
    return acc;
  }, {} as Record<string, ChatSession[]>);

  return (
    <>
      <div
        className={`
          fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-[320px] 
          bg-[#F9F9F9] dark:bg-[#1e1e1e]
          border-r border-gray-200 dark:border-[#333] 
          transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div 
              onClick={() => router.push('/')}
              className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-200/50 dark:hover:bg-white/5 transition-colors cursor-pointer group flex-1"
            >
              <div className="w-6 h-6 bg-gray-900 dark:bg-white rounded-md flex items-center justify-center shadow-sm">
                <ShieldIcon className="w-3.5 h-3.5 text-white dark:text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">Prepped</h2>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontalIcon className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="hidden md:flex p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors"
              title="Collapse Sidebar"
            >
              <PanelLeftIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex p-1 bg-gray-200/50 dark:bg-[#2a2a2a] rounded-lg">
            <button
                onClick={() => setActiveTab('context')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'context' ? 'bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
                Live Context
            </button>
            <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'history' ? 'bg-white dark:bg-[#3a3a3a] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
                History
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 no-scrollbar">
            
            {activeTab === 'context' ? (
                <div className="space-y-6 pb-4">
                    <div className="space-y-2">
                        <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <ZapIcon className="w-3 h-3" /> Chief Complaint
                        </h3>
                        <div className="bg-white dark:bg-[#252525] rounded-xl p-3 shadow-sm border border-gray-200/50 dark:border-[#333]">
                            <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
                                {memoryBank.chiefComplaint ? `"${memoryBank.chiefComplaint}"` : <span className="text-gray-400 italic">Pending input...</span>}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <FileIcon className="w-3 h-3" /> Symptom Timeline
                        </h3>
                        <div className="space-y-2">
                            {memoryBank.symptomTimeline.length > 0 ? memoryBank.symptomTimeline.map((symptom, idx) => (
                                <div key={idx} className="bg-white dark:bg-[#252525] rounded-xl p-3 shadow-sm border border-gray-200/50 dark:border-[#333]">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{symptom.description}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="text-[10px] bg-gray-100 dark:bg-[#333] px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">{symptom.duration}</span>
                                        <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded border border-amber-100 dark:border-amber-900/30">
                                            {symptom.severity}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-xs text-gray-400 italic p-1">No symptoms recorded yet.</div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <ShieldIcon className="w-3 h-3" /> Medications
                        </h3>
                        <div className="bg-white dark:bg-[#252525] rounded-xl p-1 shadow-sm border border-gray-200/50 dark:border-[#333]">
                            {memoryBank.currentMedications.length > 0 ? memoryBank.currentMedications.map((med, idx) => (
                                <div key={idx} className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 border-b last:border-0 border-gray-100 dark:border-[#333] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                    {med}
                                </div>
                            )) : (
                                <div className="px-3 py-2 text-xs text-gray-400 italic">None recorded</div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <SparklesIcon className="w-3 h-3 text-purple-500" /> Suggested Questions
                        </h3>
                        <div className="space-y-2">
                            {memoryBank.suggestedQuestions.length > 0 ? memoryBank.suggestedQuestions.map((q, idx) => (
                                <div key={idx} className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-lg p-3">
                                    <p className="text-xs font-medium text-purple-900 dark:text-purple-100">
                                        "{q}"
                                    </p>
                                </div>
                            )) : (
                                <div className="text-xs text-gray-400 italic p-1">Waiting for analysis...</div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="px-1 space-y-2">
                        <button
                            onClick={() => {
                                onNewChat();
                                if (window.innerWidth < 768) onClose();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#252525] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] active:scale-[0.98] border border-gray-200 dark:border-[#333] rounded-lg shadow-sm transition-all duration-200 group"
                        >
                            <PlusIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">New Intake</span>
                        </button>

                        <NeoButton
                            onClick={() => {
                                router.push(`/canvas?session_id=${activeSessionId}`);
                                if (window.innerWidth < 768) onClose();
                            }}
                            width="w-full"
                            height="h-[44px]"
                            className="scale-95"
                        >
                            <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Briefings</span>
                            </div>
                        </NeoButton>

                        {onOpenCall && (
                            <button
                                onClick={() => {
                                    onOpenCall();
                                    if (window.innerWidth < 768) onClose();
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 active:scale-[0.98] border border-green-200 dark:border-green-900/30 rounded-lg shadow-sm transition-all duration-200 group"
                            >
                                <PhoneIcon className="w-4 h-4 text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors" />
                                <span className="text-xs font-semibold text-green-700 dark:text-green-300 group-hover:text-green-800 dark:group-hover:text-green-200 transition-colors">Call Me (Emergency)</span>
                            </button>
                        )}
                    </div>

                    {Object.entries(groupedSessions).map(([category, categorySessions]) => (
                        <div key={category}>
                        <h3 className="px-2 mb-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            {category}
                        </h3>
                        <div className="space-y-0.5">
                            {categorySessions.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => {
                                onSelectSession(session.id);
                                if (window.innerWidth < 768) onClose();
                                }}
                                className={`
                                w-full text-left px-2 py-1.5 rounded-md text-sm transition-all duration-200 flex items-center gap-2.5 group
                                ${activeSessionId === session.id
                                    ? 'bg-gray-200/60 dark:bg-[#2a2a2a] text-gray-900 dark:text-white font-medium'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252525] hover:text-gray-900 dark:hover:text-gray-200'
                                }
                                `}
                            >
                                <MessageSquareIcon className={`w-4 h-4 transition-colors ${activeSessionId === session.id ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                                <span className="truncate flex-1 text-[13px]">{session.title}</span>
                            </button>
                            ))}
                        </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="p-3 border-t border-gray-200 dark:border-[#333] bg-gray-50/50 dark:bg-[#1e1e1e] space-y-0.5">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-[#2a2a2a] hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="text-[13px]">Settings</span>
          </button>

          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md text-sm text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <LogOutIcon className="w-4 h-4" />
            <span className="text-[13px]">Log Out</span>
          </button>

          <div className="pt-2 mt-2 border-t border-gray-200 dark:border-[#333]">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-md hover:bg-gray-200/50 dark:hover:bg-[#2a2a2a] transition-colors text-left group"
            >
              <div className="w-6 h-6 rounded-full bg-linear-to-br from-gray-700 to-black dark:from-gray-600 dark:to-gray-800 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {user?.name || 'User'}
                </p>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

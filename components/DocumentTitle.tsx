"use client";

import { useState, useEffect } from 'react';

interface DocumentTitleProps {
    initialTitle?: string;
    onTitleChange?: (title: string) => void;
    saveStatus?: 'saved' | 'saving' | 'synced';
    className?: string;
    showStatus?: boolean;
}

export function DocumentTitle({
    initialTitle = "Untitled Document",
    onTitleChange,
    saveStatus = 'saved',
    className = "",
    showStatus = true
}: DocumentTitleProps) {
    const [title, setTitle] = useState(initialTitle);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle]);

    const handleBlur = () => {
        setIsEditing(false);
        if (onTitleChange && title !== initialTitle) {
            onTitleChange(title);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
        }
        if (e.key === 'Escape') {
            setTitle(initialTitle);
            setIsEditing(false);
            e.currentTarget.blur();
        }
    };

    const getSaveStatusIcon = () => {
        switch (saveStatus) {
            case 'saving':
                return (
                    <div className="flex items-center gap-1">
                        <div className="animate-spin w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                        <span>Saving</span>
                    </div>
                );
            case 'synced':
                return (
                    <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                        <span>Synced</span>
                    </div>
                );
            case 'saved':
            default:
                return (
                    <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Saved</span>
                    </div>
                );
        }
    };

    return (
        <div className="flex items-center gap-3">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setIsEditing(true)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="Untitled Document"
                className={`bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-400 hover:bg-gray-50/50 dark:hover:bg-[#2a2a2a]/50 px-2 py-0.5 rounded transition-colors ${className}`}
                onClick={(e) => e.stopPropagation()}
            />

            {/* Save Status Indicator */}
            {showStatus && (
                <div className={`
                    text-xs font-medium text-gray-500 dark:text-gray-400
                    transition-opacity duration-300
                    ${isEditing ? 'opacity-0' : 'opacity-100'}
                `}>
                    {getSaveStatusIcon()}
                </div>
            )}
        </div>
    );
}

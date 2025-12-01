import React from 'react';

interface NeoButtonProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    width?: string;
    height?: string;
    active?: boolean;
}

export const NeoButton: React.FC<NeoButtonProps> = ({ 
    children, 
    onClick, 
    className = "", 
    disabled = false,
    type = 'button',
    width = "w-12",
    height = "h-12",
    active = false
}) => {
    return (
        <button 
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`group relative flex items-center justify-center rounded-2xl bg-transparent cursor-pointer disabled:cursor-not-allowed ${width} ${height} ${className}`}
        >
            <div className={`
                absolute inset-0 rounded-2xl 
                shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15),0_4px_10px_-4px_rgba(0,0,0,0.1)] 
                dark:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.6)]
                transition-shadow duration-500 
                ${active ? 'shadow-[0_8px_25px_-10px_rgba(0,0,0,0.15),0_4px_10px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.5)]' : 'group-active:shadow-[0_8px_25px_-10px_rgba(0,0,0,0.15),0_4px_10px_-4px_rgba(0,0,0,0.1)] dark:group-active:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.5)]'}
            `}></div>
            
            <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-[#ededed] to-[#d5d5d5] dark:from-[#525252] dark:to-[#3f3f3f]"></div>
            
            <div className="absolute inset-1 rounded-xl bg-linear-to-b from-white to-white/30 dark:from-[#4a4a4a] dark:to-[#3a3a3a] p-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-none ring-1 ring-black/5 dark:ring-0 transition-all duration-500">
                <div className="h-full w-full rounded-lg bg-linear-to-b from-[#F7F7F7] to-[#F0F0F0] dark:from-[#454545] dark:to-[#3a3a3a] shadow-[inset_0_0_10px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] border border-transparent dark:border-[#525252]"></div>
            </div>
            
            <div className={`relative z-10 transition-opacity duration-300 ${disabled ? 'opacity-30' : 'opacity-90 group-hover:opacity-100'}`}>
                {children}
            </div>
        </button>
    );
};
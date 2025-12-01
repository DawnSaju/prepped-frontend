"use client";
import React from 'react';
import { useTheme } from './ThemeContext';

export const AuthInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  const { theme } = useTheme();
  const inputContainerShadow = theme === 'dark' ? 'none' : "rgba(0, 0, 0, 0.1) 0px 2px 4px inset, rgba(0, 0, 0, 0.06) 0px 1px 2px inset, rgba(255, 255, 255, 0.8) 0px 1px 0px";

  return (
    <div
      className="w-full relative mb-4 rounded-full transition-all duration-300"
      style={{ boxShadow: inputContainerShadow }}
    >
      <input
        ref={ref}
        className="
          w-full 
          h-16 
          bg-linear-to-b from-gray-100 to-gray-200 
          dark:from-[#333333] dark:to-[#333333]
          rounded-full 
          border 
          border-gray-300/50 dark:border-[#454545]
          px-8
          text-lg
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none
          focus:ring-2
          focus:ring-gray-200/50 dark:focus:ring-[#525252]
          focus:border-gray-400 dark:focus:border-[#666]
          transition-all
        "
        {...props}
      />
    </div>
  );
});

export const AuthButton = ({ children, onClick, isLoading, className = "" }: { children: React.ReactNode, onClick?: () => void, isLoading?: boolean, className?: string }) => {
  const buttonShadow = "0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)";

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        w-full 
        h-16 
        rounded-full 
        bg-linear-to-b from-gray-900 to-black 
        dark:from-[#5a5a5a] dark:to-[#404040]
        text-white
        font-medium
        text-lg
        flex 
        items-center 
        justify-center 
        border 
        border-gray-800 dark:border-[#525252]
        transition-all 
        duration-300 
        hover:scale-[1.01]
        active:scale-[0.99]
        disabled:opacity-80
        ${className}
      `}
      style={{ boxShadow: buttonShadow }}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};
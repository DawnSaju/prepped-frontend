
import React, { useRef, useState } from 'react';

interface NeoSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (newValue: number) => void;
  label?: string;
}

export const NeoSlider: React.FC<NeoSliderProps> = ({ 
  value, 
  min, 
  max, 
  step = 1, 
  onChange,
  label
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<number>(0);
  const startValueRef = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startValueRef.current = value;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startXRef.current;
    // Sensitivity: 10px pixel movement = 1 step
    const stepsMoved = Math.round(deltaX / 20);
    
    let newValue = startValueRef.current + (stepsMoved * step);
    newValue = Math.max(min, Math.min(max, newValue));
    
    // Round to avoid floating point errors
    if (step < 1) {
        newValue = parseFloat(newValue.toFixed(1));
    }
    
    onChange(newValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(step < 1 ? parseFloat(newValue.toFixed(1)) : newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(step < 1 ? parseFloat(newValue.toFixed(1)) : newValue);
  };

  return (
    <div className="flex flex-col items-center gap-3">
        {label && (
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {label}
            </span>
        )}
        <div 
            className="rounded-full bg-linear-to-b from-gray-200 to-gray-300 dark:from-[#2a2a2a] dark:to-[#3a3a3a] px-2 py-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1),inset_0_-1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.4),inset_0_-1px_2px_rgba(255,255,255,0.03)] select-none"
        >
        <div className="flex items-center gap-4">
            <button 
                onClick={handleDecrement}
                className="w-10 h-full flex items-center justify-center text-2xl font-light text-gray-400 dark:text-white/70 hover:text-gray-600 dark:hover:text-white transition-colors active:scale-90"
                style={{ opacity: value <= min ? 0.1 : 0.5 }}
                disabled={value <= min}
            >
            −
            </button>

            <div 
                onMouseDown={handleMouseDown}
                style={{ 
                    touchAction: 'none',
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
                className={`
                    relative z-10 flex h-16 w-16 items-center justify-center rounded-full 
                    bg-linear-to-br from-white via-gray-100 to-gray-200 
                    dark:from-[#6a6a6a] dark:via-[#5a5a5a] dark:to-[#4a4a4a] 
                    shadow-[0_4px_8px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_-1px_2px_rgba(0,0,0,0.05)]
                    dark:shadow-[0_4px_8px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2)] 
                    active:scale-95 transition-transform duration-100
                `}
            >
                <div className="absolute inset-0 rounded-full bg-linear-to-b from-white/40 to-transparent pointer-events-none"></div>
                
                <span 
                    className="relative z-10 font-mono text-2xl font-light text-gray-700 dark:text-white drop-shadow-sm dark:drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]"
                >
                    {value}
                </span>
            </div>

            <button 
                onClick={handleIncrement}
                className="w-10 h-full flex items-center justify-center text-2xl font-light text-gray-400 dark:text-white/70 hover:text-gray-600 dark:hover:text-white transition-colors active:scale-90"
                style={{ opacity: value >= max ? 0.1 : 0.5 }}
                disabled={value >= max}
            >
            +
            </button>
        </div>
        </div>
    </div>
  );
};

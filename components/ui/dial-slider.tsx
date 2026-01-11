"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
  className?: string;
}

export function DialSlider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  unit = "",
  className,
}: DialSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleIncrement = () => {
    if (value + step <= max) {
      onChange(value + step);
    }
  };

  const handleDecrement = () => {
    if (value - step >= min) {
      onChange(value - step);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={cn("space-y-6", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      {/* Big number display */}
      <div className="relative flex items-center justify-center py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="text-center"
          >
            <div className="text-7xl md:text-8xl font-bold text-gradient leading-none">
              {value}
            </div>
            {unit && (
              <div className="text-lg md:text-xl text-muted-foreground mt-2 font-medium">
                {unit}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Circular progress indicator */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
          viewBox="0 0 200 200"
        >
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-primary"
            strokeDasharray={`${(percentage / 100) * 502} 502`}
            initial={{ strokeDasharray: "0 502" }}
            animate={{ strokeDasharray: `${(percentage / 100) * 502} 502` }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      </div>

      {/* Slider with increment/decrement buttons */}
      <div className="flex items-center gap-4">
        <motion.button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            "glass border-2 transition-all duration-200",
            value <= min
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-primary hover:scale-105 active:scale-95"
          )}
          whileTap={value > min ? { scale: 0.9 } : undefined}
        >
          <Minus className="w-5 h-5" />
        </motion.button>

        <div className="flex-1 relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSliderChange}
            className="w-full h-3 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-muted [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200 hover:[&::-webkit-slider-thumb]:scale-110 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-muted [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-200 hover:[&::-moz-range-thumb]:scale-110"
          />
          
          {/* Progress fill */}
          <div
            className="absolute top-1/2 left-0 h-3 rounded-full bg-gradient-to-r from-primary to-secondary pointer-events-none -translate-y-1/2"
            style={{ width: `${percentage}%` }}
          />

          {/* Min/Max labels */}
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            "glass border-2 transition-all duration-200",
            value >= max
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-primary hover:scale-105 active:scale-95"
          )}
          whileTap={value < max ? { scale: 0.9 } : undefined}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

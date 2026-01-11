"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePicker12hProps {
  hour: number; // 1-12
  minute: number; // 0-59
  period: "AM" | "PM";
  onHourChange: (hour: number) => void;
  onMinuteChange: (minute: number) => void;
  onPeriodChange: (period: "AM" | "PM") => void;
  className?: string;
}

export function TimePicker12h({
  hour,
  minute,
  period,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
  className,
}: TimePicker12hProps) {
  const incrementHour = () => {
    onHourChange(hour === 12 ? 1 : hour + 1);
  };

  const decrementHour = () => {
    onHourChange(hour === 1 ? 12 : hour - 1);
  };

  const incrementMinute = () => {
    onMinuteChange(minute === 45 ? 0 : minute + 15);
  };

  const decrementMinute = () => {
    onMinuteChange(minute === 0 ? 45 : minute - 15);
  };

  const togglePeriod = () => {
    onPeriodChange(period === "AM" ? "PM" : "AM");
  };

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* Clock icon */}
      <motion.div
        className="flex items-center justify-center w-16 h-16 rounded-full glass"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Clock className="w-8 h-8 text-primary" />
      </motion.div>

      {/* Time picker */}
      <div className="flex items-center gap-4">
        {/* Hour picker */}
        <TimeUnit
          value={hour}
          onIncrement={incrementHour}
          onDecrement={decrementHour}
          label="Hour"
        />

        <div className="text-4xl font-bold text-muted-foreground">:</div>

        {/* Minute picker */}
        <TimeUnit
          value={minute}
          onIncrement={incrementMinute}
          onDecrement={decrementMinute}
          label="Min"
          padZero
        />

        {/* Period picker */}
        <motion.button
          type="button"
          onClick={togglePeriod}
          className="flex flex-col items-center justify-center glass px-6 py-4 rounded-xl hover:border-primary transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl font-bold text-gradient">{period}</span>
          <span className="text-xs text-muted-foreground mt-1">Toggle</span>
        </motion.button>
      </div>
    </div>
  );
}

interface TimeUnitProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  label: string;
  padZero?: boolean;
}

function TimeUnit({
  value,
  onIncrement,
  onDecrement,
  label,
  padZero = false,
}: TimeUnitProps) {
  const displayValue = padZero ? String(value).padStart(2, "0") : String(value);

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        type="button"
        onClick={onIncrement}
        className="w-12 h-10 flex items-center justify-center glass rounded-lg hover:border-primary transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronUp className="w-5 h-5" />
      </motion.button>

      <motion.div
        key={value}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass px-6 py-4 rounded-xl min-w-[100px] flex flex-col items-center"
      >
        <span className="text-4xl font-bold text-gradient">{displayValue}</span>
        <span className="text-xs text-muted-foreground mt-1">{label}</span>
      </motion.div>

      <motion.button
        type="button"
        onClick={onDecrement}
        className="w-12 h-10 flex items-center justify-center glass rounded-lg hover:border-primary transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronDown className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

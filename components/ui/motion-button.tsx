"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MotionButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  shimmer?: boolean;
  glow?: boolean;
  className?: string;
}

export const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      shimmer = false,
      glow = false,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseStyles = cn(
      "relative inline-flex items-center justify-center gap-2",
      "font-medium transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
      shimmer && "shimmer overflow-hidden"
    );

    const variantStyles = {
      primary: cn(
        "bg-gradient-to-r from-primary via-primary to-secondary",
        "text-primary-foreground shadow-lg shadow-primary/30",
        "hover:shadow-xl hover:shadow-primary/40",
        glow && "hover:animate-glow"
      ),
      secondary: cn(
        "bg-secondary text-secondary-foreground",
        "hover:bg-secondary/90"
      ),
      outline: cn(
        "border-2 border-primary/50 bg-background/50",
        "hover:bg-primary/10 hover:border-primary"
      ),
      ghost: cn(
        "hover:bg-accent hover:text-accent-foreground"
      ),
      danger: cn(
        "bg-danger text-white shadow-lg shadow-danger/30",
        "hover:shadow-xl hover:shadow-danger/40"
      ),
    };

    const sizeStyles = {
      sm: "h-9 px-4 text-sm rounded-md",
      md: "h-11 px-6 text-base rounded-lg",
      lg: "h-14 px-8 text-lg rounded-xl",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);

MotionButton.displayName = "MotionButton";

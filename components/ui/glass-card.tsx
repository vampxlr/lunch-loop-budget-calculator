"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hover = true, glow = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "glass rounded-lg p-6 transition-all duration-300",
          hover && "hover:scale-[1.01] hover:shadow-lg",
          glow && "hover:shadow-primary/20",
          className
        )}
        whileHover={hover ? { y: -4 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export const GlassCardHeader = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>
      {children}
    </div>
  );
};

GlassCardHeader.displayName = "GlassCardHeader";

export const GlassCardTitle = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

GlassCardTitle.displayName = "GlassCardTitle";

export const GlassCardDescription = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
};

GlassCardDescription.displayName = "GlassCardDescription";

export const GlassCardContent = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
};

GlassCardContent.displayName = "GlassCardContent";

export const GlassCardFooter = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex items-center mt-6 pt-6 border-t border-border/50", className)} {...props}>
      {children}
    </div>
  );
};

GlassCardFooter.displayName = "GlassCardFooter";

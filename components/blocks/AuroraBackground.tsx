"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface AuroraBackgroundProps {
  children: React.ReactNode;
  className?: string;
  showGrid?: boolean;
}

export function AuroraBackground({
  children,
  className = "",
  showGrid = true,
}: AuroraBackgroundProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Aurora colors based on theme
  const colors = mounted && resolvedTheme === "dark"
    ? {
        blob1: "rgba(139, 92, 246, 0.3)",  // Purple
        blob2: "rgba(59, 130, 246, 0.25)",  // Blue
        blob3: "rgba(168, 85, 247, 0.2)",   // Violet
      }
    : {
        blob1: "rgba(139, 92, 246, 0.15)",  // Purple
        blob2: "rgba(59, 130, 246, 0.12)",  // Blue
        blob3: "rgba(168, 85, 247, 0.1)",   // Violet
      };

  return (
    <div className={`relative min-h-screen overflow-hidden bg-background ${className}`}>
      {/* Aurora gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-50"
          style={{
            background: `radial-gradient(circle, ${colors.blob1} 0%, transparent 70%)`,
            top: "-10%",
            left: "10%",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-50"
          style={{
            background: `radial-gradient(circle, ${colors.blob2} 0%, transparent 70%)`,
            top: "20%",
            right: "10%",
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full blur-3xl opacity-50"
          style={{
            background: `radial-gradient(circle, ${colors.blob3} 0%, transparent 70%)`,
            bottom: "10%",
            left: "40%",
          }}
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Grid overlay */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      )}

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              circle at center,
              transparent 0%,
              hsl(var(--background) / 0.3) 100%
            )
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

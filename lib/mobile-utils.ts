/**
 * Mobile detection and performance utilities
 */

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
}

export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Get reduced motion variants for mobile devices
 * Returns simpler animations that perform better on mobile
 */
export function getMotionVariants(isMobile: boolean) {
  if (isMobile) {
    // Simplified animations for mobile
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 }
    };
  }
  
  // Full animations for desktop
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  };
}

/**
 * Get slide variants with mobile optimization
 */
export function getSlideVariants(isMobile: boolean) {
  if (isMobile) {
    // No slide animation on mobile, just fade
    return {
      enter: { opacity: 0 },
      center: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
  
  // Full slide animation on desktop
  return {
    enter: (direction: string) => ({
      x: direction === "forward" ? 100 : -100,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: string) => ({
      x: direction === "forward" ? -100 : 100,
      opacity: 0,
    }),
  };
}

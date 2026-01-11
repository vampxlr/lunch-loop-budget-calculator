# Lunch Loop - Premium Design System

## Overview

This document outlines the premium futuristic design system implemented for Lunch Loop. The design system features glassmorphism, animated aurora backgrounds, and heavy micro-interactions while maintaining excellent performance and accessibility.

## Design Principles

1. **Futuristic but Readable** - Modern aesthetics without compromising usability
2. **Premium and Clean** - High-quality feel with attention to detail
3. **Dark and Light Themes** - Full support using next-themes
4. **Mobile-First** - Responsive design that works on all devices
5. **Performance-Friendly** - No heavy WebGL, optimized animations
6. **Accessible** - Respects prefers-reduced-motion and includes focus states

## Color System

### CSS Variables

All colors are defined as CSS variables in `app/globals.css`:

#### Light Theme
- Background: `240 20% 99%` - Clean, bright white with slight warmth
- Primary: `262 83% 58%` - Vibrant purple
- Secondary: `200 95% 55%` - Electric blue
- Accent: `280 90% 65%` - Vivid magenta
- Success: `142 76% 36%` - Fresh green
- Warning: `38 92% 50%` - Warm orange
- Danger: `0 84% 60%` - Alert red

#### Dark Theme
- Background: `240 10% 4%` - Deep, rich black
- Primary: `262 80% 65%` - Bright purple
- Secondary: `200 90% 60%` - Cyan blue
- Accent: `280 85% 70%` - Bright magenta
- Success: `142 76% 45%` - Vivid green
- Warning: `38 92% 60%` - Bright orange
- Danger: `0 84% 65%` - Bright red

## Components

### Layout Components (`/components/blocks`)

#### AuroraBackground
Animated gradient background with grid overlay and vignette effect.

```tsx
import { AuroraBackground } from "@/components/blocks/AuroraBackground";

<AuroraBackground showGrid={true}>
  {children}
</AuroraBackground>
```

**Features:**
- 3 animated gradient blobs with different speeds
- Optional grid overlay
- Vignette edges for depth
- Theme-aware colors
- Respects reduced motion

#### GlobalNav
Sticky navigation with logo, theme toggle, and optional dashboard link.

```tsx
import { GlobalNav } from "@/components/blocks/GlobalNav";

<GlobalNav showDashboardLink={true} />
```

**Features:**
- Scroll-aware glassmorphism
- Animated logo with glow effect
- Smooth entrance animation
- Mobile responsive

### UI Components (`/components/ui`)

#### GlassCard
Premium glassmorphic card with hover effects.

```tsx
import { 
  GlassCard, 
  GlassCardHeader, 
  GlassCardTitle, 
  GlassCardDescription, 
  GlassCardContent 
} from "@/components/ui/glass-card";

<GlassCard hover glow>
  <GlassCardHeader>
    <GlassCardTitle>Title</GlassCardTitle>
    <GlassCardDescription>Description</GlassCardDescription>
  </GlassCardHeader>
  <GlassCardContent>
    Content here
  </GlassCardContent>
</GlassCard>
```

**Props:**
- `hover` - Enable hover lift effect
- `glow` - Add glow on hover

#### MotionButton
Premium button with gradient, shimmer, and glow effects.

```tsx
import { MotionButton } from "@/components/ui/motion-button";

<MotionButton 
  variant="primary" 
  size="lg" 
  shimmer 
  glow
  loading={isLoading}
>
  Click Me
</MotionButton>
```

**Variants:** `primary`, `secondary`, `outline`, `ghost`, `danger`  
**Sizes:** `sm`, `md`, `lg`  
**Features:** Shimmer effect, glow animation, loading state, press animation

#### StepperProgress
Animated progress indicator with step labels.

```tsx
import { StepperProgress } from "@/components/ui/stepper-progress";

<StepperProgress 
  steps={["Contact", "Details", "Budget"]} 
  currentStep={1} 
/>
```

**Features:**
- Animated progress bar with spring physics
- Step indicators with check marks
- Current step highlighting with glow
- Responsive labels

#### DialSlider
Big number slider with circular progress and increment/decrement buttons.

```tsx
import { DialSlider } from "@/components/ui/dial-slider";

<DialSlider
  value={50}
  min={1}
  max={100}
  step={1}
  onChange={(value) => console.log(value)}
  label="Number of Employees"
  unit="employees"
/>
```

**Features:**
- Large animated number display
- Circular progress indicator
- Smooth slider with gradient fill
- Plus/minus buttons
- Spring animations

#### TimePicker12h
Premium time picker with hour, minute, and period selection.

```tsx
import { TimePicker12h } from "@/components/ui/time-picker-12h";

<TimePicker12h
  hour={12}
  minute={30}
  period="PM"
  onHourChange={setHour}
  onMinuteChange={setMinute}
  onPeriodChange={setPeriod}
/>
```

**Features:**
- 12-hour format
- Increment/decrement buttons
- Glassmorphic styling
- Animated value changes

#### Skeleton
Loading skeleton components.

```tsx
import { Skeleton, SkeletonCard, SkeletonList } from "@/components/ui/skeleton";

<SkeletonCard />
<SkeletonList count={5} />
```

#### EmptyState
Reusable empty state component.

```tsx
import { EmptyState } from "@/components/ui/empty-state";
import { FileText } from "lucide-react";

<EmptyState
  icon={FileText}
  title="No submissions yet"
  description="Submissions will appear here"
  action={<Button>Create New</Button>}
/>
```

#### Toast
Notification toast system.

```tsx
import { useToast, ToastProvider } from "@/components/ui/toast";

// Wrap app in provider
<ToastProvider>
  <App />
</ToastProvider>

// Use in components
const { addToast } = useToast();

addToast({
  type: "success",
  title: "Saved!",
  description: "Your changes have been saved."
});
```

**Types:** `success`, `error`, `info`, `warning`

## Utility Classes

### Glassmorphism

```css
.glass - Standard glass effect
.glass-strong - Stronger glass effect with more blur
```

### Text Effects

```css
.text-gradient - Animated gradient text (primary → secondary → accent)
```

### Shimmer

```css
.shimmer - Adds animated shimmer effect
```

## Animations

### Keyframes (Tailwind Config)

- `aurora` - Slow rotating gradient blob (20s)
- `aurora-2` - Alternative rotation pattern (25s)
- `fade-in` / `fade-out` - Opacity transitions
- `slide-in-from-*` - Directional slide animations
- `glow` - Pulsing glow effect
- `pulse-glow` - Subtle pulsing

### Motion Spec

All animations follow these guidelines:

- **Page transitions:** 200-300ms fade + slight slide
- **Step transitions:** 250ms slide (directional based on navigation)
- **Hover:** 4px lift, subtle glow
- **Button press:** Scale to 0.98
- **Progress bar:** Animated width with spring physics
- **Reduced motion:** Animations respect `prefers-reduced-motion`

## Typography

Using **Inter** font with clear hierarchy:

- **Hero:** 42-56px (text-4xl to text-6xl)
- **Section headings:** 24-32px (text-2xl to text-3xl)
- **Body:** 16-18px (text-base to text-lg)
- **Labels:** 12-14px (text-xs to text-sm)

## Spacing System

Consistent spacing using Tailwind's spacing scale:

- **Component padding:** 6-8 (1.5rem - 2rem)
- **Section gaps:** 6-8 (1.5rem - 2rem)
- **Element gaps:** 3-4 (0.75rem - 1rem)
- **Tight spacing:** 2 (0.5rem)

## Accessibility

### Focus States

All interactive elements include:
- Visible focus rings using `focus-visible:ring-2`
- High contrast focus indicators
- Keyboard navigation support

### Motion

Respects user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Color Contrast

All color combinations meet WCAG AA standards for contrast ratios.

## File Structure

```
components/
├── blocks/           # Layout components
│   ├── AuroraBackground.tsx
│   └── GlobalNav.tsx
├── ui/              # Reusable UI components
│   ├── glass-card.tsx
│   ├── motion-button.tsx
│   ├── stepper-progress.tsx
│   ├── dial-slider.tsx
│   ├── time-picker-12h.tsx
│   ├── skeleton.tsx
│   ├── empty-state.tsx
│   └── toast.tsx
└── wizard/          # Wizard step components
    ├── ContactStep.tsx
    ├── EmployeesCountStep.tsx
    ├── DaysPerWeekStep.tsx
    ├── DeliveryTimeStep.tsx
    ├── BudgetStep.tsx
    └── TastingStep.tsx
```

## Best Practices

### Component Usage

1. **Always wrap pages in AuroraBackground** for consistent backdrop
2. **Use GlobalNav** for consistent navigation
3. **Prefer GlassCard** over standard Card for premium feel
4. **Use MotionButton** with shimmer/glow for CTAs
5. **Add loading states** with Skeleton components
6. **Show empty states** instead of blank spaces

### Performance

1. Aurora animations use CSS transforms (GPU accelerated)
2. Motion components use `framer-motion` with proper exit animations
3. Images should be optimized and lazy-loaded
4. Avoid deep nesting of glass effects (impacts performance)

### Theme Switching

The design system automatically adapts to theme changes via `next-themes`. No additional configuration needed.

## Future Enhancements

Potential improvements for future iterations:

- [ ] Add more empty state illustrations
- [ ] Expand toast notification positions
- [ ] Create more skeleton variants
- [ ] Add tooltip component
- [ ] Create modal/dialog component
- [ ] Add dropdown menu component
- [ ] Implement command palette
- [ ] Add progress indicators for long operations

## Support

For questions or issues with the design system, refer to:
- Component source files for implementation details
- Framer Motion docs: https://www.framer.com/motion/
- Tailwind CSS docs: https://tailwindcss.com/docs

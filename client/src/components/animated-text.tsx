import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type AnimationStyle = 'fade' | 'slide' | 'bounce' | 'typing' | 'glow' | 'none';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  animationStyle?: AnimationStyle;
  delay?: number; // Delay in ms before animation starts
  duration?: number; // Duration of the animation in ms
  repeat?: boolean; // Whether to repeat the animation
  hoverTrigger?: boolean; // Trigger animation on hover
}

export default function AnimatedText({
  text,
  className = '',
  style = {},
  animationStyle = 'fade',
  delay = 0,
  duration = 1000,
  repeat = false,
  hoverTrigger = false,
}: AnimatedTextProps) {
  const [isAnimating, setIsAnimating] = useState(!hoverTrigger);

  useEffect(() => {
    if (!hoverTrigger && repeat) {
      const interval = setInterval(() => {
        setIsAnimating(false);
        setTimeout(() => setIsAnimating(true), 50);
      }, duration + delay + 1000); // Add extra time between repeats
      
      return () => clearInterval(interval);
    }
  }, [hoverTrigger, repeat, duration, delay]);

  const handleMouseEnter = () => {
    if (hoverTrigger) {
      setIsAnimating(true);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTrigger) {
      setIsAnimating(false);
    }
  };

  const getAnimationClass = (): string => {
    if (!isAnimating) return '';
    
    switch (animationStyle) {
      case 'fade':
        return 'animate-fade-in';
      case 'slide':
        return 'animate-slide-in';
      case 'bounce':
        return 'animate-bounce';
      case 'typing':
        return 'animate-typing';
      case 'glow':
        return 'animate-glow';
      case 'none':
      default:
        return '';
    }
  };

  const animationStyles = {
    'fade': {
      opacity: isAnimating ? 1 : 0,
      transition: `opacity ${duration}ms ease-in-out ${delay}ms`,
    },
    'slide': {
      transform: isAnimating ? 'translateY(0)' : 'translateY(20px)',
      opacity: isAnimating ? 1 : 0,
      transition: `transform ${duration}ms ease-out ${delay}ms, opacity ${duration}ms ease-in-out ${delay}ms`,
    },
    'bounce': {
      animation: isAnimating ? `bounce ${duration}ms ease ${delay}ms ${repeat ? 'infinite' : '1'}` : 'none',
    },
    'typing': {
      position: 'relative' as const,
      borderRight: isAnimating ? '2px solid currentColor' : 'none',
      whiteSpace: 'nowrap' as const,
      overflow: 'hidden' as const,
      maxWidth: isAnimating ? '100%' : '0',
      animation: isAnimating ? `typing ${duration}ms steps(${text.length}) ${delay}ms forwards, blink 750ms step-end infinite` : 'none',
    },
    'glow': {
      textShadow: isAnimating ? '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' : 'none',
      transition: `text-shadow ${duration}ms ease-in-out ${delay}ms`,
    },
    'none': {},
  };

  return (
    <span
      className={cn('inline-block', getAnimationClass(), className)}
      style={{
        ...style,
        ...animationStyles[animationStyle],
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </span>
  );
}
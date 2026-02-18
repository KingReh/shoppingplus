import React, { useState, useRef, useCallback } from 'react';
import { Trash2, CopyPlus } from 'lucide-react';

interface SwipeableProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const SWIPE_THRESHOLD = 60;
const MAX_SWIPE = 80;

export function SwipeableRow({
  onSwipeLeft,
  onSwipeRight,
  leftContent,
  rightContent,
  children,
  className = '',
  disabled = false,
}: SwipeableProps) {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const isHorizontal = useRef<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isHorizontal.current = null;
    setIsDragging(false);
  }, [disabled]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    if (isHorizontal.current === null) {
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isHorizontal.current = Math.abs(dx) > Math.abs(dy);
      }
      return;
    }

    if (!isHorizontal.current) return;

    e.preventDefault();
    setIsDragging(true);

    const clamped = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, dx));
    if (!onSwipeLeft && clamped < 0) return;
    if (!onSwipeRight && clamped > 0) return;
    setOffset(clamped);
  }, [disabled, onSwipeLeft, onSwipeRight]);

  const handleTouchEnd = useCallback(() => {
    if (disabled) return;
    
    if (offset < -SWIPE_THRESHOLD && onSwipeLeft) {
      onSwipeLeft();
    } else if (offset > SWIPE_THRESHOLD && onSwipeRight) {
      onSwipeRight();
    }
    
    setOffset(0);
    setIsDragging(false);
    isHorizontal.current = null;
  }, [offset, onSwipeLeft, onSwipeRight, disabled]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Left reveal (swipe right) */}
      {rightContent && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          {rightContent}
        </div>
      )}
      {/* Right reveal (swipe left) */}
      {leftContent && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          {leftContent}
        </div>
      )}
      {/* Main content */}
      <div
        style={{
          transform: `translateX(${offset}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}

export function DeleteReveal({ label = 'Deletar' }: { label?: string }) {
  return (
    <div className="flex items-center gap-1 text-destructive">
      <Trash2 className="w-5 h-5" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

export function DuplicateReveal({ label = 'Duplicar' }: { label?: string }) {
  return (
    <div className="flex items-center gap-1 text-primary">
      <CopyPlus className="w-5 h-5" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

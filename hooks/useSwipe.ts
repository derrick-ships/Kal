"use client";
import { useRef, useCallback } from "react";

export function useSwipe(onSwipeRight: () => void) {
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - startY.current);
    if (dx > 80 && dy < 60) onSwipeRight();
  }, [onSwipeRight]);

  return { onTouchStart, onTouchEnd };
}
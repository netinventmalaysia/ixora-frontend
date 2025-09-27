import React, { useRef, useState, useEffect } from 'react';

type Props = {
  onRefresh: () => Promise<void> | void;
  threshold?: number; // pixels to trigger
  maxPull?: number; // max translateY
  children: React.ReactNode;
  // When true, do not apply transform on content wrapper (preserves sticky headers).
  // Instead, render a fixed indicator at the top.
  noTransform?: boolean;
};

// Lightweight pull-to-refresh for touch devices. Works when the scroll container is at top.
export default function PullToRefresh({ onRefresh, threshold = 70, maxPull = 120, children, noTransform = false }: Props) {
  const startY = useRef<number | null>(null);
  const pulling = useRef(false);
  const [offset, setOffset] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const scroller = document; // page-level scroll; could be customized

    const onTouchStart = (e: TouchEvent) => {
      if (refreshing) return;
      if (window.scrollY > 0) return; // only when at top
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling.current || refreshing) return;
      const y = e.touches[0].clientY;
      if (startY.current === null) return;
      const delta = y - startY.current;
      if (delta > 0 && window.scrollY === 0) {
        e.preventDefault(); // prevent native bounce
        const next = Math.min(delta * 0.6, maxPull);
        setOffset(next);
      }
    };

    const endPull = async () => {
      if (!pulling.current) return;
      pulling.current = false;
      if (offset >= threshold) {
        try {
          setRefreshing(true);
          await onRefresh();
        } finally {
          setRefreshing(false);
        }
      }
      // animate back
      setOffset(0);
    };

    const onTouchEnd = () => { endPull(); };
    const onTouchCancel = () => { endPull(); };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchCancel, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart as any);
      window.removeEventListener('touchmove', onTouchMove as any);
      window.removeEventListener('touchend', onTouchEnd as any);
      window.removeEventListener('touchcancel', onTouchCancel as any);
    };
  }, [onRefresh, threshold, maxPull, refreshing, offset]);

  const wrapperStyle: React.CSSProperties = noTransform
    ? {}
    : {
        transform: offset ? `translateY(${offset}px)` : undefined,
        transition: pulling.current || offset ? 'transform 200ms ease' : undefined,
      };

  const indicator = (
    <div
      className={noTransform ? 'pointer-events-none fixed left-1/2 top-2 z-[60] -translate-x-1/2' : 'pointer-events-none h-0 overflow-visible'}
      aria-hidden="true"
    >
      <div
        className={noTransform ? 'flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 shadow-md' : 'mx-auto mt-[-48px] flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 shadow-md'}
        style={{
          opacity: Math.min(offset / threshold, 1),
          transform: noTransform
            ? `scale(${0.8 + Math.min(offset / threshold, 1) * 0.2})`
            : `scale(${0.8 + Math.min(offset / threshold, 1) * 0.2})`,
        }}
      >
        {refreshing ? (
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14m0 0l-6-6m6 6l6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  );

  if (noTransform) {
    return (
      <>
        {indicator}
        {children}
      </>
    );
  }

  return (
    <div style={wrapperStyle}>
      {/* Indicator */}
      {indicator}
      {children}
    </div>
  );
}

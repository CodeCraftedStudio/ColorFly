/**
 * ColorFly: Virtual List Component
 * Renders only visible items in a long list for performance.
 * Useful for large lists like the 162 workbench color settings.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // Extra items to render above/below viewport
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const VirtualList: React.FC<VirtualListProps<any>> = ({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
  renderItem,
  className,
  style,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount - 1);

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  if (items.length === 0) {
    return (
      <div
        ref={listRef}
        className={className}
        style={{ ...style, height: containerHeight, overflow: 'auto' }}
        onScroll={handleScroll}
      />
    );
  }

  return (
    <div
      ref={listRef}
      className={className}
      style={{
        ...style,
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      {/* Spacer above visible items */}
      <div
        style={{
          height: offsetY,
          width: '100%',
        }}
      />
      {/* Visible items */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {visibleItems.map((item, i) => (
          <div
            key={i}
            style={{
              height: itemHeight,
              position: 'relative',
            }}
          >
            {renderItem(item, startIndex + i)}
          </div>
        ))}
      </div>
      {/* Spacer below visible items */}
      <div
        style={{
          height: totalHeight - offsetY - visibleItems.length * itemHeight,
          width: '100%',
        }}
      />
    </div>
  );
};

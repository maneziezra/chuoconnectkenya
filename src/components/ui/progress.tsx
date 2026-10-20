import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indicatorColor?: string;
}

/**
 * shadcn/ui Progress component using compositor-safe transform: scaleX().
 */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, indicatorColor = 'var(--accent-gold)', style, ...props }, ref) => {
    const clamped = Math.min(Math.max(value, 0), max);
    const ratio = max > 0 ? clamped / max : 0;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(clamped)}
        className={cn('ui-progress-root', className)}
        style={{
          position: 'relative',
          height: 8,
          width: '100%',
          overflow: 'hidden',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-tertiary)',
          ...style,
        }}
        {...props}
      >
        <div
          className="ui-progress-indicator"
          style={{
            height: '100%',
            width: '100%',
            background: indicatorColor,
            transformOrigin: 'left center',
            transform: `scaleX(${ratio})`,
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

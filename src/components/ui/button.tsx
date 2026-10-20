import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'navy' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  loading?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  gold: 'btn btn-gold',
  navy: 'btn btn-navy',
  outline: 'btn btn-outline',
  ghost: 'btn btn-ghost',
};

/**
 * shadcn/ui Button & LoadingButton component with accessible busy state and spinner.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'gold', size = 'default', loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          variantClasses[variant],
          size === 'sm' && 'btn-sm',
          className
        )}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

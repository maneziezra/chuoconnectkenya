import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'navy' | 'green' | 'outline';
}

const badgeVariantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  gold: 'badge badge-gold',
  navy: 'badge badge-navy',
  green: 'badge badge-green',
  outline: 'badge',
};

/**
 * shadcn/ui Badge component styled with Chuo Connect Executive Navy & Gold tokens.
 */
export function Badge({ className, variant = 'navy', ...props }: BadgeProps) {
  return <span className={cn(badgeVariantClasses[variant], className)} {...props} />;
}

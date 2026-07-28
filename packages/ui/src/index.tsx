import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// Button
// ============================================================================

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 shadow-md',
        secondary: 'bg-[var(--color-surface-elevated)] text-[var(--color-text)] hover:bg-[var(--color-border)]',
        accent: 'bg-[var(--color-accent)] text-black font-bold hover:brightness-110 shadow-glow',
        ghost: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]',
        danger: 'bg-[var(--color-error)] text-white hover:bg-red-700',
        success: 'bg-[var(--color-success)] text-white hover:bg-emerald-700',
        outline: 'border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-elevated)]',
        wicket: 'bg-[var(--color-wicket)] text-white hover:bg-red-800 font-bold',
        four: 'bg-[var(--color-four)] text-white hover:bg-blue-800 font-bold',
        six: 'bg-[var(--color-six)] text-white hover:bg-purple-800 font-bold',
      },
      size: {
        xs: 'h-7 px-2 text-xs',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

// ============================================================================
// Panel
// ============================================================================

const panelVariants = cva('rounded-xl border border-[var(--color-border)]', {
  variants: {
    variant: {
      default: 'bg-[var(--color-surface)]',
      elevated: 'bg-[var(--color-surface-elevated)] shadow-md',
      glass: 'glass-panel',
      glassElevated: 'glass-panel-elevated',
    },
    padding: {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
});

export interface PanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelVariants> {
  title?: string;
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className, variant, padding, title, children, ...props }, ref) => (
    <div ref={ref} className={cn(panelVariants({ variant, padding, className }))} {...props}>
      {title && (
        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
          {title}
        </h3>
      )}
      {children}
    </div>
  ),
);
Panel.displayName = 'Panel';

// ============================================================================
// Input
// ============================================================================

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-colors disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

// ============================================================================
// Badge
// ============================================================================

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)]',
        live: 'bg-[var(--color-live)]/20 text-[var(--color-live)]',
        success: 'bg-emerald-500/20 text-emerald-400',
        warning: 'bg-amber-500/20 text-amber-400',
        error: 'bg-red-500/20 text-red-400',
        info: 'bg-blue-500/20 text-blue-400',
        gold: 'bg-[var(--color-gold)]/20 text-[var(--color-gold)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, className }))} {...props} />
  ),
);
Badge.displayName = 'Badge';

// ============================================================================
// Card
// ============================================================================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all',
        hoverable && 'cursor-pointer hover:border-[var(--color-accent)]/50 hover:shadow-lg',
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

// ============================================================================
// Select
// ============================================================================

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] transition-colors disabled:opacity-50 appearance-none',
        className,
      )}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
);
Select.displayName = 'Select';

// ============================================================================
// Separator
// ============================================================================

export const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' }
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'bg-[var(--color-border)]',
      orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
      className,
    )}
    {...props}
  />
));
Separator.displayName = 'Separator';

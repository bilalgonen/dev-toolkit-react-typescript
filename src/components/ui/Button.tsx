import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { Icon, type IconName } from './Icon'

const VARIANTS = {
  primary: 'bg-accent text-accent-fg hover:opacity-90',
  ghost: 'text-muted hover:bg-line/60 hover:text-fg',
  outline: 'border border-line bg-surface hover:bg-line/50',
}

interface ButtonProps extends ComponentProps<'button'> {
  variant?: keyof typeof VARIANTS
  icon?: IconName
}

export function Button({ variant = 'outline', icon, className, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  )
}

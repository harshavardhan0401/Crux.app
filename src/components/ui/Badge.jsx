const variantStyles = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-error/15 text-error',
  coral: 'bg-coral/15 text-coral',
  teal: 'bg-teal/15 text-teal',
  purple: 'bg-purple/15 text-purple',
  amber: 'bg-warning/15 text-warning',
  default: 'bg-white/5 dark:bg-white/5 bg-black/5 text-text-secondary dark:text-text-secondary text-text-secondary-light',
  outline: 'border border-white/10 dark:border-white/10 border-black/10 text-text-secondary dark:text-text-secondary text-text-secondary-light',
  'teal-outline': 'border border-teal/50 text-teal bg-teal/5',
}

export default function Badge({ children, variant = 'default', className = '', ...props }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap
        ${variantStyles[variant] || variantStyles.default}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}

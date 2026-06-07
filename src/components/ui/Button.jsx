import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-coral text-white font-medium hover:bg-coral-hover hover:shadow-coral-glow',
  ghost: 'border border-white/10 dark:border-white/10 border-black/10 text-text-secondary dark:text-text-secondary text-text-secondary-light hover:bg-white/5 dark:hover:bg-white/5 hover:bg-black/5',
  danger: 'bg-error/10 text-error border border-error/20 hover:bg-error/20',
  teal: 'bg-teal text-bg-base font-medium hover:bg-teal-hover hover:shadow-teal-glow',
  link: 'text-coral hover:text-coral-hover underline-offset-2 hover:underline p-0',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-sm',
  md: 'px-5 py-2.5 text-sm rounded-md',
  lg: 'px-6 py-3 text-base rounded-md',
}

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
})

Button.displayName = 'Button'
export default Button

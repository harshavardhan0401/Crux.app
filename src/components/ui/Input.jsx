import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  prefix,
  suffix,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted text-text-muted-light text-sm">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          type={inputType}
          className={`
            w-full bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light
            border border-white/8 dark:border-white/8 border-black/10
            rounded-md px-4 py-2.5 text-sm
            text-text-primary dark:text-text-primary text-text-primary-light
            placeholder:text-text-muted dark:placeholder:text-text-muted placeholder:text-text-muted-light
            focus:outline-none focus:border-coral/50 transition-colors
            ${prefix ? 'pl-8' : ''}
            ${isPassword || suffix ? 'pr-10' : ''}
            ${error ? 'border-error/50' : ''}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-muted text-text-muted-light hover:text-text-secondary transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        {suffix && !isPassword && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input

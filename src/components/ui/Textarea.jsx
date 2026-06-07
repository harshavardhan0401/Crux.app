import { forwardRef } from 'react'

const Textarea = forwardRef(({
  label,
  error,
  maxLength,
  value = '',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        value={value}
        maxLength={maxLength}
        className={`
          w-full bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light
          border border-white/8 dark:border-white/8 border-black/10
          rounded-md px-4 py-2.5 text-sm
          text-text-primary dark:text-text-primary text-text-primary-light
          placeholder:text-text-muted dark:placeholder:text-text-muted placeholder:text-text-muted-light
          focus:outline-none focus:border-coral/50 transition-colors
          resize-none min-h-[80px]
          ${error ? 'border-error/50' : ''}
          ${className}
        `}
        {...props}
      />
      <div className="flex justify-between mt-1">
        {error && <p className="text-xs text-error">{error}</p>}
        {maxLength && (
          <p className={`text-xs ml-auto ${value.length >= maxLength ? 'text-error' : 'text-text-muted dark:text-text-muted text-text-muted-light'}`}>
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
})

Textarea.displayName = 'Textarea'
export default Textarea

import { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, className = '', maxWidth = 'max-w-lg' }) {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className={`
        relative w-full ${maxWidth}
        bg-bg-surface dark:bg-bg-surface bg-bg-surface-light
        border border-white/8 dark:border-white/8 border-black/10
        rounded-lg shadow-card-hover
        animate-slide-up
        max-h-[90vh] overflow-y-auto
        md:max-h-[85vh]
        ${className}
      `}>
        {title && (
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 className="text-lg font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

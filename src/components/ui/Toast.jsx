import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const icons = {
  success: <CheckCircle className="w-5 h-5 text-teal" />,
  error: <XCircle className="w-5 h-5 text-coral" />,
  info: <Info className="w-5 h-5 text-purple" />,
}

const borderColors = {
  success: 'border-l-teal',
  error: 'border-l-coral',
  info: 'border-l-purple',
}

function Toast({ toast }) {
  const removeToast = useAppStore(s => s.removeToast)

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3
        bg-bg-surface dark:bg-bg-surface bg-bg-surface-light
        border border-white/8 dark:border-white/8 border-black/10
        border-l-4 ${borderColors[toast.type] || borderColors.info}
        rounded-md shadow-card-hover
        animate-slide-up
        min-w-[300px] max-w-[400px]
      `}
    >
      {icons[toast.type] || icons.info}
      <p className="text-sm text-text-primary dark:text-text-primary text-text-primary-light flex-1">
        {toast.message}
      </p>
      <button
        onClick={() => removeToast(toast.id)}
        className="p-0.5 text-text-muted hover:text-text-primary transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useAppStore(s => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCheck, Bell } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import { formatDate } from '../../utils/formatDate'
import Button from '../../components/ui/Button'

const notifStyles = {
  application_received: { color: 'bg-purple/20 text-purple', icon: '📩' },
  application_accepted: { color: 'bg-teal/20 text-teal', icon: '✅' },
  project_match: { color: 'bg-coral/20 text-coral', icon: '🔗' },
  profile_view: { color: 'bg-warning/20 text-warning', icon: '👁️' },
}

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'applications', label: 'Applications' },
  { id: 'matches', label: 'Matches' },
]

export default function Notifications() {
  const navigate = useNavigate()
  const { notifications, markAllRead, markRead } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const filtered = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.isRead
    if (activeFilter === 'applications') return n.type === 'application_received' || n.type === 'application_accepted'
    if (activeFilter === 'matches') return n.type === 'project_match'
    return true
  })

  const handleClick = (n) => {
    markRead(n.id)
    if (n.referenceId?.startsWith('p')) {
      navigate('/dashboard/explore')
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-6">
        <div className="h-8 w-48 rounded skeleton mb-6" />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-start gap-3 p-4 mb-2">
            <div className="w-10 h-10 rounded-full skeleton shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded skeleton" />
              <div className="h-3 w-full rounded skeleton" />
              <div className="h-3 w-16 rounded skeleton" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light">
          Notifications
        </h1>
        <Button variant="ghost" size="sm" onClick={markAllRead}>
          <CheckCheck className="w-4 h-4" /> Mark all as read
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
              activeFilter === tab.id
                ? 'bg-coral text-white'
                : 'bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light text-text-secondary hover:bg-white/10 dark:hover:bg-white/10 hover:bg-black/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {filtered.length > 0 ? (
        <div className="space-y-1">
          {filtered.map(n => {
            const style = notifStyles[n.type] || notifStyles.profile_view
            return (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`
                  w-full text-left flex items-start gap-3 p-4 rounded-lg transition-colors
                  hover:bg-white/3 dark:hover:bg-white/3 hover:bg-black/3
                  ${!n.isRead ? 'border-l-2 border-l-teal bg-teal/5' : ''}
                `}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg ${style.color}`}>
                  {style.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.isRead ? 'text-text-primary dark:text-text-primary text-text-primary-light font-medium' : 'text-text-secondary dark:text-text-secondary text-text-secondary-light'}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{n.body}</p>
                  <p className="text-[10px] text-text-muted mt-1">{formatDate(n.createdAt)}</p>
                </div>
                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-teal shrink-0 mt-2" />
                )}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Bell className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary dark:text-text-secondary text-text-secondary-light">No notifications</p>
          <p className="text-sm text-text-muted mt-1">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}

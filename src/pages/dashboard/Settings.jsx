import { useState, useEffect } from 'react'
import { User, Lock, Bell, Palette, AlertTriangle, Sun, Moon } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import { STUDENTS, CURRENT_USER_ID } from '../../data/students'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

function getPasswordStrength(password) {
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4)
}

const strengthLabels = ['', 'Weak', 'Fair', 'Strong', 'Very Strong']
const strengthColors = ['', 'bg-error', 'bg-warning', 'bg-teal', 'bg-success']

const settingsSections = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
]

export default function Settings() {
  const { user, theme, toggleTheme, addToast, logout } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('account')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const currentUser = user || STUDENTS.find(s => s.id === CURRENT_USER_ID)

  // Account form
  const [accountForm, setAccountForm] = useState({ name: currentUser?.name || '', email: 'harsha@vits.edu.in' })
  const [accountLoading, setAccountLoading] = useState(false)

  // Password form
  const [passwordForm, setPasswordForm] = useState({ current: '', newPassword: '', confirm: '' })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState({})
  const strength = getPasswordStrength(passwordForm.newPassword)

  // Notification toggles
  const [notifSettings, setNotifSettings] = useState({
    applicationReceived: true,
    applicationAccepted: true,
    projectMatch: true,
    profileViewed: true,
  })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const handleSaveAccount = async () => {
    setAccountLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setAccountLoading(false)
    addToast('Account updated!', 'success')
  }

  const handleUpdatePassword = async () => {
    const errs = {}
    if (!passwordForm.current) errs.current = 'Current password is required'
    if (!passwordForm.newPassword) errs.newPassword = 'New password is required'
    else if (passwordForm.newPassword.length < 6) errs.newPassword = 'At least 6 characters'
    if (passwordForm.newPassword !== passwordForm.confirm) errs.confirm = 'Passwords do not match'
    setPasswordErrors(errs)
    if (Object.keys(errs).length > 0) return

    setPasswordLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setPasswordLoading(false)
    setPasswordForm({ current: '', newPassword: '', confirm: '' })
    addToast('Password updated!', 'success')
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(false)
    logout()
    addToast('Account deleted.', 'info')
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="h-8 w-32 rounded skeleton mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
          <div className="space-y-2">{[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 rounded skeleton" />)}</div>
          <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-12 rounded skeleton" />)}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light mb-6">
        Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        {/* Left nav */}
        <div className="space-y-1">
          {settingsSections.map(section => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-colors text-left
                  ${activeSection === section.id
                    ? 'bg-coral/10 text-coral font-medium'
                    : 'text-text-secondary dark:text-text-secondary text-text-secondary-light hover:bg-white/5 dark:hover:bg-white/5 hover:bg-black/5'
                  }
                  ${section.id === 'danger' ? 'mt-4 text-error' : ''}
                `}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            )
          })}
        </div>

        {/* Right content */}
        <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-6 shadow-card">
          {/* Account */}
          {activeSection === 'account' && (
            <div className="space-y-5">
              <h2 className="text-lg font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light">Account</h2>
              <Input
                label="Full Name"
                value={accountForm.name}
                onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
              />
              <div className="relative">
                <Input
                  label="Email"
                  value={accountForm.email}
                  disabled
                />
                <Lock className="absolute right-3 top-9 w-4 h-4 text-text-muted" />
              </div>
              <Button loading={accountLoading} onClick={handleSaveAccount}>Save Changes</Button>
            </div>
          )}

          {/* Password */}
          {activeSection === 'password' && (
            <div className="space-y-5">
              <h2 className="text-lg font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light">Password</h2>
              <Input
                label="Current Password"
                type="password"
                value={passwordForm.current}
                onChange={(e) => { setPasswordForm(prev => ({ ...prev, current: e.target.value })); setPasswordErrors(prev => ({ ...prev, current: '' })) }}
                error={passwordErrors.current}
              />
              <div>
                <Input
                  label="New Password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => { setPasswordForm(prev => ({ ...prev, newPassword: e.target.value })); setPasswordErrors(prev => ({ ...prev, newPassword: '' })) }}
                  error={passwordErrors.newPassword}
                />
                {passwordForm.newPassword && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${strengthColors[strength]} rounded-full transition-all duration-300`} style={{ width: `${strength * 25}%` }} />
                    </div>
                    <p className={`text-xs mt-1 ${strength <= 1 ? 'text-error' : strength === 2 ? 'text-warning' : 'text-success'}`}>
                      {strengthLabels[strength]}
                    </p>
                  </div>
                )}
              </div>
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => { setPasswordForm(prev => ({ ...prev, confirm: e.target.value })); setPasswordErrors(prev => ({ ...prev, confirm: '' })) }}
                error={passwordErrors.confirm}
              />
              <Button loading={passwordLoading} onClick={handleUpdatePassword}>Update Password</Button>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="space-y-5">
              <h2 className="text-lg font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light">Notification Preferences</h2>
              {[
                { key: 'applicationReceived', label: 'Application received', desc: 'When someone applies to your project' },
                { key: 'applicationAccepted', label: 'Application accepted/rejected', desc: 'When your application status changes' },
                { key: 'projectMatch', label: 'New project match', desc: 'When a project matches your skills' },
                { key: 'profileViewed', label: 'Profile viewed', desc: 'When someone views your profile' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/5 dark:border-white/5 border-black/5 last:border-0">
                  <div>
                    <p className="text-sm text-text-primary dark:text-text-primary text-text-primary-light">{item.label}</p>
                    <p className="text-xs text-text-muted">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`w-11 h-6 rounded-full transition-colors relative ${notifSettings[item.key] ? 'bg-teal' : 'bg-white/10 dark:bg-white/10 bg-black/10'}`}
                    aria-label={`Toggle ${item.label}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifSettings[item.key] ? 'translate-x-5.5 left-0.5' : 'translate-x-0 left-0.5'}`}
                      style={{ transform: notifSettings[item.key] ? 'translateX(22px)' : 'translateX(0)' }}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div className="space-y-5">
              <h2 className="text-lg font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light">Appearance</h2>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-text-primary dark:text-text-primary text-text-primary-light">Theme</p>
                  <p className="text-xs text-text-muted">Switch between dark and light mode</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`w-16 h-8 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-bg-surface2' : 'bg-warning/20'}`}
                  aria-label="Toggle theme"
                >
                  <span className={`absolute top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${theme === 'dark' ? 'left-1 bg-bg-base' : 'left-8 bg-warning'}`}>
                    {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-text-secondary" /> : <Sun className="w-3.5 h-3.5 text-white" />}
                  </span>
                </button>
              </div>
              <div className="flex items-center justify-between py-3 opacity-50 cursor-not-allowed">
                <div>
                  <p className="text-sm text-text-primary dark:text-text-primary text-text-primary-light">Font Size</p>
                  <p className="text-xs text-text-muted">Normal / Large — coming soon</p>
                </div>
                <div className="flex gap-2">
                  <button disabled className="px-3 py-1 rounded-md text-xs bg-coral/10 text-coral">Normal</button>
                  <button disabled className="px-3 py-1 rounded-md text-xs bg-bg-surface2 text-text-muted">Large</button>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {activeSection === 'danger' && (
            <div className="space-y-5">
              <h2 className="text-lg font-heading font-semibold text-error">Danger Zone</h2>
              <div className="p-4 border border-error/20 rounded-lg">
                <p className="text-sm text-text-primary dark:text-text-primary text-text-primary-light mb-1">Delete Account</p>
                <p className="text-xs text-text-muted mb-4">Once you delete your account, there is no going back.</p>
                <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                  <AlertTriangle className="w-4 h-4" /> Delete Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-error mx-auto mb-3" />
          <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light mb-6">
            This will permanently delete your account and all associated data. Are you sure?
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteAccount}>Confirm Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

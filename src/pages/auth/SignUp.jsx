import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import { STUDENTS, CURRENT_USER_ID } from '../../data/students'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

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
const strengthWidths = ['0%', '25%', '50%', '75%', '100%']

export default function SignUp() {
  const navigate = useNavigate()
  const { login, addToast } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', terms: false })
  const [errors, setErrors] = useState({})

  const strength = getPasswordStrength(form.password)
  const passwordsMatch = form.password && form.confirmPassword && form.password === form.confirmPassword

  const handleChange = (field) => (e) => {
    const value = field === 'terms' ? e.target.checked : e.target.value
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (!form.terms) errs.terms = 'You must accept the terms'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const isValid = form.name.trim() && form.email.trim() && form.password.length >= 6 && 
    form.password === form.confirmPassword && form.terms

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const currentUser = STUDENTS.find(s => s.id === CURRENT_USER_ID)
    login({ ...currentUser, name: form.name, email: form.email })
    setLoading(false)
    navigate('/onboarding')
  }

  const handleGoogleClick = () => {
    addToast('Google auth coming soon!', 'info')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-8 shadow-card">
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="text-coral text-3xl">◆</span>
            <h1 className="text-2xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light mt-3">
              Create your account
            </h1>
            <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light mt-1">
              Join thousands of students building together
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange('name')}
              error={errors.name}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@college.edu"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange('password')}
                error={errors.password}
              />
              {form.password && (
                <div className="mt-2">
                  <div className="h-1.5 bg-white/5 dark:bg-white/5 bg-black/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strengthColors[strength]} rounded-full transition-all duration-300`}
                      style={{ width: strengthWidths[strength] }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${strength <= 1 ? 'text-error' : strength === 2 ? 'text-warning' : 'text-success'}`}>
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            <div>
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                error={errors.confirmPassword}
              />
              {form.confirmPassword && (
                <div className="flex items-center gap-1 mt-1">
                  {passwordsMatch ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-success" />
                      <span className="text-xs text-success">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3.5 h-3.5 text-error" />
                      <span className="text-xs text-error">Passwords don't match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={handleChange('terms')}
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-bg-surface2 text-coral focus:ring-coral/50 accent-coral"
                />
                <span className="text-xs text-text-secondary dark:text-text-secondary text-text-secondary-light">
                  I agree to the <span className="text-coral hover:underline cursor-pointer">Terms of Service</span> and{' '}
                  <span className="text-coral hover:underline cursor-pointer">Privacy Policy</span>
                </span>
              </label>
              {errors.terms && <p className="text-xs text-error mt-1">{errors.terms}</p>}
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={!isValid}
              className="w-full"
            >
              Create Account
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/8 dark:border-white/8 border-black/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-bg-surface dark:bg-bg-surface bg-bg-surface-light text-text-muted">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleClick}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 border border-white/10 dark:border-white/10 border-black/10 rounded-md text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light hover:bg-white/5 dark:hover:bg-white/5 hover:bg-black/5 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-coral hover:text-coral-hover font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

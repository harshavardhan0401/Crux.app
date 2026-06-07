import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAppStore from '../../store/useAppStore'
import { STUDENTS, CURRENT_USER_ID } from '../../data/students'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function Login() {
  const navigate = useNavigate()
  const { login, isOnboarded } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const currentUser = STUDENTS.find(s => s.id === CURRENT_USER_ID)
    login({ ...currentUser })
    setLoading(false)
    if (!isOnboarded) {
      navigate('/onboarding')
    } else {
      navigate('/dashboard/home')
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-8 shadow-card">
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="text-coral text-3xl">◆</span>
            <h1 className="text-2xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light mt-3">
              Welcome back
            </h1>
            <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light mt-1">
              Sign in to continue building with your team
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange('password')}
                error={errors.password}
              />
              <div className="flex justify-end mt-1">
                <Link to="/forgot" className="text-xs text-coral hover:text-coral-hover">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>

          <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light text-center mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-coral hover:text-coral-hover font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

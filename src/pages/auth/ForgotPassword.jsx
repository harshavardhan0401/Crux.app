import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-8 shadow-card">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-teal" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light">
                Check your email
              </h1>
              <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light mt-2">
                We've sent a password reset link to{' '}
                <span className="text-text-primary dark:text-text-primary text-text-primary-light font-medium">{email}</span>
              </p>
              <Link to="/login" className="inline-block mt-6">
                <Button variant="ghost">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <span className="text-coral text-3xl">◆</span>
                <h1 className="text-2xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light mt-3">
                  Reset your password
                </h1>
                <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light mt-1">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@college.edu"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  error={error}
                />
                <Button type="submit" loading={loading} className="w-full">
                  Send Reset Link
                </Button>
              </form>

              <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light text-center mt-6">
                <Link to="/login" className="text-coral hover:text-coral-hover font-medium inline-flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Check, X, Zap, CheckCircle } from 'lucide-react'
import { STUDENTS, CURRENT_USER_ID } from '../../data/students'
import { calculateMatchScore } from '../../utils/matchScore'
import Modal from '../ui/Modal'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import Textarea from '../ui/Textarea'
import useAppStore from '../../store/useAppStore'

export default function ApplyModal({ isOpen, onClose, project }) {
  const { addToast } = useAppStore()
  const [selectedRole, setSelectedRole] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [messageError, setMessageError] = useState('')

  const currentUser = STUDENTS.find(s => s.id === CURRENT_USER_ID)
  const { score, matched, missing } = calculateMatchScore(currentUser.skills, project?.techStack || [])
  const teamMembers = project?.teamMembers?.map(m => {
    const student = STUDENTS.find(s => s.id === m.userId)
    return { ...m, student }
  }).filter(m => m.student) || []
  const openSlots = (project?.maxTeamSize || 0) - (project?.teamMembers?.length || 0)
  const unfilledOpenings = project?.openings?.filter(o => !o.isFilled) || []
  const owner = STUDENTS.find(s => s.id === project?.ownerId)

  const handleSubmit = async () => {
    if (message.length < 20) {
      setMessageError('Message must be at least 20 characters')
      return
    }
    setMessageError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
    addToast('Application sent successfully!', 'success')
  }

  const handleClose = () => {
    setSubmitted(false)
    setMessage('')
    setSelectedRole('')
    setMessageError('')
    onClose()
  }

  if (!project) return null

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={submitted ? null : `Apply to ${project.title}`} maxWidth="max-w-xl">
      {submitted ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-teal" />
          </div>
          <h3 className="text-xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light mb-2">
            Application sent!
          </h3>
          <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light max-w-sm mx-auto">
            Once accepted, you can message your team directly on Crux.
          </p>
          <Button variant="ghost" onClick={handleClose} className="mt-6">
            Close
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Project info */}
          <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map(tech => (
              <span key={tech} className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light text-text-secondary">
                {tech}
              </span>
            ))}
          </div>

          {/* Current team */}
          <div>
            <p className="text-xs text-text-muted dark:text-text-muted text-text-muted-light mb-2">Current team</p>
            <div className="flex flex-wrap gap-2">
              {teamMembers.map(m => (
                <div key={m.userId} className="flex items-center gap-2 bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light rounded-md px-2.5 py-1.5">
                  <Avatar name={m.student.name} color={m.student.avatarColor} size={24} />
                  <div>
                    <span className="text-xs text-text-primary dark:text-text-primary text-text-primary-light">{m.student.name}</span>
                    <span className="text-[10px] text-text-muted ml-1">({m.role})</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-2">{openSlots} spots remaining</p>
          </div>

          {/* Match breakdown */}
          <div className="bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light rounded-md p-4">
            <p className="text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light mb-2">
              Your skill match — {score}%
            </p>
            <div className="h-2 bg-white/5 dark:bg-white/5 bg-black/5 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full rounded-full transition-all duration-500 ${score >= 80 ? 'bg-teal shadow-teal-glow' : score >= 60 ? 'bg-warning' : 'bg-error'}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="space-y-1.5">
              {project.techStack.map(tech => {
                const hasSkill = matched.map(m => m.toLowerCase()).includes(tech.toLowerCase())
                return (
                  <div key={tech} className="flex items-center gap-2 text-xs">
                    {hasSkill ? (
                      <Check className="w-3.5 h-3.5 text-teal" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-error" />
                    )}
                    <span className={hasSkill ? 'text-text-primary dark:text-text-primary text-text-primary-light' : 'text-text-muted'}>{tech}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Owner reliability */}
          {owner && (
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <Zap className="w-3.5 h-3.5 text-warning" />
              Owner reliability: {owner.reliability}%
            </div>
          )}

          {/* Role selector */}
          {unfilledOpenings.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light mb-1.5">
                Apply for role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light border border-white/8 dark:border-white/8 border-black/10 rounded-md px-4 py-2.5 text-sm text-text-primary dark:text-text-primary text-text-primary-light focus:outline-none focus:border-coral/50 transition-colors"
              >
                <option value="">Select a role</option>
                {unfilledOpenings.map(o => (
                  <option key={o.id} value={o.role}>{o.label} — {o.description}</option>
                ))}
              </select>
            </div>
          )}

          {/* Message */}
          <Textarea
            label="Message to team"
            placeholder="Introduce yourself and explain why you'd be a great fit... (min 20 characters)"
            value={message}
            onChange={(e) => { setMessage(e.target.value); setMessageError('') }}
            error={messageError}
          />

          <Button loading={loading} onClick={handleSubmit} className="w-full">
            Submit Application
          </Button>
        </div>
      )}
    </Modal>
  )
}

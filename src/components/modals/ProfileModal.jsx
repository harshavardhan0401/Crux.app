import { useState } from 'react'
import { Github, Linkedin, Globe, Zap, MapPin, Calendar, GraduationCap } from 'lucide-react'
import { STUDENTS, CURRENT_USER_ID } from '../../data/students'
import { PROJECTS } from '../../data/projects'
import { calculateMatchScore } from '../../utils/matchScore'
import Modal from '../ui/Modal'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import MatchScore from '../ui/MatchScore'
import Button from '../ui/Button'
import useAppStore from '../../store/useAppStore'

const roleLabels = {
  frontend_dev: 'Frontend Developer',
  backend_dev: 'Backend Developer',
  fullstack: 'Full Stack Developer',
  ui_ux: 'UI/UX Designer',
  ml_engineer: 'ML/AI Engineer',
  mobile_dev: 'Mobile Developer',
  marketing: 'Marketing',
  product_manager: 'Product Manager',
}

const expBadgeColors = {
  beginner: 'teal',
  intermediate: 'warning',
  advanced: 'coral',
}

export default function ProfileModal({ isOpen, onClose, student }) {
  const { addToast } = useAppStore()
  const [inviteProject, setInviteProject] = useState('')
  const currentUser = STUDENTS.find(s => s.id === CURRENT_USER_ID)
  
  if (!student) return null

  const { score } = calculateMatchScore(currentUser.skills, student.skills.map(s => s.name))
  const studentProjects = PROJECTS.filter(p => 
    p.teamMembers.some(m => m.userId === student.id)
  )
  const myProjects = PROJECTS.filter(p => p.ownerId === CURRENT_USER_ID)

  // Group skills by category
  const skillsByCategory = student.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  const categoryLabels = {
    frontend: 'Frontend',
    backend: 'Backend',
    mobile: 'Mobile',
    design: 'Design',
    ml_ai: 'ML / AI',
    devops: 'DevOps',
  }

  const proficiencyWidth = { learning: '33%', comfortable: '66%', strong: '100%' }

  const handleInvite = () => {
    if (!inviteProject) return
    const proj = PROJECTS.find(p => p.id === inviteProject)
    addToast(`Invited ${student.name} to ${proj?.title || 'your project'}!`, 'success')
    setInviteProject('')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Avatar name={student.name} color={student.avatarColor} size={64} />
          <div className="flex-1">
            <h3 className="text-lg font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light">
              {student.name}
            </h3>
            <p className="text-sm text-text-muted">@{student.username}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{student.college}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{student.year}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={expBadgeColors[student.experience]}>
                <GraduationCap className="w-3 h-3" />
                {student.experience}
              </Badge>
              {student.id !== CURRENT_USER_ID && <MatchScore score={score} />}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light">
          {student.bio}
        </p>

        {/* Skills by category */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light">Skills</h4>
          {Object.entries(skillsByCategory).map(([cat, skills]) => (
            <div key={cat}>
              <p className="text-xs text-text-muted mb-2">{categoryLabels[cat] || cat}</p>
              <div className="space-y-2">
                {skills.map(skill => (
                  <div key={skill.name} className="flex items-center gap-3">
                    <span className="text-xs text-text-primary dark:text-text-primary text-text-primary-light w-24 truncate">{skill.name}</span>
                    <div className="flex-1 h-1.5 bg-white/5 dark:bg-white/5 bg-black/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal rounded-full transition-all duration-300"
                        style={{ width: proficiencyWidth[skill.proficiency] }}
                      />
                    </div>
                    <span className="text-[10px] text-text-muted w-16">{skill.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Reliability */}
        <div className="flex items-center gap-2 text-sm" title="Based on project completion history">
          <Zap className="w-4 h-4 text-warning" />
          <span className="text-text-secondary">Reliability: <span className="text-text-primary dark:text-text-primary text-text-primary-light font-medium">{student.reliability}%</span></span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-3">
          {student.github && (
            <a href={`https://${student.github}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </a>
          )}
          {student.linkedin && (
            <a href={`https://${student.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {student.portfolio && (
            <a href={`https://${student.portfolio}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors" aria-label="Portfolio">
              <Globe className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* Projects */}
        {studentProjects.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light mb-2">Projects</h4>
            <div className="space-y-2">
              {studentProjects.map(p => {
                const member = p.teamMembers.find(m => m.userId === student.id)
                return (
                  <div key={p.id} className="flex items-center justify-between bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light rounded-md px-3 py-2">
                    <span className="text-sm text-text-primary dark:text-text-primary text-text-primary-light">{p.title}</span>
                    <Badge variant="teal-outline" className="text-[10px]">{roleLabels[member?.role] || member?.role}</Badge>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Invite to project */}
        {student.id !== CURRENT_USER_ID && myProjects.length > 0 && (
          <div className="flex items-center gap-2 pt-3 border-t border-white/8 dark:border-white/8 border-black/10">
            <select
              value={inviteProject}
              onChange={(e) => setInviteProject(e.target.value)}
              className="flex-1 bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light border border-white/8 rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-coral/50 transition-colors"
            >
              <option value="">Select project</option>
              {myProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
            <Button size="sm" onClick={handleInvite} disabled={!inviteProject}>
              Invite
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

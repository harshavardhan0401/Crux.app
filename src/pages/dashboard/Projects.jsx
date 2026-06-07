import { useState, useEffect } from 'react'
import { Plus, Users, Check, X as XIcon, ChevronRight } from 'lucide-react'
import { PROJECTS } from '../../data/projects'
import { STUDENTS, CURRENT_USER_ID } from '../../data/students'
import { calculateMatchScore } from '../../utils/matchScore'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import MatchScore from '../../components/ui/MatchScore'
import Button from '../../components/ui/Button'
import AddProjectModal from '../../components/modals/AddProjectModal'
import useAppStore from '../../store/useAppStore'

const roleLabels = {
  frontend_dev: 'Frontend', backend_dev: 'Backend', fullstack: 'Full Stack',
  ui_ux: 'UI/UX', ml_engineer: 'ML/AI', mobile_dev: 'Mobile',
  marketing: 'Marketing', product_manager: 'PM',
}

const dummyApplicants = [
  { id: 'da1', studentId: 's3', role: 'backend_dev', message: 'I can contribute ML expertise for recommendation features.', matchScore: 78 },
  { id: 'da2', studentId: 's4', role: 'mobile_dev', message: 'I can help with mobile responsiveness and UI testing.', matchScore: 65 },
  { id: 'da3', studentId: 's6', role: 'backend_dev', message: 'I have experience with GraphQL and Redis. Would love to help with DevOps.', matchScore: 91 },
]

export default function Projects() {
  const { addToast } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [localProjects, setLocalProjects] = useState(PROJECTS)
  const [selectedProject, setSelectedProject] = useState(null)
  const [applicants, setApplicants] = useState(dummyApplicants)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const myProjects = localProjects.filter(p =>
    p.teamMembers.some(m => m.userId === CURRENT_USER_ID)
  )

  const handleAddProject = (newProject) => {
    setLocalProjects(prev => [newProject, ...prev])
  }

  const handleAccept = (appId) => {
    const app = applicants.find(a => a.id === appId)
    const student = STUDENTS.find(s => s.id === app?.studentId)
    setApplicants(prev => prev.filter(a => a.id !== appId))
    addToast(`${student?.name} has been added to your team!`, 'success')
  }

  const handleDecline = (appId) => {
    setApplicants(prev => prev.filter(a => a.id !== appId))
    addToast('Application declined.', 'info')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="h-8 w-48 rounded skeleton mb-6" />
        {[1, 2].map(i => (
          <div key={i} className="bg-bg-surface border border-white/8 rounded-lg p-6 mb-4">
            <div className="space-y-3">
              <div className="h-5 w-40 rounded skeleton" />
              <div className="h-3 w-full rounded skeleton" />
              <div className="h-8 w-24 rounded skeleton" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light">
          My Projects
        </h1>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Project list */}
        <div className={`flex-1 space-y-4 ${selectedProject ? 'hidden md:block' : ''}`}>
          {myProjects.length > 0 ? (
            myProjects.map(project => {
              const teamAvatars = project.teamMembers.map(m => STUDENTS.find(s => s.id === m.userId)).filter(Boolean)
              const openSlots = project.maxTeamSize - project.teamMembers.length
              const isOwner = project.ownerId === CURRENT_USER_ID

              return (
                <div
                  key={project.id}
                  className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-5 shadow-card hover:shadow-card-hover transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light">
                          {project.title}
                        </h3>
                        <Badge variant={project.status === 'recruiting' ? 'success' : 'warning'}>
                          {project.status === 'recruiting' ? 'Recruiting' : 'In Progress'}
                        </Badge>
                        {isOwner && <Badge variant="coral">Owner</Badge>}
                      </div>
                      <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light line-clamp-2 mb-3">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {teamAvatars.slice(0, 4).map(s => (
                            <Avatar key={s.id} name={s.name} color={s.avatarColor} size={28} />
                          ))}
                        </div>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {project.teamMembers.length}/{project.maxTeamSize} members
                        </span>
                        {openSlots > 0 && (
                          <span className="text-xs text-teal">{openSlots} open</span>
                        )}
                        {project.newApplicants > 0 && (
                          <Badge variant="coral">{project.newApplicants} applicants</Badge>
                        )}
                      </div>
                    </div>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProject(selectedProject?.id === project.id ? null : project)}
                      >
                        Manage <ChevronRight className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-16">
              <p className="text-text-secondary mb-2">You haven't joined or created any projects yet.</p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4" /> Create Your First Project
              </Button>
            </div>
          )}
        </div>

        {/* Applicants panel */}
        {selectedProject && (
          <div className="w-full md:w-96 bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-5 shadow-card animate-slide-up md:animate-none">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light">
                Applicants — {selectedProject.title}
              </h3>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1 text-text-muted hover:text-text-primary transition-colors md:hidden"
                aria-label="Close panel"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {applicants.length > 0 ? (
              <div className="space-y-3">
                {[...applicants].sort((a, b) => b.matchScore - a.matchScore).map(app => {
                  const student = STUDENTS.find(s => s.id === app.studentId)
                  if (!student) return null
                  return (
                    <div key={app.id} className="p-3 bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar name={student.name} color={student.avatarColor} size={32} />
                        <div>
                          <p className="text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light">{student.name}</p>
                          <p className="text-[10px] text-text-muted">{student.college}</p>
                        </div>
                        <MatchScore score={app.matchScore} className="ml-auto" />
                      </div>
                      <Badge variant="outline" className="text-[10px] mb-2">{roleLabels[app.role] || app.role}</Badge>
                      <p className="text-xs text-text-secondary mb-3 line-clamp-2">{app.message}</p>
                      <div className="flex gap-2">
                        <Button variant="teal" size="sm" className="flex-1" onClick={() => handleAccept(app.id)}>
                          <Check className="w-3 h-3" /> Accept
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleDecline(app.id)}>
                          Decline
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-8">No pending applicants</p>
            )}
          </div>
        )}
      </div>

      <AddProjectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProject}
      />
    </div>
  )
}

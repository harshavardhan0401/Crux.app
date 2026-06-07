import { useState, useEffect } from 'react'
import { Github, Linkedin, Globe, MapPin, Calendar, GraduationCap, Zap, Edit2, Plus, Briefcase } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import { STUDENTS, CURRENT_USER_ID } from '../../data/students'
import { PROJECTS } from '../../data/projects'
import { getCompleteness } from '../../utils/completeness'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import SkillChip from '../../components/ui/SkillChip'
import CompletenessRing from '../../components/ui/CompletenessRing'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import Modal from '../../components/ui/Modal'

const roleLabels = {
  frontend_dev: 'Frontend Developer', backend_dev: 'Backend Developer', fullstack: 'Full Stack Developer',
  ui_ux: 'UI/UX Designer', ml_engineer: 'ML/AI Engineer', mobile_dev: 'Mobile Developer',
  marketing: 'Marketing', product_manager: 'Product Manager',
}

const expBadgeColors = { beginner: 'teal', intermediate: 'warning', advanced: 'coral' }
const categoryLabels = { frontend: 'Frontend', backend: 'Backend', mobile: 'Mobile', design: 'Design', ml_ai: 'ML / AI', devops: 'DevOps' }
const proficiencyWidth = { learning: '33%', comfortable: '66%', strong: '100%' }

export default function Profile() {
  const { user, updateUser, addToast } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  // Edit form
  const [editForm, setEditForm] = useState({})

  // Upload project form
  const [uploadForm, setUploadForm] = useState({ name: '', description: '', techStack: '', github: '', demo: '' })
  const [uploadErrors, setUploadErrors] = useState({})
  const [pastProjects, setPastProjects] = useState([])
  const [uploadLoading, setUploadLoading] = useState(false)

  const currentUser = user || STUDENTS.find(s => s.id === CURRENT_USER_ID)
  const completeness = getCompleteness(currentUser)
  const myProjects = PROJECTS.filter(p => p.teamMembers.some(m => m.userId === CURRENT_USER_ID))

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const skillsByCategory = (currentUser.skills || []).reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  const openEditModal = () => {
    setEditForm({
      name: currentUser.name || '',
      username: currentUser.username || '',
      bio: currentUser.bio || '',
      college: currentUser.college || '',
      year: currentUser.year || '',
      branch: currentUser.branch || '',
      experience: currentUser.experience || '',
      github: currentUser.github || '',
      linkedin: currentUser.linkedin || '',
      portfolio: currentUser.portfolio || '',
    })
    setEditModalOpen(true)
  }

  const handleSaveProfile = () => {
    updateUser(editForm)
    setEditModalOpen(false)
    addToast('Profile updated!', 'success')
  }

  const handleUploadProject = async () => {
    const errs = {}
    if (!uploadForm.name.trim()) errs.name = 'Project name is required'
    if (!uploadForm.description.trim()) errs.description = 'Description is required'
    setUploadErrors(errs)
    if (Object.keys(errs).length > 0) return

    setUploadLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setPastProjects(prev => [...prev, {
      id: 'pp' + Date.now(),
      name: uploadForm.name,
      description: uploadForm.description,
      techStack: uploadForm.techStack.split(',').map(t => t.trim()).filter(Boolean),
      github: uploadForm.github,
      demo: uploadForm.demo,
    }])
    setUploadForm({ name: '', description: '', techStack: '', github: '', demo: '' })
    setUploadLoading(false)
    setUploadModalOpen(false)
    addToast('Project added to your profile!', 'success')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="h-32 w-full rounded-lg skeleton mb-4" />
        <div className="flex items-center gap-4 mb-6 -mt-10 ml-8">
          <div className="w-20 h-20 rounded-full skeleton border-4 border-bg-base" />
          <div><div className="h-6 w-32 rounded skeleton" /><div className="h-4 w-24 rounded skeleton mt-1" /></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Cover */}
      <div className="h-32 rounded-lg bg-gradient-to-r from-coral/30 to-purple/30 relative mb-12">
        <div className="absolute -bottom-8 left-8 flex items-end gap-4">
          <Avatar name={currentUser.name} color={currentUser.avatarColor} size={80} className="border-4 border-bg-base dark:border-bg-base border-bg-base-light" />
          <div className="pb-1">
            <h1 className="text-xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light">{currentUser.name}</h1>
            <p className="text-sm text-text-muted">@{currentUser.username}</p>
          </div>
        </div>
        <div className="absolute bottom-2 right-4">
          <Button variant="ghost" size="sm" onClick={openEditModal}>
            <Edit2 className="w-3.5 h-3.5" /> Edit Profile
          </Button>
        </div>
      </div>

      {/* Role badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(currentUser.roles || []).map(role => (
          <Badge key={role} variant="teal-outline">{roleLabels[role] || role}</Badge>
        ))}
      </div>

      {/* Two column body */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left */}
        <div className="space-y-6">
          {/* About card */}
          <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-5 shadow-card">
            <h3 className="text-sm font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light mb-3">About</h3>
            <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light mb-3">{currentUser.bio}</p>
            <div className="space-y-1.5 text-xs text-text-secondary">
              <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{currentUser.college}</div>
              <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{currentUser.year} · {currentUser.branch}</div>
              <div className="flex items-center gap-1.5"><GraduationCap className="w-3 h-3" />
                <Badge variant={expBadgeColors[currentUser.experience]} className="text-[10px]">{currentUser.experience}</Badge>
              </div>
            </div>
          </div>

          {/* Skills card */}
          <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-5 shadow-card">
            <h3 className="text-sm font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light mb-4">Skills</h3>
            <div className="space-y-4">
              {Object.entries(skillsByCategory).map(([cat, skills]) => (
                <div key={cat}>
                  <p className="text-xs text-text-muted mb-2">{categoryLabels[cat] || cat}</p>
                  <div className="space-y-2">
                    {skills.map(skill => (
                      <div key={skill.name} className="flex items-center gap-3">
                        <span className="text-xs text-text-primary dark:text-text-primary text-text-primary-light w-24 truncate">{skill.name}</span>
                        <div className="flex-1 h-1.5 bg-white/5 dark:bg-white/5 bg-black/5 rounded-full overflow-hidden">
                          <div className="h-full bg-teal rounded-full transition-all duration-300" style={{ width: proficiencyWidth[skill.proficiency] }} />
                        </div>
                        <span className="text-[10px] text-text-muted w-16">{skill.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links card */}
          <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-5 shadow-card">
            <h3 className="text-sm font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light mb-3">Links</h3>
            <div className="space-y-2">
              {currentUser.github && (
                <a href={`https://${currentUser.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text-secondary hover:text-coral transition-colors">
                  <Github className="w-4 h-4" /> {currentUser.github}
                </a>
              )}
              {currentUser.linkedin && (
                <a href={`https://${currentUser.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text-secondary hover:text-coral transition-colors">
                  <Linkedin className="w-4 h-4" /> {currentUser.linkedin}
                </a>
              )}
              {currentUser.portfolio && (
                <a href={`https://${currentUser.portfolio}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-text-secondary hover:text-coral transition-colors">
                  <Globe className="w-4 h-4" /> {currentUser.portfolio}
                </a>
              )}
              {!currentUser.github && !currentUser.linkedin && !currentUser.portfolio && (
                <p className="text-sm text-text-muted">No links added yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* My Projects card */}
          <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-5 shadow-card">
            <h3 className="text-sm font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light mb-3">My Projects</h3>
            <div className="space-y-2">
              {myProjects.map(p => {
                const member = p.teamMembers.find(m => m.userId === CURRENT_USER_ID)
                return (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light rounded-md">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-text-muted" />
                      <span className="text-sm text-text-primary dark:text-text-primary text-text-primary-light">{p.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="teal-outline" className="text-[10px]">{roleLabels[member?.role] || member?.role}</Badge>
                      <Badge variant={p.status === 'recruiting' ? 'success' : 'warning'} className="text-[10px]">{p.status === 'recruiting' ? 'Recruiting' : 'In Progress'}</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upload past project */}
          <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light">Past Projects</h3>
              <Button variant="ghost" size="sm" onClick={() => setUploadModalOpen(true)}>
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
            {pastProjects.length > 0 ? (
              <div className="space-y-2">
                {pastProjects.map(pp => (
                  <div key={pp.id} className="p-3 bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light rounded-md">
                    <p className="text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light">{pp.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">{pp.description}</p>
                    {pp.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {pp.techStack.map(t => (
                          <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-text-secondary">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-4">No past projects yet</p>
            )}
          </div>

          {/* Stats card */}
          <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-5 shadow-card">
            <h3 className="text-sm font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light mb-3">Stats</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Projects Posted', value: myProjects.filter(p => p.ownerId === CURRENT_USER_ID).length },
                { label: 'Teams Joined', value: myProjects.filter(p => p.teamMembers.some(m => m.userId === CURRENT_USER_ID && !m.isOwner)).length },
                { label: 'Applications', value: 2 },
              ].map(stat => (
                <div key={stat.label} className="text-center p-3 bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light rounded-md">
                  <p className="text-xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light">{stat.value}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reliability + Completeness */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Zap className="w-4 h-4 text-warning" />
              {currentUser.reliability}% reliability
            </div>
            <CompletenessRing percentage={completeness.score} size={40} />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Profile" maxWidth="max-w-xl">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Input label="Name" value={editForm.name || ''} onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))} />
          <Input label="Username" prefix="@" value={editForm.username || ''} onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))} />
          <Textarea label="Bio" value={editForm.bio || ''} onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))} maxLength={160} />
          <Input label="College" value={editForm.college || ''} onChange={(e) => setEditForm(prev => ({ ...prev, college: e.target.value }))} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Year" value={editForm.year || ''} onChange={(e) => setEditForm(prev => ({ ...prev, year: e.target.value }))} />
            <Input label="Branch" value={editForm.branch || ''} onChange={(e) => setEditForm(prev => ({ ...prev, branch: e.target.value }))} />
          </div>
          <Input label="GitHub" value={editForm.github || ''} onChange={(e) => setEditForm(prev => ({ ...prev, github: e.target.value }))} />
          <Input label="LinkedIn" value={editForm.linkedin || ''} onChange={(e) => setEditForm(prev => ({ ...prev, linkedin: e.target.value }))} />
          <Input label="Portfolio" value={editForm.portfolio || ''} onChange={(e) => setEditForm(prev => ({ ...prev, portfolio: e.target.value }))} />
          <Button onClick={handleSaveProfile} className="w-full">Save Changes</Button>
        </div>
      </Modal>

      {/* Upload Project Modal */}
      <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} title="Add Past Project" maxWidth="max-w-md">
        <div className="space-y-4">
          <Input label="Project Name" value={uploadForm.name} onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))} error={uploadErrors.name} />
          <Textarea label="Description" value={uploadForm.description} onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))} error={uploadErrors.description} />
          <Input label="Tech Stack" placeholder="React, Node.js, MongoDB" value={uploadForm.techStack} onChange={(e) => setUploadForm(prev => ({ ...prev, techStack: e.target.value }))} />
          <Input label="GitHub URL" value={uploadForm.github} onChange={(e) => setUploadForm(prev => ({ ...prev, github: e.target.value }))} />
          <Input label="Demo URL" value={uploadForm.demo} onChange={(e) => setUploadForm(prev => ({ ...prev, demo: e.target.value }))} />
          <Button loading={uploadLoading} onClick={handleUploadProject} className="w-full">Add to Profile</Button>
        </div>
      </Modal>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, Github, Linkedin, Globe, Zap, X, Plus, Bell, Trophy, ChevronRight, Check, Flame } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import { STUDENTS, CURRENT_USER_ID } from '../../data/students'
import { PROJECTS } from '../../data/projects'
import { HACKATHONS } from '../../data/hackathons'
import { calculateMatchScore } from '../../utils/matchScore'
import { getCompleteness } from '../../utils/completeness'
import { formatDate } from '../../utils/formatDate'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import SkillChip from '../../components/ui/SkillChip'
import CompletenessRing from '../../components/ui/CompletenessRing'
import MatchScore from '../../components/ui/MatchScore'
import ProjectCard from '../../components/cards/ProjectCard'

const roleLabels = {
  frontend_dev: 'Frontend',
  backend_dev: 'Backend',
  fullstack: 'Full Stack',
  ui_ux: 'UI/UX',
  ml_engineer: 'ML/AI',
  mobile_dev: 'Mobile',
  marketing: 'Marketing',
  product_manager: 'PM',
}

const notifIcons = {
  application_received: { color: 'bg-purple/20 text-purple', icon: '📩' },
  application_accepted: { color: 'bg-teal/20 text-teal', icon: '✅' },
  project_match: { color: 'bg-coral/20 text-coral', icon: '🔗' },
  profile_view: { color: 'bg-warning/20 text-warning', icon: '👁️' },
}

export default function Home() {
  const { user, notifications, addToast } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [bannerDismissed, setBannerDismissed] = useState(() => localStorage.getItem('crux-banner-dismissed') === 'true')
  const [showAllSkills, setShowAllSkills] = useState(false)

  const currentUser = user || STUDENTS.find(s => s.id === CURRENT_USER_ID)
  const completeness = getCompleteness(currentUser)
  const myProject = PROJECTS.find(p => p.ownerId === CURRENT_USER_ID)
  const trendingProjects = [PROJECTS[2], PROJECTS[0]] // p3, p1
  const recommendedProjects = [PROJECTS[2], PROJECTS[0], PROJECTS[4]] // p3, p1, p5

  // Dummy applicants for Harsha's project (p6)
  const dummyApplicants = [
    { id: 'a1', studentId: 's3', message: 'I can contribute ML expertise for recommendation features.', role: 'ml_engineer' },
    { id: 'a2', studentId: 's4', message: 'I can help with mobile responsiveness and UI testing.', role: 'mobile_dev' },
  ]

  const [applicants, setApplicants] = useState(dummyApplicants)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const dismissBanner = () => {
    setBannerDismissed(true)
    localStorage.setItem('crux-banner-dismissed', 'true')
  }

  const handleAccept = (applicantId) => {
    const applicant = applicants.find(a => a.id === applicantId)
    const student = STUDENTS.find(s => s.id === applicant?.studentId)
    setApplicants(prev => prev.filter(a => a.id !== applicantId))
    addToast(`${student?.name} has been added to your team!`, 'success')
  }

  const handleDecline = (applicantId) => {
    setApplicants(prev => prev.filter(a => a.id !== applicantId))
    addToast('Application declined.', 'info')
  }

  const displayedSkills = showAllSkills ? currentUser.skills : currentUser.skills?.slice(0, 6)
  const userProjects = PROJECTS.filter(p => p.teamMembers.some(m => m.userId === CURRENT_USER_ID))

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr_300px] gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 rounded-lg p-6">
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-full skeleton" />
                <div className="h-4 w-32 rounded skeleton" />
                <div className="h-3 w-48 rounded skeleton" />
                <div className="h-3 w-40 rounded skeleton" />
                <div className="h-8 w-full rounded skeleton mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr_300px] gap-6">
        {/* Left Column — Profile Card */}
        <div className="space-y-4 md:sticky md:top-20 md:self-start">
          <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-5 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={currentUser.name} color={currentUser.avatarColor} size={48} />
              <div>
                <h3 className="text-sm font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light">{currentUser.name}</h3>
                <p className="text-xs text-text-muted">@{currentUser.username}</p>
              </div>
            </div>

            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-1.5 text-xs text-text-secondary dark:text-text-secondary text-text-secondary-light">
                <MapPin className="w-3 h-3" /> {currentUser.college}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-text-secondary dark:text-text-secondary text-text-secondary-light">
                <Calendar className="w-3 h-3" /> {currentUser.year}
              </div>
            </div>

            <Link to="/dashboard/profile">
              <Button variant="ghost" size="sm" className="w-full mb-4">Edit Profile</Button>
            </Link>

            {/* About */}
            <div className="mb-4">
              <p className="text-xs text-text-muted mb-1">About</p>
              <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light">{currentUser.bio}</p>
            </div>

            {/* Roles */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {currentUser.roles?.map(role => (
                <Badge key={role} variant="teal-outline" className="text-[10px]">{roleLabels[role] || role}</Badge>
              ))}
            </div>

            {/* Skills */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1.5">
                {displayedSkills?.map(skill => (
                  <SkillChip key={skill.name} name={skill.name} proficiency={skill.proficiency} />
                ))}
              </div>
              {currentUser.skills?.length > 6 && !showAllSkills && (
                <button onClick={() => setShowAllSkills(true)} className="text-xs text-coral hover:text-coral-hover mt-2">
                  Show all
                </button>
              )}
            </div>

            {/* Links */}
            <div className="flex items-center gap-2 mb-4">
              {currentUser.github && (
                <a href={`https://${currentUser.github}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded text-text-muted hover:text-text-primary transition-colors" aria-label="GitHub">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {currentUser.linkedin && (
                <a href={`https://${currentUser.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded text-text-muted hover:text-text-primary transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {currentUser.portfolio && (
                <a href={`https://${currentUser.portfolio}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded text-text-muted hover:text-text-primary transition-colors" aria-label="Portfolio">
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Stats */}
            <p className="text-xs text-text-muted mb-4">
              {userProjects.length} Projects · {userProjects.filter(p => p.teamMembers.some(m => m.userId === CURRENT_USER_ID && !m.isOwner)).length} Teams · 2 Applications
            </p>

            {/* Completeness */}
            {completeness.score < 100 && (
              <div className="flex items-center gap-3 p-3 bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light rounded-md">
                <CompletenessRing percentage={completeness.score} size={36} />
                <div>
                  <p className="text-xs text-text-primary dark:text-text-primary text-text-primary-light font-medium">Complete your profile</p>
                  <p className="text-[10px] text-coral">3x more team invites</p>
                </div>
              </div>
            )}

            {/* Reliability */}
            <div className="flex items-center gap-1.5 mt-3 text-xs text-text-secondary">
              <Zap className="w-3.5 h-3.5 text-warning" />
              {currentUser.reliability}% reliability
            </div>
          </div>
        </div>

        {/* Middle Column — Feed */}
        <div className="space-y-6">
          {/* Cold start banner */}
          {!bannerDismissed && (
            <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 border-l-4 border-l-coral rounded-lg p-4 flex items-center justify-between animate-fade-in">
              <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light">
                🎉 <span className="text-text-primary dark:text-text-primary text-text-primary-light font-medium">12 students</span> from Andhra Pradesh are already on Crux!
              </p>
              <button onClick={dismissBanner} className="p-1 text-text-muted hover:text-text-primary transition-colors" aria-label="Dismiss banner">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Trending */}
          <div>
            <h2 className="text-lg font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-coral" />
              Trending this week
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trendingProjects.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>

          {/* Applications inbox */}
          {applicants.length > 0 && (
            <div>
              <h2 className="text-lg font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light mb-4">
                Applications inbox
              </h2>
              <div className="space-y-3">
                {applicants.map(app => {
                  const student = STUDENTS.find(s => s.id === app.studentId)
                  if (!student) return null
                  const { score } = calculateMatchScore(student.skills, myProject?.techStack || [])
                  return (
                    <div key={app.id} className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-4 flex items-start gap-3">
                      <Avatar name={student.name} color={student.avatarColor} size={40} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light">{student.name}</span>
                          <MatchScore score={score} />
                        </div>
                        <p className="text-xs text-text-secondary dark:text-text-secondary text-text-secondary-light mt-1 line-clamp-2">{app.message}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="teal" size="sm" onClick={() => handleAccept(app.id)}>
                          <Check className="w-3 h-3" /> Accept
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDecline(app.id)}>
                          Decline
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Recommended for you */}
          <div>
            <h2 className="text-lg font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light mb-4">
              Recommended for you
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedProjects.map(p => {
                const { score, matched } = calculateMatchScore(currentUser.skills, p.techStack)
                return (
                  <div key={p.id} className="relative">
                    <ProjectCard project={p} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Post a project CTA */}
          <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border-2 border-dashed border-coral/30 rounded-lg p-6 text-center">
            <h3 className="text-base font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light mb-1">
              Looking to build something amazing?
            </h3>
            <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light mb-4">
              Post your project and find the perfect teammates.
            </p>
            <Link to="/dashboard/projects">
              <Button>
                <Plus className="w-4 h-4" />
                Post a Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column — Activity */}
        <div className="space-y-4 hidden lg:block">
          {/* Notifications */}
          <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light flex items-center gap-1.5">
                <Bell className="w-4 h-4" /> Notifications
              </h3>
              <Link to="/dashboard/notifications" className="text-xs text-coral hover:text-coral-hover">View all</Link>
            </div>
            <div className="space-y-3">
              {notifications.slice(0, 5).map(n => {
                const nIcon = notifIcons[n.type] || notifIcons.profile_view
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-2.5 p-2 rounded-md transition-colors ${!n.isRead ? 'border-l-2 border-l-teal bg-teal/5' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${nIcon.color}`}>
                      {nIcon.icon}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs ${!n.isRead ? 'text-text-primary dark:text-text-primary text-text-primary-light font-medium' : 'text-text-secondary'}`}>
                        {n.title}
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">{formatDate(n.createdAt)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <Link to="/dashboard/notifications" className="block mt-3">
              <Button variant="ghost" size="sm" className="w-full">
                Go to Notifications
              </Button>
            </Link>
          </div>

          {/* Hackathons */}
          <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-5 shadow-card">
            <h3 className="text-sm font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light flex items-center gap-1.5 mb-4">
              <Trophy className="w-4 h-4 text-warning" /> Upcoming Hackathons
            </h3>
            <div className="space-y-3">
              {HACKATHONS.map(h => (
                <div key={h.id} className="p-3 bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light rounded-md">
                  <p className="text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light">{h.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{h.prize}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant={h.daysLeft <= 7 ? 'error' : h.daysLeft <= 14 ? 'warning' : 'success'}>
                      {h.daysLeft}d left
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

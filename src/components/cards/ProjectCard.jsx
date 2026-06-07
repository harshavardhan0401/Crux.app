import { useState } from 'react'
import { Flame, Users } from 'lucide-react'
import { STUDENTS, CURRENT_USER_ID } from '../../data/students'
import { calculateMatchScore } from '../../utils/matchScore'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import MatchScore from '../ui/MatchScore'
import Button from '../ui/Button'
import ApplyModal from '../modals/ApplyModal'

const typeColors = {
  startup: 'coral',
  hackathon: 'purple',
  college: 'teal',
  'open-source': 'teal',
  personal: 'default',
}

const typeLabels = {
  startup: 'Startup',
  hackathon: 'Hackathon',
  college: 'College',
  'open-source': 'Open Source',
  personal: 'Personal',
}

export default function ProjectCard({ project }) {
  const [showApply, setShowApply] = useState(false)
  const currentUser = STUDENTS.find(s => s.id === CURRENT_USER_ID)
  const { score } = calculateMatchScore(currentUser.skills, project.techStack)
  const isOwner = project.ownerId === CURRENT_USER_ID
  const teamAvatars = project.teamMembers.map(m => STUDENTS.find(s => s.id === m.userId)).filter(Boolean)

  return (
    <>
      <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-6 shadow-card hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200 flex flex-col">
        {/* Top badges */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant={typeColors[project.type]}>{typeLabels[project.type]}</Badge>
          <div className="flex items-center gap-2">
            {project.newApplicants > 0 && (
              <Badge variant="coral" className="animate-pulse-soft">
                <Flame className="w-3 h-3" />
                {project.newApplicants} new
              </Badge>
            )}
            <Badge variant={project.status === 'recruiting' ? 'success' : 'warning'}>
              {project.status === 'recruiting' ? 'Recruiting' : 'In Progress'}
            </Badge>
          </div>
        </div>

        {/* Title & description */}
        <h3 className="text-base font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light mb-1.5">
          {project.title}
        </h3>
        <p className="text-sm text-text-secondary dark:text-text-secondary text-text-secondary-light line-clamp-2 mb-4">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.map(tech => (
            <span key={tech} className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light text-text-secondary dark:text-text-secondary text-text-secondary-light">
              {tech}
            </span>
          ))}
        </div>

        {/* Team & match */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 dark:border-white/5 border-black/5">
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {teamAvatars.slice(0, 3).map((member) => (
                <Avatar key={member.id} name={member.name} color={member.avatarColor} size={28} />
              ))}
            </div>
            <span className="text-xs text-text-muted dark:text-text-muted text-text-muted-light ml-2">
              <Users className="w-3 h-3 inline" /> {project.teamMembers.length}/{project.maxTeamSize}
            </span>
          </div>
          <MatchScore score={score} />
        </div>

        {/* Action button */}
        <div className="mt-4">
          {isOwner ? (
            <Button variant="ghost" size="sm" disabled className="w-full">
              Your project
            </Button>
          ) : (
            <Button size="sm" className="w-full" onClick={() => setShowApply(true)}>
              Apply to Join
            </Button>
          )}
        </div>
      </div>

      <ApplyModal
        isOpen={showApply}
        onClose={() => setShowApply(false)}
        project={project}
      />
    </>
  )
}

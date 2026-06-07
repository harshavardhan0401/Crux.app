import { useState } from 'react'
import { ShieldCheck, Info, Zap, MapPin, Calendar } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import SkillChip from '../ui/SkillChip'
import CompletenessRing from '../ui/CompletenessRing'
import Button from '../ui/Button'
import ProfileModal from '../modals/ProfileModal'

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

export default function StudentCard({ student }) {
  const [showProfile, setShowProfile] = useState(false)

  return (
    <>
      <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-6 shadow-card hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar
            name={student.name}
            color={student.avatarColor}
            size={48}
            showActive
            isActive={student.isActive}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light truncate">
                {student.name}
              </h3>
              {student.verified ? (
                <span className="flex items-center gap-0.5 text-teal" title="Verified via email domain">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              ) : (
                <span className="flex items-center gap-0.5 text-text-muted" title="Self-reported">
                  <Info className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted dark:text-text-muted text-text-muted-light">@{student.username}</p>
          </div>
        </div>

        {/* College & year */}
        <div className="flex items-center gap-3 text-xs text-text-secondary dark:text-text-secondary text-text-secondary-light mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {student.college}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {student.year}
          </span>
        </div>

        {/* Verification badge */}
        <div className="mb-3">
          {student.verified ? (
            <Badge variant="teal-outline">
              <ShieldCheck className="w-3 h-3" /> Verified
            </Badge>
          ) : (
            <Badge variant="default">
              <Info className="w-3 h-3" /> Self-reported
            </Badge>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {student.skills.slice(0, 4).map(skill => (
            <SkillChip key={skill.name} name={skill.name} proficiency={skill.proficiency} />
          ))}
          {student.skills.length > 4 && (
            <span className="font-mono text-xs px-3 py-1 text-text-muted">
              +{student.skills.length - 4} more
            </span>
          )}
        </div>

        {/* Role tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {student.roles.map(role => (
            <Badge key={role} variant="teal-outline" className="text-[10px]">
              {roleLabels[role] || role}
            </Badge>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 dark:border-white/5 border-black/5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Zap className="w-3 h-3 text-warning" />
              {student.reliability}%
            </span>
            <CompletenessRing percentage={student.completeness} size={32} />
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowProfile(true)}>
            View Profile
          </Button>
        </div>
      </div>

      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        student={student}
      />
    </>
  )
}

import { useState, useEffect, useRef } from 'react'
import { Search, Users, Folder } from 'lucide-react'
import { STUDENTS, CURRENT_USER_ID } from '../../data/students'
import { PROJECTS } from '../../data/projects'
import { calculateMatchScore } from '../../utils/matchScore'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import MatchScore from '../../components/ui/MatchScore'
import SkillChip from '../../components/ui/SkillChip'
import Button from '../../components/ui/Button'
import ProjectCard from '../../components/cards/ProjectCard'
import StudentCard from '../../components/cards/StudentCard'

const skillFilters = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'design', label: 'UI/UX' },
  { id: 'ml_ai', label: 'ML/AI' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'devops', label: 'DevOps' },
]

export default function Finder() {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState([])
  const timer = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setDebouncedSearch(search), 200)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [search])

  const toggleFilter = (id) => {
    setActiveFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const filteredStudents = STUDENTS.filter(s => {
    const matchesSearch = !debouncedSearch ||
      s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      s.skills.some(sk => sk.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
    const matchesCategory = activeFilters.length === 0 ||
      s.skills.some(sk => activeFilters.includes(sk.category))
    return matchesSearch && matchesCategory
  })

  const filteredProjects = PROJECTS.filter(p => {
    const matchesSearch = !debouncedSearch ||
      p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.techStack.some(t => t.toLowerCase().includes(debouncedSearch.toLowerCase()))
    const matchesCategory = activeFilters.length === 0 ||
      p.techStack.some(t => {
        const skill = STUDENTS.flatMap(s => s.skills).find(sk => sk.name.toLowerCase() === t.toLowerCase())
        return skill && activeFilters.includes(skill.category)
      })
    return matchesSearch && (activeFilters.length === 0 || matchesCategory)
  })

  const noResults = filteredStudents.length === 0 && filteredProjects.length === 0

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="h-10 w-64 rounded skeleton mb-4 mx-auto" />
        <div className="h-12 w-full max-w-2xl mx-auto rounded skeleton mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-48 rounded-lg skeleton" />)}</div>
          <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-48 rounded-lg skeleton" />)}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light mb-2">
          Find the right teammate
        </h1>
        <p className="text-text-secondary dark:text-text-secondary text-text-secondary-light">
          Search across students and projects to find your perfect match
        </p>
      </div>

      {/* Search bar */}
      <div className="relative max-w-2xl mx-auto mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          placeholder="Search students and projects by name, skill, or tech..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg pl-12 pr-4 py-3.5 text-base text-text-primary dark:text-text-primary text-text-primary-light placeholder:text-text-muted focus:outline-none focus:border-coral/50 shadow-card transition-all"
        />
      </div>

      {/* Skill filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {skillFilters.map(f => (
          <button
            key={f.id}
            onClick={() => toggleFilter(f.id)}
            className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
              activeFilters.includes(f.id)
                ? 'bg-teal text-bg-base font-medium'
                : 'bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light text-text-secondary hover:bg-white/10 dark:hover:bg-white/10 hover:bg-black/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {noResults ? (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-secondary dark:text-text-secondary text-text-secondary-light mb-2">No results found</p>
          <p className="text-sm text-text-muted">Try a different skill or post a project to attract teammates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Students column */}
          <div>
            <h2 className="text-lg font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal" />
              Matching Students
              <span className="text-xs text-text-muted font-normal">({filteredStudents.length})</span>
            </h2>
            <div className="space-y-4">
              {filteredStudents.map(s => (
                <StudentCard key={s.id} student={s} />
              ))}
              {filteredStudents.length === 0 && (
                <p className="text-sm text-text-muted text-center py-8">No matching students</p>
              )}
            </div>
          </div>

          {/* Projects column */}
          <div>
            <h2 className="text-lg font-heading font-semibold text-text-primary dark:text-text-primary text-text-primary-light mb-4 flex items-center gap-2">
              <Folder className="w-5 h-5 text-coral" />
              Matching Projects
              <span className="text-xs text-text-muted font-normal">({filteredProjects.length})</span>
            </h2>
            <div className="space-y-4">
              {filteredProjects.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
              {filteredProjects.length === 0 && (
                <p className="text-sm text-text-muted text-center py-8">No matching projects</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

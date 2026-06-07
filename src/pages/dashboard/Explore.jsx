import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { PROJECTS } from '../../data/projects'
import ProjectCard from '../../components/cards/ProjectCard'
import Button from '../../components/ui/Button'

const typeFilters = [
  { id: 'all', label: 'All' },
  { id: 'hackathon', label: 'Hackathon' },
  { id: 'startup', label: 'Startup' },
  { id: 'college', label: 'College' },
  { id: 'open-source', label: 'Open Source' },
]

const sortOptions = [
  { id: 'latest', label: 'Latest' },
  { id: 'best-match', label: 'Best Match' },
  { id: 'most-applicants', label: 'Most Applicants' },
]

export default function Explore() {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sort, setSort] = useState('latest')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const filtered = PROJECTS.filter(p => {
    const matchesType = typeFilter === 'all' || p.type === typeFilter
    const matchesSearch = !search || 
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.techStack.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchesType && matchesSearch
  }).sort((a, b) => {
    if (sort === 'best-match') return b.matchScore - a.matchScore
    if (sort === 'most-applicants') return b.newApplicants - a.newApplicants
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="h-8 w-48 rounded skeleton mb-6" />
        <div className="h-10 w-full rounded skeleton mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-bg-surface border border-white/8 rounded-lg p-6">
              <div className="space-y-3">
                <div className="h-4 w-16 rounded skeleton" />
                <div className="h-5 w-40 rounded skeleton" />
                <div className="h-3 w-full rounded skeleton" />
                <div className="h-3 w-3/4 rounded skeleton" />
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3].map(j => <div key={j} className="h-5 w-14 rounded-full skeleton" />)}
                </div>
                <div className="h-9 w-full rounded skeleton mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light mb-6">
        Explore Projects
      </h1>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          placeholder="Search projects by name, description, or tech stack..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light border border-white/8 dark:border-white/8 border-black/10 rounded-md pl-10 pr-4 py-2.5 text-sm text-text-primary dark:text-text-primary text-text-primary-light placeholder:text-text-muted focus:outline-none focus:border-coral/50 transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {typeFilters.map(f => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id)}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                typeFilter === f.id
                  ? 'bg-coral text-white'
                  : 'bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light text-text-secondary hover:bg-white/10 dark:hover:bg-white/10 hover:bg-black/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light border border-white/8 dark:border-white/8 border-black/10 rounded-md px-3 py-2 text-sm text-text-primary dark:text-text-primary text-text-primary-light focus:outline-none focus:border-coral/50"
        >
          {sortOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <div className="w-16 h-16 rounded-full bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light" />
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light border-4 border-bg-base dark:border-bg-base border-bg-base-light flex items-center justify-center">
              <Search className="w-4 h-4 text-text-muted" />
            </div>
          </div>
          <p className="text-text-secondary dark:text-text-secondary text-text-secondary-light mb-2">No projects found</p>
          <p className="text-sm text-text-muted mb-4">Be the first to post one!</p>
          <Button>Post a Project</Button>
        </div>
      )}
    </div>
  )
}

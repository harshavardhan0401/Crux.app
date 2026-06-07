import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { STUDENTS } from '../../data/students'
import StudentCard from '../../components/cards/StudentCard'

const categoryFilters = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'design', label: 'UI/UX' },
  { id: 'ml_ai', label: 'ML/AI' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'devops', label: 'DevOps' },
]

export default function Students() {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const toggleFilter = (id) => {
    setActiveFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const filtered = STUDENTS.filter(s => {
    const matchesSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.college.toLowerCase().includes(search.toLowerCase()) ||
      s.skills.some(sk => sk.name.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = activeFilters.length === 0 ||
      s.skills.some(sk => activeFilters.includes(sk.category))
    return matchesSearch && matchesCategory
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
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full skeleton" />
                  <div><div className="h-4 w-24 rounded skeleton" /><div className="h-3 w-16 rounded skeleton mt-1" /></div>
                </div>
                <div className="flex gap-2">{[1, 2, 3].map(j => <div key={j} className="h-5 w-14 rounded-full skeleton" />)}</div>
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
        Students
      </h1>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          placeholder="Search by name, college, or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light border border-white/8 dark:border-white/8 border-black/10 rounded-md pl-10 pr-4 py-2.5 text-sm text-text-primary dark:text-text-primary text-text-primary-light placeholder:text-text-muted focus:outline-none focus:border-coral/50 transition-colors"
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categoryFilters.map(f => (
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

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(s => <StudentCard key={s.id} student={s} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-text-secondary mb-2">No students match your filters</p>
          <p className="text-sm text-text-muted">Try different skills or clear your search</p>
        </div>
      )}
    </div>
  )
}

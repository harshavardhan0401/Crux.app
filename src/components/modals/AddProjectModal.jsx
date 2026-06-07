import { useState } from 'react'
import { Check } from 'lucide-react'
import { SKILLS, SKILL_CATEGORIES } from '../../data/skills'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import useAppStore from '../../store/useAppStore'

const ROLES = [
  { id: 'frontend_dev', label: 'Frontend Developer', emoji: '🖥️' },
  { id: 'backend_dev', label: 'Backend Developer', emoji: '⚙️' },
  { id: 'fullstack', label: 'Full Stack Developer', emoji: '🔗' },
  { id: 'ui_ux', label: 'UI/UX Designer', emoji: '🎨' },
  { id: 'ml_engineer', label: 'ML/AI Engineer', emoji: '🤖' },
  { id: 'mobile_dev', label: 'Mobile Developer', emoji: '📱' },
  { id: 'marketing', label: 'Marketing', emoji: '📢' },
  { id: 'product_manager', label: 'Product Manager', emoji: '📋' },
]

const PROJECT_TYPES = [
  { id: 'hackathon', label: 'Hackathon' },
  { id: 'startup', label: 'Startup' },
  { id: 'college', label: 'College' },
  { id: 'open-source', label: 'Open Source' },
  { id: 'personal', label: 'Personal' },
]

export default function AddProjectModal({ isOpen, onClose, onAdd }) {
  const { addToast } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: '',
    github: '',
    demo: '',
    maxTeamSize: 4,
    status: 'recruiting',
  })
  const [selectedTech, setSelectedTech] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([])
  const [techSearch, setTechSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const filteredSkills = SKILLS.filter(s => {
    const matchesCat = activeCategory === 'all' || s.category === activeCategory
    const matchesSearch = !techSearch || s.name.toLowerCase().includes(techSearch.toLowerCase())
    return matchesCat && matchesSearch
  })

  const toggleTech = (name) => {
    setSelectedTech(prev => prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name])
  }

  const toggleRole = (id) => {
    setSelectedRoles(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id])
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.description.trim()) errs.description = 'Description is required'
    if (!form.type) errs.type = 'Select a project type'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const newProject = {
      id: 'p' + Date.now(),
      title: form.title,
      description: form.description,
      type: form.type,
      status: form.status,
      techStack: selectedTech,
      openings: selectedRoles.map((r, i) => ({
        id: 'o' + Date.now() + i,
        role: r,
        label: ROLES.find(rl => rl.id === r)?.label || r,
        description: '',
        isFilled: false,
      })),
      teamMembers: [{ userId: 's1', role: 'fullstack', isOwner: true }],
      maxTeamSize: parseInt(form.maxTeamSize) || 4,
      matchScore: 0,
      newApplicants: 0,
      ownerId: 's1',
      github: form.github,
      demo: form.demo,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setLoading(false)
    if (onAdd) onAdd(newProject)
    addToast('Project posted!', 'success')
    setForm({ title: '', description: '', type: '', github: '', demo: '', maxTeamSize: 4, status: 'recruiting' })
    setSelectedTech([])
    setSelectedRoles([])
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post a New Project" maxWidth="max-w-2xl">
      <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
        <Input
          label="Project Title"
          placeholder="What are you building?"
          value={form.title}
          onChange={handleChange('title')}
          error={errors.title}
        />

        <Textarea
          label="Description"
          placeholder="Describe your project and what you're looking for..."
          value={form.description}
          onChange={handleChange('description')}
          error={errors.description}
        />

        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light mb-1.5">
            Project Type
          </label>
          <select
            value={form.type}
            onChange={handleChange('type')}
            className="w-full bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light border border-white/8 dark:border-white/8 border-black/10 rounded-md px-4 py-2.5 text-sm text-text-primary dark:text-text-primary text-text-primary-light focus:outline-none focus:border-coral/50 transition-colors"
          >
            <option value="">Select type</option>
            {PROJECT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          {errors.type && <p className="text-xs text-error mt-1">{errors.type}</p>}
        </div>

        {/* Tech stack */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light mb-1.5">
            Tech Stack
          </label>
          <Input placeholder="Search technologies..." value={techSearch} onChange={(e) => setTechSearch(e.target.value)} />
          <div className="flex flex-wrap gap-2 mt-2">
            <button onClick={() => setActiveCategory('all')} className={`px-3 py-1 text-xs rounded-full ${activeCategory === 'all' ? 'bg-coral text-white' : 'bg-bg-surface2 text-text-secondary'}`}>All</button>
            {SKILL_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-3 py-1 text-xs rounded-full ${activeCategory === cat.id ? 'bg-coral text-white' : 'bg-bg-surface2 text-text-secondary'}`}>
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2 max-h-32 overflow-y-auto">
            {filteredSkills.map(s => (
              <button
                key={s.name}
                onClick={() => toggleTech(s.name)}
                className={`font-mono text-xs px-3 py-1 rounded-full border transition-all ${selectedTech.includes(s.name) ? 'bg-teal/20 border-teal/50 text-teal' : 'border-white/10 text-text-secondary hover:border-coral/50'}`}
              >
                {selectedTech.includes(s.name) && <Check className="w-3 h-3 inline mr-1" />}
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Required roles */}
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light mb-2">
            Required Roles
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {ROLES.map(role => (
              <button
                key={role.id}
                onClick={() => toggleRole(role.id)}
                className={`p-2.5 rounded-md border text-center transition-all text-xs ${selectedRoles.includes(role.id) ? 'border-coral bg-coral/5' : 'border-white/8 hover:border-white/20'}`}
              >
                <span className="block mb-0.5">{role.emoji}</span>
                {role.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="GitHub URL" placeholder="https://github.com/..." value={form.github} onChange={handleChange('github')} />
          <Input label="Demo URL" placeholder="https://..." value={form.demo} onChange={handleChange('demo')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light mb-1.5">Max Team Size</label>
            <input
              type="number"
              min="2"
              max="10"
              value={form.maxTeamSize}
              onChange={handleChange('maxTeamSize')}
              className="w-full bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light border border-white/8 rounded-md px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-coral/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light mb-1.5">Status</label>
            <div className="flex gap-2 mt-1">
              {['recruiting', 'in-progress'].map(s => (
                <button
                  key={s}
                  onClick={() => setForm(prev => ({ ...prev, status: s }))}
                  className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${form.status === s ? 'bg-coral text-white' : 'bg-bg-surface2 text-text-secondary border border-white/8'}`}
                >
                  {s === 'recruiting' ? 'Recruiting' : 'In Progress'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button loading={loading} onClick={handleSubmit} className="w-full">
          Post Project
        </Button>
      </div>
    </Modal>
  )
}

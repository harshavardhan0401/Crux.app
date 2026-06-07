import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, Check, Loader2, ArrowLeft, ArrowRight, Sparkles, ExternalLink } from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import { SKILLS, SKILL_CATEGORIES } from '../../data/skills'
import { getCompleteness } from '../../utils/completeness'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import SkillChip from '../../components/ui/SkillChip'
import CompletenessRing from '../../components/ui/CompletenessRing'

const TAKEN_USERNAMES = ['admin', 'crux', 'harsha_dev', 'priya_designs', 'rahul_ml']

const COLLEGES = [
  'IIT Bombay', 'IIT Delhi', 'IIT Hyderabad', 'IIT Madras', 'IIT Kanpur',
  'NIT Warangal', 'NIT Trichy', 'NIT Surathkal', 'BITS Pilani', 'BITS Hyderabad',
  'JNTU Hyderabad', 'VITS Engineering', 'Osmania University', 'CBIT Hyderabad',
  'VNR VJIET', 'IIIT Hyderabad', 'IIIT Bangalore', 'DTU Delhi', 'NSUT Delhi', 'PES University'
]

const BRANCHES = ['CSE', 'ECE', 'EEE', 'IT', 'Mechanical', 'Civil', 'AI&ML', 'Data Science', 'Other']

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

const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', emoji: '🌱', desc: 'Just getting started' },
  { id: 'intermediate', label: 'Intermediate', emoji: '🚀', desc: 'Built a few projects' },
  { id: 'advanced', label: 'Advanced', emoji: '⚡', desc: 'Shipping to production' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { user, updateUser, setOnboarded, addToast } = useAppStore()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState('right')

  // Step 1 state
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [name, setName] = useState(user?.name || '')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [usernameStatus, setUsernameStatus] = useState(null) // null, 'checking', 'available', 'taken'
  const usernameTimer = useRef(null)

  // Step 2 state
  const [college, setCollege] = useState('')
  const [year, setYear] = useState('')
  const [branch, setBranch] = useState('')
  const [experience, setExperience] = useState('')

  // Step 3 state
  const [selectedSkills, setSelectedSkills] = useState([])
  const [skillSearch, setSkillSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const searchTimer = useRef(null)
  const [filteredSearch, setFilteredSearch] = useState('')

  // Step 4 state
  const [selectedRoles, setSelectedRoles] = useState([])
  const [github, setGithub] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [portfolio, setPortfolio] = useState('')

  // Username check
  useEffect(() => {
    if (!username.trim()) {
      setUsernameStatus(null)
      return
    }
    setUsernameStatus('checking')
    if (usernameTimer.current) clearTimeout(usernameTimer.current)
    usernameTimer.current = setTimeout(() => {
      if (TAKEN_USERNAMES.includes(username.toLowerCase())) {
        setUsernameStatus('taken')
      } else {
        setUsernameStatus('available')
      }
    }, 600)
    return () => { if (usernameTimer.current) clearTimeout(usernameTimer.current) }
  }, [username])

  // Skill search debounce
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setFilteredSearch(skillSearch)
    }, 200)
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current) }
  }, [skillSearch])

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const filteredSkills = SKILLS.filter(skill => {
    const matchesCategory = activeCategory === 'all' || skill.category === activeCategory
    const matchesSearch = !filteredSearch || skill.name.toLowerCase().includes(filteredSearch.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleSkill = (skillName) => {
    setSelectedSkills(prev => {
      const existing = prev.find(s => s.name === skillName)
      if (existing) {
        const profLevels = ['learning', 'comfortable', 'strong']
        const nextIndex = profLevels.indexOf(existing.proficiency) + 1
        if (nextIndex >= profLevels.length) {
          return prev.filter(s => s.name !== skillName)
        }
        return prev.map(s => s.name === skillName ? { ...s, proficiency: profLevels[nextIndex] } : s)
      }
      if (prev.length >= 15) return prev
      const skillData = SKILLS.find(s => s.name === skillName)
      return [...prev, { name: skillName, category: skillData?.category || 'frontend', proficiency: 'learning' }]
    })
  }

  const addSkillFromGrid = (skillName) => {
    const existing = selectedSkills.find(s => s.name === skillName)
    if (existing) return
    if (selectedSkills.length >= 15) return
    const skillData = SKILLS.find(s => s.name === skillName)
    setSelectedSkills(prev => [...prev, { name: skillName, category: skillData?.category || 'frontend', proficiency: 'learning' }])
  }

  const toggleRole = (roleId) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(r => r !== roleId)
        : [...prev, roleId]
    )
  }

  const goNext = () => {
    if (step < 5) {
      setDirection('right')
      setStep(s => s + 1)
    }
  }

  const goBack = () => {
    if (step > 1) {
      setDirection('left')
      setStep(s => s - 1)
    }
  }

  const handleFinish = () => {
    updateUser({
      name: name || user?.name,
      username: username || user?.username,
      bio,
      college,
      year,
      branch,
      experience,
      skills: selectedSkills,
      roles: selectedRoles,
      github,
      linkedin,
      portfolio,
    })
    setOnboarded()
    navigate('/dashboard/home')
  }

  // Confetti effect for step 5
  const canvasRef = useRef(null)
  useEffect(() => {
    if (step !== 5 || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5 - canvas.height * 0.5,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 3 + 2,
      size: Math.random() * 6 + 2,
      color: ['#FF6B6B', '#C06AF2', '#4ECDC4', '#F59E0B', '#22C55E', '#3B82F6', '#EC4899', '#8B5CF6'][Math.floor(Math.random() * 8)],
      opacity: 1,
      rotation: Math.random() * 360,
    }))

    let frame
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.1
        p.opacity -= 0.005
        p.rotation += 3
        if (p.opacity > 0) {
          alive = true
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rotation * Math.PI) / 180)
          ctx.globalAlpha = p.opacity
          ctx.fillStyle = p.color
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
          ctx.restore()
        }
      })
      if (alive) frame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [step])

  const completenessData = getCompleteness({
    name: name || user?.name,
    college,
    year,
    skills: selectedSkills,
    roles: selectedRoles,
    github,
    linkedin,
    portfolio,
  })

  const progress = (step / 5) * 100

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-8">
      {step === 5 && (
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
      )}

      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-secondary dark:text-text-secondary text-text-secondary-light">
              Step {step} of 5
            </span>
            <span className="text-sm text-text-muted dark:text-text-muted text-text-muted-light">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-1.5 bg-white/5 dark:bg-white/5 bg-black/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-coral rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-bg-surface dark:bg-bg-surface bg-bg-surface-light border border-white/8 dark:border-white/8 border-black/10 rounded-lg p-8 shadow-card overflow-hidden">
          <div
            key={step}
            className="animate-fade-in"
          >
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light">
                    Let's set up your profile
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">Tell us about yourself</p>
                </div>

                {/* Avatar upload */}
                <div className="flex justify-center">
                  <label className="cursor-pointer group">
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    <div className="w-24 h-24 rounded-full bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light border-2 border-dashed border-white/20 dark:border-white/20 border-black/20 flex items-center justify-center overflow-hidden group-hover:border-coral/50 transition-colors">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <Upload className="w-6 h-6 text-text-muted mx-auto" />
                          <span className="text-xs text-text-muted mt-1 block">Upload</span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                <Input
                  label="Full Name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <div>
                  <Input
                    label="Username"
                    prefix="@"
                    placeholder="your_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  />
                  {usernameStatus && (
                    <div className="flex items-center gap-1 mt-1">
                      {usernameStatus === 'checking' && (
                        <><Loader2 className="w-3.5 h-3.5 animate-spin text-text-muted" /><span className="text-xs text-text-muted">Checking...</span></>
                      )}
                      {usernameStatus === 'available' && (
                        <><Check className="w-3.5 h-3.5 text-teal" /><span className="text-xs text-teal">Available!</span></>
                      )}
                      {usernameStatus === 'taken' && (
                        <><span className="text-xs text-error">Already taken</span></>
                      )}
                    </div>
                  )}
                </div>

                <Textarea
                  label="Bio"
                  placeholder="Tell others about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={160}
                />
              </div>
            )}

            {/* Step 2: Academic */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light">
                    Academic details
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">Help us find the right projects for you</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light mb-1.5">College</label>
                  <input
                    list="colleges"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="Search your college..."
                    className="w-full bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light border border-white/8 dark:border-white/8 border-black/10 rounded-md px-4 py-2.5 text-sm text-text-primary dark:text-text-primary text-text-primary-light placeholder:text-text-muted focus:outline-none focus:border-coral/50 transition-colors"
                  />
                  <datalist id="colleges">
                    {COLLEGES.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light mb-1.5">Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light border border-white/8 dark:border-white/8 border-black/10 rounded-md px-4 py-2.5 text-sm text-text-primary dark:text-text-primary text-text-primary-light focus:outline-none focus:border-coral/50 transition-colors"
                    >
                      <option value="">Select year</option>
                      {['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light mb-1.5">Branch</label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light border border-white/8 dark:border-white/8 border-black/10 rounded-md px-4 py-2.5 text-sm text-text-primary dark:text-text-primary text-text-primary-light focus:outline-none focus:border-coral/50 transition-colors"
                    >
                      <option value="">Select branch</option>
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light mb-3">Experience Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {EXPERIENCE_LEVELS.map(level => (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setExperience(level.id)}
                        className={`
                          p-4 rounded-lg border text-center transition-all duration-200
                          ${experience === level.id
                            ? 'border-coral bg-coral/5 shadow-coral-glow'
                            : 'border-white/8 dark:border-white/8 border-black/10 hover:border-white/20 dark:hover:border-white/20 hover:border-black/20'}
                        `}
                      >
                        <span className="text-2xl block mb-1">{level.emoji}</span>
                        <span className="text-sm font-medium text-text-primary dark:text-text-primary text-text-primary-light block">{level.label}</span>
                        <span className="text-xs text-text-muted dark:text-text-muted text-text-muted-light">{level.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Skills */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light">
                    What are your skills?
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">Click a skill to add it, then click chips to change proficiency level</p>
                </div>

                <Input
                  placeholder="Search skills..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                />

                {/* Category tabs */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-3 py-1.5 text-xs rounded-full transition-colors ${activeCategory === 'all' ? 'bg-coral text-white' : 'bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light text-text-secondary hover:bg-white/10'}`}
                  >
                    All
                  </button>
                  {SKILL_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 text-xs rounded-full transition-colors ${activeCategory === cat.id ? 'bg-coral text-white' : 'bg-bg-surface2 dark:bg-bg-surface2 bg-bg-surface2-light text-text-secondary hover:bg-white/10'}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Skill grid */}
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                  {filteredSkills.map(skill => {
                    const isSelected = selectedSkills.find(s => s.name === skill.name)
                    return (
                      <button
                        key={skill.name}
                        onClick={() => addSkillFromGrid(skill.name)}
                        disabled={isSelected || selectedSkills.length >= 15}
                        className={`
                          font-mono text-xs px-3 py-1.5 rounded-full border transition-all
                          ${isSelected
                            ? 'bg-teal/20 border-teal/50 text-teal cursor-default'
                            : selectedSkills.length >= 15
                              ? 'border-white/5 text-text-muted cursor-not-allowed opacity-50'
                              : 'border-white/10 dark:border-white/10 border-black/10 text-text-secondary hover:border-coral/50 hover:text-coral cursor-pointer'
                          }
                        `}
                      >
                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                        {skill.name}
                      </button>
                    )
                  })}
                </div>

                {/* Selected skills */}
                {selectedSkills.length > 0 && (
                  <div>
                    <p className="text-xs text-text-muted mb-2">
                      {selectedSkills.length} / 15 skills selected — click to change proficiency
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map(skill => (
                        <SkillChip
                          key={skill.name}
                          name={skill.name}
                          proficiency={skill.proficiency}
                          onClick={() => toggleSkill(skill.name)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Roles & Links */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light">
                    Roles & Links
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">What roles are you interested in?</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ROLES.map(role => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => toggleRole(role.id)}
                      className={`
                        p-3 rounded-lg border text-center transition-all duration-200
                        ${selectedRoles.includes(role.id)
                          ? 'border-coral bg-coral/5 shadow-coral-glow'
                          : 'border-white/8 dark:border-white/8 border-black/10 hover:border-white/20 dark:hover:border-white/20 hover:border-black/20'}
                      `}
                    >
                      <span className="text-xl block mb-1">{role.emoji}</span>
                      <span className="text-xs font-medium text-text-primary dark:text-text-primary text-text-primary-light">{role.label}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-white/8 dark:border-white/8 border-black/10">
                  <p className="text-sm text-text-secondary">Links <span className="text-text-muted">(optional)</span></p>
                  <Input label="GitHub URL" placeholder="https://github.com/username" value={github} onChange={(e) => setGithub(e.target.value)} />
                  <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/username" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                  <Input label="Portfolio URL" placeholder="https://yoursite.com" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
                </div>
              </div>
            )}

            {/* Step 5: Complete */}
            {step === 5 && (
              <div className="text-center space-y-6">
                <div className="mb-4">
                  <Sparkles className="w-12 h-12 text-coral mx-auto mb-3" />
                  <h2 className="text-2xl font-heading font-bold text-text-primary dark:text-text-primary text-text-primary-light">
                    Welcome to Crux, {name || user?.name}!
                  </h2>
                  <p className="text-sm text-text-secondary mt-2">You're all set to start collaborating</p>
                </div>

                <div className="flex justify-center">
                  <CompletenessRing percentage={completenessData.score} size={80} />
                </div>

                <div className="text-left max-w-sm mx-auto space-y-2">
                  {completenessData.checks.map((check, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${check.done ? 'bg-teal/20' : 'bg-white/5 dark:bg-white/5 bg-black/5'}`}>
                        {check.done && <Check className="w-3 h-3 text-teal" />}
                      </div>
                      <span className={`text-sm ${check.done ? 'text-text-primary dark:text-text-primary text-text-primary-light' : 'text-text-muted'}`}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>

                {completenessData.score < 100 && (
                  <p className="text-sm text-coral">
                    Complete your profile to get 3x more team invites
                  </p>
                )}

                <Button onClick={handleFinish} className="mx-auto">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          {step < 5 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/8 dark:border-white/8 border-black/10">
              <div>
                {step > 1 && (
                  <Button variant="ghost" onClick={goBack}>
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3">
                {step >= 2 && step <= 4 && (
                  <Button variant="ghost" onClick={goNext}>Skip</Button>
                )}
                <Button onClick={goNext}>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

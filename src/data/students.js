export const CURRENT_USER_ID = 's1'

export const STUDENTS = [
  {
    id: 's1', name: 'Harsha', username: 'harsha_dev',
    bio: 'Passionate about building scalable web applications and solving real world problems.',
    avatarColor: '#6366F1', college: 'VITS Engineering',
    year: '3rd Year', branch: 'CSE', experience: 'intermediate',
    skills: [
      { name: 'React', category: 'frontend', proficiency: 'strong' },
      { name: 'JavaScript', category: 'frontend', proficiency: 'strong' },
      { name: 'Java', category: 'backend', proficiency: 'strong' },
      { name: 'Spring Boot', category: 'backend', proficiency: 'comfortable' },
      { name: 'CSS', category: 'frontend', proficiency: 'comfortable' },
      { name: 'TypeScript', category: 'frontend', proficiency: 'comfortable' },
      { name: 'Git', category: 'devops', proficiency: 'comfortable' },
      { name: 'Figma', category: 'design', proficiency: 'learning' },
    ],
    roles: ['frontend_dev', 'fullstack'],
    github: 'github.com/harsha', linkedin: 'linkedin.com/in/harsha', portfolio: '',
    reliability: 94, isActive: true, verified: true, verifiedMethod: 'email_domain',
    completeness: 85, projects: ['p6'], joinedAt: '2025-01-15'
  },
  {
    id: 's2', name: 'Priya', username: 'priya_designs',
    bio: 'UI/UX designer who loves crafting beautiful and intuitive interfaces.',
    avatarColor: '#EC4899', college: 'JNTU Hyderabad',
    year: '2nd Year', branch: 'AI&ML', experience: 'beginner',
    skills: [
      { name: 'Figma', category: 'design', proficiency: 'strong' },
      { name: 'UI/UX', category: 'design', proficiency: 'strong' },
      { name: 'CSS', category: 'frontend', proficiency: 'comfortable' },
      { name: 'Prototyping', category: 'design', proficiency: 'comfortable' },
    ],
    roles: ['ui_ux'],
    github: '', linkedin: 'linkedin.com/in/priya', portfolio: '',
    reliability: 88, isActive: true, verified: true, verifiedMethod: 'email_domain',
    completeness: 92, projects: ['p1','p4'], joinedAt: '2025-02-10'
  },
  {
    id: 's3', name: 'Rahul', username: 'rahul_ml',
    bio: 'ML engineer building intelligent systems. IIT grad passionate about deep learning.',
    avatarColor: '#10B981', college: 'IIT Hyderabad',
    year: '4th Year', branch: 'CSE', experience: 'advanced',
    skills: [
      { name: 'Python', category: 'ml_ai', proficiency: 'strong' },
      { name: 'ML', category: 'ml_ai', proficiency: 'strong' },
      { name: 'TensorFlow', category: 'ml_ai', proficiency: 'strong' },
      { name: 'PyTorch', category: 'ml_ai', proficiency: 'comfortable' },
    ],
    roles: ['ml_engineer'],
    github: 'github.com/rahulml', linkedin: '', portfolio: '',
    reliability: 96, isActive: true, verified: true, verifiedMethod: 'email_domain',
    completeness: 100, projects: ['p2','p3'], joinedAt: '2025-01-20'
  },
  {
    id: 's4', name: 'Sneha', username: 'sneha_flutter',
    bio: 'Mobile developer focused on cross-platform apps with beautiful UX.',
    avatarColor: '#F59E0B', college: 'Osmania University',
    year: '3rd Year', branch: 'IT', experience: 'intermediate',
    skills: [
      { name: 'Flutter', category: 'mobile', proficiency: 'strong' },
      { name: 'Dart', category: 'mobile', proficiency: 'strong' },
      { name: 'Firebase', category: 'backend', proficiency: 'comfortable' },
      { name: 'Kotlin', category: 'mobile', proficiency: 'learning' },
    ],
    roles: ['mobile_dev'],
    github: '', linkedin: '', portfolio: '',
    reliability: 79, isActive: false, verified: false, verifiedMethod: 'self_reported',
    completeness: 70, projects: ['p3'], joinedAt: '2025-03-01'
  },
  {
    id: 's5', name: 'Aditya', username: 'aditya_be',
    bio: 'Backend developer who loves clean APIs and scalable architecture.',
    avatarColor: '#8B5CF6', college: 'CBIT Hyderabad',
    year: '2nd Year', branch: 'CSE', experience: 'intermediate',
    skills: [
      { name: 'Node.js', category: 'backend', proficiency: 'strong' },
      { name: 'MongoDB', category: 'backend', proficiency: 'strong' },
      { name: 'Express', category: 'backend', proficiency: 'comfortable' },
      { name: 'Docker', category: 'devops', proficiency: 'learning' },
    ],
    roles: ['backend_dev'],
    github: 'github.com/aditya', linkedin: '', portfolio: '',
    reliability: 91, isActive: true, verified: true, verifiedMethod: 'email_domain',
    completeness: 88, projects: ['p2','p4'], joinedAt: '2025-02-20'
  },
  {
    id: 's6', name: 'Divya', username: 'divya_fx',
    bio: 'Frontend developer obsessed with performance and great developer experience.',
    avatarColor: '#EF4444', college: 'VNR VJIET',
    year: '3rd Year', branch: 'CSE', experience: 'intermediate',
    skills: [
      { name: 'React', category: 'frontend', proficiency: 'strong' },
      { name: 'TypeScript', category: 'frontend', proficiency: 'strong' },
      { name: 'GraphQL', category: 'backend', proficiency: 'comfortable' },
      { name: 'Next.js', category: 'frontend', proficiency: 'comfortable' },
    ],
    roles: ['frontend_dev','fullstack'],
    github: '', linkedin: '', portfolio: 'divya.dev',
    reliability: 85, isActive: true, verified: false, verifiedMethod: 'self_reported',
    completeness: 78, projects: ['p3','p4','p5'], joinedAt: '2025-03-10'
  }
]

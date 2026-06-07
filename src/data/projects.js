export const PROJECTS = [
  {
    id: 'p1', title: 'AI Study Assistant', ownerId: 's2',
    description: 'A personalized AI tutor with progress tracking and adaptive study suggestions.',
    type: 'startup', status: 'recruiting',
    techStack: ['React','Node.js','MongoDB','Gemini API'],
    openings: [
      { id: 'o1a', role: 'ui_ux', label: 'UI Designer', description: 'Design the full app UI in Figma', isFilled: false },
      { id: 'o1b', role: 'backend_dev', label: 'Backend Dev', description: 'Build REST API and database layer', isFilled: false }
    ],
    teamMembers: [{ userId: 's2', role: 'fullstack', isOwner: true }],
    maxTeamSize: 4, matchScore: 87, newApplicants: 3,
    github: '', demo: '', createdAt: '2025-05-28'
  },
  {
    id: 'p2', title: 'CampusCart', ownerId: 's3',
    description: 'Smart campus marketplace for students to buy, sell, and rent items within college.',
    type: 'startup', status: 'recruiting',
    techStack: ['Flutter','Firebase','Dart','Stripe'],
    openings: [
      { id: 'o2a', role: 'mobile_dev', label: 'Mobile Dev', description: 'Flutter UI development', isFilled: false },
      { id: 'o2b', role: 'marketing', label: 'Marketing', description: 'Growth and campus outreach', isFilled: false }
    ],
    teamMembers: [
      { userId: 's3', role: 'backend_dev', isOwner: true },
      { userId: 's5', role: 'backend_dev', isOwner: false }
    ],
    maxTeamSize: 4, matchScore: 72, newApplicants: 1,
    github: '', demo: '', createdAt: '2025-05-25'
  },
  {
    id: 'p3', title: 'HackHelper', ownerId: 's4',
    description: 'AI-powered hackathon project generator — brainstorm ideas, generate boilerplate, plan sprints.',
    type: 'hackathon', status: 'recruiting',
    techStack: ['Python','FastAPI','OpenAI API','React'],
    openings: [
      { id: 'o3a', role: 'frontend_dev', label: 'Frontend Dev', description: 'Build React dashboard', isFilled: false }
    ],
    teamMembers: [
      { userId: 's4', role: 'backend_dev', isOwner: true },
      { userId: 's3', role: 'ml_engineer', isOwner: false },
      { userId: 's6', role: 'fullstack', isOwner: false }
    ],
    maxTeamSize: 4, matchScore: 91, newApplicants: 5,
    github: '', demo: '', createdAt: '2025-05-20'
  },
  {
    id: 'p4', title: 'GreenTrack', ownerId: 's5',
    description: 'Carbon footprint tracker with ML-powered suggestions to reduce your environmental impact.',
    type: 'open-source', status: 'in-progress',
    techStack: ['React Native','MongoDB','Python','ML'],
    openings: [
      { id: 'o4a', role: 'ml_engineer', label: 'ML Engineer', description: 'Train and deploy carbon prediction model', isFilled: false }
    ],
    teamMembers: [
      { userId: 's5', role: 'fullstack', isOwner: true },
      { userId: 's2', role: 'ui_ux', isOwner: false },
      { userId: 's6', role: 'frontend_dev', isOwner: false }
    ],
    maxTeamSize: 5, matchScore: 65, newApplicants: 0,
    github: 'github.com/greentrack', demo: '', createdAt: '2025-05-15'
  },
  {
    id: 'p5', title: 'StudyCircle', ownerId: 's6',
    description: 'Collaborative study room platform for exam prep — live whiteboards, shared notes, Pomodoro timer.',
    type: 'college', status: 'recruiting',
    techStack: ['Vue.js','Spring Boot','PostgreSQL','WebSockets'],
    openings: [
      { id: 'o5a', role: 'backend_dev', label: 'Backend Dev', description: 'Spring Boot REST APIs and WebSocket server', isFilled: false }
    ],
    teamMembers: [{ userId: 's6', role: 'frontend_dev', isOwner: true }],
    maxTeamSize: 3, matchScore: 78, newApplicants: 2,
    github: '', demo: '', createdAt: '2025-05-10'
  },
  {
    id: 'p6', title: 'DevConnect', ownerId: 's1',
    description: 'Developer networking app to find open-source contributors and collaborators for side projects.',
    type: 'startup', status: 'in-progress',
    techStack: ['React','GraphQL','Redis','Node.js'],
    openings: [
      { id: 'o6a', role: 'backend_dev', label: 'DevOps', description: 'Infrastructure, CI/CD, containerization', isFilled: false }
    ],
    teamMembers: [
      { userId: 's1', role: 'frontend_dev', isOwner: true },
      { userId: 's2', role: 'ui_ux', isOwner: false },
      { userId: 's3', role: 'ml_engineer', isOwner: false },
      { userId: 's5', role: 'backend_dev', isOwner: false }
    ],
    maxTeamSize: 5, matchScore: 83, newApplicants: 0,
    github: 'github.com/devconnect', demo: '', createdAt: '2025-05-05'
  }
]

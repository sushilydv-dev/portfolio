// Content of the Resume page (/resume), based on Sushil_Yadav_Resume.pdf and rewritten for the web.
// The PDF itself is served from public/ for the "Download PDF" button.

export const resumePdf = '/Sushil_Yadav_Resume.pdf'

export const role = 'Software Development Engineer'

export const summary =
  'Software Development Engineer who designs and ships full-stack products, building React frontends, Node.js and Express services, and PostgreSQL data layers secured with role-based access. I integrate AI into these products: private document Q&A powered by RAG and self-hosted LLMs, and computer vision that turns hand gestures into real-time controls.'

export const experience = [
  {
    role: 'SDE',
    company: 'Helios Tech Labs',
    type: 'Full-time',
    period: 'Jul 2026 – Present',
    place: 'Chandigarh, India',
    points: [
      'Build and scale full-stack applications end to end, from React interfaces through Express APIs to PostgreSQL schemas.',
      'Work with cross-functional teams to design, ship and maintain production features, with every fix diagnosed, tested and documented.',
    ],
  },
  {
    role: 'MERN Stack Developer',
    company: 'LBM Solutions Pvt. Ltd.',
    type: 'Internship',
    period: 'Feb 2026 – Jul 2026',
    place: 'Mohali, India',
    points: [
      'Tracked down and fixed defects across the whole stack, from UI to API to database, verifying each fix before release.',
      'Built and maintained REST APIs and React components alongside senior developers, shipping features on schedule.',
      'Kept a shared log of recurring issues and their fixes, so the team could solve repeat problems faster.',
    ],
  },
]

export const projects = [
  {
    name: 'NeuroVault',
    tagline: 'Collaborative AI knowledge base',
    text: 'A privacy-first, multi-tenant knowledge platform that turns PDF, Word (DOC/DOCX), PowerPoint (PPTX), CSV and text files into a queryable knowledge base. A fully local RAG pipeline (Ollama with Phi-3, nomic-embed-text and a vector database) answers with exact document and page citations, in English, Hindi and Punjabi. Built on React, Node.js, Express and PostgreSQL, with admin-approved ingestion, JWT auth and a real-time analytics dashboard.',
    links: [
      { label: 'Live', href: 'https://neurovault-xi.vercel.app' },
      { label: 'Code', href: 'https://github.com/sushilydv-dev/neuro_vault' },
    ],
  },
  {
    name: 'Airglide',
    tagline: 'Gesture-controlled presentations',
    text: 'Run your slides with your hands. Python computer vision and hand tracking turn gestures into low-latency controls, tuned for timing and false detections, with a built-in AI assistant for the talk.',
    links: [
      { label: 'Live', href: 'https://airglide.vercel.app' },
      { label: 'Code', href: 'https://github.com/sushilydv-dev/Airglide' },
    ],
  },
  {
    name: 'TIMS',
    tagline: 'Internship & training management',
    text: 'One platform for admins, trainers and students in place of scattered spreadsheets. React, Node.js, Express and PostgreSQL, with REST APIs, role-based access and a database schema designed from scratch.',
    links: [
      { label: 'Live', href: 'https://tims-rouge.vercel.app' },
      { label: 'Code', href: 'https://github.com/sushilydv-dev/TIMS' },
    ],
  },
]

export const skills = [
  { group: 'Languages', items: ['Python', 'JavaScript', 'SQL'] },
  { group: 'AI & data', items: ['Generative AI', 'Ollama', 'RAG pipelines', 'Vector search', 'Computer vision'] },
  { group: 'Backend', items: ['Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'REST APIs', 'RBAC & auth'] },
  { group: 'Frontend', items: ['React.js', 'Vite'] },
  { group: 'Tools', items: ['Git', 'GitHub', 'Docker', 'Postman', 'VS Code'] },
  { group: 'Practices', items: ['Root-cause debugging', 'Technical writing', 'Cross-team work'] },
]

export const education = [
  { degree: 'Master of Computer Applications', short: 'MCA', school: 'Chitkara University, Punjab', period: '2024 – 2026', score: '9.21' },
  { degree: 'Bachelor of Computer Applications', short: 'BCA', school: 'Chandigarh Group of Colleges, Mohali', period: '2021 – 2024', score: '8.23' },
]

// What the site assistant knows about Sushil. Each entry is one answer:
//   ask:      different ways a visitor might ask it (the more, the better it matches)
//   keywords: words that strongly point to this answer (matched on whole words)
//   answer:   the reply, written by hand, so it is always accurate
//   links:    optional buttons under the reply (site pages or external links)
// To teach it something new, add an entry. To fix a wrong match, add that phrasing to `ask`.
// Keep personal details out: only the public email below, never phone numbers.

const EMAIL = 'hellosushildev@gmail.com'

export const knowledge = [
  /* ---------- small talk ---------- */
  {
    id: 'hello',
    ask: ['hi', 'hello', 'hey', 'hey there', 'good morning', 'good evening', 'yo', 'namaste', 'hello there how are you', 'hi, anyone here?'],
    keywords: ['hi', 'hello', 'hey', 'namaste', 'yo', 'hola'],
    answer: 'Hi! I’m Sushil’s site assistant. Ask me about his work, skills, services or how to get in touch.',
  },
  {
    id: 'thanks',
    ask: ['thanks', 'thank you', 'thanks a lot', 'great, thanks', 'that helps', 'cool thank you', 'awesome', 'nice'],
    keywords: ['thanks', 'thank', 'thx', 'awesome', 'helpful'],
    answer: 'You’re welcome! Anything else you’d like to know about Sushil or his work?',
  },
  {
    id: 'bye',
    ask: ['bye', 'goodbye', 'see you', 'that is all', 'ok bye', 'see ya later'],
    keywords: ['bye', 'goodbye', 'cya'],
    answer: 'Thanks for stopping by! If you have a project in mind, Sushil would love to hear about it.',
    links: [{ label: 'Contact', href: '/contact' }],
  },
  {
    id: 'bot',
    ask: ['who are you', 'are you a bot', 'are you an AI', 'are you real', 'am I talking to Sushil', 'what are you', 'is this ChatGPT', 'how do you work', 'are you human', 'is this a real person'],
    keywords: ['bot', 'chatgpt', 'robot', 'assistant', 'human', 'person'],
    answer: 'I’m a small assistant built into this site. I answer common questions about Sushil from answers he wrote himself, so I won’t make things up. For anything I can’t answer, you can reach him directly.',
    links: [{ label: 'Contact', href: '/contact' }],
  },

  /* ---------- who he is ---------- */
  {
    id: 'who',
    ask: ['who is Sushil', 'tell me about Sushil', 'who are you Sushil', 'introduce yourself', 'what do you do', 'what does he do', 'about him', 'give me a summary of Sushil', 'tell me about yourself'],
    keywords: ['who', 'yourself', 'introduce', 'summary', 'about'],
    answer: 'Sushil Yadav is a Software Development Engineer who takes ideas all the way to production: system design, APIs, data, front end, deployment and release. He builds full-stack web apps, integrations between business systems, and private AI that runs on a company’s own servers.',
    links: [{ label: 'About', href: '/about' }],
  },
  {
    id: 'job',
    ask: ['where does he work', 'where do you work', 'current job', 'what is his current role', 'which company is he at', 'is he employed', 'current position', 'where is he working now'],
    keywords: ['company', 'employer', 'employed', 'job', 'currently', 'helios'],
    answer: 'He’s currently an SDE at Helios Tech Labs in Chandigarh (since July 2026), building and scaling full-stack applications from React interfaces through Express APIs to PostgreSQL.',
    links: [{ label: 'Resume', href: '/resume' }],
  },
  {
    id: 'experience',
    ask: ['what is his experience', 'work experience', 'work history', 'past jobs', 'how many years of experience', 'previous companies', 'career so far', 'did he do an internship', 'internship'],
    keywords: ['experience', 'history', 'career', 'internship', 'intern', 'years', 'previous', 'lbm'],
    answer: 'Sushil is an SDE at Helios Tech Labs, Chandigarh (July 2026 – present). Before that he was a MERN Stack Developer intern at LBM Solutions in Mohali (Feb – Jul 2026), building REST APIs and React components and fixing defects across the whole stack.',
    links: [{ label: 'Resume', href: '/resume' }, { label: 'About', href: '/about' }],
  },
  {
    id: 'education',
    ask: ['what did he study', 'education', 'which college', 'what degree does he have', 'qualifications', 'university', 'did he do MCA', 'academic background'],
    keywords: ['education', 'degree', 'college', 'university', 'study', 'studied', 'mca', 'bca', 'qualification', 'qualifications', 'cgpa'],
    answer: 'He has a Master of Computer Applications from Chitkara University, Punjab (2024 – 2026, CGPA 9.21) and a Bachelor of Computer Applications from Chandigarh Group of Colleges, Mohali (2021 – 2024, CGPA 8.23).',
    links: [{ label: 'Resume', href: '/resume' }],
  },
  {
    id: 'location',
    ask: ['where is he based', 'where are you located', 'which city', 'what country is he in', 'location', 'time zone', 'where does he live', 'does he work remotely', 'remote work'],
    keywords: ['located', 'location', 'based', 'city', 'country', 'india', 'timezone', 'remote', 'remotely', 'chandigarh'],
    answer: 'Sushil is based in Chandigarh, India (IST, UTC+5:30), and works with clients remotely, wherever they are.',
  },

  /* ---------- skills ---------- */
  {
    id: 'skills',
    ask: ['what are his skills', 'what technologies does he use', 'tech stack', 'which languages does he know', 'what tools does he work with', 'what is he good at', 'programming languages', 'frameworks he knows'],
    keywords: ['skills', 'skill', 'stack', 'technologies', 'tech', 'languages', 'tools', 'frameworks', 'toolkit'],
    answer: 'Languages: JavaScript, Python and SQL. Frontend: React, Vite and Tailwind CSS. Backend: Node.js, Express, PostgreSQL, MongoDB and Redis, with REST APIs and role-based auth. AI: RAG pipelines, local LLMs with Ollama, vector search and computer vision. Also Git, Docker and SAP integration.',
    links: [{ label: 'About', href: '/about' }],
  },
  {
    id: 'frontend',
    ask: ['does he know React', 'frontend skills', 'can he build a website', 'UI development', 'does he do web design'],
    keywords: ['react', 'frontend', 'front', 'ui', 'tailwind', 'website', 'websites'],
    answer: 'Yes. He builds front ends in React with Vite and Tailwind CSS, from dashboards and portals to marketing sites like this one, and connects them to his own Node.js APIs.',
    links: [{ label: 'Full-stack web apps', href: '/services/full-stack-web-apps' }],
  },
  {
    id: 'backend',
    ask: ['does he know Node', 'backend skills', 'databases he uses', 'can he build an API', 'does he know PostgreSQL', 'server side', 'which database do you prefer'],
    keywords: ['db', 'dbs', 'node', 'nodejs', 'backend', 'api', 'apis', 'postgresql', 'postgres', 'database', 'databases', 'express', 'mongodb', 'sql'],
    answer: 'Yes. On the backend he uses Node.js and Express with PostgreSQL (and MongoDB or Redis where they fit), designing REST APIs with JWT auth and role-based access, and database schemas from scratch.',
    links: [{ label: 'Full-stack web apps', href: '/services/full-stack-web-apps' }],
  },
  {
    id: 'ai',
    ask: ['does he work with AI', 'AI experience', 'can he build a chatbot', 'machine learning', 'LLM experience', 'RAG', 'private AI', 'can he add AI to my app', 'generative AI'],
    keywords: ['ai', 'llm', 'llms', 'rag', 'chatbot', 'chatbots', 'gpt', 'ml', 'ollama', 'generative', 'agents', 'agent'],
    answer: 'AI is his favourite area. He builds private AI that runs on your own servers: document search and assistants with RAG, self-hosted LLMs through Ollama, cited answers you can verify, and on-device models. NeuroVault is a good example.',
    links: [{ label: 'Private AI & LLMs', href: '/services/private-ai' }, { label: 'NeuroVault', href: '/work/neurovault' }],
  },

  /* ---------- projects ---------- */
  {
    id: 'projects',
    ask: ['what has he built', 'what has Sushil built', 'what has Sushil made', 'show me his projects', 'portfolio', 'best work', 'what projects has he done', 'examples of his work', 'case studies'],
    keywords: ['projects', 'project', 'portfolio', 'built', 'work', 'examples', 'case'],
    answer: 'Highlights: NeuroVault (private AI knowledge base with local RAG), Airglide (control slides with hand gestures), TIMS (training institute platform), plus confidential client work like an SAP ↔ CRM integration, a support & ticketing system and a lead conversion engine.',
    links: [
      { label: 'NeuroVault', href: '/work/neurovault' },
      { label: 'Airglide', href: '/work/airglide' },
      { label: 'TIMS', href: '/work/tims' },
      { label: 'SAP ↔ CRM integration', href: '/work/sap-crm-integration' },
      { label: 'All work', href: '/work' },
    ],
  },
  {
    id: 'neurovault',
    ask: ['tell me about NeuroVault', 'what is NeuroVault', 'what does NeuroVault do', 'NeuroVault project', 'knowledge base project'],
    keywords: ['neurovault', 'neuro', 'vault'],
    answer: 'NeuroVault is a privacy-first knowledge base. Teams upload PDFs, Word files, slides and CSVs, and a fully local RAG pipeline (Ollama with Phi-3) answers questions with exact document and page citations, in English, Hindi and Punjabi. Built with React, Node.js and PostgreSQL.',
    links: [{ label: 'Case study', href: '/work/neurovault' }, { label: 'Live demo', href: 'https://neurovault-xi.vercel.app' }],
  },
  {
    id: 'airglide',
    ask: ['tell me about Airglide', 'what is Airglide', 'gesture project', 'hand tracking app', 'control slides with hands'],
    keywords: ['airglide', 'gesture', 'gestures', 'hand', 'slides', 'presentation'],
    answer: 'Airglide lets you run your slides with your hands. On-device hand tracking turns gestures into controls (next slide, laser pointer, zoom), and a small on-device AI writes talking points for your talk. It’s a desktop app for macOS and Windows, built in Python.',
    links: [{ label: 'Case study', href: '/work/airglide' }, { label: 'Live', href: 'https://airglide.vercel.app' }],
  },
  {
    id: 'tims',
    ask: ['tell me about TIMS', 'what is TIMS', 'training management system', 'internship management project'],
    keywords: ['tims', 'training', 'institute', 'students', 'trainers'],
    answer: 'TIMS is a training and internship management platform with separate portals for admins, trainers and students: courses, batches, assessments, projects and payments in one place. React, Node.js, Express and PostgreSQL with role-based access.',
    links: [{ label: 'Case study', href: '/work/tims' }, { label: 'Live demo', href: 'https://tims-rouge.vercel.app' }],
  },
  {
    id: 'sap',
    ask: ['SAP experience', 'does he know SAP', 'SAP integration project', 'can he integrate SAP with our CRM', 'ERP integration'],
    keywords: ['sap', 'erp', 'crm', 'integration', 'integrations', 'integrate'],
    answer: 'Yes. He designed and built the integration between a multinational company’s private SAP system and its CRM, so business data flows between them automatically instead of being re-entered by hand. The client is confidential.',
    links: [{ label: 'Case study', href: '/work/sap-crm-integration' }, { label: 'Integrations & automation', href: '/services/integrations-automation' }],
  },
  {
    id: 'ticketing',
    ask: ['support ticketing system', 'helpdesk experience', 'customer support platform', 'ticket system project'],
    keywords: ['ticket', 'ticketing', 'helpdesk', 'support', 'sla', 'slas'],
    answer: 'He implemented and rolled out the support and ticketing system for a multinational client: query intake, ticket routing and assignment, SLAs, automations and agent workflows, so every request is tracked from first contact to resolution.',
    links: [{ label: 'Case study', href: '/work/support-ticketing' }],
  },
  {
    id: 'leads',
    ask: ['lead conversion engine', 'turn tickets into leads', 'CRM leads project', 'sales lead tool'],
    keywords: ['lead', 'leads', 'sales', 'conversion'],
    answer: 'The lead conversion engine turns support tickets into qualified CRM leads from just a ticket ID: it pre-fills the customer’s details, looks up live lead owners and shows only the fields each lead stage needs.',
    links: [{ label: 'Case study', href: '/work/lead-conversion-engine' }],
  },

  /* ---------- working together ---------- */
  {
    id: 'hire',
    ask: ['is he available for freelance work', 'can I hire you', 'can I hire Sushil for a project', 'are you taking new projects', 'is he open to work', 'are you available', 'I want to hire a developer', 'can you build something for me', 'I have a project for you', 'work with you', 'I need someone to build my app', 'looking for a developer', 'need a developer for my startup', 'are you free to take a contract', 'do you have time for a new client'],
    keywords: ['hire', 'hiring', 'freelance', 'freelancer', 'available', 'availability', 'open', 'collaborate', 'contract'],
    answer: 'Yes, Sushil is taking on new projects. Tell him a bit about what you want to build through the contact form or by email, and he usually replies within a day.',
    links: [{ label: 'Start a project', href: '/contact' }],
  },
  {
    id: 'services',
    ask: ['what services do you offer', 'what can he build for me', 'what kind of work does he take on', 'services', 'what can you help with', 'what do you offer'],
    keywords: ['services', 'service', 'offer', 'offering', 'help'],
    answer: 'Four kinds of work: full-stack web apps, private AI & LLMs on your own servers, integrations & automation (including SAP and CRMs), and desktop & mobile apps.',
    links: [{ label: 'Services', href: '/services' }],
  },
  {
    id: 'price',
    ask: ['how much does he charge', 'what are your rates', 'pricing', 'cost of a project', 'hourly rate', 'how much for a website', 'budget', 'is it expensive'],
    keywords: ['price', 'pricing', 'cost', 'costs', 'charge', 'rate', 'rates', 'budget', 'quote', 'expensive', 'fees', 'fee'],
    answer: 'Every project gets a custom quote after a short discovery call, once the scope is clear. You get a fixed or milestone-based price up front, so there are no surprises.',
    links: [{ label: 'Get a quote', href: '/contact' }],
  },
  {
    id: 'process',
    ask: ['how does working with you look', 'what is your process', 'how long does a project take', 'timeline', 'how do projects run', 'what happens after launch', 'do you offer support after launch', 'maintenance'],
    keywords: ['process', 'timeline', 'long', 'steps', 'maintenance', 'launch', 'handover', 'support'],
    answer: 'It starts with a short call, then a clear proposal with scope, timeline and quote. During the build you get regular updates and working increments, and at the end a deployment, documentation and handover, with support after launch.',
    links: [{ label: 'How it works', href: '/services' }],
  },
  {
    id: 'contact',
    ask: ['how can I contact him', 'what is his email', 'email address', 'how do I reach Sushil', 'get in touch', 'can I message you', 'contact details', 'whats your email'],
    keywords: ['contact', 'email', 'mail', 'reach', 'touch', 'message', 'gmail'],
    answer: `You can email him at ${EMAIL} or use the contact form. He usually replies within a day.`,
    links: [{ label: 'Contact', href: '/contact' }, { label: 'Email', href: `mailto:${EMAIL}` }],
  },
  {
    id: 'phone',
    ask: ['what is his phone number', 'can I call him', 'whatsapp number', 'mobile number', 'phone'],
    keywords: ['phone', 'call', 'number', 'whatsapp', 'mobile'],
    answer: `The best way to reach Sushil is by email at ${EMAIL} or through the contact form. If a call helps, mention it there and he’ll set one up.`,
    links: [{ label: 'Contact', href: '/contact' }],
  },
  {
    id: 'resume',
    ask: ['can I see his resume', 'download CV', 'resume', 'curriculum vitae', 'resume pdf'],
    keywords: ['resume', 'cv', 'résumé'],
    answer: 'Sure, his resume is on the site, with a PDF you can download.',
    links: [{ label: 'Resume', href: '/resume' }],
  },
  {
    id: 'socials',
    ask: ['github', 'linkedin profile', 'social media', 'where can I see his code', 'is his code public'],
    keywords: ['github', 'linkedin', 'social', 'code', 'twitter', 'repos', 'repositories'],
    answer: 'His code is on GitHub and his professional profile is on LinkedIn.',
    links: [{ label: 'GitHub', href: 'https://github.com/sushilydv-dev' }, { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sushil-yadav-125937279/' }],
  },
  {
    id: 'mobile',
    ask: ['does he build mobile apps', 'can you make an android app', 'iOS app', 'desktop app development', 'cross platform app'],
    keywords: ['mobile', 'android', 'ios', 'desktop', 'app', 'apps', 'windows', 'macos'],
    answer: 'Yes. He builds cross-platform apps for macOS, Windows and phones that feel native and work offline, like Airglide, his gesture-controlled presentation app.',
    links: [{ label: 'Desktop & mobile apps', href: '/services/desktop-mobile-apps' }],
  },
]

// When nothing matches well enough
export const fallback = {
  id: 'fallback',
  answer: `I’m not sure about that one. I only know about Sushil’s work, skills and services. You can ask him directly at ${EMAIL}.`,
  links: [{ label: 'Contact', href: '/contact' }],
}

// Shown as tappable chips when the chat opens
export const suggestions = ['What does Sushil build?', 'Is he available for freelance?', 'Tell me about NeuroVault', 'What’s his tech stack?']

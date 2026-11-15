// What clients can hire me for: the home page's "Work with me" list, the Services page, and each
// service's own page (/services/<slug>).
// `work` is the slug of the main /work example (linked from the Services page); `related` lists
// every /work project shown on the service's page. `deliverables` are listed on both pages.
// `icon` picks a line icon from serviceIcons.jsx. `pitch` words in `accent` are blue.
export const services = [
  {
    slug: 'full-stack-web-apps',
    title: 'Full-stack web apps',
    description: 'Portals, dashboards and internal tools in React and Node, designed, built end to end, deployed and looked after once they are live.',
    example: 'TIMS',
    work: 'tims',
    related: ['tims', 'neurovault'],
    icon: 'layers',
    pitch: { text: 'Web apps your whole team can rely on, from the first screen to the last API call.', accent: ['rely', 'on,'] },
    overview: [
      'I build complete web applications: the interface people use every day, the API behind it and the database that holds it all together. One developer owns the whole stack, so nothing gets lost between teams.',
      'Every app is built for real use from day one, with role-based access, sensible data models, clear error handling and a deployment you can trust. Once it is live, I stay on to fix, improve and extend it.',
    ],
    offerings: [
      { title: 'Portals and dashboards', text: 'Admin panels, customer portals and live dashboards with charts, filters and exports.' },
      { title: 'Internal tools', text: 'Replace spreadsheets and manual steps with a tool shaped around how your team works.' },
      { title: 'Role-based access', text: 'Separate views and permissions for admins, staff and customers, enforced on the server.' },
      { title: 'APIs and data models', text: 'Clean REST APIs and well-designed PostgreSQL schemas that are easy to extend.' },
      { title: 'Payments and notifications', text: 'Online payments, invoices, emails and real-time updates wired in where they are needed.' },
      { title: 'Deployment and care', text: 'Hosting, environments and monitoring set up properly, with support after launch.' },
    ],
    deliverables: ['Production web app, deployed', 'REST API with role-based access', 'Database design and documentation'],
    approach: [
      { title: 'Map the workflows', text: 'Who uses the app, what they need to do and which data moves where.' },
      { title: 'Design the data and API', text: 'The database schema and API endpoints are agreed before the screens are built.' },
      { title: 'Build in increments', text: 'Working features you can click through every week, not a big reveal at the end.' },
      { title: 'Launch and support', text: 'Deployed to production with documentation, then monitored and improved.' },
    ],
    stackGroups: [
      { group: 'Frontend', items: ['React', 'React Router', 'Tailwind CSS', 'Framer Motion', 'Recharts'] },
      { group: 'Backend', items: ['Node.js', 'Express', 'PostgreSQL', 'Sequelize', 'Socket.io'] },
      { group: 'Auth', items: ['JWT + refresh tokens', 'Google sign-in', 'Email OTP', 'RBAC'] },
      { group: 'Services', items: ['Razorpay', 'PDFKit', 'Email delivery'] },
    ],
  },
  {
    slug: 'private-ai',
    title: 'Private AI & LLMs',
    description: 'RAG search, chatbots and agents that run on your own servers, so your documents and data never leave your hands.',
    example: 'NeuroVault',
    work: 'neurovault',
    related: ['neurovault', 'airglide'],
    icon: 'shield',
    pitch: { text: 'AI that knows your business and keeps every document on your own servers.', accent: ['own', 'servers.'] },
    overview: [
      'Most AI tools send your data to someone else’s servers. I build assistants, search and automation on self-hosted models instead, so sensitive documents never leave infrastructure you control.',
      'Answers are grounded in your own files and cite their sources, so your team can check them. Access is controlled per team, and nothing is indexed until it is approved.',
    ],
    offerings: [
      { title: 'Document search (RAG)', text: 'Ask questions across PDFs, Word files, slides and spreadsheets and get answers from your own content.' },
      { title: 'Cited answers', text: 'Every answer names the document and page it came from, so it can be verified.' },
      { title: 'Self-hosted models', text: 'Open models running on your servers or on-device, with no third-party AI APIs.' },
      { title: 'Chatbots and assistants', text: 'Internal helpers for support, onboarding or policy questions, trained on your material.' },
      { title: 'Access control', text: 'Separate workspaces per team, roles, and an approval step before documents are indexed.' },
      { title: 'Multilingual', text: 'Questions and answers in several languages, translated offline.' },
    ],
    deliverables: ['RAG search or assistant over your own documents', 'Self-hosted LLMs, no third-party AI APIs', 'Cited answers your team can verify'],
    approach: [
      { title: 'Audit the data', text: 'Which documents matter, who may see them and what questions people actually ask.' },
      { title: 'Choose the models', text: 'Pick models that fit your hardware, language and accuracy needs.' },
      { title: 'Build the pipeline', text: 'Extraction, chunking, embeddings and retrieval, tuned on real questions.' },
      { title: 'Deploy on your servers', text: 'Installed on your infrastructure with dashboards to watch usage and gaps.' },
    ],
    stackGroups: [
      { group: 'Models', items: ['Ollama', 'Phi-3', 'llama.cpp', 'nomic-embed-text'] },
      { group: 'Retrieval', items: ['LangChain', 'ChromaDB', 'Pinecone', 'Semantic search'] },
      { group: 'App', items: ['React', 'Node.js', 'PostgreSQL', 'Socket.io'] },
      { group: 'Language', items: ['LibreTranslate', 'Offline translation'] },
    ],
  },
  {
    slug: 'integrations-automation',
    title: 'Integrations & automation',
    description: 'SAP and third-party systems wired together, with the repetitive work automated away.',
    example: 'SAP Integration',
    work: 'sap-crm-integration',
    related: ['sap-crm-integration', 'lead-conversion-engine', 'support-ticketing'],
    icon: 'exchange',
    pitch: { text: 'Your systems talking to each other, and your team free from copy and paste.', accent: ['talking', 'free'] },
    overview: [
      'Most businesses already run good tools: an ERP like SAP, a CRM, a helpdesk. The cost is in the gaps between them, where people re-type data and chase updates by hand.',
      'I connect those systems so data flows both ways on its own, with field mapping, validation and logging, and automate the repetitive steps around them. Nothing gets replaced; it just starts working together.',
    ],
    offerings: [
      { title: 'SAP integration', text: 'Two-way sync between SAP and the systems around it, including private, customised SAP setups.' },
      { title: 'CRM and helpdesk', text: 'Leads, contacts, deals and tickets kept in step across your CRM and support tools.' },
      { title: 'Field mapping', text: 'Careful mapping between different data models, with validation so bad data never spreads.' },
      { title: 'Workflow automation', text: 'Approvals, assignments, reminders and status updates that run on their own.' },
      { title: 'Rollout and adoption', text: 'Platforms implemented, configured and rolled out to teams across regions.' },
      { title: 'Logging and alerts', text: 'Every sync is recorded, and failures raise an alert instead of failing silently.' },
    ],
    deliverables: ['Two-way data flow between your systems', 'Field mapping across SAP, CRM and more', 'Repetitive tasks automated end to end'],
    approach: [
      { title: 'Trace the data', text: 'Where each record starts, where it needs to go and who touches it on the way.' },
      { title: 'Map the fields', text: 'Agree how every field translates between systems, including the edge cases.' },
      { title: 'Connect and test', text: 'Build the integration against test systems with real-shaped data.' },
      { title: 'Go live and monitor', text: 'Switch on gradually, with logs and alerts watching every sync.' },
    ],
    stackGroups: [
      { group: 'Systems', items: ['SAP', 'CRM platforms', 'Helpdesk platforms'] },
      { group: 'Integration', items: ['REST APIs', 'Webhooks', 'Data mapping', 'Validation'] },
      { group: 'Automation', items: ['Workflow rules', 'SLAs', 'Scheduled jobs'] },
      { group: 'Code', items: ['Node.js', 'Python', 'JavaScript'] },
    ],
  },
  {
    slug: 'desktop-mobile-apps',
    title: 'Desktop & mobile apps',
    description: 'Cross-platform apps for macOS, Windows and phones that feel native, from gesture control to offline-first tools.',
    example: 'Airglide',
    work: 'airglide',
    related: ['airglide'],
    icon: 'devices',
    pitch: { text: 'Apps that feel at home on every device and keep working offline.', accent: ['every', 'offline.'] },
    overview: [
      'Some products belong on the desktop or in your pocket, not in a browser tab. I build cross-platform apps for macOS, Windows and phones that feel native, start fast and respect the user’s privacy.',
      'From computer vision and on-device AI to tray utilities and offline-first tools, the hard parts run locally, so the app keeps working with no connection and no data leaving the device.',
    ],
    offerings: [
      { title: 'macOS and Windows apps', text: 'One codebase that installs and behaves properly on both platforms.' },
      { title: 'Mobile apps', text: 'Phone apps that share logic with your web or desktop product.' },
      { title: 'Offline-first', text: 'Everything important works without a connection and syncs when one is back.' },
      { title: 'On-device AI', text: 'Small language models and vision running locally, fast and private.' },
      { title: 'Computer vision', text: 'Camera-based features such as hand tracking and gesture control.' },
      { title: 'Installers and updates', text: 'Signed installers, a release pipeline and a smooth update path.' },
    ],
    deliverables: ['Native-feeling app for macOS and Windows', 'Offline-first, private by default', 'Installers and a release pipeline'],
    approach: [
      { title: 'Define the platforms', text: 'Which devices, which permissions and what must work offline.' },
      { title: 'Prototype the core', text: 'The riskiest part, such as tracking or on-device AI, is proven first.' },
      { title: 'Build and polish', text: 'Native-feeling UI, accessibility, keyboard support and performance tuning.' },
      { title: 'Package and ship', text: 'Installers for each platform, release notes and an update path.' },
    ],
    stackGroups: [
      { group: 'App', items: ['Python', 'pywebview', 'React', 'WebView UI'] },
      { group: 'Vision', items: ['MediaPipe', 'OpenCV', 'NumPy'] },
      { group: 'AI (on-device)', items: ['llama.cpp', 'Metal on macOS'] },
      { group: 'System', items: ['PyAutoGUI', 'pynput', 'System tray'] },
    ],
  },
]

export const findService = (slug) => services.find((s) => s.slug === slug)

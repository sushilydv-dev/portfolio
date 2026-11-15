// The Services page (/services): heading, intro, how a project runs, and the FAQ.
// The services themselves come from services.js.

// Big heading, in the same style as the About and Work pages. Words in `accent` are blue.
export const tagline = { text: 'From first idea to production, built to last.', accent: ['production,'] }

export const intro =
  'I work with founders and teams to design, build and ship software that holds up in the real world. Clear scope, steady updates and a clean handover.'

export const process = [
  { title: 'Discovery', text: 'A short call to understand the problem, the users and what success looks like.' },
  { title: 'Proposal', text: 'A clear plan: scope, deliverables, timeline and a quote, before any code is written.' },
  { title: 'Build', text: 'Regular updates and working increments you can try as the product takes shape.' },
  { title: 'Launch & handover', text: 'Deployment, documentation and a walkthrough, so your team can run it with confidence.' },
]

export const faq = [
  {
    q: 'What kind of projects do you take on?',
    a: 'Full-stack web apps, private AI built on your own data, integrations between business systems such as SAP and CRMs, and desktop apps. If it needs a front end, an API and a database working together, it’s a good fit.',
  },
  {
    q: 'How do you price a project?',
    a: 'Every project is quoted after a short discovery call, once the scope is clear. You get a fixed or milestone-based price up front, so there are no surprises.',
  },
  {
    q: 'Where does my data go when you build AI features?',
    a: 'Nowhere you don’t control. I build AI that runs on your own servers with self-hosted models, so your documents and data are never sent to third-party AI services.',
  },
  {
    q: 'Can you work with our existing systems?',
    a: 'Yes. A lot of my work is connecting what you already run, from SAP and CRMs to helpdesks and internal tools, rather than replacing it.',
  },
  {
    q: 'What happens after launch?',
    a: 'You get documentation, a handover walkthrough and a support window after launch. Ongoing maintenance can be arranged too.',
  },
]

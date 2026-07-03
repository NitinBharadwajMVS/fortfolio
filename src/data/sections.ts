import type { SectionId } from '../state/store'

export interface Project {
  title: string
  description: string
  tags: string[]
  link?: string
}

export interface ExperienceItem {
  role: string
  company: string
  period: string
  description: string
}

export interface SectionConfig {
  id: SectionId
  label: string
  color: string
  position: [number, number, number]
  icon: string
}

export const PORTFOLIO_NAME = 'TINTIN'

export const MAP_BOUNDS = {
  minX: -400,
  maxX: 400,
  minZ: -400,
  maxZ: 400,
}

export const BUS_CONFIG = {
  height: 80,
  speed: 120,
  turnSpeed: 1.2,
  forwardDamping: 5,
  turnDamping: 7,
  scale: 1,
  /** Extra Y rotation (radians) if the bus front/back still looks wrong. Try 0 or Math.PI. */
  visualYawCorrection: Math.PI,
}

export const INTERACT_RADIUS = 55

export const sections: SectionConfig[] = [
  {
    id: 'about',
    label: 'Drop Zone',
    color: '#4fc3f7',
    position: [-180, 0, -120],
    icon: '👤',
  },
  {
    id: 'projects',
    label: 'Mission Archive',
    color: '#ffd54f',
    position: [200, 0, -80],
    icon: '🎯',
  },
  {
    id: 'skills',
    label: 'Loadout',
    color: '#81c784',
    position: [-60, 0, 200],
    icon: '⚡',
  },
  {
    id: 'experience',
    label: 'Journey Log',
    color: '#ce93d8',
    position: [140, 0, 160],
    icon: '🏆',
  },
  {
    id: 'contact',
    label: 'Extraction Point',
    color: '#ff8a65',
    position: [-220, 0, 180],
    icon: '📡',
  },
]

export const sectionContent: Record<
  SectionId,
  {
    title: string
    subtitle: string
    body: string
    items?: string[] | Project[] | ExperienceItem[]
  }
> = {
  about: {
    title: 'About Me',
    subtitle: 'Drop Zone',
    body: 'Making you fly a Battle Bus just to read an "About Me" felt like a perfectly reasonable idea.\n\nI\'m Nitin. I enjoy turning random "What if...?" moments into projects that usually become much bigger than planned. Most of them revolve around AI, Machine Learning, Distributed Systems, or simply building something that makes people stop and explore. When I\'m not coding, you\'ll probably find me at a piano, travelling, solving maths problems, or convincing myself that one more game won\'t turn into five.\n\n"Enough about me. Your next POI is waiting... head left."',
  },
  projects: {
    title: 'Projects',
    subtitle: 'Mission Archive',
    body: 'A selection of work spanning interactive 3D, web apps, and creative coding.',
    items: [
      {
        title: 'ACIS-X – Autonomous Credit Intelligence System',
        description: 'Architected an event-driven multi-agent credit intelligence system with self-healing and dynamic discovery mechanisms.',
        tags: ['Python', 'FastAPI', 'Apache Kafka', 'SQLite', 'Machine Learning'],
        link: 'https://github.com/allalg/ACIS-X',
      },
      {
        title: 'MediXpress',
        description: 'Designed MediXpress, a platform that streamlines ambulance-to-hospital communication for faster emergency response and care coordination.',
        tags: ['React', 'Supabase', 'TypeScript'],
        link: 'https://github.com/NitinBharadwajMVS/em-link-med',
      },
      {
        title: 'Vector + Graph RAG System',
        description: 'Retrieved-Augmented Generation (RAG) prototype combining vector embeddings with knowledge graphs to optimize data retrieval accuracy.',
        tags: ['Python', 'Vector DB', 'Knowledge Graphs', 'Machine Learning'],
      },
      {
        title: '2D Survival Game with Unity',
        description: 'Developed a responsive 2D survival game prototype in Unity, implementing custom game loops and resource management mechanics.',
        tags: ['Unity', 'C#'],
        link: 'https://github.com/Kavana917/What-If-',
      },
    ] as Project[],
  },
  skills: {
    title: 'Skills',
    subtitle: 'Loadout',
    body: 'Technologies and tools I use to build products.',
    items: [
      'TypeScript / JavaScript',
      'React / Next.js',
      'Three.js / React Three Fiber',
      'Node.js / Python',
      'GLSL / Shaders',
      'Figma / Blender',
    ],
  },
  experience: {
    title: 'Experience',
    subtitle: 'Journey Log',
    body: 'Professional journey across startups and product teams.',
    items: [
      {
        role: 'Senior Frontend Engineer',
        company: 'Tech Co.',
        period: '2023 — Present',
        description: 'Led 3D product experiences and design system adoption.',
      },
      {
        role: 'Full Stack Developer',
        company: 'Startup Inc.',
        period: '2021 — 2023',
        description: 'Shipped MVP to 50k users; built realtime features.',
      },
    ] as ExperienceItem[],
  },
  contact: {
    title: 'Contact',
    subtitle: 'Extraction Point',
    body: 'Reach out for collaborations, freelance work, or just to talk about 3D on the web.',
    items: ['email@example.com', 'github.com/you', 'linkedin.com/in/you', 'twitter.com/you'],
  },
}

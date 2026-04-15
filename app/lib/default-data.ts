import { ResumeData } from "@/app/types/resume";

/** Completely empty resume — used when creating a new resume from scratch. */
export function createBlankResumeData(): ResumeData {
  return {
    personalDetails: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      address: "",
      photoUrl: "",
    },
    profile: "",
    employmentHistory: [],
    education: [],
    certifications: [],
    links: [],
    skills: [],
    languages: [],
    hobbies: [],
  };
}

/** Fictional sample resume — used for "Load sample" or testing purposes. */
export function createDefaultResumeData(): ResumeData {
  return {
    personalDetails: {
      fullName: "Alex Johnson",
      jobTitle: "Senior Frontend Engineer",
      email: "alex.johnson@example.com",
      phone: "+1 (555) 000-1234",
      address: "San Francisco, CA",
      photoUrl: "",
    },
    profile:
      "Passionate frontend engineer with 8+ years of experience building high-quality user interfaces at scale. Skilled in React, TypeScript, and performance optimization, with a proven track record delivering products used by millions of users worldwide. Strong advocate for accessibility, design systems, and developer experience. Comfortable leading cross-functional teams, running technical interviews, and driving architectural decisions from ideation through production.",
    employmentHistory: [
      {
        id: crypto.randomUUID(),
        jobTitle: "Senior Frontend Engineer",
        employer: "Acme Corp",
        city: "San Francisco",
        startDate: "March 2021",
        endDate: "",
        current: true,
        bullets: [
          "Led a cross-functional team of 6 to rebuild the core analytics dashboard, reducing load time by 40% and cutting error rates by 25%.",
          "Designed and maintained a shared component library in Storybook used across 4 product teams, reducing UI inconsistencies by 60%.",
          "Mentored 3 junior engineers through weekly code reviews, pair-programming sessions, and growth-plan check-ins.",
          "Introduced end-to-end testing with Playwright, achieving 85% coverage on critical user flows.",
          "Drove adoption of React Query for server-state management, eliminating 3,000+ lines of redundant Redux boilerplate.",
        ],
      },
      {
        id: crypto.randomUUID(),
        jobTitle: "Frontend Engineer",
        employer: "Globex Solutions",
        city: "Austin, TX",
        startDate: "January 2019",
        endDate: "February 2021",
        current: false,
        bullets: [
          "Built responsive web applications with React and Next.js serving 500k monthly active users.",
          "Integrated Stripe, Twilio, and internal REST APIs, reducing checkout drop-off by 18%.",
          "Collaborated with UX designers to implement WCAG 2.1 AA-compliant interfaces across the entire product.",
          "Optimised Core Web Vitals scores from 'Poor' to 'Good' on all key landing pages, improving SEO ranking.",
        ],
      },
      {
        id: crypto.randomUUID(),
        jobTitle: "Junior Frontend Developer",
        employer: "Initech Digital",
        city: "Austin, TX",
        startDate: "July 2017",
        endDate: "December 2018",
        current: false,
        bullets: [
          "Maintained and extended a legacy jQuery codebase while progressively migrating to React.",
          "Delivered pixel-perfect implementations of Figma mockups for 10+ client projects.",
          "Reduced average page weight by 35% through image optimisation and lazy-loading strategies.",
        ],
      },
    ],
    education: [
      {
        id: crypto.randomUUID(),
        degree: "B.Sc. Computer Science",
        school: "State University",
        city: "Austin, TX",
        startDate: "September 2014",
        endDate: "June 2018",
        description: "Graduated with honours. Thesis on client-side rendering performance in single-page applications.",
      },
      {
        id: crypto.randomUUID(),
        degree: "Full-Stack Web Development Bootcamp",
        school: "Hack Reactor",
        city: "San Francisco, CA",
        startDate: "January 2017",
        endDate: "April 2017",
        description: "",
      },
    ],
    certifications: [
      {
        id: crypto.randomUUID(),
        name: "AWS Certified Developer – Associate",
        issuer: "Amazon Web Services",
        date: "2023",
      },
      {
        id: crypto.randomUUID(),
        name: "Professional Scrum Master I (PSM I)",
        issuer: "Scrum.org",
        date: "2022",
      },
      {
        id: crypto.randomUUID(),
        name: "Google UX Design Certificate",
        issuer: "Google / Coursera",
        date: "2021",
      },
    ],
    links: [
      { id: crypto.randomUUID(), label: "LinkedIn", url: "https://linkedin.com/in/alexjohnson" },
      { id: crypto.randomUUID(), label: "GitHub", url: "https://github.com/alexjohnson" },
      { id: crypto.randomUUID(), label: "Portfolio", url: "https://alexjohnson.dev" },
    ],
    skills: [
      { id: crypto.randomUUID(), name: "React", level: 95 },
      { id: crypto.randomUUID(), name: "TypeScript", level: 90 },
      { id: crypto.randomUUID(), name: "Next.js", level: 85 },
      { id: crypto.randomUUID(), name: "Node.js", level: 70 },
      { id: crypto.randomUUID(), name: "CSS / Tailwind", level: 80 },
      { id: crypto.randomUUID(), name: "GraphQL", level: 75 },
      { id: crypto.randomUUID(), name: "REST APIs", level: 90 },
      { id: crypto.randomUUID(), name: "Docker", level: 60 },
      { id: crypto.randomUUID(), name: "Jest / Testing Library", level: 82 },
      { id: crypto.randomUUID(), name: "Playwright / Cypress", level: 78 },
      { id: crypto.randomUUID(), name: "Git / GitHub Actions", level: 92 },
      { id: crypto.randomUUID(), name: "Figma", level: 70 },
    ],
    languages: [
      { id: crypto.randomUUID(), name: "English", level: 100 },
      { id: crypto.randomUUID(), name: "Spanish", level: 60 },
      { id: crypto.randomUUID(), name: "French", level: 30 },
    ],
    hobbies: ["Hiking", "Open Source", "Photography", "Reading", "Board Games", "Coffee Brewing"],
  };
}

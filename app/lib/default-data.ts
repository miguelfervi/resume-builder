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
      "Passionate frontend engineer with 8+ years of experience building high-quality user interfaces. Skilled in React, TypeScript, and performance optimization, with a proven track record delivering scalable products used by millions.",
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
          "Led a cross-functional team to rebuild the core dashboard, reducing load time by 40%.",
          "Introduced component library with Storybook, improving design-dev handoff.",
          "Mentored 3 junior engineers, conducting weekly code reviews and pair-programming sessions.",
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
          "Built responsive web applications using React and Next.js.",
          "Integrated third-party APIs and improved data-fetching performance.",
          "Collaborated with UX designers to implement accessible, WCAG-compliant interfaces.",
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
    ],
    links: [
      { id: crypto.randomUUID(), label: "LinkedIn", url: "https://linkedin.com/in/alexjohnson" },
      { id: crypto.randomUUID(), label: "GitHub", url: "https://github.com/alexjohnson" },
    ],
    skills: [
      { id: crypto.randomUUID(), name: "React", level: 95 },
      { id: crypto.randomUUID(), name: "TypeScript", level: 90 },
      { id: crypto.randomUUID(), name: "Next.js", level: 85 },
      { id: crypto.randomUUID(), name: "Node.js", level: 70 },
      { id: crypto.randomUUID(), name: "CSS / Tailwind", level: 80 },
    ],
    languages: [
      { id: crypto.randomUUID(), name: "English", level: 100 },
      { id: crypto.randomUUID(), name: "Spanish", level: 60 },
    ],
    hobbies: ["Hiking", "Open Source", "Photography", "Reading"],
  };
}

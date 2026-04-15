import { ResumeData } from "@/app/types/resume";

export function createDefaultResumeData(): ResumeData {
  return {
    personalDetails: {
      fullName: "Miguel Fernandez Villegas",
      jobTitle: "Senior Front-End Engineer",
      email: "miguelfervi@gmail.com",
      phone: "+34.639058401",
      address: "Granada, Spain",
      photoUrl: "",
    },
    profile:
      "Dynamic Frontend Engineer with 9 years of experience, committed to creating high-quality user interfaces that significantly enhance user experiences. Proficient in Vue and React, with a strong focus on performance optimization to ensure applications are both scalable and responsive. A collaborative approach fosters seamless communication with cross-functional teams, driving projects to successful completion through agile methodologies. With a solid foundation in leadership and project management, the ability to navigate complex challenges and deliver innovative solutions is consistently demonstrated.",
    employmentHistory: [
      {
        id: crypto.randomUUID(),
        jobTitle: "Senior Front end Engineer",
        employer: "Docplanner",
        city: "Barcelona",
        startDate: "January 2022",
        endDate: "",
        current: true,
        bullets: [
          "Develop high-quality applications using Vue 2 and Vue 3 frameworks.",
          "Implement responsive designs to enhance user experience across devices.",
          "Collaborate with cross-functional teams to define and refine project requirements.",
          "Optimize application performance and ensure scalability in production environments.",
          "Develop solutions in mobile applications using React Native.",
        ],
      },
      {
        id: crypto.randomUUID(),
        jobTitle: "Front end Engineer",
        employer: "LeadTech Group",
        city: "Barcelona",
        startDate: "December 2020",
        endDate: "December 2021",
        current: false,
        bullets: [
          "Developed responsive user interfaces using Gatsby, enhancing user experience and performance.",
          "Collaborated with designers to implement modern web design principles.",
          "Optimized web applications for maximum speed and scalability.",
          "Integrated RESTful APIs to facilitate dynamic content updates.",
          "Conducted code reviews to ensure best practices and code quality.",
        ],
      },
      {
        id: crypto.randomUUID(),
        jobTitle: "Software Engineer",
        employer: "Financial Force",
        city: "Granada",
        startDate: "July 2019",
        endDate: "December 2020",
        current: false,
        bullets: [
          "Developed innovative features for Salesforce products using APEX and LWC.",
          "Maintained and enhanced existing functionalities to improve user experience.",
          "Collaborated with cross-functional teams to gather requirements and implement solutions.",
          "Implemented automated testing to increase code reliability and efficiency.",
        ],
      },
      {
        id: crypto.randomUUID(),
        jobTitle: "Software Engineer",
        employer: "PC Componentes",
        city: "Granada",
        startDate: "September 2018",
        endDate: "June 2019",
        current: false,
        bullets: [
          "Developed internal tools and enhanced website features using React, JavaScript, and Node.",
          "Collaborated with cross-functional teams to define and implement technical requirements.",
          "Participated in agile development processes to deliver projects on time.",
        ],
      },
    ],
    skills: [
      { id: crypto.randomUUID(), name: "Vue", level: 95 },
      { id: crypto.randomUUID(), name: "React", level: 85 },
      { id: crypto.randomUUID(), name: "Node", level: 70 },
      { id: crypto.randomUUID(), name: "Typescript", level: 80 },
      { id: crypto.randomUUID(), name: "Git", level: 85 },
      { id: crypto.randomUUID(), name: "Scrum", level: 80 },
      { id: crypto.randomUUID(), name: "Kanban", level: 75 },
      { id: crypto.randomUUID(), name: "Jira", level: 75 },
      { id: crypto.randomUUID(), name: "People Management", level: 65 },
      { id: crypto.randomUUID(), name: "Leadership", level: 70 },
    ],
    languages: [
      { id: crypto.randomUUID(), name: "English", level: 80 },
      { id: crypto.randomUUID(), name: "Spanish", level: 100 },
    ],
    hobbies: ["Sports", "Music", "Videogames", "Traveling"],
  };
}

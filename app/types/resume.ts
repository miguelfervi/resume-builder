export interface PersonalDetails {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  photoUrl: string;
}

export interface EmploymentEntry {
  id: string;
  jobTitle: string;
  employer: string;
  city: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  degree: string;
  school: string;
  city: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface LinkEntry {
  id: string;
  label: string;
  url: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
}

export interface Language {
  id: string;
  name: string;
  level: number;
}

export interface ResumeData {
  personalDetails: PersonalDetails;
  profile: string;
  employmentHistory: EmploymentEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  links: LinkEntry[];
  skills: Skill[];
  languages: Language[];
  hobbies: string[];
}

// Multi-CV
export interface SavedResume {
  id: string;
  name: string;
  templateId: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  activeResumeId: string;
  resumes: SavedResume[];
}

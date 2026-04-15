export interface TemplateConfig {
  id: string;
  name: string;
  sidebarColor: string;
  sidebarTextColor: string;
  accentColor: string;
  layout: "sidebar-right" | "sidebar-left" | "single-column";
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "classic",
    name: "Classic",
    sidebarColor: "#1e3a5f",
    sidebarTextColor: "#ffffff",
    accentColor: "#3b82f6",
    layout: "sidebar-right",
  },
  {
    id: "modern",
    name: "Modern",
    sidebarColor: "#0d9488",
    sidebarTextColor: "#ffffff",
    accentColor: "#0d9488",
    layout: "sidebar-left",
  },
  {
    id: "minimal",
    name: "Minimal",
    sidebarColor: "#1f2937",
    sidebarTextColor: "#ffffff",
    accentColor: "#1f2937",
    layout: "single-column",
  },
];

export function getTemplate(id: string): TemplateConfig {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

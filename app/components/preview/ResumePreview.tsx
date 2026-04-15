"use client";

import { ResumeData } from "@/app/types/resume";
import { getTemplate, TemplateConfig } from "@/app/lib/templates";

interface Props {
  data: ResumeData;
  templateId?: string;
}

// A4 height in px at 96 dpi — keeps sidebar filling the page
const A4_H = 1123;

function ProgressBar({ level, color }: { level: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full mt-1" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
      <div className="h-1.5 rounded-full" style={{ width: `${level}%`, backgroundColor: color }} />
    </div>
  );
}

function SidebarSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-[9px] font-bold tracking-[1.5px] uppercase mb-2" style={{ color }}>{title}</div>
      {children}
    </div>
  );
}

function Sidebar({ data, t }: { data: ResumeData; t: TemplateConfig }) {
  const { personalDetails, skills, languages, hobbies, links } = data;
  const bg = t.sidebarColor;
  const text = t.sidebarTextColor;
  const dim = "rgba(255,255,255,0.75)";
  const barFill = t.id === "modern" ? "#99f6e4" : "#ffffff";

  return (
    <div
      className="flex-shrink-0 self-stretch flex flex-col"
      style={{ width: 170, backgroundColor: bg, padding: 20, color: text }}
    >
      {/* Name + photo shown in sidebar for sidebar-left (Modern) template */}
      {t.layout === "sidebar-left" && (
        <div className="flex flex-col items-center mb-5">
          {personalDetails.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={personalDetails.photoUrl}
              alt=""
              className="w-[72px] h-[72px] rounded-full object-cover mb-2.5"
            />
          ) : (
            <div
              className="w-[72px] h-[72px] rounded-full mb-2.5 flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              {personalDetails.fullName.charAt(0)}
            </div>
          )}
          <div className="text-base font-bold text-center leading-snug">{personalDetails.fullName}</div>
          <div className="text-[8px] tracking-[1.5px] uppercase mt-1 text-center opacity-70">
            {personalDetails.jobTitle}
          </div>
        </div>
      )}

      <SidebarSection title="Details" color={text}>
        {personalDetails.address && (
          <div className="text-[9px] leading-relaxed mb-0.5" style={{ color: dim }}>{personalDetails.address}</div>
        )}
        {personalDetails.phone && (
          <div className="text-[9px] leading-relaxed mb-0.5" style={{ color: dim }}>{personalDetails.phone}</div>
        )}
        {personalDetails.email && (
          <div className="text-[9px] leading-relaxed mb-0.5 break-all" style={{ color: dim }}>{personalDetails.email}</div>
        )}
      </SidebarSection>

      {links.length > 0 && (
        <SidebarSection title="Links" color={text}>
          {links.map((l) => (
            <div key={l.id} className="mb-1">
              <div className="text-[9px] font-semibold" style={{ color: text }}>{l.label}</div>
              <div className="text-[8px] break-all" style={{ color: dim }}>{l.url}</div>
            </div>
          ))}
        </SidebarSection>
      )}

      {skills.length > 0 && (
        <SidebarSection title="Skills" color={text}>
          {skills.map((s) => (
            <div key={s.id} className="mb-1.5">
              <div className="text-[9px]" style={{ color: text }}>{s.name}</div>
              <ProgressBar level={s.level} color={barFill} />
            </div>
          ))}
        </SidebarSection>
      )}

      {languages.length > 0 && (
        <SidebarSection title="Languages" color={text}>
          {languages.map((l) => (
            <div key={l.id} className="mb-1.5">
              <div className="text-[9px]" style={{ color: text }}>{l.name}</div>
              <ProgressBar level={l.level} color={barFill} />
            </div>
          ))}
        </SidebarSection>
      )}

      {hobbies.length > 0 && (
        <SidebarSection title="Hobbies" color={text}>
          <div className="text-[9px] leading-relaxed" style={{ color: dim }}>{hobbies.join(", ")}</div>
        </SidebarSection>
      )}
    </div>
  );
}

function SectionTitle({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div className="text-[13px] font-bold border-b pb-1 mb-3 border-gray-200" style={{ color }}>
      {children}
    </div>
  );
}

function MainContent({ data, t }: { data: ResumeData; t: TemplateConfig }) {
  const { personalDetails, profile, employmentHistory, education, certifications } = data;
  const isMinimal = t.layout === "single-column";
  const headingColor = isMinimal ? t.accentColor : "#111827";

  return (
    <div className="flex-1 min-w-0 p-8">
      {/* Header with photo+name: only for sidebar-right (Classic). sidebar-left shows it in the Sidebar. */}
      {t.layout === "sidebar-right" && (
        <div className="flex items-center gap-4 mb-6">
          {personalDetails.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={personalDetails.photoUrl}
              alt="Profile"
              className="w-[72px] h-[72px] rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-[72px] h-[72px] rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-2xl text-gray-500 font-bold">
              {personalDetails.fullName.charAt(0)}
            </div>
          )}
          <div>
            <div className="text-[22px] font-bold text-gray-900 leading-tight">
              {personalDetails.fullName || "Your Name"}
            </div>
            <div className="text-[10px] tracking-[2px] text-gray-400 uppercase mt-1">
              {personalDetails.jobTitle}
            </div>
          </div>
        </div>
      )}

      {profile && (
        <div className="mb-5">
          <SectionTitle color={headingColor}>Profile</SectionTitle>
          <div className="text-[10px] text-gray-500 leading-[1.7]">{profile}</div>
        </div>
      )}

      {employmentHistory.length > 0 && (
        <div className="mb-5">
          <SectionTitle color={headingColor}>Employment History</SectionTitle>
          {employmentHistory.map((entry) => (
            <div key={entry.id} className="mb-3.5">
              <div className="text-[10.5px] font-bold text-gray-900">
                {[entry.jobTitle, entry.employer, entry.city].filter(Boolean).join(", ")}
              </div>
              <div className="text-[8.5px] text-gray-400 uppercase tracking-[0.5px] mt-0.5 mb-1.5">
                {entry.startDate}{entry.startDate && " — "}{entry.current ? "Present" : entry.endDate}
              </div>
              {entry.bullets.map((b, i) => (
                <div key={i} className="flex gap-1.5 mb-0.5">
                  <span className="text-[10px] text-gray-400 flex-shrink-0">•</span>
                  <span className="text-[10px] text-gray-500 leading-relaxed">{b}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="mb-5">
          <SectionTitle color={headingColor}>Education</SectionTitle>
          {education.map((entry) => (
            <div key={entry.id} className="mb-2.5">
              <div className="text-[10.5px] font-bold text-gray-900">
                {[entry.degree, entry.school, entry.city].filter(Boolean).join(", ")}
              </div>
              <div className="text-[8.5px] text-gray-400 uppercase tracking-[0.5px] mt-0.5 mb-1">
                {entry.startDate}{entry.startDate && " — "}{entry.endDate}
              </div>
              {entry.description && (
                <div className="text-[10px] text-gray-500 leading-relaxed">{entry.description}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div className="mb-5">
          <SectionTitle color={headingColor}>Certifications</SectionTitle>
          {certifications.map((c) => (
            <div key={c.id} className="flex justify-between items-baseline mb-1.5">
              <div>
                <span className="text-[10.5px] font-bold text-gray-900">{c.name}</span>
                {c.issuer && <span className="text-[10px] text-gray-400"> · {c.issuer}</span>}
              </div>
              {c.date && <span className="text-[9px] text-gray-400">{c.date}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MinimalLayout({ data, t }: { data: ResumeData; t: TemplateConfig }) {
  const { personalDetails, skills, languages, hobbies, links } = data;
  const accent = t.accentColor;

  return (
    <div className="p-10 bg-white" style={{ minHeight: A4_H }}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6" style={{ borderBottom: `3px solid ${accent}` }}>
        <div className="flex items-center gap-4">
          {personalDetails.photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={personalDetails.photoUrl} alt="" className="w-[72px] h-[72px] rounded-full object-cover" />
          )}
          <div>
            <div className="text-2xl font-bold text-gray-900">{personalDetails.fullName}</div>
            <div className="text-[11px] uppercase tracking-[2px] mt-1" style={{ color: accent }}>
              {personalDetails.jobTitle}
            </div>
          </div>
        </div>
        <div className="text-right">
          {personalDetails.email && <div className="text-[9px] text-gray-400">{personalDetails.email}</div>}
          {personalDetails.phone && <div className="text-[9px] text-gray-400">{personalDetails.phone}</div>}
          {personalDetails.address && <div className="text-[9px] text-gray-400">{personalDetails.address}</div>}
          {links.map((l) => (
            <div key={l.id} className="text-[9px] text-gray-400">{l.label}: {l.url}</div>
          ))}
        </div>
      </div>

      <MainContent data={data} t={t} />

      {/* Skills — 2 columnas para no desbordar verticalmente */}
      {skills.length > 0 && (
        <div className="mt-2 mb-5">
          <div className="text-[13px] font-bold border-b border-gray-200 pb-1 mb-2.5" style={{ color: accent }}>
            Skills
          </div>
          <div className="grid grid-cols-2 gap-x-8">
            {skills.map((s) => (
              <div key={s.id} className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] text-gray-700">{s.name}</span>
                <div className="w-20 h-1 bg-gray-200 rounded-full">
                  <div className="h-1 rounded-full" style={{ backgroundColor: accent, width: `${s.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages + Hobbies en dos columnas */}
      {(languages.length > 0 || hobbies.length > 0) && (
        <div className="flex gap-8 mt-2">
          {languages.length > 0 && (
            <div className="flex-1">
              <div className="text-[13px] font-bold border-b border-gray-200 pb-1 mb-2.5" style={{ color: accent }}>
                Languages
              </div>
              {languages.map((l) => (
                <div key={l.id} className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] text-gray-700">{l.name}</span>
                  <div className="w-20 h-1 bg-gray-200 rounded-full">
                    <div className="h-1 rounded-full" style={{ backgroundColor: accent, width: `${l.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          {hobbies.length > 0 && (
            <div className="flex-1">
              <div className="text-[13px] font-bold border-b border-gray-200 pb-1 mb-2" style={{ color: accent }}>
                Hobbies
              </div>
              <div className="text-[10px] text-gray-500">{hobbies.join(", ")}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ResumePreview({ data, templateId = "classic" }: Props) {
  const t = getTemplate(templateId);

  if (t.layout === "single-column") {
    return (
      <div className="w-full bg-white" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <MinimalLayout data={data} t={t} />
      </div>
    );
  }

  const sidebar = <Sidebar data={data} t={t} />;
  const main = <MainContent data={data} t={t} />;

  return (
    <div
      className="w-full flex items-stretch bg-white"
      style={{ fontFamily: "Arial, Helvetica, sans-serif", minHeight: A4_H }}
    >
      {t.layout === "sidebar-left" ? <>{sidebar}{main}</> : <>{main}{sidebar}</>}
    </div>
  );
}

"use client";

import { ResumeData, Skill } from "@/app/types/resume";
import { getTemplate, TemplateConfig } from "@/app/lib/templates";

function groupSkills(skills: Skill[]): [string, Skill[]][] {
  const map = new Map<string, Skill[]>();
  for (const s of skills) {
    const cat = s.category?.trim() || "";
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(s);
  }
  return Array.from(map.entries());
}

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
          {groupSkills(skills).map(([cat, items]) => (
            <div key={cat}>
              {cat && (
                <div className="text-[7.5px] font-bold uppercase tracking-[1px] mb-1 mt-2 first:mt-0" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {cat}
                </div>
              )}
              {items.map((s) => (
                <div key={s.id} className="mb-1.5">
                  <div className="text-[9px]" style={{ color: text }}>{s.name}</div>
                  <ProgressBar level={s.level} color={barFill} />
                </div>
              ))}
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

      {/* Skills — grouped by category, 2 columns */}
      {skills.length > 0 && (
        <div className="mt-2 mb-5">
          <div className="text-[13px] font-bold border-b border-gray-200 pb-1 mb-2.5" style={{ color: accent }}>
            Skills
          </div>
          <div className="grid grid-cols-2 gap-x-8">
            {groupSkills(skills).map(([cat, items]) => (
              <div key={cat} className="col-span-2">
                {cat && (
                  <div className="text-[8px] font-bold uppercase tracking-[1px] mb-1 mt-2 first:mt-0 text-gray-400">{cat}</div>
                )}
                <div className="grid grid-cols-2 gap-x-8">
                  {items.map((s) => (
                    <div key={s.id} className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] text-gray-700">{s.name}</span>
                      <div className="w-20 h-1 bg-gray-200 rounded-full">
                        <div className="h-1 rounded-full" style={{ backgroundColor: accent, width: `${s.level}%` }} />
                      </div>
                    </div>
                  ))}
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

function AtsLayout({ data }: { data: ResumeData }) {
  const { personalDetails, profile, employmentHistory, education, certifications, skills, languages, hobbies, links } = data;

  const contact = [
    personalDetails.phone,
    personalDetails.email,
    personalDetails.address,
    ...links.map((l) => l.url),
  ].filter(Boolean).join("  |  ");

  const skillsByCategory = groupSkills(skills);

  return (
    <div className="p-10 bg-white" style={{ fontFamily: "Arial, Helvetica, sans-serif", color: "#000" }}>
      {/* Header */}
      <div className="mb-4">
        <div style={{ fontSize: 22, fontWeight: 700, color: "#000" }}>{personalDetails.fullName}</div>
        {personalDetails.jobTitle && (
          <div style={{ fontSize: 12, fontWeight: 600, color: "#000", marginTop: 2 }}>{personalDetails.jobTitle}</div>
        )}
        {contact && (
          <div style={{ fontSize: 9, color: "#000", marginTop: 4 }}>{contact}</div>
        )}
      </div>

      {/* Summary */}
      {profile && (
        <div className="mb-4">
          <div style={{ fontSize: 11, fontWeight: 700, borderBottom: "1.5px solid #000", paddingBottom: 2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Summary</div>
          <div style={{ fontSize: 10, lineHeight: 1.6 }}>{profile}</div>
        </div>
      )}

      {/* Experience */}
      {employmentHistory.length > 0 && (
        <div className="mb-4">
          <div style={{ fontSize: 11, fontWeight: 700, borderBottom: "1.5px solid #000", paddingBottom: 2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Experience</div>
          {employmentHistory.map((e) => (
            <div key={e.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span style={{ fontSize: 10, fontWeight: 700 }}>{e.jobTitle}{e.employer ? `, ${e.employer}` : ""}{e.city ? ` — ${e.city}` : ""}</span>
                <span style={{ fontSize: 9, color: "#333" }}>{e.startDate}{e.startDate ? " – " : ""}{e.current ? "Present" : e.endDate}</span>
              </div>
              {e.bullets.map((b, i) => (
                <div key={i} className="flex gap-2 mt-0.5">
                  <span style={{ fontSize: 10 }}>•</span>
                  <span style={{ fontSize: 10, lineHeight: 1.6 }}>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <div style={{ fontSize: 11, fontWeight: 700, borderBottom: "1.5px solid #000", paddingBottom: 2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Skills</div>
          {skillsByCategory.map(([cat, items]) => (
            <div key={cat} style={{ fontSize: 10, lineHeight: 1.8 }}>
              {cat
                ? <><span style={{ fontWeight: 700 }}>{cat}:</span>{" "}{items.map((s) => s.name).join(", ")}</>
                : items.map((s) => s.name).join(", ")
              }
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <div style={{ fontSize: 11, fontWeight: 700, borderBottom: "1.5px solid #000", paddingBottom: 2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Education</div>
          {education.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span style={{ fontSize: 10, fontWeight: 700 }}>{e.degree}{e.school ? `, ${e.school}` : ""}{e.city ? ` — ${e.city}` : ""}</span>
                <span style={{ fontSize: 9, color: "#333" }}>{e.startDate}{e.startDate ? " – " : ""}{e.endDate}</span>
              </div>
              {e.description && <div style={{ fontSize: 10, lineHeight: 1.6 }}>{e.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mb-4">
          <div style={{ fontSize: 11, fontWeight: 700, borderBottom: "1.5px solid #000", paddingBottom: 2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Certifications</div>
          {certifications.map((c) => (
            <div key={c.id} className="flex justify-between items-baseline mb-1">
              <span style={{ fontSize: 10 }}>{c.name}{c.issuer ? ` · ${c.issuer}` : ""}</span>
              {c.date && <span style={{ fontSize: 9, color: "#333" }}>{c.date}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Languages & Hobbies */}
      {(languages.length > 0 || hobbies.length > 0) && (
        <div className="mb-4">
          <div style={{ fontSize: 11, fontWeight: 700, borderBottom: "1.5px solid #000", paddingBottom: 2, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Additional</div>
          {languages.length > 0 && (
            <div style={{ fontSize: 10, lineHeight: 1.8 }}>
              <span style={{ fontWeight: 700 }}>Languages:</span>{" "}{languages.map((l) => l.name).join(", ")}
            </div>
          )}
          {hobbies.length > 0 && (
            <div style={{ fontSize: 10, lineHeight: 1.8 }}>
              <span style={{ fontWeight: 700 }}>Interests:</span>{" "}{hobbies.join(", ")}
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

  if (t.layout === "ats") {
    return (
      <div className="w-full bg-white" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
        <AtsLayout data={data} />
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

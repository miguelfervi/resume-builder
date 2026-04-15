"use client";

import { ResumeData } from "@/app/types/resume";
import { getTemplate, TemplateConfig } from "@/app/lib/templates";

interface Props {
  data: ResumeData;
  templateId?: string;
}

function ProgressBar({ level, color }: { level: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full mt-1" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
      <div className="h-1.5 rounded-full" style={{ width: `${level}%`, backgroundColor: color }} />
    </div>
  );
}

function MainContent({ data, t }: { data: ResumeData; t: TemplateConfig }) {
  const { personalDetails, profile, employmentHistory, education, certifications } = data;
  const borderColor = t.layout === "single-column" ? "#e5e7eb" : "#e2e8f0";
  const headingStyle = { color: t.layout === "single-column" ? t.accentColor : "#111827" };

  return (
    <div style={{ flex: 2, padding: 32, minWidth: 0 }}>
      {/* Header (only for sidebar layouts) */}
      {t.layout !== "single-column" && (
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          {personalDetails.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={personalDetails.photoUrl} alt="Profile"
              style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
          ) : (
            <div style={{ width: 72, height: 72, borderRadius: "50%", backgroundColor: "#d1d5db", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#6b7280", fontWeight: 700 }}>
              {personalDetails.fullName.charAt(0)}
            </div>
          )}
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
              {personalDetails.fullName || "Your Name"}
            </div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#6b7280", textTransform: "uppercase", marginTop: 4 }}>
              {personalDetails.jobTitle}
            </div>
          </div>
        </div>
      )}

      {/* Profile */}
      {profile && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, borderBottom: `1px solid ${borderColor}`, paddingBottom: 4, marginBottom: 8, ...headingStyle }}>
            Profile
          </div>
          <div style={{ fontSize: 10, color: "#4b5563", lineHeight: 1.7 }}>{profile}</div>
        </div>
      )}

      {/* Employment */}
      {employmentHistory.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, borderBottom: `1px solid ${borderColor}`, paddingBottom: 4, marginBottom: 12, ...headingStyle }}>
            Employment History
          </div>
          {employmentHistory.map((entry) => (
            <div key={entry.id} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#111827" }}>
                {[entry.jobTitle, entry.employer, entry.city].filter(Boolean).join(", ")}
              </div>
              <div style={{ fontSize: 8.5, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2, marginBottom: 6 }}>
                {entry.startDate}{entry.startDate && " — "}{entry.current ? "Present" : entry.endDate}
              </div>
              {entry.bullets.map((b, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: "#6b7280", flexShrink: 0 }}>•</span>
                  <span style={{ fontSize: 10, color: "#4b5563", lineHeight: 1.6 }}>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, borderBottom: `1px solid ${borderColor}`, paddingBottom: 4, marginBottom: 12, ...headingStyle }}>
            Education
          </div>
          {education.map((entry) => (
            <div key={entry.id} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "#111827" }}>
                {[entry.degree, entry.school, entry.city].filter(Boolean).join(", ")}
              </div>
              <div style={{ fontSize: 8.5, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2, marginBottom: 4 }}>
                {entry.startDate}{entry.startDate && " — "}{entry.endDate}
              </div>
              {entry.description && (
                <div style={{ fontSize: 10, color: "#4b5563", lineHeight: 1.6 }}>{entry.description}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, borderBottom: `1px solid ${borderColor}`, paddingBottom: 4, marginBottom: 10, ...headingStyle }}>
            Certifications
          </div>
          {certifications.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#111827" }}>{c.name}</span>
                {c.issuer && <span style={{ fontSize: 10, color: "#6b7280" }}> · {c.issuer}</span>}
              </div>
              {c.date && <span style={{ fontSize: 9, color: "#9ca3af" }}>{c.date}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Sidebar({ data, t }: { data: ResumeData; t: TemplateConfig }) {
  const { personalDetails, skills, languages, hobbies, links } = data;
  const bg = t.sidebarColor;
  const text = t.sidebarTextColor;
  const dimText = "rgba(255,255,255,0.75)";
  const barFill = t.id === "modern" ? "#99f6e4" : "#ffffff";

  return (
    <div style={{ width: 170, flexShrink: 0, backgroundColor: bg, padding: 20, color: text }}>
      {/* Photo for single-column / sidebar-left */}
      {(t.layout === "sidebar-left" || t.layout === "single-column") && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
          {personalDetails.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={personalDetails.photoUrl} alt="" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", marginBottom: 10 }} />
          ) : (
            <div style={{ width: 72, height: 72, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", marginBottom: 10,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700 }}>
              {personalDetails.fullName.charAt(0)}
            </div>
          )}
          <div style={{ fontSize: 16, fontWeight: 700, textAlign: "center", lineHeight: 1.3 }}>{personalDetails.fullName}</div>
          <div style={{ fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.7, marginTop: 4, textAlign: "center" }}>
            {personalDetails.jobTitle}
          </div>
        </div>
      )}

      <SidebarSection title="Details" color={text}>
        {personalDetails.address && <SidebarText color={dimText}>{personalDetails.address}</SidebarText>}
        {personalDetails.phone && <SidebarText color={dimText}>{personalDetails.phone}</SidebarText>}
        {personalDetails.email && <SidebarText color={dimText} style={{ wordBreak: "break-all" }}>{personalDetails.email}</SidebarText>}
      </SidebarSection>

      {links.length > 0 && (
        <SidebarSection title="Links" color={text}>
          {links.map((l) => (
            <div key={l.id} style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 8.5, color: text, fontWeight: 600 }}>{l.label}</div>
              <div style={{ fontSize: 8, color: dimText, wordBreak: "break-all" }}>{l.url}</div>
            </div>
          ))}
        </SidebarSection>
      )}

      {skills.length > 0 && (
        <SidebarSection title="Skills" color={text}>
          {skills.map((s) => (
            <div key={s.id} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 9, color: text }}>{s.name}</div>
              <ProgressBar level={s.level} color={barFill} />
            </div>
          ))}
        </SidebarSection>
      )}

      {languages.length > 0 && (
        <SidebarSection title="Languages" color={text}>
          {languages.map((l) => (
            <div key={l.id} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 9, color: text }}>{l.name}</div>
              <ProgressBar level={l.level} color={barFill} />
            </div>
          ))}
        </SidebarSection>
      )}

      {hobbies.length > 0 && (
        <SidebarSection title="Hobbies" color={text}>
          <SidebarText color={dimText}>{hobbies.join(", ")}</SidebarText>
        </SidebarSection>
      )}
    </div>
  );
}

function SidebarSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color, marginBottom: 8 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function SidebarText({ color, children, style }: { color: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ fontSize: 9, color, lineHeight: 1.6, marginBottom: 3, ...style }}>{children}</div>;
}

function MinimalLayout({ data, t }: { data: ResumeData; t: TemplateConfig }) {
  const { personalDetails, skills, languages, hobbies, links } = data;
  const accent = t.accentColor;

  return (
    <div style={{ padding: 40, minHeight: "100%", backgroundColor: "#ffffff" }}>
      {/* Header */}
      <div style={{ borderBottom: `3px solid ${accent}`, paddingBottom: 16, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {personalDetails.photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={personalDetails.photoUrl} alt="" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover" }} />
          )}
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#111827" }}>{personalDetails.fullName}</div>
            <div style={{ fontSize: 11, color: accent, textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>{personalDetails.jobTitle}</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            {personalDetails.email && <div style={{ fontSize: 9, color: "#6b7280" }}>{personalDetails.email}</div>}
            {personalDetails.phone && <div style={{ fontSize: 9, color: "#6b7280" }}>{personalDetails.phone}</div>}
            {personalDetails.address && <div style={{ fontSize: 9, color: "#6b7280" }}>{personalDetails.address}</div>}
            {links.map((l) => <div key={l.id} style={{ fontSize: 9, color: "#6b7280" }}>{l.label}: {l.url}</div>)}
          </div>
        </div>
      </div>
      {/* Reuse main content */}
      <MainContent data={data} t={t} />
      {/* Skills & Languages in two columns */}
      <div style={{ display: "flex", gap: 32, marginTop: 8 }}>
        {skills.length > 0 && (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: accent, borderBottom: `1px solid #e5e7eb`, paddingBottom: 4, marginBottom: 10 }}>Skills</div>
            {skills.map((s) => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: "#374151" }}>{s.name}</span>
                <div style={{ width: 80, height: 4, backgroundColor: "#e5e7eb", borderRadius: 2, marginTop: 4 }}>
                  <div style={{ height: 4, backgroundColor: accent, borderRadius: 2, width: `${s.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
        {(languages.length > 0 || hobbies.length > 0) && (
          <div style={{ flex: 1 }}>
            {languages.length > 0 && (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: accent, borderBottom: `1px solid #e5e7eb`, paddingBottom: 4, marginBottom: 10 }}>Languages</div>
                {languages.map((l) => (
                  <div key={l.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: "#374151" }}>{l.name}</span>
                    <div style={{ width: 80, height: 4, backgroundColor: "#e5e7eb", borderRadius: 2, marginTop: 4 }}>
                      <div style={{ height: 4, backgroundColor: accent, borderRadius: 2, width: `${l.level}%` }} />
                    </div>
                  </div>
                ))}
              </>
            )}
            {hobbies.length > 0 && (
              <>
                <div style={{ fontSize: 13, fontWeight: 700, color: accent, borderBottom: `1px solid #e5e7eb`, paddingBottom: 4, marginBottom: 8, marginTop: 12 }}>Hobbies</div>
                <div style={{ fontSize: 10, color: "#4b5563" }}>{hobbies.join(", ")}</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function ResumePreview({ data, templateId = "classic" }: Props) {
  const t = getTemplate(templateId);

  if (t.layout === "single-column") {
    return (
      <div style={{ width: "100%", minHeight: "100%", backgroundColor: "#ffffff", fontFamily: "Arial, Helvetica, sans-serif" }}>
        <MinimalLayout data={data} t={t} />
      </div>
    );
  }

  const sidebar = <Sidebar data={data} t={t} />;
  const main = <MainContent data={data} t={t} />;

  return (
    <div style={{ width: "100%", minHeight: "100%", backgroundColor: "#ffffff", fontFamily: "Arial, Helvetica, sans-serif", display: "flex" }}>
      {t.layout === "sidebar-left" ? <>{sidebar}{main}</> : <>{main}{sidebar}</>}
    </div>
  );
}

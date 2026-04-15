import { Document, Page, View, Text, Image, StyleSheet, Link } from "@react-pdf/renderer";
import { ResumeData } from "@/app/types/resume";
import { getTemplate, TemplateConfig } from "@/app/lib/templates";

function makeStyles(t: TemplateConfig) {
  return StyleSheet.create({
    page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 9 },
    main: { flex: 2, padding: 28 },
    sidebar: { width: 150, padding: 18, color: t.sidebarTextColor },
    singlePage: { flex: 1, padding: 24, fontFamily: "Helvetica" },
    // Header
    headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 18, gap: 12 },
    photo: { width: 58, height: 58, borderRadius: 29 },
    photoPlaceholder: { width: 58, height: 58, borderRadius: 29, backgroundColor: "#d1d5db" },
    name: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#111827", lineHeight: 1.2 },
    jobTitle: { fontSize: 8, letterSpacing: 1.5, color: "#6b7280", marginTop: 3, textTransform: "uppercase" },
    // Section
    sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827", borderBottom: 1, borderBottomColor: "#e2e8f0", paddingBottom: 3, marginBottom: 8 },
    section: { marginBottom: 16 },
    // Body text
    bodyText: { fontSize: 9, color: "#4b5563", lineHeight: 1.6 },
    jobHeader: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#111827" },
    jobMeta: { fontSize: 7.5, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2, marginBottom: 5 },
    bullet: { flexDirection: "row", marginBottom: 2.5, gap: 5 },
    bulletDot: { fontSize: 9, color: "#6b7280" },
    bulletText: { flex: 1, fontSize: 9, color: "#4b5563", lineHeight: 1.5 },
    entryWrap: { marginBottom: 12 },
    certRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
    certName: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: "#111827" },
    certMeta: { fontSize: 9, color: "#6b7280" },
    certDate: { fontSize: 8.5, color: "#9ca3af" },
    // Sidebar
    sidebarSectionTitle: { fontSize: 7.5, fontFamily: "Helvetica-Bold", letterSpacing: 1.2, textTransform: "uppercase", color: t.sidebarTextColor, marginBottom: 7 },
    sidebarSection: { marginBottom: 16 },
    sidebarText: { fontSize: 7.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.5, marginBottom: 2 },
    skillName: { fontSize: 7.5, color: t.sidebarTextColor },
    barOuter: { height: 3, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 2, marginTop: 2, marginBottom: 5 },
    barInner: { height: 3, borderRadius: 2, backgroundColor: t.sidebarTextColor },
    // Links
    linkLabel: { fontSize: 7.5, color: t.sidebarTextColor, fontFamily: "Helvetica-Bold" },
    linkUrl: { fontSize: 7, color: "rgba(255,255,255,0.7)" },
    linkEntry: { marginBottom: 6 },
    // Minimal (single-column)
    minimalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottom: 2, borderBottomColor: t.accentColor, paddingBottom: 12, marginBottom: 20 },
    minimalName: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#111827" },
    minimalJobTitle: { fontSize: 9, letterSpacing: 2, color: t.accentColor, textTransform: "uppercase", marginTop: 4 },
    minimalContact: { fontSize: 8, color: "#6b7280", textAlign: "right", marginBottom: 2 },
    minimalSectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: t.accentColor, borderBottom: 1, borderBottomColor: "#e5e7eb", paddingBottom: 3, marginBottom: 8 },
    minimalSection: { marginBottom: 10 },
    minimalTwoCol: { flexDirection: "row", gap: 20, marginTop: 8 },
    minimalCol: { flex: 1 },
    minimalSkillRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
    minimalSkillName: { fontSize: 9, color: "#374151" },
    minimalBarOuter: { width: 70, height: 3, backgroundColor: "#e5e7eb", borderRadius: 2 },
    minimalBarInner: { height: 3, borderRadius: 2, backgroundColor: t.accentColor },
    minimalHobbies: { fontSize: 9, color: "#4b5563", lineHeight: 1.6 },
  });
}

interface Props {
  data: ResumeData;
  templateId?: string;
}

export function ResumePdfDocument({ data, templateId = "classic" }: Props) {
  const t = getTemplate(templateId);
  const s = makeStyles(t);
  const { personalDetails, profile, employmentHistory, education, certifications, skills, languages, hobbies, links } = data;

  // Single-column (Minimal) layout
  if (t.layout === "single-column") {
    return (
      <Document>
        <Page size="A4" style={s.singlePage}>
          {/* Header */}
          <View style={s.minimalHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              {personalDetails.photoUrl ? (
                <Image src={personalDetails.photoUrl} style={{ width: 56, height: 56, borderRadius: 28 }} />
              ) : null}
              <View>
                <Text style={s.minimalName}>{personalDetails.fullName}</Text>
                <Text style={s.minimalJobTitle}>{personalDetails.jobTitle}</Text>
              </View>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              {personalDetails.email ? <Text style={s.minimalContact}>{personalDetails.email}</Text> : null}
              {personalDetails.phone ? <Text style={s.minimalContact}>{personalDetails.phone}</Text> : null}
              {personalDetails.address ? <Text style={s.minimalContact}>{personalDetails.address}</Text> : null}
              {links.map((l) => (
                <Text key={l.id} style={s.minimalContact}>{l.label}: {l.url}</Text>
              ))}
            </View>
          </View>

          {/* Profile */}
          {profile ? (
            <View style={s.minimalSection}>
              <Text style={s.minimalSectionTitle}>Profile</Text>
              <Text style={s.bodyText}>{profile}</Text>
            </View>
          ) : null}

          {/* Employment */}
          {employmentHistory.length > 0 && (
            <View style={s.minimalSection}>
              <Text style={s.minimalSectionTitle}>Employment History</Text>
              {employmentHistory.map((e) => (
                <View key={e.id} style={s.entryWrap}>
                  <Text style={s.jobHeader}>{[e.jobTitle, e.employer, e.city].filter(Boolean).join(", ")}</Text>
                  <Text style={s.jobMeta}>{e.startDate}{e.startDate ? " — " : ""}{e.current ? "Present" : e.endDate}</Text>
                  {e.bullets.map((b, i) => (
                    <View key={i} style={s.bullet}>
                      <Text style={s.bulletDot}>•</Text>
                      <Text style={s.bulletText}>{b}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {education.length > 0 && (
            <View style={s.minimalSection}>
              <Text style={s.minimalSectionTitle}>Education</Text>
              {education.map((e) => (
                <View key={e.id} style={s.entryWrap}>
                  <Text style={s.jobHeader}>{[e.degree, e.school, e.city].filter(Boolean).join(", ")}</Text>
                  <Text style={s.jobMeta}>{e.startDate}{e.startDate ? " — " : ""}{e.endDate}</Text>
                  {e.description ? <Text style={s.bodyText}>{e.description}</Text> : null}
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <View style={s.minimalSection}>
              <Text style={s.minimalSectionTitle}>Certifications</Text>
              {certifications.map((c) => (
                <View key={c.id} style={s.certRow}>
                  <View>
                    <Text style={s.certName}>{c.name}</Text>
                    {c.issuer ? <Text style={s.certMeta}>{c.issuer}</Text> : null}
                  </View>
                  {c.date ? <Text style={s.certDate}>{c.date}</Text> : null}
                </View>
              ))}
            </View>
          )}

          {/* Skills — 2 columnas para no desbordar verticalmente */}
          {skills.length > 0 && (
            <View style={s.minimalSection}>
              <Text style={s.minimalSectionTitle}>Skills</Text>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <View style={{ flex: 1 }}>
                  {skills.slice(0, Math.ceil(skills.length / 2)).map((skill) => (
                    <View key={skill.id} style={s.minimalSkillRow}>
                      <Text style={s.minimalSkillName}>{skill.name}</Text>
                      <View style={s.minimalBarOuter}>
                        <View style={[s.minimalBarInner, { width: `${skill.level}%` }]} />
                      </View>
                    </View>
                  ))}
                </View>
                <View style={{ flex: 1 }}>
                  {skills.slice(Math.ceil(skills.length / 2)).map((skill) => (
                    <View key={skill.id} style={s.minimalSkillRow}>
                      <Text style={s.minimalSkillName}>{skill.name}</Text>
                      <View style={s.minimalBarOuter}>
                        <View style={[s.minimalBarInner, { width: `${skill.level}%` }]} />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Languages + Hobbies en dos columnas */}
          {(languages.length > 0 || hobbies.length > 0) && (
            <View style={s.minimalTwoCol}>
              {languages.length > 0 && (
                <View style={s.minimalCol}>
                  <Text style={s.minimalSectionTitle}>Languages</Text>
                  {languages.map((lang) => (
                    <View key={lang.id} style={s.minimalSkillRow}>
                      <Text style={s.minimalSkillName}>{lang.name}</Text>
                      <View style={s.minimalBarOuter}>
                        <View style={[s.minimalBarInner, { width: `${lang.level}%` }]} />
                      </View>
                    </View>
                  ))}
                </View>
              )}
              {hobbies.length > 0 && (
                <View style={s.minimalCol}>
                  <Text style={s.minimalSectionTitle}>Hobbies</Text>
                  <Text style={s.minimalHobbies}>{hobbies.join(", ")}</Text>
                </View>
              )}
            </View>
          )}
        </Page>
      </Document>
    );
  }

  const MainCol = (
    <View style={s.main}>
      {/* Header: only for sidebar-right (Classic). sidebar-left shows name/photo in the sidebar. */}
      {t.layout === "sidebar-right" && (
        <View style={s.headerRow}>
          {personalDetails.photoUrl ? (
            <Image src={personalDetails.photoUrl} style={s.photo} />
          ) : (
            <View style={s.photoPlaceholder} />
          )}
          <View>
            <Text style={s.name}>{personalDetails.fullName}</Text>
            <Text style={s.jobTitle}>{personalDetails.jobTitle}</Text>
          </View>
        </View>
      )}

      {/* Profile */}
      {profile ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Profile</Text>
          <Text style={s.bodyText}>{profile}</Text>
        </View>
      ) : null}

      {/* Employment */}
      {employmentHistory.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Employment History</Text>
          {employmentHistory.map((e) => (
            <View key={e.id} style={s.entryWrap}>
              <Text style={s.jobHeader}>{[e.jobTitle, e.employer, e.city].filter(Boolean).join(", ")}</Text>
              <Text style={s.jobMeta}>{e.startDate}{e.startDate ? " — " : ""}{e.current ? "Present" : e.endDate}</Text>
              {e.bullets.map((b, i) => (
                <View key={i} style={s.bullet}>
                  <Text style={s.bulletDot}>•</Text>
                  <Text style={s.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {education.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Education</Text>
          {education.map((e) => (
            <View key={e.id} style={s.entryWrap}>
              <Text style={s.jobHeader}>{[e.degree, e.school, e.city].filter(Boolean).join(", ")}</Text>
              <Text style={s.jobMeta}>{e.startDate}{e.startDate ? " — " : ""}{e.endDate}</Text>
              {e.description ? <Text style={s.bodyText}>{e.description}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Certifications</Text>
          {certifications.map((c) => (
            <View key={c.id} style={s.certRow}>
              <View>
                <Text style={s.certName}>{c.name}</Text>
                {c.issuer ? <Text style={s.certMeta}>{c.issuer}</Text> : null}
              </View>
              {c.date ? <Text style={s.certDate}>{c.date}</Text> : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const SidebarCol = (
    <View style={s.sidebar}>
      {/* Name + photo for sidebar-left (Modern) template */}
      {t.layout === "sidebar-left" && (
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          {personalDetails.photoUrl ? (
            <Image src={personalDetails.photoUrl} style={{ width: 58, height: 58, borderRadius: 29, marginBottom: 8 }} />
          ) : (
            <View style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: "rgba(255,255,255,0.2)", marginBottom: 8 }} />
          )}
          <Text style={{ ...s.skillName, fontSize: 11, fontFamily: "Helvetica-Bold", textAlign: "center" }}>
            {personalDetails.fullName}
          </Text>
          <Text style={{ ...s.skillName, fontSize: 7, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.7, marginTop: 3 }}>
            {personalDetails.jobTitle}
          </Text>
        </View>
      )}

      {/* Details */}
      {(personalDetails.address || personalDetails.phone || personalDetails.email) && (
        <View style={s.sidebarSection}>
          <Text style={s.sidebarSectionTitle}>Details</Text>
          {personalDetails.address ? <Text style={s.sidebarText}>{personalDetails.address}</Text> : null}
          {personalDetails.phone ? <Text style={s.sidebarText}>{personalDetails.phone}</Text> : null}
          {personalDetails.email ? (
            <Link src={`mailto:${personalDetails.email}`} style={s.sidebarText}>{personalDetails.email}</Link>
          ) : null}
        </View>
      )}

      {/* Links */}
      {links.length > 0 && (
        <View style={s.sidebarSection}>
          <Text style={s.sidebarSectionTitle}>Links</Text>
          {links.map((l) => (
            <View key={l.id} style={s.linkEntry}>
              <Text style={s.linkLabel}>{l.label}</Text>
              <Text style={s.linkUrl}>{l.url}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <View style={s.sidebarSection}>
          <Text style={s.sidebarSectionTitle}>Skills</Text>
          {skills.map((skill) => (
            <View key={skill.id}>
              <Text style={s.skillName}>{skill.name}</Text>
              <View style={s.barOuter}>
                <View style={[s.barInner, { width: `${skill.level}%` }]} />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <View style={s.sidebarSection}>
          <Text style={s.sidebarSectionTitle}>Languages</Text>
          {languages.map((lang) => (
            <View key={lang.id}>
              <Text style={s.skillName}>{lang.name}</Text>
              <View style={s.barOuter}>
                <View style={[s.barInner, { width: `${lang.level}%` }]} />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Hobbies */}
      {hobbies.length > 0 && (
        <View style={s.sidebarSection}>
          <Text style={s.sidebarSectionTitle}>Hobbies</Text>
          <Text style={s.sidebarText}>{hobbies.join(", ")}</Text>
        </View>
      )}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={{ fontFamily: "Helvetica", fontSize: 9, paddingTop: 24, paddingBottom: 24 }}>
        {/* Sidebar background — fixed so it fills the full page height on every page, ignoring padding */}
        <View
          fixed
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            ...(t.layout === "sidebar-left" ? { left: 0 } : { right: 0 }),
            width: 150,
            backgroundColor: t.sidebarColor,
          }}
        />
        <View style={{ flex: 1, flexDirection: "row" }}>
          {t.layout === "sidebar-left" ? <>{SidebarCol}{MainCol}</> : <>{MainCol}{SidebarCol}</>}
        </View>
      </Page>
    </Document>
  );
}

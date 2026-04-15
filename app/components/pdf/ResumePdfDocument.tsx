import { Document, Page, View, Text, Image, StyleSheet, Link } from "@react-pdf/renderer";
import { ResumeData } from "@/app/types/resume";
import { getTemplate, TemplateConfig } from "@/app/lib/templates";

function makeStyles(t: TemplateConfig) {
  return StyleSheet.create({
    page: { flexDirection: t.layout === "sidebar-left" ? "row-reverse" : "row", fontFamily: "Helvetica", fontSize: 9 },
    main: { flex: 2, padding: 28 },
    sidebar: { width: 150, padding: 18, backgroundColor: t.sidebarColor, color: t.sidebarTextColor },
    singlePage: { flex: 1, padding: 36, fontFamily: "Helvetica" },
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

  const MainCol = (
    <View style={s.main}>
      {/* Header */}
      {t.layout !== "single-column" && (
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
      <Page size="A4" style={s.page}>
        {t.layout === "sidebar-left" ? <>{SidebarCol}{MainCol}</> : <>{MainCol}{SidebarCol}</>}
      </Page>
    </Document>
  );
}

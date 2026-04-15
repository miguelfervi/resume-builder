import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import { ResumeData } from "@/app/types/resume";

const SIDEBAR_COLOR = "#1e3a5f";
const WHITE = "#ffffff";
const WHITE_DIM = "rgba(255,255,255,0.75)";
const WHITE_DIM2 = "rgba(255,255,255,0.2)";
const DARK = "#1a1a1a";
const GRAY = "#555555";
const BORDER = "#dddddd";

const s = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Helvetica",
    fontSize: 8,
    lineHeight: 1.4,
  },
  main: {
    flex: 2,
    padding: 28,
  },
  sidebar: {
    width: 140,
    padding: 18,
    backgroundColor: SIDEBAR_COLOR,
    color: WHITE,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  photoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#cccccc",
  },
  name: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    lineHeight: 1.2,
  },
  jobTitle: {
    fontSize: 7,
    letterSpacing: 1.5,
    color: GRAY,
    marginTop: 2,
    textTransform: "uppercase",
  },
  // Sections
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 3,
    marginBottom: 8,
  },
  section: {
    marginBottom: 14,
  },
  // Profile
  profileText: {
    fontSize: 7.5,
    color: GRAY,
    lineHeight: 1.6,
  },
  // Employment
  jobHeader: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  jobMeta: {
    fontSize: 6.5,
    color: "#999999",
    letterSpacing: 0.5,
    marginTop: 2,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
    gap: 4,
  },
  bulletDot: {
    fontSize: 7.5,
    color: GRAY,
    marginTop: 0.5,
  },
  bulletText: {
    flex: 1,
    fontSize: 7.5,
    color: GRAY,
    lineHeight: 1.5,
  },
  entryWrapper: {
    marginBottom: 10,
  },
  // Sidebar
  sidebarSectionTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  sidebarSection: {
    marginBottom: 14,
  },
  sidebarText: {
    fontSize: 6.5,
    color: WHITE_DIM,
    lineHeight: 1.5,
    marginBottom: 2,
  },
  // Progress bar
  barOuter: {
    height: 3,
    backgroundColor: WHITE_DIM2,
    borderRadius: 2,
    marginTop: 2,
    marginBottom: 6,
  },
  barInner: {
    height: 3,
    borderRadius: 2,
    backgroundColor: WHITE,
  },
  skillName: {
    fontSize: 6.5,
    color: "#e5e7eb",
  },
});

interface Props {
  data: ResumeData;
}

export function ResumePdfDocument({ data }: Props) {
  const { personalDetails, profile, employmentHistory, skills, languages, hobbies } = data;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Main */}
        <View style={s.main}>
          {/* Header */}
          <View style={s.header}>
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

          {/* Profile */}
          {profile ? (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Profile</Text>
              <Text style={s.profileText}>{profile}</Text>
            </View>
          ) : null}

          {/* Employment */}
          {employmentHistory.length > 0 ? (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Employment History</Text>
              {employmentHistory.map((entry) => (
                <View key={entry.id} style={s.entryWrapper}>
                  <Text style={s.jobHeader}>
                    {[entry.jobTitle, entry.employer, entry.city]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                  <Text style={s.jobMeta}>
                    {entry.startDate}
                    {entry.startDate ? " — " : ""}
                    {entry.current ? "Present" : entry.endDate}
                  </Text>
                  {entry.bullets.map((bullet, i) => (
                    <View key={i} style={s.bullet}>
                      <Text style={s.bulletDot}>•</Text>
                      <Text style={s.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {/* Sidebar */}
        <View style={s.sidebar}>
          {/* Details */}
          {(personalDetails.address || personalDetails.phone || personalDetails.email) && (
            <View style={s.sidebarSection}>
              <Text style={s.sidebarSectionTitle}>Details</Text>
              {personalDetails.address ? (
                <Text style={s.sidebarText}>{personalDetails.address}</Text>
              ) : null}
              {personalDetails.phone ? (
                <Text style={s.sidebarText}>{personalDetails.phone}</Text>
              ) : null}
              {personalDetails.email ? (
                <Link src={`mailto:${personalDetails.email}`} style={s.sidebarText}>
                  {personalDetails.email}
                </Link>
              ) : null}
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
      </Page>
    </Document>
  );
}

import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"
import { Children, type ReactNode } from "react"

import type { ResumeData, ResumeLink } from "./data"
import type { ResumeVariant } from "./files"

// Keep words whole: a parser reads "engineer-ing" as two broken keywords.
Font.registerHyphenationCallback((word) => [word])

const LINK_COLOR = "#1d4ed8"

// ATS parsers read single-column text in order, so the layout stays plain:
// one column, standard headings, a built-in font, and no tables or icons.
const styles = StyleSheet.create({
  page: {
    paddingVertical: 32,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    color: "#111111",
  },
  header: {
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 0.75,
    borderBottomColor: "#8a8a8a",
  },
  name: { fontFamily: "Helvetica-Bold", fontSize: 21, lineHeight: 1.2 },
  headline: { fontSize: 12.5, marginTop: 3 },
  headerLine: { fontSize: 10, marginTop: 4, textAlign: "center" },
  link: { color: LINK_COLOR, textDecoration: "none" },
  underlinedLink: { color: LINK_COLOR, textDecoration: "underline" },
  section: { marginTop: 12 },
  heading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingBottom: 3,
    marginBottom: 7,
    borderBottomWidth: 0.75,
    borderBottomColor: "#999999",
  },
  entry: { marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  rowMain: { flex: 1, paddingRight: 12 },
  rowDate: { flexShrink: 0, color: "#333333" },
  title: { fontFamily: "Helvetica-Bold" },
  muted: { color: "#444444" },
  bullet: { flexDirection: "row", marginTop: 2, paddingRight: 6 },
  bulletMark: { width: 10 },
  bulletText: { flex: 1 },
  skillRow: { marginBottom: 3 },
})

const statusLabel = (status: string) => {
  const label = status.replaceAll("_", " ")
  return label.charAt(0).toUpperCase() + label.slice(1)
}

const doiUrl = (doi: string | null) => {
  if (!doi) return null
  if (/^https?:\/\//i.test(doi)) return doi
  return `https://doi.org/${doi.replace(/^doi:\s*/i, "")}`
}

/** A link shown by its label, never its raw URL. */
function Labelled({
  link,
  underline,
}: {
  link: ResumeLink
  underline?: boolean
}) {
  return (
    <Link
      src={link.url}
      style={underline ? styles.underlinedLink : styles.link}
    >
      {link.label}
    </Link>
  )
}

/** Labelled links joined with " | ". */
function LinkList({
  links,
  underline,
}: {
  links: ResumeLink[]
  underline?: boolean
}) {
  return links.map((link, i) => (
    <Text key={link.label}>
      {i > 0 && " | "}
      <Labelled link={link} underline={underline} />
    </Text>
  ))
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [first, ...rest] = Children.toArray(children)
  return (
    <View style={styles.section}>
      {/* The heading moves with its first entry, so it is never left alone
          at the foot of a page. */}
      <View wrap={false}>
        <Text style={styles.heading}>{title}</Text>
        {first}
      </View>
      {rest}
    </View>
  )
}

/** A title on the left with its date pinned to the right. */
function TitleRow({ date, children }: { date?: string; children: ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowMain}>{children}</Text>
      {date && <Text style={styles.rowDate}>{date}</Text>}
    </View>
  )
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletMark}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  )
}

export default function ResumeDocument({
  data,
  variant,
}: {
  data: ResumeData
  variant: ResumeVariant
}) {
  const isAcademic = variant === "academic"
  // The resume stays short: a featured-first selection of projects and only
  // published papers. The academic CV keeps the full record.
  const projects = isAcademic ? data.projects : data.projects.slice(0, 3)
  const publicationList = isAcademic
    ? data.publications
    : data.publications.filter(
        (publication) => publication.metadata.status === "published"
      )

  const summary = (
    <Section key="summary" title="Summary">
      <Text>{data.summaries[variant]}</Text>
    </Section>
  )

  const experience = data.experience.length > 0 && (
    <Section key="experience" title="Experience">
      {data.experience.map((item, i) => (
        <View key={`${item.role}-${i}`} style={styles.entry} wrap={false}>
          <TitleRow date={item.timeline}>
            <Text style={styles.title}>{item.role}</Text>
            {", "}
            {item.companyUrl ? (
              <Labelled link={{ label: item.company, url: item.companyUrl }} />
            ) : (
              item.company
            )}
          </TitleRow>
          {item.location && <Text style={styles.muted}>{item.location}</Text>}
          {item.bullets.map((bullet, j) => (
            <Bullet key={j}>{bullet}</Bullet>
          ))}
        </View>
      ))}
    </Section>
  )

  const education = data.education.length > 0 && (
    <Section key="education" title="Education">
      {data.education.map((item, i) => (
        <View key={`${item.degree}-${i}`} style={styles.entry} wrap={false}>
          <TitleRow date={item.timeline}>
            <Text style={styles.title}>
              {[item.degree, item.field].filter(Boolean).join(", ")}
            </Text>
          </TitleRow>
          <Text>
            {item.institute.website ? (
              <Labelled
                link={{
                  label: item.institute.name,
                  url: item.institute.website,
                }}
              />
            ) : (
              item.institute.name
            )}
          </Text>
        </View>
      ))}
    </Section>
  )

  const projectList = projects.length > 0 && (
    <Section
      key="projects"
      title={isAcademic ? "Research and projects" : "Projects"}
    >
      {projects.map((project) => {
        const links: ResumeLink[] = []
        if (project.metadata.projectUrl) {
          links.push({ label: "Preview", url: project.metadata.projectUrl })
        }
        if (project.metadata.repositoryUrl) {
          links.push({ label: "Source", url: project.metadata.repositoryUrl })
        }
        return (
          <View key={project.id} style={styles.entry} wrap={false}>
            <Text style={styles.title}>{project.title}</Text>
            <Text>{project.description}</Text>
            {links.length > 0 && (
              <Text>
                <LinkList links={links} />
              </Text>
            )}
          </View>
        )
      })}
    </Section>
  )

  const publications = publicationList.length > 0 && (
    <Section key="publications" title="Publications">
      {publicationList.map((publication) => {
        const url = doiUrl(publication.metadata.doi)
        const isPublished = publication.metadata.status === "published"
        return (
          <View key={publication.id} style={styles.entry} wrap={false}>
            <TitleRow
              date={
                publication.metadata.year
                  ? String(publication.metadata.year)
                  : undefined
              }
            >
              <Text style={styles.title}>{publication.title}</Text>
            </TitleRow>
            {isAcademic && publication.authors.length > 0 && (
              <Text style={styles.muted}>{publication.authors.join(", ")}</Text>
            )}
            <Text>
              {isPublished
                ? (publication.metadata.journal ?? "Published")
                : statusLabel(publication.metadata.status)}
              {isPublished && url && (
                <>
                  {", "}
                  <Labelled link={{ label: "Link", url }} />
                </>
              )}
            </Text>
          </View>
        )
      })}
    </Section>
  )

  const skills = data.skills.length > 0 && (
    <Section key="skills" title="Skills">
      {data.skills.map((skill) => (
        <Text key={skill.id} style={styles.skillRow}>
          <Text style={styles.title}>{skill.title}: </Text>
          {skill.tags.join(", ")}
        </Text>
      ))}
    </Section>
  )

  // The resume puts the stack right under the summary, where recruiters and
  // ATS keyword matching look first; education closes it.
  const sections = isAcademic
    ? [summary, education, publications, projectList, experience, skills]
    : [summary, skills, experience, projectList, publications, education]

  return (
    <Document
      title={`${data.name} - ${isAcademic ? "Academic CV" : "Resume"}`}
      author={data.name}
      subject={data.headline}
      keywords={data.skills.flatMap((skill) => skill.tags).join(", ")}
      creator={data.name}
      producer={data.name}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.headline}>{data.headline}</Text>
          <Text style={styles.headerLine}>
            <Labelled link={data.location} underline />
            {" | "}
            <Labelled
              link={{ label: data.email, url: `mailto:${data.email}` }}
              underline
            />
            {data.phone && ` | ${data.phone}`}
          </Text>
          <Text style={styles.headerLine}>
            <LinkList links={data.links} underline />
          </Text>
        </View>
        {sections}
      </Page>
    </Document>
  )
}

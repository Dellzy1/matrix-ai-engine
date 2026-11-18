import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Lang } from "./i18n";
import { challengeText } from "./challengeStrings";
import type { ReportModel, ReportSection } from "./reportData";
import { REPORT_STRINGS, fill, type ReportStrings } from "./reportStrings";

// The PDF layout. It only lays out the data it is given; it never adds facts of its own.
const styles = StyleSheet.create({
  page: { paddingTop: 40, paddingBottom: 56, paddingHorizontal: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1e293b", lineHeight: 1.4 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  kind: { fontSize: 10, color: "#64748b", marginBottom: 14 },
  section: { marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#e2e8f0" },
  heading: { fontSize: 13, fontWeight: "bold", color: "#4338ca", marginBottom: 6 },
  row: { flexDirection: "row", marginBottom: 4 },
  label: { width: 130, color: "#475569", fontWeight: "bold" },
  value: { flex: 1 },
  line: { marginBottom: 3 },
  muted: { color: "#64748b" },
  taskRow: { flexDirection: "row", marginBottom: 2 },
  taskTitle: { flex: 1 },
  taskMeta: { width: 150, color: "#64748b", textAlign: "right" },
  groupTitle: { fontWeight: "bold", marginTop: 6, marginBottom: 3 },
  footer: { position: "absolute", bottom: 24, left: 40, right: 40, fontSize: 8, color: "#94a3b8", textAlign: "center" },
});

function fillDate(template: string, date: string) {
  return fill(template, { date });
}

function Block({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{heading}</Text>
      {children}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function SectionView({ section, s, lang }: { section: ReportSection; s: ReportStrings; lang: Lang }) {
  switch (section.kind) {
    case "summary":
      return (
        <Block heading={s.sections.summary}>
          {section.rows.map((r) => (
            <Row key={r.label} label={s.labels[r.label]} value={r.value ?? ""} />
          ))}
        </Block>
      );

    case "decision":
      return (
        <Block heading={s.sections.decision}>
          <Row label={s.labels.question} value={section.question} />
          {section.reason && <Row label={s.labels.reason} value={section.reason} />}
          {section.options.length > 0 && <Row label={s.labels.options} value={section.options.join(", ")} />}
        </Block>
      );

    case "analysis":
      return (
        <Block heading={s.sections.analysis}>
          {section.criteria.map((c, i) => (
            <Text key={i} style={styles.line}>
              {`${c.name} — ${s.labels.weight} ${c.weight}${c.inverted ? ` (${s.labels.inverted})` : ""}`}
            </Text>
          ))}
          <Text style={[styles.groupTitle]}>{s.labels.ranking}</Text>
          {section.ranking.map((r, i) => (
            <Text key={i} style={styles.line}>{`${i + 1}. ${r.name} — ${r.score}`}</Text>
          ))}
        </Block>
      );

    case "choice":
      return (
        <Block heading={s.sections.choice}>
          {section.chosen && <Row label={s.labels.chosen} value={section.chosen} />}
          {section.recommended && <Row label={s.labels.recommended} value={section.recommended} />}
        </Block>
      );

    case "stages": {
      const total = section.total;
      return (
        <Block heading={s.sections.stages}>
          <Text style={styles.line}>{fill(s.labels.progress, { done: section.done, total })}</Text>
          {section.groups.map((g, gi) => (
            <View key={gi}>
              <Text style={styles.groupTitle}>{g.title ?? s.labels.unstaged}</Text>
              {g.tasks.map((t, ti) => (
                <View key={ti} style={styles.taskRow}>
                  <Text style={styles.taskTitle}>{t.title}</Text>
                  <Text style={styles.taskMeta}>
                    {[s.statuses[t.status], t.due ? fillDate(s.labels.due, t.due) : null].filter(Boolean).join(" · ")}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </Block>
      );
    }

    case "risks":
      return (
        <Block heading={s.sections.risks}>
          {section.items.map((c, i) => (
            <Text key={i} style={styles.line}>{`• ${challengeText(lang, c).body}`}</Text>
          ))}
        </Block>
      );

    case "outcome":
      return (
        <Block heading={s.sections.outcome}>
          {section.outcome && <Row label={s.labels.outcome} value={section.outcome} />}
          {section.lessons && <Row label={s.labels.lessons} value={section.lessons} />}
        </Block>
      );
  }
}

export function ReportDocument({ report, lang, createdOn }: { report: ReportModel; lang: Lang; createdOn: string }) {
  const s = REPORT_STRINGS[lang];
  return (
    <Document title={report.title} author="Decision Loop" subject={s.kind}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{report.title}</Text>
        <Text style={styles.kind}>{`${s.kind} · ${fillDate(s.created, createdOn)}`}</Text>
        {report.sections.map((section, i) => (
          <SectionView key={`${section.kind}-${i}`} section={section} s={s} lang={lang} />
        ))}
        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) => fill(s.pageOf, { page: pageNumber, total: totalPages })}
        />
      </Page>
    </Document>
  );
}

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Lang } from "./i18n";
import { registerChineseFont, fontFamilyFor } from "./reportPdf";
import { CALC_REPORT_STRINGS } from "./calculatorReportStrings";
import type { CalculatorReportData } from "./calculatorReport";
import { fill } from "./reportStrings";

const NAVY = "#0b0f2a";
const PURPLE = "#3b1d6e";
const VIOLET = "#7c3aed";
const CYAN = "#22d3ee";
const AMBER = "#f59e0b";
const INK = "#1e293b";
const MUTED = "#64748b";
const LINE = "#e2e8f0";

function makeStyles(font: string) {
  return StyleSheet.create({
    page: { paddingTop: 44, paddingBottom: 60, paddingHorizontal: 40, fontFamily: font, fontSize: 10, color: INK, lineHeight: 1.4 },
    darkPage: { paddingTop: 70, paddingBottom: 60, paddingHorizontal: 44, fontFamily: font, fontSize: 10, color: "#ffffff", backgroundColor: NAVY, lineHeight: 1.5 },
    brand: { fontSize: 12, fontWeight: "bold", color: CYAN, marginBottom: 8 },
    coverTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 26 },
    banner: { fontSize: 12, fontWeight: "bold", color: "#1f1300", backgroundColor: AMBER, padding: 10, borderRadius: 6, marginBottom: 24 },
    decisionTitle: { fontSize: 18, fontWeight: "bold", color: CYAN, marginBottom: 18 },
    field: { marginBottom: 10 },
    fieldLabel: { fontSize: 9, color: "#a5b4fc", marginBottom: 2 },
    explain: { fontSize: 10, color: "#cbd5e1", marginTop: 18 },
    heading: { fontSize: 16, fontWeight: "bold", color: PURPLE, marginBottom: 4 },
    accent: { height: 3, width: 48, backgroundColor: VIOLET, marginBottom: 16 },
    row: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: LINE },
    bold: { fontWeight: "bold" },
    muted: { color: MUTED, fontSize: 9 },
    tableHead: { flexDirection: "row", backgroundColor: PURPLE, color: "#ffffff", fontWeight: "bold", paddingVertical: 6, paddingHorizontal: 4 },
    tableRow: { flexDirection: "row", alignItems: "center", borderBottomWidth: 0.5, borderBottomColor: LINE, paddingVertical: 6, paddingHorizontal: 4 },
    topRow: { backgroundColor: "#ecfeff", borderWidth: 1, borderColor: CYAN, borderRadius: 6, marginVertical: 2 },
    topLabel: { fontSize: 9, fontWeight: "bold", color: VIOLET, marginBottom: 2 },
    footer: { position: "absolute", bottom: 26, left: 40, right: 40, fontSize: 8, color: MUTED, textAlign: "center" },
    darkFooter: { position: "absolute", bottom: 26, left: 44, right: 44, fontSize: 8, color: "#94a3b8", textAlign: "center" },
    tagline: { fontSize: 12, fontWeight: "bold", color: PURPLE, marginTop: 20 },
  });
}

type Styles = ReturnType<typeof makeStyles>;

// The unsaved-calculator PDF. It lays out the Calculator's results and never recalculates them.
export function CalculatorReportDocument({ report, lang }: { report: CalculatorReportData; lang: Lang }) {
  const c = CALC_REPORT_STRINGS[lang];
  const family = fontFamilyFor(lang);
  if (family !== "Helvetica") registerChineseFont();
  const st = makeStyles(family);
  const pageOf = (s: Styles, dark: boolean) => (
    <Text
      style={dark ? st.darkFooter : st.footer}
      fixed
      render={({ pageNumber, totalPages }) => fill(c.pageOf, { page: pageNumber, total: totalPages })}
    />
  );
  // Many criteria need the wider landscape page to stay readable.
  const wide = report.criteria.length > 4;
  const usable = (wide ? 842 : 595) - 80;
  const optionW = Math.min(180, usable * 0.3);
  const rankW = 46;
  const overallW = 74;
  const critW = report.criteria.length > 0 ? (usable - optionW - rankW - overallW) / report.criteria.length : 0;
  const cellSize = report.criteria.length > 6 ? 8 : 9;
  const nameOf = (name: string) => name || c.unnamed;
  const scoreText = (v: number | null) => (v === null ? "–" : String(v));

  return (
    <Document title={report.title || c.untitled} author="Decision Loop" subject={c.reportTitle}>
      {/* Cover and decision summary */}
      <Page size="A4" style={st.darkPage}>
        <Text style={st.brand}>{c.brand}</Text>
        <Text style={st.coverTitle}>{c.reportTitle}</Text>
        <Text style={[st.banner, report.saved ? { backgroundColor: CYAN, color: NAVY } : {}]}>
          {report.saved ? c.saved : c.notSaved}
        </Text>
        <Text style={st.decisionTitle}>{report.title || c.untitled}</Text>
        {report.reason && (
          <View style={st.field}>
            <Text style={st.fieldLabel}>{c.reason}</Text>
            <Text>{report.reason}</Text>
          </View>
        )}
        {report.reviewDate && (
          <View style={st.field}>
            <Text style={st.fieldLabel}>{c.reviewDate}</Text>
            <Text>{report.reviewDate}</Text>
          </View>
        )}
        <View style={st.field}>
          <Text style={st.fieldLabel}>{c.generated}</Text>
          <Text>{report.generatedAt}</Text>
        </View>
        <Text style={st.explain}>{report.saved ? c.savedExplain : c.notSavedExplain}</Text>
        {pageOf(st, true)}
      </Page>

      {/* Evaluation criteria and weights */}
      <Page size="A4" style={st.page}>
        <Text style={st.heading}>{c.criteriaHeading}</Text>
        <View style={st.accent} />
        {report.criteria.map((crit) => (
          <View key={crit.id} wrap={false} style={st.row}>
            <View style={{ flex: 1 }}>
              <Text style={st.bold}>{nameOf(crit.name)}</Text>
              <Text style={st.muted}>{`${c.weight}: ${crit.weight}`}</Text>
            </View>
            <Text style={[{ width: 170, textAlign: "right" }, crit.lowerIsBetter ? { color: VIOLET, fontWeight: "bold" } : {}]}>
              {crit.lowerIsBetter ? c.lower : c.higher}
            </Text>
          </View>
        ))}
        {pageOf(st, false)}
      </Page>

      {/* Option scores and comparison */}
      <Page size="A4" orientation={wide ? "landscape" : "portrait"} style={st.page}>
        <Text style={st.heading}>{c.scoresHeading}</Text>
        <View style={st.accent} />
        <View style={st.tableHead} fixed>
          <Text style={{ width: optionW }}>{c.option}</Text>
          {report.criteria.map((crit) => (
            <Text key={crit.id} style={{ width: critW, fontSize: cellSize, paddingRight: 4 }}>
              {nameOf(crit.name)}
            </Text>
          ))}
          <Text style={{ width: overallW, textAlign: "right" }}>{c.overall}</Text>
          <Text style={{ width: rankW, textAlign: "right" }}>{c.rank}</Text>
        </View>
        {report.options.map((opt) => (
          <View key={opt.id} wrap={false} style={st.tableRow}>
            <Text style={{ width: optionW, fontSize: cellSize + 1, fontWeight: "bold", paddingRight: 6 }}>
              {opt.name || c.unnamed}
            </Text>
            {report.criteria.map((crit) => {
              const found = opt.criterionScores.find((x) => x.criterionId === crit.id);
              return (
                <Text key={crit.id} style={{ width: critW, fontSize: cellSize }}>
                  {scoreText(found ? found.score : null)}
                </Text>
              );
            })}
            <Text style={{ width: overallW, textAlign: "right", fontWeight: "bold" }}>{`${opt.finalScore}/100`}</Text>
            <Text style={{ width: rankW, textAlign: "right" }}>{String(opt.rank)}</Text>
          </View>
        ))}
        {pageOf(st, false)}
      </Page>

      {/* Final ranking */}
      <Page size="A4" style={st.page}>
        <Text style={st.heading}>{c.rankingHeading}</Text>
        <View style={st.accent} />
        {report.options.map((opt, index) => (
          <View key={opt.id} wrap={false} style={index === 0 ? [st.row, st.topRow] : st.row}>
            <Text style={{ width: 60, fontSize: 14, fontWeight: "bold", color: PURPLE }}>{`#${opt.rank}`}</Text>
            <View style={{ flex: 1 }}>
              {index === 0 && <Text style={st.topLabel}>{c.topLabel}</Text>}
              <Text style={st.bold}>{opt.name || c.unnamed}</Text>
              {index === 0 && <Text style={st.muted}>{c.topNote}</Text>}
            </View>
            <Text style={{ width: 80, textAlign: "right", fontWeight: "bold" }}>{`${opt.finalScore}/100`}</Text>
          </View>
        ))}
        {pageOf(st, false)}
      </Page>

      {/* Reasons for scores: only the notes the user typed. Shown only when there are some. */}
      {report.options.some((o) => o.reasons.length > 0) && (
        <Page size="A4" style={st.page}>
          <Text style={st.heading}>{c.reasonsHeading}</Text>
          <View style={st.accent} />
          {report.options
            .filter((o) => o.reasons.length > 0)
            .map((opt) => (
              <View key={opt.id} style={{ marginBottom: 10 }}>
                <Text style={[st.bold, { fontSize: 11, marginBottom: 4 }]}>{opt.name || c.unnamed}</Text>
                {opt.reasons.map((r) => (
                  <View key={r.criterionId} wrap={false} style={st.row}>
                    <View style={{ flex: 1 }}>
                      <Text style={st.bold}>{nameOf(r.criterionName)}</Text>
                      <Text style={st.muted}>{`${c.reasonLabel}: ${r.text}`}</Text>
                    </View>
                    <Text style={{ width: 60, textAlign: "right", fontWeight: "bold" }}>{`${r.score ?? "–"}/10`}</Text>
                  </View>
                ))}
              </View>
            ))}
          {pageOf(st, false)}
        </Page>
      )}

      {/* Disclaimer */}
      <Page size="A4" style={st.page}>
        <Text style={st.heading}>{report.saved ? c.disclaimerSaved : c.disclaimerNotSaved}</Text>
        <View style={st.accent} />
        <Text style={st.tagline}>{c.tagline}</Text>
        {pageOf(st, false)}
      </Page>
    </Document>
  );
}

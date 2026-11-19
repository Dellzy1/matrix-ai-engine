"use client";

import React, { useRef, useState } from "react";
import type { DocumentProps } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import type { CalculatorReportData } from "@/lib/calculatorReport";
import { CALC_REPORT_STRINGS } from "@/lib/calculatorReportStrings";
import { todayKey } from "@/lib/planDates";

type Props = { lang: Lang; report: CalculatorReportData };

// Builds the PDF in the browser only when pressed. It reads the results it is given and changes nothing.
// A build that takes longer than this is treated as a failure, so the spinner can never run forever.
const PDF_TIMEOUT_MS = 30000;

function withTimeout<T>(work: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const limit = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("PDF generation timed out")), PDF_TIMEOUT_MS);
  });
  return Promise.race([work, limit]).finally(() => clearTimeout(timer));
}
export default function CalculatorPDFDownload({ lang, report }: Props) {
  const c = CALC_REPORT_STRINGS[lang];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const download = async () => {
    if (inFlight.current) return; // one document at a time
    inFlight.current = true;
    setBusy(true);
    setError(null);
    try {
      const [{ pdf }, { CalculatorReportDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/lib/calculatorReportPdf"),
      ]);
      // The date is read now, at the moment of download.
      const dated = { ...report, generatedAt: todayKey() };
      const doc = <CalculatorReportDocument report={dated} lang={lang} />;
      const blob = await withTimeout(pdf(doc as React.ReactElement<DocumentProps>).toBlob());
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `DecisionLoop_Decision_Analysis_${todayKey()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("Calculator PDF failed:", err);
      setError(c.error);
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={download}
        disabled={busy}
        className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 disabled:opacity-60 text-white text-xs font-medium px-4 py-2 rounded-xl shadow"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {busy ? c.generating : c.download}
      </button>
      {error && <p className="max-w-xs text-xs text-rose-300">{error}</p>}
    </div>
  );
}

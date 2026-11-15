"use client";

import React from "react";
import { FileText, Mail, Moon, Shield, Sun, X } from "lucide-react";

type Props = {
  isDark: boolean;
  onToggleTheme: () => void;
  onClose: () => void;
  title: string;
  close: string;
  legal: string;
  themeLabel: string;
  privacyLabel: string;
  termsLabel: string;
  contactLabel: string;
};

const panel = "bg-[#0b0f2a] border border-indigo-500/40 text-slate-100";

export default function SettingsPanel({
  isDark,
  onToggleTheme,
  onClose,
  title,
  close,
  legal,
  themeLabel,
  privacyLabel,
  termsLabel,
  contactLabel,
}: Props) {
  const linkCls =
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-200 hover:bg-indigo-500/20 transition";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full max-w-sm rounded-2xl p-6 space-y-5 shadow-2xl ${panel}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-bold">{title}</p>
          <button type="button" onClick={onClose} aria-label={close} className="p-1">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Theme */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="w-full flex items-center justify-between rounded-xl border border-indigo-500/30 px-4 py-3 text-sm hover:bg-indigo-500/20 transition"
        >
          <span className="flex items-center gap-3">
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
            {themeLabel}
          </span>
        </button>

        {/* Legal and support */}
        <div className="space-y-1">
          <p className="px-1 pb-1 text-xs font-semibold text-slate-400">{legal}</p>
          <a href="/privacy" className={linkCls}>
            <Shield className="w-4 h-4 text-indigo-300" /> {privacyLabel}
          </a>
          <a href="/terms" className={linkCls}>
            <FileText className="w-4 h-4 text-indigo-300" /> {termsLabel}
          </a>
          <a href="mailto:decisionloop.help@gmail.com" className={linkCls}>
            <Mail className="w-4 h-4 text-indigo-300" /> {contactLabel}
          </a>
        </div>
      </div>
    </div>
  );
}

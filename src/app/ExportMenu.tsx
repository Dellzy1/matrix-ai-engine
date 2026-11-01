"use client";

import React, { useEffect, useRef, useState } from "react";
import { Download, FileSpreadsheet, Printer, ChevronDown } from "lucide-react";

interface ExportMenuProps {
  onExportCSV: () => void;
}

export default function ExportMenu({ onExportCSV }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left print:hidden" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-700 transition"
      >
        <Download className="w-3.5 h-3.5 text-indigo-400" />
        <span>Export</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-lg bg-slate-800 border border-slate-700 shadow-xl py-1 z-50"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onExportCSV();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors text-left"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Download CSV (spreadsheet)</span>
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              window.print();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors text-left"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>Print / Save as PDF</span>
          </button>

          <p className="px-3 pt-1 pb-2 text-[10px] text-slate-500">
            On phones, choose Save as PDF in the print preview.
          </p>
        </div>
      )}
    </div>
  );
}
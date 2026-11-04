"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js"; // Or use your local project's supabase client import if configured

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function BrandingSettingsPage() {
  const [companyName, setCompanyName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#0284c7");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Handle Logo File Upload to Supabase Storage Bucket
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setMessage(null);
      const files = e.target.files;
      if (!files || files.length === 0) return;
      
      const file = files[0];
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to 'workspace-logos' bucket
      const { error: uploadError } = await supabase.storage
        .from("workspace-logos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data } = supabase.storage
        .from("workspace-logos")
        .getPublicUrl(filePath);

      setLogoUrl(data.publicUrl);
      setMessage({ type: "success", text: "Logo uploaded successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to upload logo." });
    } finally {
      setUploading(false);
    }
  };

  // Save Settings to Database
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Example update statement targeting your matrices or workspaces table
      const { error } = await supabase
        .from("matrices")
        .update({
          company_name: companyName,
          primary_color: primaryColor,
          logo_url: logoUrl,
        })
        .limit(1); // Adjust query based on your workspace model architecture

      if (error) throw error;
      setMessage({ type: "success", text: "Branding settings saved successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save settings." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div>
          <h1 className="text-xl font-bold">Workspace Branding</h1>
          <p className="text-sm text-slate-400 mt-1">
            Customize your exported PDF reports and shared links with your company identity.
          </p>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-emerald-950 border border-emerald-800 text-emerald-300"
                : "bg-rose-950 border border-rose-800 text-rose-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Acme Corporation"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Primary Color Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Primary Brand Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-10 bg-slate-950 border border-slate-800 rounded cursor-pointer"
              />
              <span className="text-sm font-mono text-slate-300">{primaryColor}</span>
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Company Logo
            </label>
            <div className="flex items-center gap-4">
              {logoUrl && (
                <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-lg flex items-center p-1 overflow-hidden">
                  <img src={logoUrl} alt="Logo Preview" className="object-contain w-full h-full" />
                </div>
              )}
              <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml"
                onChange={handleLogoUpload}
                disabled={uploading}
                className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Branding Preferences"}
          </button>
        </form>
      </div>
    </main>
  );
}
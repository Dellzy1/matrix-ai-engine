"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setInvalidLink(true);
      return;
    }
    // Supabase reads the reset token from the link and signs the user in for this session only.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
      else {
        // Give the link a moment to finish processing before declaring it invalid.
        setTimeout(() => setInvalidLink(true), 2500);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (password.length < 6) {
      setError("Use at least 6 characters for your new password.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don't match. Type the same password in both boxes.");
      return;
    }
    if (!supabase) return;

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message || "We couldn't update your password. Please request a new link.");
      return;
    }
    setDone(true);
    await supabase.auth.signOut();
  };

  const field =
    "w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 text-xs focus:outline-none focus:border-indigo-500";

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-6">
      <div className="w-full max-w-sm space-y-4 p-6 rounded-2xl border border-slate-800 bg-slate-900">
        {done ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h1 className="text-lg font-bold">Password updated</h1>
            <p className="text-sm text-slate-400">You can now sign in with your new password.</p>
            <Link
              href="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl"
            >
              Go to sign in
            </Link>
          </div>
        ) : invalidLink ? (
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <h1 className="text-lg font-bold">This link has expired</h1>
            <p className="text-sm text-slate-400">
              Reset links only work for a short time and only once. Request a new one from the sign-in screen.
            </p>
            <Link href="/" className="inline-block text-sm text-indigo-300 underline">
              Back to MatrixAI Engine
            </Link>
          </div>
        ) : !ready ? (
          <p className="text-sm text-slate-400 text-center">Checking your reset link...</p>
        ) : (
          <>
            <div className="space-y-1">
              <h1 className="text-lg font-bold">Choose a new password</h1>
              <p className="text-xs text-slate-400">Use at least 6 characters.</p>
            </div>

            {error && (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800">{error}</p>
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${field} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Type it again"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={field}
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-2.5 rounded-xl text-xs font-medium transition"
            >
              {loading ? "Saving..." : "Save new password"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
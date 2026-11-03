import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function ConfirmedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-6">
      <div className="max-w-sm w-full text-center space-y-4 p-8 rounded-2xl border border-slate-800 bg-slate-900">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <h1 className="text-xl font-bold">Email confirmed</h1>
        <p className="text-sm text-slate-400">
          Your account is active. Sign in to start saving your decisions.
        </p>
        <Link
          href="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl"
        >
          Go to MatrixAI Engine
        </Link>
        <p className="text-xs text-slate-500">You can also close this page.</p>
      </div>
    </main>
  );
}
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-6 sm:p-10">
      <article className="max-w-2xl mx-auto space-y-5 text-sm leading-relaxed">
        <Link href="/" className="text-xs text-indigo-300 underline">
          Back to DecisionLoop
        </Link>

        <h1 className="text-2xl font-bold text-white">DecisionLoop: Terms of Use</h1>
        <p className="text-xs text-slate-400">Effective date: [date you publish]. Last updated: [same date].</p>

        <h2 className="text-lg font-semibold text-white pt-2">1. Acceptance</h2>
        <p>By creating an account or using DecisionLoop, you agree to these terms. If you don't agree, don't use the App.</p>

        <h2 className="text-lg font-semibold text-white pt-2">2. What the App is</h2>
        <p>
          DecisionLoop helps you compare options using criteria, weights, and scores that you enter. It helps organise your
          thinking. It is not professional, financial, legal, or medical advice.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">3. Your account</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>You must provide a valid email address and keep your password private.</li>
          <li>
            Tell us at{" "}
            <a href="mailto:decisionloop.help@gmail.com" className="text-indigo-300 underline">decisionloop.help@gmail.com</a>{" "}
            if you think your account has been accessed without permission.
          </li>
          <li>You must be at least 16 years old, or the minimum age in your country, to use the App.</li>
        </ul>

        <h2 className="text-lg font-semibold text-white pt-2">4. Acceptable use</h2>
        <p>
          Don't use the App to store unlawful content, to harm others, to attempt to access other users' data, or to interfere
          with the service.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">5. Your content</h2>
        <p>
          You own the decisions and notes you save. You give us permission to store and display them only so the service can
          work for you.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">6. The scores are yours</h2>
        <p>
          The App calculates results from the numbers you enter. Results depend entirely on your input and are not objective
          advice. You are responsible for any decision you make.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">7. Availability</h2>
        <p>
          We aim to keep the App running, but we don't guarantee it will always be available, error-free, or unchanged. We may
          update or stop features with reasonable notice.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">8. Limitation of liability</h2>
        <p>
          To the extent the law allows, Timbong Norris is not liable for losses arising from your use of the App, or from
          decisions made based on its results.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">9. Ending your account</h2>
        <p>
          You can stop using the App at any time and delete your account from the account menu. We may suspend accounts that
          break these terms.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">10. Changes to these terms</h2>
        <p>We may update these terms. Continued use after an update means you accept the new terms.</p>

        <h2 className="text-lg font-semibold text-white pt-2">11. Governing law</h2>
        <p>
          These terms are governed by the laws of Cameroon. Questions:{" "}
          <a href="mailto:decisionloop.help@gmail.com" className="text-indigo-300 underline">decisionloop.help@gmail.com</a>.
        </p>

        <p className="pt-4"><Link href="/privacy" className="text-indigo-300 underline">Read our Privacy Policy</Link></p>
      </article>
    </main>
  );
}
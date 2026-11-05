import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-6 sm:p-10">
      <article className="max-w-2xl mx-auto space-y-5 text-sm leading-relaxed">
        <Link href="/" className="text-xs text-indigo-300 underline">
          Back to DecisionLoop
        </Link>

        <h1 className="text-2xl font-bold text-white">DecisionLoop: Privacy Policy</h1>
        <p className="text-xs text-slate-400">Effective date: [date you publish]. Last updated: [same date].</p>

        <p>
          <strong className="text-white">Short version:</strong> We store your email, a hashed password, and the decisions you
          save, so you can sign in on any device. We don't sell your data, we don't show ads, and we don't use your decisions
          to train AI models. You can delete a decision or your whole account at any time, and deletion is permanent.
        </p>

        <p>
          This policy explains how Timbong Norris, operating DecisionLoop from Cameroon ("we," "us"), handles information when
          you use the DecisionLoop website at matrix-ai-engine.vercel.app (the "App").
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">1. What we collect</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong className="text-white">Account details:</strong> your email address and a password. Passwords are stored in hashed form, never in plain text.</li>
          <li><strong className="text-white">Your decisions:</strong> titles, reasons, options, criteria, weights, scores, review dates, and outcome notes you save.</li>
          <li><strong className="text-white">Basic technical data:</strong> standard server logs needed to keep the service running and secure. We don't collect payment details, government ID, or your phone contacts.</li>
        </ul>

        <h2 className="text-lg font-semibold text-white pt-2">2. How we use it</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>To sign you in and keep your decisions in your private vault.</li>
          <li>To send account emails, such as confirmation and password reset messages.</li>
          <li>To keep the service running, fix problems, and answer your messages.</li>
        </ul>

        <h2 className="text-lg font-semibold text-white pt-2">3. Who processes it</h2>
        <p>We use these providers to run the App. They process data on our behalf:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong className="text-white">Supabase:</strong> database and sign-in.</li>
          <li><strong className="text-white">Vercel:</strong> website hosting.</li>
          <li><strong className="text-white">Resend (once set up):</strong> sends confirmation and password reset emails. Until then, Supabase's default email sender is used.</li>
        </ul>
        <p>We don't sell your data or share it for advertising.</p>

        <h2 className="text-lg font-semibold text-white pt-2">4. Who can see your decisions</h2>
        <p>
          Only you can see your saved decisions. Our database uses row-level security, so each account can read and change only
          its own records. We don't browse user decisions. We access data only to fix a problem you report, or where the law
          requires it.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">5. Where data is stored</h2>
        <p>
          Your data is stored with Supabase and processed by our providers, which may be located outside Cameroon. By using the
          App, you agree to this transfer.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">6. How long we keep it</h2>
        <p>
          We keep your decisions and account until you delete them or delete your account. Server logs are kept for 30 days,
          then deleted.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">7. Your choices, including deletion</h2>
        <ul className="list-disc list-inside space-y-1">
          <li><strong className="text-white">Delete a decision:</strong> open it in the App and click Delete. It's removed immediately and permanently.</li>
          <li><strong className="text-white">Delete your account:</strong> open the account menu in the App and choose Delete account. This removes your decisions and sign-in permanently.</li>
          <li><strong className="text-white">Export:</strong> download your decisions as CSV from the App before deleting.</li>
          <li>
            <strong className="text-white">Other requests:</strong> email{" "}
            <a href="mailto:decisionloop.privacy@gmail.com" className="text-indigo-300 underline">decisionloop.privacy@gmail.com</a>{" "}
            for a copy of your data or any other privacy request.
          </li>
        </ul>
        <p>Deleted data can't be recovered, and we don't keep backups of individual accounts beyond 30 days.</p>

        <h2 className="text-lg font-semibold text-white pt-2">8. Security</h2>
        <p>
          Each account is isolated by row-level security. Passwords are hashed, and the connection to the App uses HTTPS. No
          system is perfectly secure, so please use a unique password and keep your device locked.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">9. Children</h2>
        <p>
          DecisionLoop is for people aged 16 and over, or the minimum age in your country. We don't knowingly collect data from
          children. If you believe a child has signed up, email{" "}
          <a href="mailto:decisionloop.privacy@gmail.com" className="text-indigo-300 underline">decisionloop.privacy@gmail.com</a>{" "}
          and we will delete the account.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">10. Your rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct, delete, or object to the use of your data, and
          to complain to your local data protection authority. Contact{" "}
          <a href="mailto:decisionloop.privacy@gmail.com" className="text-indigo-300 underline">decisionloop.privacy@gmail.com</a>{" "}
          to use them. We will respond within 15 days.
        </p>

        <h2 className="text-lg font-semibold text-white pt-2">11. Changes</h2>
        <p>We'll post changes on this page and update the date above. If a change is significant, we'll tell registered users by email.</p>

        <h2 className="text-lg font-semibold text-white pt-2">12. Contact</h2>
        <p>For privacy questions or requests: decisionloop.privacy@gmail.com</p>
        <p>For app support: decisionloop.help@gmail.com</p>
        <p>Operator: Timbong Norris, Cameroon</p>

        <p className="pt-4"><Link href="/terms" className="text-indigo-300 underline">Read our Terms of Use</Link></p>
      </article>
    </main>
  );
}
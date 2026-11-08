import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "TravelPack doesn't collect, store or share your personal data.",
};

export default function Privacy() {
  return (
    <article className="prose-page mx-auto max-w-2xl px-4 pt-14 sm:px-6 sm:pt-20">
      <h1 className="text-4xl font-bold tracking-tight">Privacy policy</h1>
      <p>Last updated {site.privacyUpdated}</p>

      <h2>The TravelPack app</h2>
      <p>TravelPack doesn&apos;t collect, store or share your personal data.</p>
      <ul>
        <li>
          <strong>Your data stays on your device.</strong> Trips, packing lists, templates and travel documents are
          stored only on your iPhone, and in your device backups if you use them. We have no servers and no access to
          your data.
        </li>
        <li>
          <strong>No account.</strong> You don&apos;t need to sign up or sign in.
        </li>
        <li>
          <strong>No tracking or analytics.</strong> The app contains no advertising, analytics or tracking code.
        </li>
        <li>
          <strong>Apple Intelligence.</strong> If you use AI list drafts, they&apos;re generated on your device by
          Apple&apos;s on-device model.
        </li>
        <li>
          <strong>Purchases.</strong> Apple processes purchases. We receive no payment details.
        </li>
        <li>
          <strong>Sharing.</strong> When you share a .travelpack file, it goes only to the people and apps you choose.
        </li>
        <li>
          <strong>Deleting data.</strong> Settings → Delete all data removes everything. Deleting the app does too.
        </li>
      </ul>

      <h2>This website</h2>
      <ul>
        <li>No accounts, no sign-in, and no cookies.</li>
        <li>
          We use Vercel Web Analytics and Speed Insights to count page views and measure load times. They don&apos;t
          use cookies or identify you, and the data is aggregated.
        </li>
        <li>Template downloads are plain files. We don&apos;t track who downloads them.</li>
      </ul>

      <h2>Earlier web app</h2>
      <p>
        TravelPack used to be a web app with accounts. It has been retired and its accounts are closed.
      </p>

      <h2>Contact</h2>
      <p>
        {site.supportEmail ? (
          <>
            Questions about privacy: <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
          </>
        ) : (
          <>A contact email will be listed here before the app launches.</>
        )}
      </p>
    </article>
  );
}

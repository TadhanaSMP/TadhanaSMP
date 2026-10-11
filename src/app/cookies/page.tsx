import Link from "next/link";
import { PageHeading } from "@/components/PageHeading";
import { CookiePreferences } from "@/components/CookiePreferences";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "Cookies",
  "Necessary TadhanaSMP sign-in cookies, their lifetimes, and the absence of optional tracking.",
  "/cookies",
);
export default function Cookies() {
  return (
    <div className="container page legal-page">
      <PageHeading
        eyebrow="Cookies"
        title="Only what the session needs."
        description="No optional analytics. No marketing trackers. Necessary cookies support Discord sign-in when it is enabled."
      />
      <div className="prose">
        <h2>Necessary sign-in cookies</h2>
        <p>
          The website sets these only when you use the sign-in flow. They are
          HttpOnly, SameSite=Lax, limited to this site, and Secure in
          production.
        </p>
        <div className="cookie-table-wrap">
          <table className="cookie-table">
            <caption>Website cookies</caption>
            <thead>
              <tr>
                <th>Name</th>
                <th>Purpose</th>
                <th>Lifetime</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>discord_oauth_state</code>
                </td>
                <td>
                  Protects the Discord sign-in callback against forged requests.
                </td>
                <td>10 minutes; cleared on callback</td>
              </tr>
              <tr>
                <td>
                  <code>tadhana_session</code>
                </td>
                <td>Opaque identifier for a server-side website session.</td>
                <td>24 hours; cleared on sign-out</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2>Optional categories</h2>
        <p>
          No optional analytics or marketing tools are installed, so there is no
          tracking consent banner or optional consent record. If the owner later
          introduces optional tracking, it must remain blocked until valid
          consent where required, with equally accessible acceptance, rejection,
          and withdrawal controls.
        </p>
        <h2>Your choices</h2>
        <p>
          You can delete cookies through your browser. This signs you out and
          may prevent a sign-in callback from completing. The preference dialog
          explains the current categories; necessary security cookies cannot be
          disabled within the website.
        </p>
        <CookiePreferences />
        <h2>External services</h2>
        <p>
          Discord, social platforms, and an external merchant may use their own
          cookies after you visit them. Their separate policies apply. See the{" "}
          <Link href="/privacy">privacy information</Link> for further context.
        </p>
      </div>
    </div>
  );
}

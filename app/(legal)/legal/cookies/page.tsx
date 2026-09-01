import type { Metadata } from "next";
import { LegalPage, Bullets } from "@/features/legal/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Notice",
  description:
    "The cookies and similar technologies GetFinalOffer uses, why it needs them, and how to control them.",
};

export default function CookieNoticePage() {
  return (
    <LegalPage
      title="Cookie Notice"
      lastUpdated="September 1, 2026"
      intro={
        <p>
          This Cookie Notice explains how GetFinalOffer (&quot;we&quot;) uses
          cookies and similar technologies on getfinaloffer.vercel.app (the
          &quot;Service&quot;), and the choices you have. It complements our{" "}
          <a href="/legal/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
          , which explains how we handle personal information more broadly.
        </p>
      }
      sections={[
        {
          id: "what-are-cookies",
          heading: "What are cookies?",
          body: (
            <p>
              Cookies are small text files that a website stores on your
              browser or device. They allow a site to remember your actions
              and preferences over time. Similar technologies include local
              storage (which we use to remember your theme preference) and
              pixels or beacons (which we do not currently use).
            </p>
          ),
        },
        {
          id: "what-we-use",
          heading: "Cookies and technologies we use",
          body: (
            <>
              <p>
                We keep this list deliberately short. The Service does not use
                advertising cookies, cross-site trackers, or social-media
                pixels.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-text-muted">
                      <th className="py-2 pr-4 font-semibold">Cookie / technology</th>
                      <th className="py-2 pr-4 font-semibold">Type</th>
                      <th className="py-2 pr-4 font-semibold">Purpose</th>
                      <th className="py-2 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-text">
                    <tr className="border-b border-border/60 align-top">
                      <td className="py-2 pr-4 font-medium">better-auth.session_token</td>
                      <td className="py-2 pr-4">Strictly necessary</td>
                      <td className="py-2 pr-4">
                        Keeps you signed in. Without it, you could not access
                        your dashboard or any authenticated feature.
                      </td>
                      <td className="py-2">Session (or 30 days with &quot;Remember me&quot;)</td>
                    </tr>
                    <tr className="border-b border-border/60 align-top">
                      <td className="py-2 pr-4 font-medium">localStorage: theme</td>
                      <td className="py-2 pr-4">Strictly necessary</td>
                      <td className="py-2 pr-4">
                        Remembers whether you chose light or dark appearance,
                        so pages do not flash the wrong theme on load.
                      </td>
                      <td className="py-2">Until you clear it</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                We do not use analytics cookies at the individual level.
                Service-improvement analytics (search latency, result quality,
                error rates) are computed from events our own servers already
                process, without a third-party tracking cookie.
              </p>
            </>
          ),
        },
        {
          id: "choices",
          heading: "Your choices",
          body: (
            <>
              <p>You can control cookies in several ways:</p>
              <Bullets
                items={[
                  <>
                    <strong>Browser settings:</strong> all major browsers let
                    you block or delete cookies, including ours. Blocking the
                    session cookie will sign you out and prevent login, because
                    authentication cannot work without it.
                  </>,
                  <>
                    <strong>Theme preference:</strong> clearing local storage
                    resets the appearance setting; the Service then follows
                    your system preference.
                  </>,
                  <>
                    <strong>Do Not Track:</strong> the Service does not respond
                    to &quot;Do Not Track&quot; signals because it does not
                    track you across third-party websites.
                  </>,
                ]}
              />
            </>
          ),
        },
        {
          id: "changes",
          heading: "Changes to this notice",
          body: (
            <p>
              If we add a cookie or technology that is not strictly necessary,
              we will update this notice and, where required by law, ask for
              your consent before using it.
            </p>
          ),
        },
        {
          id: "contact",
          heading: "Questions",
          body: (
            <p>
              Questions about this notice or our use of cookies:
              sbist738@gmail.com.
            </p>
          ),
        },
      ]}
    />
  );
}

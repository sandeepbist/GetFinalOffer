import type { Metadata } from "next";
import { LegalPage, Bullets } from "@/features/legal/LegalPage";

export const metadata: Metadata = {
  title: "Data Processing Addendum",
  description:
    "The Data Processing Addendum that applies when GetFinalOffer processes personal data on behalf of partner organisations using recruiter access.",
};

export default function DataProcessingAddendumPage() {
  return (
    <LegalPage
      title="Data Processing Addendum"
      lastUpdated="September 1, 2026"
      intro={
        <p>
          This Data Processing Addendum (&quot;DPA&quot;) applies when a
          partner organisation (&quot;Customer&quot;) uses the GetFinalOffer
          recruiter service and GetFinalOffer (&quot;Company,&quot;
          &quot;Provider,&quot; or &quot;we&quot;) processes personal data on
          Customer&apos;s behalf, including the candidate profiles, interview
          history, and contact records that Customer accesses through the
          Service. It is incorporated into the Terms of Use and into any
          agreement between Customer and Provider governing use of the
          Service. Terms not defined here have the meanings in the GDPR, the
          UK GDPR, or applicable U.S. state privacy laws.
        </p>
      }
      sections={[
        {
          id: "roles",
          heading: "Roles of the parties and scope of processing",
          body: (
            <>
              <p>
                For personal data that candidates provide directly to
                GetFinalOffer (profiles, resumes, interview history,
                verification documents), Provider is the controller or
                &quot;business&quot; and processes that data under its own{" "}
                <a href="/legal/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                ; this DPA does not change that.
              </p>
              <p>
                For personal data that Provider processes on Customer&apos;s
                behalf, Provider acts as a Processor / Service Provider and
                Customer acts as a Controller / Business. That processing is
                limited to:
              </p>
              <Bullets
                items={[
                  <>
                    displaying candidate profiles in search results when
                    candidates have not hidden Customer&apos;s organisation;
                  </>,
                  <>
                    storing and showing invite and contact records between
                    Customer&apos;s recruiters and candidates who accepted
                    contact;
                  </>,
                  <>
                    logging search queries issued by Customer&apos;s recruiter
                    accounts for security, rate limiting, and quality
                    improvement.
                  </>,
                ]}
              />
              <p>
                The subject-matter, duration, nature and purpose of
                processing, types of personal data, and categories of data
                subjects are as described in this DPA and the Service
                documentation. Provider will process personal data only on
                Customer&apos;s documented instructions as set out in this
                DPA, the Terms of Use, and the Service itself.
              </p>
            </>
          ),
        },
        {
          id: "compliance",
          heading: "Compliance with data protection laws",
          body: (
            <p>
              Each party will comply with its obligations under applicable
              data protection laws. Provider will assist Customer, where
              reasonably possible, in responding to data subject requests that
              Customer receives and forwards to Provider relating to data
              processed on Customer&apos;s behalf, taking into account the
              nature of the processing.
            </p>
          ),
        },
        {
          id: "confidentiality",
          heading: "Confidentiality and personnel",
          body: (
            <p>
              Provider ensures that personnel authorised to process personal
              data have committed themselves to confidentiality obligations
              and receive data-protection training appropriate to their role.
              Provider limits authorisation to personnel who need access for
              the purposes described in this DPA.
            </p>
          ),
        },
        {
          id: "security",
          heading: "Security measures",
          body: (
            <>
              <p>
                Provider implements and maintains technical and organisational
                measures designed to protect personal data against accidental
                or unlawful destruction, loss, alteration, and unauthorised
                disclosure or access, taking into account the state of the
                art, implementation costs, and the nature, scope, context, and
                purposes of processing. Current measures include:
              </p>
              <Bullets
                items={[
                  <>
                    <strong>Access control:</strong> all candidate-data APIs
                    enforce server-side session authentication, role checks,
                    and recruiter-organisation membership before returning any
                    candidate record.
                  </>,
                  <>
                    <strong>Encryption:</strong> data in transit is encrypted
                    (TLS); provider-managed storage is encrypted at rest.
                  </>,
                  <>
                    <strong>Minimisation:</strong> search APIs return profile
                    summaries, not resumes or verification documents; access
                    to those requires explicit candidate action.
                  </>,
                  <>
                    <strong>Rate limiting and abuse prevention:</strong>{" "}
                    search and upload endpoints are rate-limited per account.
                  </>,
                  <>
                    <strong>Logging and monitoring:</strong> application errors
                    and infrastructure events are logged to monitored
                    providers with access restricted to authorised personnel.
                  </>,
                  <>
                    <strong>Data separation:</strong> Customer&apos;s
                    recruiters can only view candidates who have not hidden
                    Customer&apos;s organisation; candidate hiding is enforced
                    server-side in every search path.
                  </>,
                ]}
              />
              <p>
                Provider may update these measures to maintain or improve
                protection, provided the updates do not materially decrease
                overall protection.
              </p>
            </>
          ),
        },
        {
          id: "subprocessors",
          heading: "Sub-processors",
          body: (
            <>
              <p>
                Provider uses the sub-processors listed in its Privacy Policy
                (hosting, database, caching, graph database, storage,
                AI-model, and monitoring providers) to deliver the Service.
                Provider remains responsible for its sub-processors&apos;
                performance of this DPA and imposes data-protection terms at
                least as protective as this DPA on each.
              </p>
              <p>
                Provider will give Customer at least 30 days&apos; prior notice
                of any intended addition or replacement of a sub-processors
                provider with access to Customer&apos;s personal data, and
                Customer may object on reasonable data-protection grounds by
                contacting privacy@getfinaloffer.com.
              </p>
            </>
          ),
        },
        {
          id: "transfers",
          heading: "International transfers",
          body: (
            <p>
              Where personal data is transferred across borders in connection
              with this DPA, Provider relies on appropriate safeguards with
              its providers, including Standard Contractual Clauses where the
              GDPR or UK GDPR applies, or another lawful transfer mechanism.
            </p>
          ),
        },
        {
          id: "incident",
          heading: "Personal data breach notification",
          body: (
            <p>
              Provider will notify Customer without undue delay after becoming
              aware of a personal data breach affecting personal data
              processed on Customer&apos;s behalf, will provide reasonable
              information about the breach and its likely consequences, and
              will cooperate on remediation. Where the law requires notifying
              data subjects or supervisory authorities, each party will meet
              its own obligations.
            </p>
          ),
        },
        {
          id: "deletion",
          heading: "Deletion and return",
          body: (
            <p>
              Upon Customer&apos;s written request, or upon termination of
              Customer&apos;s use of the Service, Provider will delete
              personal data processed on Customer&apos;s behalf, except to the
              extent retention is required by law, in which case Provider will
              protect it from further processing. Because Provider also
              processes candidate data under its own Privacy Policy, deleting
              a Customer account deletes the Customer&apos;s recruiter records
              and contact records, but candidates control their own profiles
              under the Privacy Policy.
            </p>
          ),
        },
        {
          id: "audit",
          heading: "Audit and cooperation",
          body: (
            <p>
              Provider will make available, upon reasonable request and not
              more than once per year, information reasonably necessary to
              demonstrate compliance with this DPA, and will cooperate
              reasonably with Customer&apos;s audits required by data
              protection laws, including by providing relevant documentation.
            </p>
          ),
        },
        {
          id: "state-laws",
          heading: "U.S. state privacy laws annex",
          body: (
            <p>
              Where the CCPA/CPRA or another U.S. state privacy law applies,
              Provider is a &quot;service provider&quot; / &quot;processor&quot;
              and Customer is a &quot;business&quot; / &quot;controller&quot;
              with respect to personal data processed on Customer&apos;s
              behalf. Provider will not: sell or share that personal data;
              retain, use, or disclose it outside the direct business
              relationship between the parties; or combine it with personal
              data received from other sources, except as permitted by
              applicable law. Provider certifies that it understands these
              restrictions and will notify Customer if it can no longer meet
              them.
            </p>
          ),
        },
        {
          id: "gdpr-annex",
          heading: "GDPR annex",
          body: (
            <>
              <p>
                <strong>Subject matter and duration:</strong> candidate
                profile display, search processing, and contact records, for
                the duration of Customer&apos;s use of the Service.
              </p>
              <p>
                <strong>Nature and purpose:</strong> enabling Customer to
                search and view candidates and manage contact relationships.
              </p>
              <p>
                <strong>Types of personal data:</strong> candidate identifiers,
                professional profile data, interview progress data, and
                contact records.
              </p>
              <p>
                <strong>Categories of data subjects:</strong> candidates who
                have made themselves discoverable to Customer, and
                Customer&apos;s recruiter users.
              </p>
            </>
          ),
        },
        {
          id: "misc",
          heading: "Miscellaneous",
          body: (
            <p>
              This DPA is governed by the same law as the Terms of Use and is
              subject to its dispute-resolution provisions. If a conflict
              exists between this DPA and the Terms of Use, this DPA governs
              with respect to personal-data processing. Contact for this DPA:
              privacy@getfinaloffer.com.
            </p>
          ),
        },
      ]}
    />
  );
}

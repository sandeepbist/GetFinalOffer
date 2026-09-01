import type { Metadata } from "next";
import { LegalPage, Bullets } from "@/features/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How GetFinalOffer collects, uses, shares, and protects personal information, including resumes, verification documents, search analytics, and AI processing, plus your privacy rights.",
};

function ProcessorList() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-text-muted">
            <th className="py-2 pr-4 font-semibold">Provider</th>
            <th className="py-2 pr-4 font-semibold">Purpose</th>
            <th className="py-2 font-semibold">Data</th>
          </tr>
        </thead>
        <tbody className="text-text">
          {[
            ["Vercel", "Website and API hosting", "Account and profile data; request logs"],
            ["Supabase", "Primary database and file storage", "Profile, skill, interview, contact, verification records; resume and verification files"],
            ["Upstash", "Caching, rate limiting, search index", "Cached search results; skill index keys; search-rate counters"],
            ["Neo4j", "Skill graph database", "Candidate-to-skill relationships (user IDs and skill names; no resumes)"],
            ["OpenAI", "Resume skill extraction, embeddings, query expansion, evaluation", "Resume text excerpts; skill names; recruiter queries"],
            ["Sentry", "Error monitoring", "Diagnostic data, including user ID when an error occurs"],
          ].map(([provider, purpose, data]) => (
            <tr key={provider} className="border-b border-border/60 align-top">
              <td className="py-2 pr-4 font-medium">{provider}</td>
              <td className="py-2 pr-4">{purpose}</td>
              <td className="py-2">{data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="September 1, 2026"
      intro={
        <p>
          This Privacy Policy explains how GetFinalOffer (&quot;Company,&quot;
          &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses,
          shares, and protects personal information when you use our website and
          service at getfinaloffer.vercel.app (the &quot;Service&quot;). The
          Service has two sides: candidates (engineers who create profiles,
          upload resumes, and record interview progress) and recruiters
          (employees of partner organisations who search for candidates). This
          policy covers both. California residents: see the state privacy
          rights section below. It is linked from our{" "}
          <a href="/legal/terms" className="text-primary hover:underline">
            Terms of Use
          </a>
          , which incorporates it by reference.
        </p>
      }
      sections={[
        {
          id: "collect",
          heading: "Information we collect",
          body: (
            <>
              <p>
                <strong>Account data</strong> you provide when registering:
                name, email address, password (stored only as a
                cryptographically hashed value), and role (candidate or
                recruiter). Recruiter accounts also record the partner
                organisation you belong to; we verify your email domain matches
                that organisation.
              </p>
              <p>
                <strong>Profile data</strong> candidates provide: professional
                title, current role, years of experience, location, bio, and
                selected skills from our skills library.
              </p>
              <p>
                <strong>Resume data.</strong> When you upload a resume (PDF),
                we store the file and parse it to extract text. The extracted
                text is used to detect skills (with a confidence score), split
                into text chunks, and converted into vector embeddings for
                semantic search. We do not share your raw resume text with
                anyone other than the AI providers described in Section 6, and
                we do not use it to train general-purpose AI models.
              </p>
              <p>
                <strong>Interview progress data</strong> candidates provide:
                company, position, rounds cleared, total rounds, dates, and
                status.
              </p>
              <p>
                <strong>Verification documents</strong> candidates upload to
                support a profile or interview verification request: offer
                letters, employment confirmation emails, and similar files, up
                to 5 MB each. These are stored in access-controlled private
                storage that is not publicly reachable; they are used only to
                review the verification request.
              </p>
              <p>
                <strong>Search and analytics data</strong> generated by use:
                recruiter search queries, result counts, latency, which
                candidate card was clicked, and profile-view events, recorded
                with the acting user&apos;s ID and a timestamp. Candidate-side
                page use is not tracked at the individual level.
              </p>
              <p>
                <strong>Organisation-hiding preferences:</strong> the list of
                partner organisations you have hidden your profile from.
              </p>
              <p>
                <strong>Contact and invite data:</strong> when a recruiter
                sends an invite and a candidate responds, we record the
                recruiter, candidate, status, and timestamp so both sides can
                see the relationship.
              </p>
              <p>
                <strong>Technical data</strong> collected automatically: IP
                address (as processed by our hosting and security providers),
                browser type, device type, and request logs for operating and
                securing the Service. See our{" "}
                <a href="/legal/cookies" className="text-primary hover:underline">
                  Cookie Notice
                </a>{" "}
                for cookies and similar technologies.
              </p>
              <p>
                <strong>We do not collect</strong> payment card numbers,
                government-issued identification numbers, or precise
                geolocation. Do not include such information in your resume,
                bio, or verification documents; if you do, we treat it as
                Candidate Content you submitted (see Section 4).
              </p>
            </>
          ),
        },
        {
          id: "use",
          heading: "How we use your information",
          body: (
            <>
              <Bullets
                items={[
                  <>
                    <strong>Provide the Service:</strong> create and
                    authenticate your account, display your profile, store
                    your resume and interview history, and operate search.
                  </>,
                  <>
                    <strong>Resume processing:</strong> parse uploaded resumes
                    with an AI model to extract skills and generate search
                    embeddings. This processing is done to build your profile;
                    it is not used for model training.
                  </>,
                  <>
                    <strong>Matching:</strong> expand recruiter queries into
                    related skills using our skill graph, score candidates
                    against queries, and generate short AI rationales for top
                    results shown to recruiters.
                  </>,
                  <>
                    <strong>Verification:</strong> review documents you submit
                    to set a verification status on your profile or an
                    interview-progress entry.
                  </>,
                  <>
                    <strong>Communication:</strong> send service-related
                    messages, respond to support requests, and send notices
                    about material changes to these Terms or the Privacy
                    Policy.
                  </>,
                  <>
                    <strong>Safety and security:</strong> rate-limit abusive
                    traffic, detect and prevent fraud or misrepresentation in
                    verification, and investigate violations of our Terms.
                  </>,
                  <>
                    <strong>Improvement:</strong> analyse aggregated,
                    de-identified usage (for example, search latency,
                    fallback rates, and result quality metrics) to improve
                    search quality and reliability. We do not attempt to
                    re-identify de-identified data.
                  </>,
                  <>
                    <strong>Legal compliance:</strong> meet obligations under
                    applicable law, establish or defend legal claims, and
                    enforce our agreements.
                  </>,
                ]}
              />
              <p>
                We do not sell personal information, and we do not use
                Candidate Content to train general-purpose AI models. We share
                personal information only as described in Section 6 or as
                required by law.
              </p>
            </>
          ),
        },
        {
          id: "ai",
          heading: "AI processing details",
          body: (
            <>
              <p>
                The Service uses AI in three places, and this section describes
                exactly what data each involves:
              </p>
              <Bullets
                items={[
                  <>
                    <strong>Resume skill extraction.</strong> Text extracted
                    from your resume is sent to OpenAI with a prompt asking it
                    to identify technical skills and rate confidence of usage.
                    The output is a list of skills and confidence scores,
                    which are stored and associated with your profile. Your
                    resume text is not retained by the provider for training
                    (we use API terms that prohibit this), and we do not reuse
                    it beyond your profile.
                  </>,
                  <>
                    <strong>Embeddings.</strong> Chunks of your resume text and
                    recruiter queries are converted to vector embeddings by an
                    embedding model so that search can compare meaning, not
                    just keywords. Embeddings are numeric and cannot be
                    directly read back as text.
                  </>,
                  <>
                    <strong>Query understanding and evaluation.</strong> When a
                    recruiter searches, we send the query (not candidate
                    resumes) to an AI model to expand it into related skills,
                    and we send anonymised summaries of top results (title,
                    skills, bio excerpt) to produce a short relevance
                    rationale. Recruiters see this rationale; candidates are
                    not individually contacted by it.
                  </>,
                ]}
              />
              <p>
                A separate, local cross-encoder model runs on our own
                infrastructure to rank search results; it processes query text
                and candidate profile fields (title, skills, experience,
                bio excerpt) without any third-party network call.
              </p>
              <p>
                We do not make automated decisions that produce legal or
                similarly significant effects on individuals. Match scores and
                rationales assist recruiters, who make the final decisions.
              </p>
            </>
          ),
        },
        {
          id: "sharing",
          heading: "How we share your information",
          body: (
            <>
              <p>
                <strong>Between users (core to how the Service works):</strong>{" "}
                <br />
                <strong>Candidate to recruiter:</strong> when your profile
                matches a recruiter search, the recruiter sees your name,
                profile photo (if any), title, location, years of experience,
                skills, bio, interview progress entries, verification statuses,
                and resume link. This display is the purpose of the Service.
                You can restrict which organisations can find you using the
                hidden-organisations setting. <br />
                <strong>On invite acceptance:</strong> accepting a recruiter
                invite gives that recruiter a direct channel to contact you
                outside the Service.
              </p>
              <p>
                <strong>Service providers.</strong> We share personal
                information only with providers that process it on our behalf
                under contractual data-protection obligations. Current key
                providers:
              </p>
              <ProcessorList />
              <p>
                The list above reflects the current deployment; we will update
                it when providers change materially.
              </p>
              <p>
                <strong>Corporate events.</strong> We may share personal
                information in connection with a merger, acquisition, asset
                sale, financing, or similar transaction, subject to this
                Privacy Policy.
              </p>
              <p>
                <strong>Legal requirements.</strong> We may disclose personal
                information if required by law, subpoena, or court order, or
                when we believe in good faith that disclosure is necessary to
                protect our rights, investigate fraud, or protect the safety
                of users.
              </p>
              <p>
                <strong>We do not</strong> sell personal information, share it
                for cross-context behavioural advertising, or share it with
                data brokers.
              </p>
            </>
          ),
        },
        {
          id: "retention",
          heading: "Retention",
          body: (
            <>
              <p>
                We retain personal information for as long as needed for the
                purposes in this policy:
              </p>
              <Bullets
                items={[
                  <>
                    <strong>Account and profile data:</strong> retained while
                    your account is active. Deleting your account deletes your
                    profile, skills, resume text chunks, interview progress,
                    verification records, and stored resume and verification
                    files, subject to backups that age out on our
                    providers&apos; schedules.
                  </>,
                  <>
                    <strong>Resumes and verification documents:</strong>{" "}
                    retained until you delete them or your account.
                    Verification documents may also be deleted when the
                    related interview-progress entry is removed or when a
                    verification request is withdrawn.
                  </>,
                  <>
                    <strong>Search analytics:</strong> retained in aggregated
                    form for service improvement; individual search log rows
                    are retained for a limited operational period and are not
                    used to profile candidates.
                  </>,
                  <>
                    <strong>Backups and logs:</strong> residual copies in
                    provider backups and logs persist for their standard
                    retention windows after deletion.
                  </>,
                ]}
              />
              <p>
                Where law requires longer retention (for example, records
                needed to establish or defend legal claims), we retain the
                minimum necessary.
              </p>
            </>
          ),
        },
        {
          id: "security",
          heading: "Security",
          body: (
            <>
              <p>
                We use technical and organisational safeguards designed to
                protect personal information, including: hashed passwords;
                session-based authentication; role checks enforced server-side
                on every API that exposes candidate data; verification documents
                stored in private, access-controlled storage; rate limiting on
                sensitive endpoints; and infrastructure encryption in transit.
              </p>
              <p>
                No internet service can guarantee security. Security risk is
                inherent in all internet and information technologies, and we
                cannot guarantee the security of your personal information. If
                a breach affects your information, we will notify you and the
                appropriate regulators as required by law.
              </p>
            </>
          ),
        },
        {
          id: "rights",
          heading: "Your privacy rights",
          body: (
            <>
              <p>
                <strong>For everyone:</strong> you can access, correct, or
                delete your profile, skills, resume, interview progress, and
                organisation-hiding settings directly in the Service, or by
                contacting us at sbist738@gmail.com. You can also
                request a copy of your personal information or ask us to stop
                processing it.
              </p>
              <p>
                <strong>U.S. state privacy laws (including CCPA/CPRA).</strong>{" "}
                If you are a resident of a U.S. state with an applicable
                privacy law, you may have the right to: know what personal
                information we collect and how it is used; access and delete
                your personal information; correct inaccurate personal
                information; opt out of any sale or sharing of personal
                information (we do not sell or share it as those terms are
                defined by law); and not be discriminated against for
                exercising these rights. Subject to the law&apos;s exemptions,
                we may need to verify your request by matching it to your
                account. Submit requests to sbist738@gmail.com. We do
                not respond to browser &quot;Do Not Track&quot; signals
                because we do not track you across third-party websites.
              </p>
              <p>
                <strong>EEA/UK residents.</strong> If you are located in the
                European Economic Area or the United Kingdom, the GDPR/UK GDPR
                grant you rights including: access; rectification; erasure;
                restriction of processing; data portability; objection to
                processing; and withdrawal of consent where processing is based
                on it. Our lawful bases for processing are: performance of a
                contract (operating your account, resume processing, matching,
                verification); legitimate interests (service improvement on
                de-identified data, safety and fraud prevention); and consent
                where explicitly requested. You may lodge a complaint with
                your local supervisory authority. Note that we are a U.S.-based
                service; transfers of personal information to the United
                States rely on safeguards such as contractual clauses with our
                providers.
              </p>
              <p>
                <strong>Children.</strong> The Service is not directed to
                anyone under 18, and we do not knowingly collect personal
                information from children under 18. If you believe a child has
                provided us personal information, contact us and we will delete
                it.
              </p>
            </>
          ),
        },
        {
          id: "transfers",
          heading: "International data transfer",
          body: (
            <p>
              We are headquartered in the United States and use service
              providers that may operate in other countries. Personal
              information may therefore be transferred to the United States or
              other jurisdictions whose privacy laws may differ from yours.
              Where required, we rely on appropriate transfer safeguards,
              including contractual data-protection terms with our providers
              (see also our{" "}
              <a href="/legal/dpa" className="text-primary hover:underline">
                Data Processing Addendum
              </a>
              ).
            </p>
          ),
        },
        {
          id: "changes",
          heading: "Changes to this Privacy Policy",
          body: (
            <p>
              We may modify this Privacy Policy at any time. If we make
              material changes, we will notify registered users by email or
              through the Service and update the &quot;Last updated&quot; date
              at the top of this page. Your continued use of the Service after
              the effective date constitutes acceptance of the modified policy.
            </p>
          ),
        },
        {
          id: "contact",
          heading: "How to contact us",
          body: (
            <p>
              Questions, requests, or complaints about this Privacy Policy or
              your personal information: contact sbist738@gmail.com.
              For legal notices, see the contact information in our{" "}
              <a href="/legal/terms" className="text-primary hover:underline">
                Terms of Use
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}

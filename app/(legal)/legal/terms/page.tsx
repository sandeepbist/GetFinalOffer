import type { Metadata } from "next";
import { LegalPage, Bullets } from "@/features/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms that govern your use of GetFinalOffer as a candidate or recruiter, including accounts, verification, AI-assisted matching, liability limits, and dispute resolution.",
};

export default function TermsOfUsePage() {
  return (
    <LegalPage
      title="Terms of Use"
      lastUpdated="September 1, 2026"
      intro={
        <p>
          These Terms of Use (&quot;Terms&quot;) govern your access to and use of the
          GetFinalOffer website and service at getfinaloffer.vercel.app (the
          &quot;Service&quot;), which is operated by GetFinalOffer
          (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
          The Service includes a candidate platform where engineers build verified
          profiles, and a recruiter search product that partner organisations use
          to find and contact those candidates. By creating an account, or by
          accessing or using the Service, you agree to these Terms on behalf of
          yourself or the entity you represent, and you confirm you have the
          authority to do so. You must be at least 18 years old to use the Service.
          If you do not agree to these Terms, do not use the Service.
        </p>
      }
      sections={[
        {
          id: "accounts",
          heading: "Accounts and roles",
          body: (
            <>
              <p>
                <strong>Account registration.</strong> Some features require a
                registered account. When you register, you agree to provide
                accurate and complete information and to keep it current. You
                can delete your account at any time by contacting us; we may
                suspend or terminate accounts as described in Section 9.
              </p>
              <p>
                <strong>Two roles, one account.</strong> Every account has
                exactly one role: candidate or recruiter. The role is set when
                you sign up and determines what data you can access.
              </p>
              <p>
                <strong>Recruiter accounts.</strong> Recruiter access is
                restricted to employees of partner organisations. When you
                register as a recruiter, the email domain of your account must
                match the domain of the partner organisation you select. We
                verify this server-side at registration. Recruiter accounts
                whose domain does not match their organisation will not be
                granted recruiter privileges.
              </p>
              <p>
                <strong>Account security.</strong> You are responsible for
                keeping your login credentials confidential and for all
                activity that occurs under your account. If you believe your
                account has been accessed without your authorisation, notify us
                immediately. We are not liable for losses resulting from your
                failure to keep your credentials secure.
              </p>
              <p>
                <strong>One person, one account.</strong> You may not create an
                account on behalf of another person, maintain multiple accounts
                to circumvent feature limits or verification decisions, or use
                another person&apos;s account.
              </p>
            </>
          ),
        },
        {
          id: "access",
          heading: "Access to the Service",
          body: (
            <>
              <p>
                <strong>License.</strong> Subject to these Terms, we grant you a
                limited, non-exclusive, non-transferable, revocable license to
                access and use the Service for its intended purpose: candidates
                manage their profiles and interview history; recruiters at
                partner organisations search for and contact candidates.
              </p>
              <p>
                <strong>Restrictions.</strong> You may not:
              </p>
              <Bullets
                items={[
                  <>
                    license, sell, rent, lease, transfer, assign, distribute, or
                    commercially exploit the Service or any content on it;
                  </>,
                  <>
                    modify, create derivative works from, disassemble,
                    reverse-compile, or reverse-engineer any part of the
                    Service;
                  </>,
                  <>
                    access the Service in order to build a similar or competing
                    product or service;
                  </>,
                  <>
                    scrape, crawl, or bulk-export candidate profiles, search
                    results, or skills data, whether manually or through
                    automated means;
                  </>,
                  <>
                    circumvent, interfere with, or disable rate limits,
                    security measures, or the organisation-hiding feature
                    described in Section 4;
                  </>,
                  <>
                    copy, reproduce, distribute, republish, download, display,
                    post, or transmit any part of the Service except as
                    expressly permitted by these Terms.
                  </>,
                ]}
              />
              <p>
                All copyright and proprietary notices on the Service must be
                kept intact on any copies you are permitted to make.
              </p>
              <p>
                <strong>Changes to the Service.</strong> We may modify, suspend,
                or discontinue the Service or any part of it at any time, with
                or without notice. We are not liable to you or any third party
                for such modification, suspension, or discontinuation.
              </p>
              <p>
                <strong>Ownership.</strong> All intellectual property rights in
                the Service and its content, including copyrights, patents,
                trademarks, and trade secrets, belong to Company or its
                suppliers. These Terms transfer no ownership rights to you.
                Feedback you submit grants us a perpetual, irrevocable,
                worldwide, non-exclusive, fully-paid, royalty-free license to
                use it freely for any purpose without attribution; do not
                submit feedback you consider proprietary or confidential.
              </p>
            </>
          ),
        },
        {
          id: "candidate-content",
          heading: "Candidate profiles and verification",
          body: (
            <>
              <p>
                <strong>Your content.</strong> You retain ownership of the
                resume, profile information, interview history, and
                verification documents you submit (&quot;Candidate Content&quot;).
                You grant us a non-exclusive, worldwide, royalty-free license to
                host, store, reproduce, and process Candidate Content for the
                sole purpose of operating and improving the Service: parsing
                your resume to extract skills, generating embeddings for
                search, building your skill graph entry, and displaying your
                profile to recruiters as described in the Privacy Policy. This
                license is limited to these purposes; we do not sell Candidate
                Content, and we do not use it to train general-purpose AI
                models. You can delete your Candidate Content at any time by
                deleting your profile or account, subject to the retention rules
                in the Privacy Policy.
              </p>
              <p>
                <strong>Verification claims.</strong> The Service displays a
                verification status (unverified, pending, verified, or rejected)
                next to your profile and each interview-progress entry. A
                &quot;verified&quot; status means our review of documents you
                submitted was consistent with the claim. It is not a guarantee
                of employment, an offer, or the accuracy of any underlying
                interview outcome, and it does not create any endorsement
                relationship between Company and any organisation named in your
                profile.
              </p>
              <p>
                <strong>Truthfulness.</strong> You must not submit verification
                documents that are forged, altered, belong to another person,
                or misrepresent your interview history. Attempting to obtain a
                verified status through misrepresentation is a material breach of
                these Terms and may result in immediate account termination and,
                where applicable, referral to the affected organisation.
              </p>
              <p>
                <strong>Editing resets verification.</strong> When you edit an
                interview-progress entry that was previously verified, its
                verification status resets to unverified because the edited
                claim has not been reviewed. Plan edits accordingly.
              </p>
            </>
          ),
        },
        {
          id: "visibility",
          heading: "Candidate visibility and organisation hiding",
          body: (
            <>
              <p>
                <strong>Default visibility.</strong> Candidates who complete a
                profile are discoverable in recruiter search. You control this:
                the Service includes a setting that hides your profile from
                recruiters at organisations you select, including your current
                employer if it is a partner organisation. Hidden organisations
                cannot see your profile in search results. The feature works on
                the organisation level, and only for organisations that
                partner with GetFinalOffer; it cannot hide you from
                non-partner employers or from the outside world.
              </p>
              <p>
                <strong>How hiding works.</strong> The hidden-organisations
                list is enforced server-side in every search path: live search,
                semantic search, and profile hydration. A recruiter at a hidden
                organisation receives no indication that you exist. If you
                remove an organisation from the list, your profile becomes
                visible to that organisation&apos;s recruiters again.
              </p>
              <p>
                <strong>Invites and contact.</strong> Recruiters can invite
                candidates they find in search. If you receive and accept an
                invite, the recruiter obtains the contact details displayed in
                your profile preview. You can reject or ignore invites.
                Interactions between recruiters and candidates who connect
                through the Service are solely between those parties, as
                described in Section 5.
              </p>
            </>
          ),
        },
        {
          id: "ai-matching",
          heading: "AI-assisted matching",
          body: (
            <>
              <p>
                The Service uses automated systems to match recruiters&apos;
                searches with candidates. These include: an AI step that expands
                a recruiter&apos;s query into related skills; a skill graph that
                connects roles, skills, and aliases; a local cross-encoder model
                that scores how well each candidate matches the query; and an
                AI evaluation step that produces a short natural-language
                rationale for top results.
              </p>
              <Bullets
                items={[
                  <>
                    Match scores, confidence badges, and AI rationales are
                    estimates produced by automated systems. They are a
                    starting point for human review, not a statement of
                    candidate quality, and they can be wrong.
                  </>,
                  <>
                    You must not rely on any match score, badge, or rationale as
                    the sole basis for a hiring decision.
                  </>,
                  <>
                    Automated matching may reflect limitations of the
                    underlying models and data. If you believe a result is
                    inaccurate, you can report it to us.
                  </>,
                ]}
              />
              <p>
                We process the minimum data necessary for these systems to
                work, and we never use Candidate Content as training data for
                general-purpose AI models. Details are in the Privacy Policy.
              </p>
            </>
          ),
        },
        {
          id: "third-parties",
          heading: "Third-party services and other users",
          body: (
            <>
              <p>
                <strong>Third-party services.</strong> The Service integrates
                third-party infrastructure (for example cloud hosting,
                database, caching, graph database, storage, and AI model
                providers) and may link to third-party websites. We do not
                control or endorse third-party services. You use them at your
                own risk, and the third party&apos;s own terms and privacy
                practices apply.
              </p>
              <p>
                <strong>Other users.</strong> Your interactions with other users
                are solely between you and them. We are not responsible for
                loss or harm arising from those interactions, and we reserve
                the right, but have no obligation, to get involved in disputes
                between users.
              </p>
              <p>
                <strong>Release.</strong> To the fullest extent permitted by
                law, you release Company and its officers, employees, agents,
                successors, and assigns from all claims, demands, and damages
                of any kind arising out of or related to the Service, other
                users, or third-party services. If you are a California
                resident, you waive California Civil Code Section 1542, which
                provides: &quot;A general release does not extend to claims
                which the creditor or releasing party does not know or suspect
                to exist in his or her favor at the time of executing the
                release, which if known by him or her must have materially
                affected his or her settlement with the debtor or released
                party.&quot;
              </p>
            </>
          ),
        },
        {
          id: "disclaimers",
          heading: "Disclaimers",
          body: (
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
              AVAILABLE.&quot; TO THE FULLEST EXTENT PERMITTED BY LAW, COMPANY
              AND ITS SUPPLIERS DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED,
              INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE
              SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF
              HARMFUL CODE. WE DO NOT WARRANT THAT VERIFICATION STATUSES,
              MATCH SCORES, OR AI-GENERATED RATIONALES ARE ACCURATE. WE DO NOT
              GUARANTEE THAT YOU WILL RECEIVE AN OFFER, AN INTERVIEW, OR ANY
              EMPLOYMENT OUTCOME. WHERE APPLICABLE LAW REQUIRES WARRANTIES,
              THEY ARE LIMITED TO 90 DAYS FROM YOUR FIRST USE.
            </p>
          ),
        },
        {
          id: "liability",
          heading: "Limitation of liability",
          body: (
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW: (A) COMPANY AND ITS
              SUPPLIERS WILL NOT BE LIABLE FOR ANY LOST PROFITS, LOST DATA,
              LOST OPPORTUNITIES, COSTS OF SUBSTITUTE PRODUCTS, OR ANY
              INDIRECT, CONSEQUENTIAL, INCIDENTAL, SPECIAL, EXEMPLARY, OR
              PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO THESE TERMS OR YOUR
              USE OF (OR INABILITY TO USE) THE SERVICE; AND (B) OUR TOTAL
              LIABILITY TO YOU FOR ANY CLAIM ARISING UNDER THESE TERMS IS
              CAPPED AT THE GREATER OF (i) $50 USD AND (ii) THE AMOUNT PAID TO
              COMPANY BY YOU UNDER THESE TERMS IN THE SIX MONTHS PRIOR TO THE
              INCIDENT GIVING RISE TO THE CLAIM. THE EXISTENCE OF MULTIPLE
              CLAIMS DOES NOT INCREASE THIS CAP.
            </p>
          ),
        },
        {
          id: "term",
          heading: "Term and termination",
          body: (
            <>
              <p>
                These Terms remain in effect while you use the Service. We may
                suspend or terminate your access, including deleting your
                account, at any time and for any reason, including if we
                believe you have violated these Terms, attempted to defraud
                verification, or used the Service to harm other users. We are
                not liable to you for such termination. You may stop using the
                Service at any time; deleting your account also deletes your
                Candidate Content as described in the Privacy Policy.
              </p>
              <p>
                Upon termination, Sections 2 (Access to the Service), 3
                (Candidate Content), 5 (Third-Party Services and Other Users),
                6 (AI-Assisted Matching), 7 (Disclaimers), 8 (Limitation of
                Liability), 10 (Indemnification), 11 (Dispute Resolution), and
                12 (General) survive.
              </p>
            </>
          ),
        },
        {
          id: "indemnification",
          heading: "Indemnification",
          body: (
            <p>
              You agree to defend, indemnify, and hold harmless Company and its
              officers, employees, and agents from any claims and reasonable
              costs or attorneys&apos; fees arising out of (i) your use of the
              Service, (ii) Candidate Content you submit, including claims that
              it infringes or misappropriates any third party&apos;s rights,
              (iii) your violation of these Terms, or (iv) your violation of
              any applicable law or regulation. We may assume control of the
              defense of any such claim at your expense, and you agree to
              cooperate with our defense and not to settle any such claim
              without our prior written consent.
            </p>
          ),
        },
        {
          id: "disputes",
          heading: "Governing law and dispute resolution",
          body: (
            <>
              <p>
                <strong>Governing law.</strong> These Terms are governed by the
                laws of the State of California, United States, without
                reference to conflict-of-law rules, regardless of your location.
              </p>
              <p>
                <strong>Informal resolution first.</strong> Before starting
                arbitration, the parties agree to try to resolve the dispute
                informally. The party raising the dispute must send written
                notice to the other party at
                legal@getfinaloffer.com. Within 45 days of receiving that
                notice, the parties will meet by phone or video in good faith
                to try to resolve the dispute. If the dispute is not resolved
                within 60 days, either party may proceed to arbitration.
              </p>
              <p>
                <strong>Binding individual arbitration.</strong> Any dispute
                arising out of or relating to these Terms or the Service will be
                resolved by binding individual arbitration administered by JAMS
                (www.jamsadr.com) under its rules then in effect, rather than in
                court, except that either party may bring an individual claim in
                small-claims court. Claims under $250,000 (excluding fees and
                interest) use JAMS&apos; Streamlined Arbitration Rules; larger
                claims use JAMS&apos; Comprehensive Arbitration Rules. Judgment
                on the award may be entered in any court of competent
                jurisdiction.
              </p>
              <p>
                <strong>Class action and jury trial waiver.</strong> BY AGREEING
                TO ARBITRATION, YOU AND COMPANY WAIVE THE RIGHT TO A TRIAL BY
                JUDGE OR JURY FOR ALL COVERED CLAIMS, AND THE RIGHT TO PARTICIPATE
                AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS, REPRESENTATIVE, OR
                COLLECTIVE PROCEEDING. The arbitrator may award relief only on
                an individual basis. If a court finds the class action waiver
                unenforceable as to a specific claim, that claim may be
                litigated in state or federal court in California; all other
                claims remain subject to arbitration.
              </p>
              <p>
                <strong>Opt-out.</strong> You may opt out of this arbitration
                agreement within 30 days of first accepting these Terms by
                sending written notice to legal@getfinaloffer.com including
                your name, account email, and a clear statement that you wish
                to opt out. Opting out does not affect any other part of these
                Terms.
              </p>
              <p>
                <strong>Severability.</strong> If any part of this arbitration
                agreement is found invalid, it will be modified to the minimum
                extent necessary to make it enforceable; the remainder stays in
                effect.
              </p>
            </>
          ),
        },
        {
          id: "general",
          heading: "General",
          body: (
            <>
              <p>
                <strong>Privacy.</strong> Your use of the Service is also
                governed by our{" "}
                <a href="/legal/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="/legal/cookies" className="text-primary hover:underline">
                  Cookie Notice
                </a>
                , incorporated into these Terms by reference. If a conflict
                exists regarding collection, use, or processing of your
                personal information, the Privacy Policy controls.
              </p>
              <p>
                <strong>Changes to these Terms.</strong> We may modify these
                Terms at any time. If we make material changes, we will notify
                registered users by email or through the Service and update the
                &quot;Last updated&quot; date. Your continued use after the
                effective date constitutes acceptance of the modified Terms.
                If you do not agree to the changes, stop using the Service and
                delete your account.
              </p>
              <p>
                <strong>Notices.</strong> We may provide notices by email to
                your account address or by posting on the Service. You are
                responsible for keeping your email address current.
              </p>
              <p>
                <strong>Assignment.</strong> You may not assign these Terms
                without our prior written consent; we may assign them in
                connection with a merger, acquisition, or sale of assets
                without restriction.
              </p>
              <p>
                <strong>Entire agreement.</strong> These Terms, together with
                the Privacy Policy and any partner-organisation agreement that
                expressly references these Terms, constitute the entire
                agreement between you and Company regarding the Service and
                supersede all prior agreements on that subject.
              </p>
              <p>
                <strong>No waiver.</strong> Our failure to enforce any provision
                is not a waiver of that provision or any other.
              </p>
              <p>
                <strong>Contact.</strong> Questions about these Terms can be
                sent to legal@getfinaloffer.com.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

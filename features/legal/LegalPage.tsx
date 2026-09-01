import type { ReactNode } from "react";

export interface LegalSection {
  id: string;
  heading: string;
  body: ReactNode;
}

export function LegalPage({
  title,
  lastUpdated,
  intro,
  sections,
}: {
  title: string;
  lastUpdated: string;
  intro?: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <main className="min-h-screen bg-section">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-10 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-subtle">
            GetFinalOffer Legal
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl">
            {title}
          </h1>
          <p className="text-sm text-text-muted">Last updated: {lastUpdated}</p>
          {intro ? <div className="text-sm leading-relaxed text-text-muted">{intro}</div> : null}
        </header>

        <nav className="mb-12 rounded-xl border border-border/70 bg-surface/80 p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-text-subtle">
            On this page
          </p>
          <ol className="space-y-1.5 text-sm">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-text-muted transition-colors hover:text-heading"
                >
                  {index + 1}. {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-heading">
                {index + 1}. {section.heading}
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-text">
                {section.body}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-16 border-t border-border/60 pt-6 text-xs text-text-subtle">
          <p>
            Questions about this document? Contact{" "}
            <a
              href="mailto:sbist738@gmail.com"
              className="text-primary hover:underline"
            >
              sbist738@gmail.com
            </a>
            . See also our{" "}
            <a href="/legal/terms" className="text-primary hover:underline">Terms of Use</a>,{" "}
            <a href="/legal/privacy" className="text-primary hover:underline">Privacy Policy</a>,{" "}
            <a href="/legal/cookies" className="text-primary hover:underline">Cookie Notice</a>, and{" "}
            <a href="/legal/dpa" className="text-primary hover:underline">Data Processing Addendum</a>.
          </p>
        </footer>
      </article>
    </main>
  );
}

export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

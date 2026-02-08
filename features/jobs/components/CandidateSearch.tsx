"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  Check,
  Eye,
  Loader2,
  Sparkles,
  AlertTriangle,
  Info,
  Bot
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { CandidateProfileModal } from "@/features/contacts/components/CandidateProfileModal";
import { useSession } from "@/lib/auth/auth-client";
import { useDebounce } from "@/hooks/use-debounce";
import { getVisibleCandidates } from "@/features/recruiter/candidates-use-cases";
import type { CandidateSummaryDTO } from "@/features/recruiter/candidates-dto";
import { getAllCompanies } from "@/features/candidate/candidate-use-cases";

import { trackSearch, trackCandidateClick } from "@/features/analytics/analytics-use-cases";

function AIReasoningBadge({ reasoning }: { reasoning?: string }) {
  if (!reasoning) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="group inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-semibold border border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all ml-2 shadow-sm">
          <Bot className="w-3.5 h-3.5 group-hover:text-indigo-500" />
          <span>AI Insight</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden shadow-xl border-border" align="start">
        <div className="bg-highlight px-4 py-3 border-b border-border flex items-center gap-2">
          <div className="p-1.5 bg-surface rounded-md shadow-sm border border-border">
            <Bot className="w-4 h-4 text-indigo-600" />
          </div>
          <h4 className="text-sm font-bold text-heading">Why this candidate?</h4>
        </div>
        <div className="p-4 bg-surface">
          <p className="text-sm text-text leading-relaxed">
            {reasoning}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ConfidenceBadge({ score }: { score: number }) {
  if (!score) return null;

  if (score > 0.7) {
    return (
      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1 ml-2">
        <Sparkles className="w-3 h-3" />
        {Math.round(score)}% Match
      </Badge>
    );
  }

  if (score < 0.3) {
    return (
      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1 ml-2">
        <AlertTriangle className="w-3 h-3" />
        Broad Match ({Math.round(score * 100)}%)
      </Badge>
    );
  }

  return null;
}

function MatchHighlight({ text, query }: { text?: string; query?: string }) {
  if (!text) return null;

  const parts = query ? text.split(new RegExp(`(${query})`, "gi")) : [text];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors mt-3 border border-primary/20">
          <Sparkles className="w-3.5 h-3.5" />
          Why this matched?
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 shadow-xl" align="start">
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> AI Context Match
          </h4>
          <div className="text-sm text-text leading-relaxed bg-highlight p-3 rounded-md border border-border italic">
            &quot;...
            {parts.map((part, i) =>
              part.toLowerCase() === query?.toLowerCase() ? (
                <span
                  key={i}
                  className="bg-yellow-400/30 text-heading font-bold px-0.5 rounded shadow-sm"
                >
                  {part}
                </span>
              ) : (
                part
              )
            )}
            ...&quot;
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function CandidateSearch() {
  const { data: session } = useSession();
  const [selected, setSelected] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 600);

  const [yearsFilter, setYearsFilter] = useState<number | null>(null);
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);

  const [candidates, setCandidates] = useState<CandidateSummaryDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);

    const startTime = performance.now();

    getVisibleCandidates(
      page,
      pageSize,
      debouncedSearch || undefined,
      yearsFilter ?? undefined,
      companyFilter ?? undefined
    )
      .then(({ data, total }) => {
        setCandidates(data);
        setTotal(total);

        if (session?.user?.id) {
          const duration = Math.round(performance.now() - startTime);

          trackSearch(session.user.id, {
            query: debouncedSearch || "*",
            resultsCount: total,
            executionTimeMs: duration,
            filters: {
              minYears: yearsFilter ?? undefined,
              location: undefined,
            }
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, debouncedSearch, yearsFilter, companyFilter, session?.user?.id]);

  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);
  useEffect(() => {
    getAllCompanies().then((cs) =>
      setAvailableCompanies(cs.map((c) => c.name))
    );
  }, []);

  const yearsOptions = Array.from({ length: 11 }, (_, i) => i);
  const activeFilterCount =
    (yearsFilter != null ? 1 : 0) + (companyFilter ? 1 : 0);
  const skeletonCount = 3;

  return (
    <main className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-heading">Candidate Search</h1>
        <p className="text-sm text-text-muted">
          Find the best talent using AI-powered search and deep filters.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[300px]">
          <Input
            placeholder="Search by role, skills, or specific experience..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pr-10 h-10 shadow-sm"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
            </div>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="relative flex items-center h-10"
            >
              <Filter className="mr-2 h-4 w-4 text-text-muted" />
              Filters
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2">
            <Accordion type="multiple" className="space-y-2">
              <AccordionItem value="years" className="border-none">
                <AccordionTrigger className="hover:no-underline py-2 px-3 hover:bg-highlight rounded-md">
                  Experience
                </AccordionTrigger>
                <AccordionContent>
                  <Command>
                    <CommandInput placeholder="Minimum years..." />
                    <CommandList className="max-h-40 overflow-auto">
                      {yearsOptions.map((y) => {
                        const sel = y === yearsFilter;
                        return (
                          <CommandItem
                            key={y}
                            onSelect={() => {
                              setYearsFilter(sel ? null : y);
                              setPage(1);
                            }}
                          >
                            <Check className={`mr-2 h-4 w-4 ${sel ? "opacity-100" : "opacity-0"}`} />
                            {y}+ years
                          </CommandItem>
                        );
                      })}
                    </CommandList>
                  </Command>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="company" className="border-none">
                <AccordionTrigger className="hover:no-underline py-2 px-3 hover:bg-highlight rounded-md">
                  Company
                </AccordionTrigger>
                <AccordionContent>
                  <Command>
                    <CommandInput placeholder="Filter by company..." />
                    <CommandList className="max-h-40 overflow-auto">
                      {availableCompanies.map((co) => {
                        const sel = co === companyFilter;
                        return (
                          <CommandItem
                            key={co}
                            onSelect={() => {
                              setCompanyFilter(sel ? null : co);
                              setPage(1);
                            }}
                          >
                            <Check className={`mr-2 h-4 w-4 ${sel ? "opacity-100" : "opacity-0"}`} />
                            {co}
                          </CommandItem>
                        );
                      })}
                    </CommandList>
                  </Command>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        {loading && candidates.length === 0 ? (
          Array.from({ length: skeletonCount }).map((_, idx) => (
            <Card key={idx} className="border-border shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="flex-1 space-y-2.5">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <div className="flex gap-2 pt-1">
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-9 w-24 rounded-md" />
              </CardContent>
            </Card>
          ))
        ) : candidates.length > 0 ? (
          candidates.map((c, index) => (
            <Card
              key={c.id}
              className="group border-border shadow-sm hover:shadow-md transition-shadow bg-surface"
            >
              <CardContent className="flex items-start justify-between p-5">
                <div className="flex items-start gap-5">
                  <Avatar className="h-14 w-14 border border-border">
                    <AvatarImage src={c.image || `/avatar.jpg`} alt={c.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {c.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-heading leading-tight">
                        {c.name}
                      </h3>
                      <ConfidenceBadge score={c.matchScore || 0} />
                      <AIReasoningBadge reasoning={c.aiReasoning} />
                    </div>

                    <p className="text-sm font-medium text-text">
                      {c.title || "Candidate"}
                    </p>

                    <p className="text-sm text-text-muted flex items-center gap-2">
                      <span>{c.location}</span>
                      <span className="w-1 h-1 rounded-full bg-text-subtle"></span>
                      <span>{c.yearsExperience} years exp.</span>
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {c.skills.slice(0, 5).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-highlight text-text hover:bg-muted border-transparent font-normal"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {c.skills.length > 5 && (
                        <span className="text-xs text-text-muted self-center">
                          +{c.skills.length - 5} more
                        </span>
                      )}
                    </div>

                    {c.matchScore && c.matchScore < 0.3 && (
                      <div className="mt-2 text-xs text-amber-600 bg-amber-500/10 p-2 rounded border border-amber-500/20 flex items-start gap-2">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>
                          We couldn&apos;t find an exact keyword match, so we included candidates with
                          related concepts (Semantic Fallback).
                        </p>
                      </div>
                    )}

                    {c.matchHighlight && (
                      <MatchHighlight text={c.matchHighlight} query={search} />
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap font-medium text-primary bg-primary/10 border-primary/20 hover:bg-primary/20 hover:border-primary/30 hover:text-primary"
                    onClick={() => {
                      setSelected(c.id);

                      if (session?.user?.id) {
                        trackCandidateClick(session.user.id, {
                          candidateId: c.id,
                          rankPosition: index + 1
                        });
                      }
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-highlight rounded-lg border border-dashed border-border">
            <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-border">
              <Filter className="w-6 h-6 text-text-subtle" />
            </div>
            <h3 className="text-lg font-medium text-heading">
              No candidates found
            </h3>
            <p className="text-text-muted max-w-sm mx-auto mt-1">
              Try adjusting your search terms or removing some filters to see
              more results.
            </p>
            <Button
              variant="link"
              className="mt-2 text-primary"
              onClick={() => {
                setSearch("");
                setYearsFilter(null);
                setCompanyFilter(null);
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-6">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="w-24"
        >
          Previous
        </Button>
        <span className="text-sm text-text-muted font-medium">
          Page {page} of {Math.ceil(total / pageSize)}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page * pageSize >= total}
          onClick={() => setPage((p) => p + 1)}
          className="w-24"
        >
          Next
        </Button>
      </div>

      {session?.user && (
        <CandidateProfileModal
          userId={selected!}
          open={!!selected}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}
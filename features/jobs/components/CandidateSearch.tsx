"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCachedFetch } from "@/hooks/use-cached-fetch";
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
  Sparkles,
  AlertTriangle,
  Info,
  Bot
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

import { CandidateProfileModal } from "@/features/contacts/components/CandidateProfileModal";
import { useSession } from "@/lib/auth/auth-client";
import { useDebounce } from "@/hooks/use-debounce";
import { CandidateSearchError, getVisibleCandidates } from "@/features/recruiter/candidates-use-cases";
import type { CandidateSummaryDTO } from "@/features/recruiter/candidates-dto";
import { getAllCompanies } from "@/features/candidate/candidate-use-cases";

import { trackSearch, trackCandidateClick } from "@/features/analytics/analytics-use-cases";

interface CompanyOption {
  id: string;
  name: string;
}

interface SearchUiError {
  status?: number;
  title: string;
  message: string;
}

function mapSearchError(error: unknown): SearchUiError {
  if (error instanceof CandidateSearchError) {
    switch (error.status) {
      case 401:
        return {
          status: 401,
          title: "Session expired",
          message: "Please sign in again to continue searching candidates.",
        };
      case 403:
        return {
          status: 403,
          title: "Recruiter access required",
          message: "Your recruiter profile is missing. Complete recruiter setup to access candidate search.",
        };
      case 429:
        return {
          status: 429,
          title: "Too many searches",
          message: "Rate limit reached. Please wait a minute before trying again.",
        };
      default:
        if (error.status && error.status >= 500) {
          return {
            status: error.status,
            title: "Search unavailable",
            message: "The search service is temporarily unavailable. Please try again shortly.",
          };
        }
    }

    return {
      status: error.status,
      title: "Search failed",
      message: error.message || "Unable to load candidates right now.",
    };
  }

  if (error instanceof Error) {
    return {
      title: "Search failed",
      message: error.message || "Unable to load candidates right now.",
    };
  }

  return {
    title: "Search failed",
    message: "Unable to load candidates right now.",
  };
}

function AIReasoningBadge({ reasoning }: { reasoning?: string }) {
  if (!reasoning) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="group ml-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary transition-all hover:border-primary/30 hover:bg-primary/20">
          <Bot className="h-3.5 w-3.5" />
          <span>AI Insight</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden shadow-xl border-border" align="start">
        <div className="bg-highlight px-4 py-3 border-b border-border flex items-center gap-2">
          <div className="p-1.5 bg-surface rounded-md shadow-sm border border-border">
            <Bot className="h-4 w-4 text-primary" />
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
  const normalized = score <= 1 ? score * 100 : score;

  if (normalized > 70) {
    return (
      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1 ml-2">
        <Sparkles className="w-3 h-3" />
        {Math.round(normalized)}% Match
      </Badge>
    );
  }

  if (normalized < 30) {
    return (
      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1 ml-2">
        <AlertTriangle className="w-3 h-3" />
        Broad Match ({Math.round(normalized)}%)
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
                  className="rounded bg-primary/20 px-0.5 font-bold text-heading"
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
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateSummaryDTO | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 600);

  const [yearsFilter, setYearsFilter] = useState<number | null>(null);
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);

  const [candidates, setCandidates] = useState<CandidateSummaryDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<SearchUiError | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const requestAbortRef = useRef<AbortController | null>(null);
  const pageSize = 10;

  useEffect(() => {
    requestAbortRef.current?.abort();
    const controller = new AbortController();
    requestAbortRef.current = controller;
    let active = true;

    const load = async () => {
      setLoading(true);
      const startTime = performance.now();

      try {
        const { data, total } = await getVisibleCandidates(
          page,
          pageSize,
          debouncedSearch || undefined,
          yearsFilter ?? undefined,
          companyFilter ?? undefined,
          controller.signal
        );

        if (!active || controller.signal.aborted) return;

        setCandidates(data);
        setTotal(total);
        setSearchError(null);

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
      } catch (error) {
        if (controller.signal.aborted || !active) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSearchError(mapSearchError(error));
      } finally {
        if (active && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
      controller.abort();
    };
  }, [page, debouncedSearch, yearsFilter, companyFilter, session?.user?.id, refreshKey]);

  useEffect(() => {
    return () => {
      requestAbortRef.current?.abort();
    };
  }, []);

  const { data: availableCompanies } = useCachedFetch<CompanyOption[]>(
    "search-companies",
    () => getAllCompanies().catch(() => [] as CompanyOption[])
  );

  const yearsOptions = useMemo(() => Array.from({ length: 11 }, (_, i) => i), []);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);
  const activeFilterCount = useMemo(
    () => (yearsFilter != null ? 1 : 0) + (companyFilter ? 1 : 0),
    [yearsFilter, companyFilter]
  );
  const selectedCompanyName = useMemo(
    () => (availableCompanies ?? []).find((company) => company.id === companyFilter)?.name,
    [availableCompanies, companyFilter]
  );
  const skeletonCount = 3;

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const hasErrorWithoutResults = !!searchError && candidates.length === 0;
  const normalizedCurrentPage = Math.min(page, totalPages);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-6xl space-y-7 px-6 py-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-1.5"
      >
        <h1 className="text-3xl font-bold tracking-tight text-heading">Candidate Search</h1>
        <p className="text-sm text-text-muted">
          Find the best talent using AI-powered search and deep filters.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-border/70 bg-surface/85 p-4 shadow-[0_18px_50px_-40px_var(--shadow)] backdrop-blur-sm"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[300px] flex-1">
            <Input
              placeholder="Search by role, skills, or specific experience..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full border-border/80 bg-background/80 pr-10 shadow-xs"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <LoadingIndicator className="text-text-muted" />
              </div>
            )}
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="relative flex h-10 items-center border-border/80 bg-background/70"
              >
                <Filter className="mr-2 h-4 w-4 text-text-muted" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-[10px] text-primary-foreground"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 rounded-xl border-border/80 p-2">
              <Accordion type="multiple" className="space-y-2">
                <AccordionItem value="years" className="border-none">
                  <AccordionTrigger className="rounded-md px-3 py-2 hover:bg-highlight hover:no-underline">
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
                  <AccordionTrigger className="rounded-md px-3 py-2 hover:bg-highlight hover:no-underline">
                    Company
                  </AccordionTrigger>
                  <AccordionContent>
                    <Command>
                      <CommandInput placeholder="Filter by company..." />
                      <CommandList className="max-h-40 overflow-auto">
                        {(availableCompanies ?? []).map((co) => {
                          const sel = co.id === companyFilter;
                          return (
                            <CommandItem
                              key={co.id}
                              onSelect={() => {
                                setCompanyFilter(sel ? null : co.id);
                                setPage(1);
                              }}
                            >
                              <Check className={`mr-2 h-4 w-4 ${sel ? "opacity-100" : "opacity-0"}`} />
                              {co.name}
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
      </motion.div>

      {searchError && candidates.length > 0 && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm">
          <p className="font-semibold text-amber-700">{searchError.title}</p>
          <p className="text-amber-700/90 mt-1">{searchError.message}</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-4"
      >
        {loading && candidates.length === 0 ? (
          Array.from({ length: skeletonCount }).map((_, idx) => (
            <Card key={idx} className="border-border/80">
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
        ) : hasErrorWithoutResults ? (
          <div className="rounded-2xl border border-dashed border-border bg-highlight py-12 text-center">
            <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-border">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium text-heading">{searchError.title}</h3>
            <p className="text-text-muted max-w-md mx-auto mt-1">{searchError.message}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setRefreshKey((value) => value + 1)}
            >
              Retry search
            </Button>
          </div>
        ) : candidates.length > 0 ? (
          candidates.map((c, index) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card
                className="group border-border/80 bg-surface/95"
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

                      {c.matchScore && (c.matchScore <= 1 ? c.matchScore * 100 : c.matchScore) < 30 && (
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
                      className="whitespace-nowrap border-primary/25 bg-primary/10 font-medium text-primary hover:border-primary/40 hover:bg-primary/20 hover:text-primary"
                      onClick={() => {
                        setSelectedCandidate(c);

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
            </motion.div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-highlight py-12 text-center">
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
            {selectedCompanyName && (
              <p className="text-xs text-text-subtle mt-2">
                Active company filter: {selectedCompanyName}
              </p>
            )}
            <Button
              variant="link"
              className="mt-2 text-primary"
              onClick={() => {
                setSearch("");
                setYearsFilter(null);
                setCompanyFilter(null);
                setSearchError(null);
                setRefreshKey((value) => value + 1);
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between border-t border-border/80 pt-6"
      >
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
          Page {normalizedCurrentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={normalizedCurrentPage >= totalPages || total === 0}
          onClick={() => setPage((p) => p + 1)}
          className="w-24"
        >
          Next
        </Button>
      </motion.div>

      {session?.user && selectedCandidate && (
        <CandidateProfileModal
          candidate={selectedCandidate}
          open={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </motion.main>
  );
}

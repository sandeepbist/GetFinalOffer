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
        <button className="group inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-all ml-2 shadow-sm">
          <Bot className="w-3.5 h-3.5 group-hover:text-indigo-600" />
          <span>AI Insight</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden shadow-xl border-indigo-100" align="start">
        <div className="bg-gradient-to-r from-indigo-50 to-white px-4 py-3 border-b border-indigo-100 flex items-center gap-2">
          <div className="p-1.5 bg-white rounded-md shadow-sm border border-indigo-50">
            <Bot className="w-4 h-4 text-indigo-600" />
          </div>
          <h4 className="text-sm font-bold text-slate-700">Why this candidate?</h4>
        </div>
        <div className="p-4 bg-white">
          <p className="text-sm text-slate-600 leading-relaxed">
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
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 ml-2">
        <Sparkles className="w-3 h-3" />
        {Math.round(score)}% Match
      </Badge>
    );
  }

  if (score < 0.3) {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1 ml-2">
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
        <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors mt-3 border border-blue-100">
          <Sparkles className="w-3.5 h-3.5" />
          Why this matched?
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 shadow-xl" align="start">
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> AI Context Match
          </h4>
          <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-100 italic">
            &quot;...
            {parts.map((part, i) =>
              part.toLowerCase() === query?.toLowerCase() ? (
                <span
                  key={i}
                  className="bg-yellow-200 text-slate-900 font-bold px-0.5 rounded shadow-sm"
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
        <h1 className="text-3xl font-bold tracking-tight">Candidate Search</h1>
        <p className="text-sm text-slate-500">
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
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="relative flex items-center h-10 border-slate-300"
            >
              <Filter className="mr-2 h-4 w-4 text-slate-500" />
              Filters
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px]"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2">
            <Accordion type="multiple" className="space-y-2">
              <AccordionItem value="years" className="border-none">
                <AccordionTrigger className="hover:no-underline py-2 px-3 hover:bg-slate-50 rounded-md">
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
                <AccordionTrigger className="hover:no-underline py-2 px-3 hover:bg-slate-50 rounded-md">
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
            <Card key={idx} className="border-slate-100 shadow-sm">
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
              className="group border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="flex items-start justify-between p-5">
                <div className="flex items-start gap-5">
                  <Avatar className="h-14 w-14 border border-slate-100">
                    <AvatarImage src={c.image || `/avatar.jpg`} alt={c.name} />
                    <AvatarFallback className="bg-blue-50 text-blue-700 font-semibold">
                      {c.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">
                        {c.name}
                      </h3>
                      <ConfidenceBadge score={c.matchScore || 0} />
                      <AIReasoningBadge reasoning={c.aiReasoning} />
                    </div>

                    <p className="text-sm font-medium text-slate-600">
                      {c.title || "Candidate"}
                    </p>

                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <span>{c.location}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span>{c.yearsExperience} years exp.</span>
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {c.skills.slice(0, 5).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent font-normal"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {c.skills.length > 5 && (
                        <span className="text-xs text-slate-500 self-center">
                          +{c.skills.length - 5} more
                        </span>
                      )}
                    </div>

                    {c.matchScore && c.matchScore < 0.3 && (
                      <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 flex items-start gap-2">
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
                    className="whitespace-nowrap font-medium text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100 hover:border-blue-200 hover:text-blue-800"
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
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
              <Filter className="w-6 h-6 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">
              No candidates found
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your search terms or removing some filters to see
              more results.
            </p>
            <Button
              variant="link"
              className="mt-2 text-blue-600"
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

      <div className="flex items-center justify-between border-t border-slate-100 pt-6">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="w-24"
        >
          Previous
        </Button>
        <span className="text-sm text-slate-500 font-medium">
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
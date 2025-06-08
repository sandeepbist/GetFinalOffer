"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
import { Filter, Check, Eye } from "lucide-react";

import { getVisibleCandidates } from "@/features/recruiter/candidates-use-cases";
import type { CandidateSummaryDTO } from "@/features/recruiter/candidates-dto";
import { getAllCompanies } from "@/features/candidate/candidate-use-cases";

export default function CandidateSearch() {
  const [search, setSearch] = useState("");
  const [yearsFilter, setYearsFilter] = useState<number | null>(null);
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);

  const [candidates, setCandidates] = useState<CandidateSummaryDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    getVisibleCandidates(
      page,
      pageSize,
      search || undefined,
      yearsFilter ?? undefined,
      companyFilter ?? undefined
    ).then(({ data, total }) => {
      setCandidates(data);
      setTotal(total);
    });
  }, [page, search, yearsFilter, companyFilter]);

  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);
  useEffect(() => {
    getAllCompanies().then((cs) => {
      setAvailableCompanies(cs.map((c) => c.name));
    });
  }, []);

  const yearsOptions = Array.from({ length: 11 }, (_, i) => i);
  const activeFilterCount =
    (yearsFilter != null ? 1 : 0) + (companyFilter ? 1 : 0);

  return (
    <main className="space-y-3 p-6">
      <h1 className="text-3xl font-bold">Candidate Search</h1>
      <p className="text-sm text-gray-600">
        Filter and find candidates for your open roles
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search by name or title…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 min-w-[200px]"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-2 text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2">
            <Accordion type="multiple" className="space-y-2">
              <AccordionItem value="years">
                <AccordionTrigger>Experience</AccordionTrigger>
                <AccordionContent>
                  <Command>
                    <CommandInput placeholder="Min years…" />
                    <CommandList className="max-h-40 overflow-auto">
                      {yearsOptions.map((y) => {
                        const selected = y === yearsFilter;
                        return (
                          <CommandItem
                            key={y}
                            onSelect={() => {
                              setYearsFilter(selected ? null : y);
                              setPage(1);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selected ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {y}+ years
                          </CommandItem>
                        );
                      })}
                    </CommandList>
                  </Command>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="company">
                <AccordionTrigger>Company</AccordionTrigger>
                <AccordionContent>
                  <Command>
                    <CommandInput placeholder="Select company…" />
                    <CommandList className="max-h-40 overflow-auto">
                      {availableCompanies.map((co) => {
                        const selected = co === companyFilter;
                        return (
                          <CommandItem
                            key={co}
                            onSelect={() => {
                              setCompanyFilter(selected ? null : co);
                              setPage(1);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selected ? "opacity-100" : "opacity-0"
                              }`}
                            />
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
        {candidates.length > 0 ? (
          candidates.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/avatar.jpg`} alt={c.name} />
                    <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {c.name}
                    </h3>
                    <p className="text-sm text-gray-600">{c.title ?? ""}</p>
                    <p className="text-sm text-gray-600">
                      {c.location} • {c.yearsExperience} years
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {c.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  <Link href={`/recruiter/candidates/${c.id}`}>
                    <Eye className="mr-1 h-4 w-4" />
                    View Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No candidates found.</p>
        )}
      </div>

      <div className="flex justify-center space-x-2">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>
        <span className="px-4 py-2">
          {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of{" "}
          {total}
        </span>
        <Button
          variant="outline"
          disabled={page * pageSize >= total}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </main>
  );
}

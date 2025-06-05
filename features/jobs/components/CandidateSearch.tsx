"use client";

import React, { useState } from "react";
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

interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  yearsOfExperience: number;
  skills: string[];
  companyCleared: string;
}
export default function CandidateSearch() {
  const [search, setSearch] = useState("");
  const [yearsFilter, setYearsFilter] = useState<number | null>(null);
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);

  const candidates: Candidate[] = [
    {
      id: "1",
      name: "Michael Chen",
      title: "Senior Frontend Developer",
      location: "San Francisco, CA",
      yearsOfExperience: 8,
      skills: ["React", "TypeScript", "Node.js", "GraphQL"],
      companyCleared: "Meta",
    },
    {
      id: "2",
      name: "Jessica Williams",
      title: "Product Manager",
      location: "New York, NY",
      yearsOfExperience: 6,
      skills: ["Product Strategy", "User Research", "Roadmapping", "Agile"],
      companyCleared: "Amazon",
    },
    {
      id: "3",
      name: "David Johnson",
      title: "UX Designer",
      location: "Remote",
      yearsOfExperience: 5,
      skills: ["Figma", "Sketch", "User Flows"],
      companyCleared: "Microsoft",
    },
  ];

  const yearsOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const availableCompanies = ["Meta", "Google", "Amazon", "Apple", "Microsoft"];

  const filtered = candidates.filter((c) => {
    if (
      search &&
      ![c.name, c.title].some((f) =>
        f.toLowerCase().includes(search.toLowerCase())
      )
    )
      return false;
    if (yearsFilter !== null && c.yearsOfExperience < yearsFilter) return false;
    if (companyFilter && c.companyCleared !== companyFilter) return false;
    return true;
  });

  const activeFilterCount =
    (yearsFilter !== null ? 1 : 0) + (companyFilter ? 1 : 0);

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
          onChange={(e) => setSearch(e.target.value)}
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
                            onSelect={() => setYearsFilter(selected ? null : y)}
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
                            onSelect={() =>
                              setCompanyFilter(selected ? null : co)
                            }
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
        {filtered.length > 0 ? (
          filtered.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/avatar.jpg`} alt={c.name} />
                    <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {c.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">{c.title}</p>
                    <p className="text-sm text-gray-600">
                      {c.location} • {c.yearsOfExperience} years
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
                    <Eye />
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
    </main>
  );
}

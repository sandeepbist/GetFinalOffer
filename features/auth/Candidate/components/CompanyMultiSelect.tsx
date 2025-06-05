"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";

export interface CompanyDTO {
  id: number;
  name: string;
}

interface CompanyMultiSelectProps {
  availableCompanies?: CompanyDTO[];
  excludedCompanyIds?: number[];
  onChangeExcludedCompanies: (ids: number[]) => void;
}

export const CompanyMultiSelect: React.FC<CompanyMultiSelectProps> = ({
  availableCompanies = [],
  excludedCompanyIds = [],
  onChangeExcludedCompanies,
}) => {
  const [companyQuery, setCompanyQuery] = useState("");

  const filteredCompanies = useMemo(() => {
    const baseList = availableCompanies;
    const q = companyQuery.trim().toLowerCase();
    const matches = q
      ? baseList.filter((c) => c.name.toLowerCase().includes(q))
      : baseList;
    return matches.slice(0, 5);
  }, [companyQuery, availableCompanies]);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        Hide Profile From (Companies)
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between text-sm">
            {excludedCompanyIds.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {excludedCompanyIds.map((id) => {
                  const company = availableCompanies.find((c) => c.id === id);
                  return company ? (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="text-xs cursor-pointer"
                      onClick={() =>
                        onChangeExcludedCompanies(
                          excludedCompanyIds.filter((cid) => cid !== id)
                        )
                      }
                    >
                      {company.name} ×
                    </Badge>
                  ) : null;
                })}
              </div>
            ) : (
              <span className="text-gray-500">Select companies…</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full max-w-sm p-0">
          <Command>
            <CommandInput
              placeholder="Search companies…"
              value={companyQuery}
              onValueChange={setCompanyQuery}
            />
            <CommandList className="max-h-60 overflow-auto">
              {filteredCompanies.length === 0 ? (
                <CommandEmpty>No companies found.</CommandEmpty>
              ) : (
                filteredCompanies.map((company) => {
                  const selected = excludedCompanyIds.includes(company.id);
                  return (
                    <CommandItem
                      key={company.id}
                      onSelect={() => {
                        if (selected) {
                          onChangeExcludedCompanies(
                            excludedCompanyIds.filter(
                              (cid) => cid !== company.id
                            )
                          );
                        } else {
                          onChangeExcludedCompanies([
                            ...excludedCompanyIds,
                            company.id,
                          ]);
                        }
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          selected ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {company.name}
                    </CommandItem>
                  );
                })
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-xs text-gray-500">
        Start typing to filter companies; only top 5 shown.
      </p>
    </div>
  );
};

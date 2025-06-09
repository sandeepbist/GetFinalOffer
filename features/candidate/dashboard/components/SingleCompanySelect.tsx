"use client";

import React, { useState, useMemo } from "react";
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
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";

export interface CompanyDTO {
  id: string;
  name: string;
}

interface SingleCompanySelectProps {
  availableCompanies?: CompanyDTO[];
  selectedCompanyId?: string | "";
  onChangeCompanyId: (id: string) => void;
}

export const SingleCompanySelect: React.FC<SingleCompanySelectProps> = ({
  availableCompanies = [],
  selectedCompanyId = "",
  onChangeCompanyId,
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

  const selectedCompany = availableCompanies.find(
    (c) => c.id === selectedCompanyId
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between text-sm">
          {selectedCompany ? selectedCompany.name : "Select company…"}
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
                const isSelected = company.id === selectedCompanyId;
                return (
                  <CommandItem
                    key={company.id}
                    onSelect={() => onChangeCompanyId(company.id)}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        isSelected ? "opacity-100" : "opacity-0"
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
  );
};

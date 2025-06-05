"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

export interface SkillDTO {
  id: number;
  name: string;
}

interface SkillMultiSelectProps {
  availableSkills: SkillDTO[];
  selectedSkillIds: number[];
  onChangeSkillIds: (ids: number[]) => void;
}

export const SkillMultiSelect: React.FC<SkillMultiSelectProps> = ({
  availableSkills,
  selectedSkillIds,
  onChangeSkillIds,
}) => {
  const [skillQuery, setSkillQuery] = useState("");

  const filteredSkills = useMemo(() => {
    const q = skillQuery.trim().toLowerCase();
    const base = q
      ? availableSkills.filter((s) => s.name.toLowerCase().includes(q))
      : availableSkills;
    return base.slice(0, 5);
  }, [skillQuery, availableSkills]);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Skills</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between text-sm">
            {selectedSkillIds.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedSkillIds.map((id) => {
                  const skill = availableSkills.find((s) => s.id === id);
                  return skill ? (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="text-xs cursor-pointer"
                      onClick={() =>
                        onChangeSkillIds(
                          selectedSkillIds.filter((sid) => sid !== id)
                        )
                      }
                    >
                      {skill.name} ×
                    </Badge>
                  ) : null;
                })}
              </div>
            ) : (
              <span className="text-gray-500">Select skills…</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full max-w-sm p-0">
          <Command>
            <CommandInput
              placeholder="Search skills…"
              value={skillQuery}
              onValueChange={setSkillQuery}
            />
            <CommandList className="max-h-60 overflow-auto">
              {filteredSkills.length === 0 ? (
                <CommandEmpty>No skills found.</CommandEmpty>
              ) : (
                filteredSkills.map((skill) => {
                  const selected = selectedSkillIds.includes(skill.id);
                  return (
                    <CommandItem
                      key={skill.id}
                      onSelect={() => {
                        if (selected) {
                          onChangeSkillIds(
                            selectedSkillIds.filter((sid) => sid !== skill.id)
                          );
                        } else {
                          onChangeSkillIds([...selectedSkillIds, skill.id]);
                        }
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          selected ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {skill.name}
                    </CommandItem>
                  );
                })
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-xs text-gray-500">
        Start typing to filter skills; only top 5 shown.
      </p>
    </div>
  );
};

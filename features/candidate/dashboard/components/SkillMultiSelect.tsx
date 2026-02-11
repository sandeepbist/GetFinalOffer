"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";

export interface SkillDTO {
  id: string;
  name: string;
}

interface SkillMultiSelectProps {
  availableSkills: SkillDTO[];
  selectedSkillIds: string[];
  onChangeSkillIds: (ids: string[]) => void;
}

export const SkillMultiSelect: React.FC<SkillMultiSelectProps> = ({
  availableSkills,
  selectedSkillIds,
  onChangeSkillIds,
}) => {
  const [skillQuery, setSkillQuery] = useState("");

  const filteredSkills = useMemo(() => {
    const query = skillQuery.trim().toLowerCase();
    const results = query
      ? availableSkills.filter((skill) => skill.name.toLowerCase().includes(query))
      : availableSkills;
    return results.slice(0, 10);
  }, [skillQuery, availableSkills]);

  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wide text-text-muted">Skills</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-auto min-h-10 w-full justify-between border-border/80 bg-background/80 text-sm">
            {selectedSkillIds.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedSkillIds.map((id) => {
                  const skill = availableSkills.find((entry) => entry.id === id);
                  return skill ? (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="cursor-pointer border-border/70 bg-highlight text-xs hover:bg-highlight/80"
                      onClick={() =>
                        onChangeSkillIds(selectedSkillIds.filter((skillId) => skillId !== id))
                      }
                    >
                      {skill.name} x
                    </Badge>
                  ) : null;
                })}
              </div>
            ) : (
              <span className="text-text-subtle">Select skills...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 text-text-subtle" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full max-w-sm rounded-xl border-border/80 p-0">
          <Command>
            <CommandInput
              placeholder="Search skills..."
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
                          onChangeSkillIds(selectedSkillIds.filter((skillId) => skillId !== skill.id));
                        } else {
                          onChangeSkillIds([...selectedSkillIds, skill.id]);
                        }
                      }}
                    >
                      <Check className={`mr-2 h-4 w-4 ${selected ? "opacity-100" : "opacity-0"}`} />
                      {skill.name}
                    </CommandItem>
                  );
                })
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-xs text-text-subtle">Start typing to filter skills quickly.</p>
    </div>
  );
};

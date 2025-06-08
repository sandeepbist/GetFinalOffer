"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import type { PartnerOrganisationDTO } from "@/features/organisation/partner-organisations-dto";

interface HideOrganisationsProps {
  partnerOrgs: PartnerOrganisationDTO[];
  hiddenOrgs: string[];
  onToggle: (orgId: string) => void;
  onSave: () => void;
}

export function HideOrganisations({
  partnerOrgs,
  hiddenOrgs,
  onToggle,
  onSave,
}: HideOrganisationsProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const filteredOrgs = partnerOrgs.filter((o) =>
    o.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardContent className="relative space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">Profile Visibility</h2>
              <p className="text-sm text-gray-600">
                Hide your profile from these organisations:
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              Edit
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {hiddenOrgs.length > 0 ? (
              hiddenOrgs.map((id) => {
                const org = partnerOrgs.find((o) => o.id === id);
                return (
                  org && (
                    <Badge key={id} variant="secondary">
                      {org.name}
                    </Badge>
                  )
                );
              })
            ) : (
              <p className="text-sm text-gray-500">
                You’re visible to all organisations.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-h-[80vh] overflow-y-auto">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Select Organisations</h2>
              </div>

              <Command className="border rounded-md overflow-hidden">
                <CommandInput
                  placeholder="Search organisations…"
                  value={filter}
                  onValueChange={setFilter}
                  className="px-4 py-2"
                />
                <CommandList className="max-h-48 overflow-auto p-0">
                  {filteredOrgs.slice(0, 5).map((org) => {
                    const selected = hiddenOrgs.includes(org.id);
                    return (
                      <CommandItem
                        key={org.id}
                        onSelect={() => onToggle(org.id)}
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selected ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        {org.name}
                      </CommandItem>
                    );
                  })}
                </CommandList>
              </Command>
            </CardContent>
            <CardFooter className="p-4">
              <Button
                className="w-full"
                onClick={() => {
                  onSave();
                  setOpen(false);
                }}
              >
                Save
              </Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}

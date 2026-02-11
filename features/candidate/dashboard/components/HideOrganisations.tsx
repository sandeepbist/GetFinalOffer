"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { Check, Eye, EyeOff, ShieldAlert, Plus, Building2 } from "lucide-react";
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
    o.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <>
      <Card className="overflow-hidden border-border/80 bg-surface">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/70 bg-highlight/60 px-6 py-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-heading">
              <EyeOff className="w-4 h-4 text-text-muted" />
              Privacy & Visibility
            </CardTitle>
            <CardDescription className="text-xs">
              Control which companies cannot see your profile.
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpen(true)}
            className="border-border/80 bg-surface hover:bg-highlight"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Manage Blocklist
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {hiddenOrgs.length > 0 ? (
              hiddenOrgs.map((id) => {
                const org = partnerOrgs.find((o) => o.id === id);
                return (
                  org && (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="gap-1.5 border border-destructive/20 bg-destructive/10 py-1.5 pl-2 pr-3 text-destructive hover:bg-destructive/20"
                    >
                      <ShieldAlert className="w-3 h-3" />
                      {org.name}
                    </Badge>
                  )
                );
              })
            ) : (
              <div className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-highlight py-6 px-4">
                <div className="flex items-center gap-3 text-text-muted">
                  <Eye className="w-5 h-5 opacity-50" />
                  <span className="text-sm font-medium">
                    Your profile is visible to all partner organisations.
                  </span>
                </div>
              </div>
            )}
          </div>

          {hiddenOrgs.length > 0 && (
            <p className="mt-4 text-xs text-text-subtle">
              * These companies will not see your name, resume, or interview
              history in search results.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
          <div className="p-6 pb-2">
            <h2 className="text-lg font-bold text-heading">Block Organisations</h2>
            <p className="text-sm text-text-muted mt-1">
              Search for your current employer or any company you want to hide
              from.
            </p>
          </div>

          <div className="px-2">
            <Command className="rounded-lg border border-border/80 shadow-none">
              <CommandInput
                placeholder="Search companies (e.g. Airbnb, Stripe)..."
                value={filter}
                onValueChange={setFilter}
                className="border-none focus:ring-0"
              />
              <CommandList className="max-h-[300px] overflow-auto p-1">
                <CommandEmpty className="py-6 text-center text-sm text-text-muted">
                  No companies found.
                </CommandEmpty>
                <CommandGroup>
                  {filteredOrgs.map((org) => {
                    const selected = hiddenOrgs.includes(org.id);
                    return (
                      <CommandItem
                        key={org.id}
                        onSelect={() => onToggle(org.id)}
                        className={`mb-1 flex cursor-pointer items-center rounded-md px-4 py-2.5 ${selected ? "bg-destructive/10 aria-selected:bg-destructive/20" : ""}`}
                      >
                        <Building2 className="mr-3 h-4 w-4 text-text-muted" />
                        <span
                          className={`flex-1 ${selected ? "text-destructive font-medium" : "text-text"}`}
                        >
                          {org.name}
                        </span>
                        {selected && <Check className="h-4 w-4 text-destructive" />}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          <div className="mt-2 flex justify-end gap-2 border-t border-border/75 bg-highlight p-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave();
                setOpen(false);
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
